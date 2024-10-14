/*
  postgres , pgvector , embeddings utils
*/

import { PGlite } from "./modules/pglite/index.js";
import { vector } from "./modules/pglite/vector/index.js";
import { getEncoding } from "./modules/js-tiktoken/index.js";
import CONFIG from "./config.js";

console.log("debug:postgres : script start");

const MAX_TOKENS_PER_DOC = 8192;
const OPENAI_API_KEY = CONFIG.setup.OPENAI_API_KEY;
const LOCAL_DB_NAME = CONFIG.setup.DB_NAME;

const enc = getEncoding("cl100k_base");
const _chunkify = (array, size) => {
	const chunks = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
};
async function sha256(source) {
	const sourceBytes = new TextEncoder().encode(source);
	const digest = await window.crypto.subtle.digest("SHA-256", sourceBytes);
	const resultBytes = [...new Uint8Array(digest)];
	return resultBytes.map((x) => x.toString(16).padStart(2, "0")).join("");
}
function _tokens_chop({
	text,
	limit = MAX_TOKENS_PER_DOC,
	chop_from_bottom = false,
	chop_from_center = false,
}) {
	const tokens = enc.encode(text);

	if (chop_from_center) {
		const halfLimit = Math.floor(limit / 2);
		const start = Math.max(0, Math.floor((tokens.length - limit) / 2));
		return enc.decode(tokens.slice(start, start + limit));
	}

	return !chop_from_bottom
		? enc.decode(tokens.slice(0, limit))
		: enc.decode(tokens.slice(Math.max(0, tokens.length - limit)));
}

let db;

async function getDb() {
	console.log("debug:postgres : getDb : start");
	if (db) {
		return db;
	}
	db = new PGlite(`idb://${LOCAL_DB_NAME}`, {
		extensions: {
			vector,
		},
	});
	await db.waitReady;
	console.log("debug:postgres : getDb : done");
	return db;
}
async function init(force = false) {
	console.log("debug:postgres : init : start");
	await db.exec(`
    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE TABLE IF NOT EXISTS embeddings (
      uid TEXT NOT NULL UNIQUE,
      content TEXT,
      timestamp BIGINT NOT NULL,
      embedding VECTOR(1536)
    );
    CREATE INDEX IF NOT EXISTS embeddings_embedding_idx ON embeddings USING hnsw (embedding vector_ip_ops);
  `);
	console.log("debug:postgres : init : done");
}

getDb().then(() => init());

async function clear({ table = "embeddings" }) {
	await db.query(`DELETE FROM ${table};`);
	await init((force = true));
}

async function count({ table = "embeddings" }) {
	const res = await db.query(`SELECT COUNT(*) FROM ${table};`);
	return res.rows[0].count;
}

async function latest({ table = "embeddings", amount = 1 }) {
	const res = await db.query(
		`SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT $1;`,
		[amount],
	);
	return res.rows;
}

async function insert({ texts }) {
	const chunks = _chunkify(texts, 15);
	await Promise.all(
		chunks.map(async (_chunk) => {
			const chunkWithUids = await Promise.all(
				_chunk.map(async (text) => {
					const uid = await sha256(text);
					return { uid, text };
				}),
			);

			const existingUids = await db.query(`
          SELECT uid FROM embeddings WHERE uid IN (${chunkWithUids.map((entry) => `'${entry.uid}'`).join(", ")});
        `);
			const existingUidSet = new Set(existingUids.rows.map((row) => row.uid));

			const newEntries = chunkWithUids.filter(
				(entry) => !existingUidSet.has(entry.uid),
			);

			if (newEntries.length) {
				const newTexts = newEntries.map((entry) => entry.text);
				const embeddings = await vectorize({ texts: newTexts });
				if (!embeddings) return;

				const entriesWithEmbeddings = newEntries.map((entry, idx) => ({
					uid: entry.uid,
					text: entry.text,
					timestamp: Date.now(),
					vector: embeddings[idx],
				}));

				const pg_entries = entriesWithEmbeddings
					.map((entry) => {
						const content = _tokens_chop({
							text: entry.text,
							chop_from_center: true,
						}).replaceAll(`'`, `''`);
						return `\t('${entry.uid}', '${content}', '${entry.timestamp}', '${JSON.stringify(entry.vector)}')`;
					})
					.join(",\n");

				await db.exec(`
insert into embeddings (uid, content, timestamp, embedding) values
  ${pg_entries};
`);
			}
		}),
	);
	return {
		count: await db.query(`SELECT COUNT(*) FROM embeddings;`),
	};
}
async function vectorize({ texts }) {
	const sliceTexts = (texts) => {
		return texts.map((text) => {
			return _tokens_chop({
				text,
				limit: MAX_TOKENS_PER_DOC,
				chop_from_center: true,
			});
		});
	};

	texts = sliceTexts(texts);

	try {
		const response = await fetch("https://api.openai.com/v1/embeddings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "text-embedding-3-small",
				input: texts,
				encoding_format: "float",
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("> openAI API error:", errorData);
			return null;
		}

		const data = await response.json();

		console.log({ debug_vectorize: { texts, data } });
		return data.data.sort((a, b) => a.index - b.index).map((e) => e.embedding);
	} catch (error) {
		console.error("Fetch Error:", error);
		alert(`Network error while fetching embedding for "${text}".`);
		return null;
	}
}
async function search({ query, embedding, match_threshold = 0.0, amount = 3 }) {
	if (!embedding) {
		embedding = (await vectorize({ texts: [query] }))[0];
	}
	if (typeof embedding === "string") {
		embedding = JSON.parse(embedding);
	}
	console.log({ "debug:postgres:search:embedding": embedding });
	try {
		const res = await db.query(
			`
          SELECT uid, content, timestamp, embedding <#> $1 AS score FROM embeddings
          WHERE embeddings.embedding <#> $1 < $2
          ORDER BY embeddings.embedding <#> $1
          LIMIT $3;
          `,
			[JSON.stringify(embedding), -Number(match_threshold), Number(amount)],
		);
		// console.log({ debug_search_res: { embedding, res } });
		return res.rows;
	} catch (error) {
		console.error("Search Error:", error);
		// alert("Error during search operation.");
		return [];
	}
}

function _format_timestamp(timestamp) {
	return new Date(timestamp).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 3,
		hour12: false,
	});
}
async function context({ recent = 2, branches = 5 }) {
	/*
    --- make context for conversation
    gets latest document , gets relevant n docs ,
  */
	const docs = await latest({ amount: recent });
	console.log("debug:postgres.js:context:docs", { docs });
	const context =
		"<CONTEXT_MEMORIES>\n\n" +
		_tokens_chop({
			limit: CONFIG.setup.calls.tokens.limits.context,
			chop_from_bottom: true,
			text: (
				await Promise.all(
					docs.map(async (item) => {
						return [
							item,
							await search({ embedding: item.embedding, amount: branches }),
						];
					}),
				)
			)
				.flat()
				.flat()
				.filter(
					(value, index, self) =>
						index === self.findIndex((t) => t.uid === value.uid),
				)
				.sort((a, b) => b.timestamp - a.timestamp)
				.map((item) => {
					return (
						`<memory>\n$ seen on : ${_format_timestamp(item.timestamp)}` +
						`\n${item.content.trim()}` +
						`\n</memory>`
					);
				})
				.join("\n\n"),
		}) +
		"\n\n</CONTEXT_MEMORIES>";

	return { context };
}

async function rag({ query, amount = 2 }) {
	const docs = (await search({ query, amount })).reverse();

	if (docs.length) {
		return {
			rag:
				"<RELATED_MEMORIES>\n\n" +
				_tokens_chop({
					limit: CONFIG.setup.calls.tokens.limits.additional,
					chop_from_bottom: true,
					text: docs
						.map((item) => {
							return (
								`<memory>\n$ seen on : ${_format_timestamp(item.timestamp)}` +
								`\n${item.content.trim()}` +
								`\n</memory>`
							);
						})
						.join(``),
				}) +
				"\n\n</RELATED_MEMORIES>",
		};
	}
	return { rag: "" };
}

export default {
	count,
	insert,
	search,
	latest,
	vectorize,
	clear,

	context,
	rag,
	chop: _tokens_chop,
};
