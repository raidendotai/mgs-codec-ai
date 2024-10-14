import { RealtimeClient } from "./modules/openairealtime/index.js";
import { WavRecorder } from "./modules/wavtools/index.js";
import CONFIG from "./config.js";

const wavRecorder = new WavRecorder({ sampleRate: 24000 });
let mediaRecorder;
let audioStream;
let isStreaming = false;

let audioContext;
let audioBufferSource;

let conversation_logs = [];
let latest_user_quote = "";

const client = new RealtimeClient({
	apiKey: CONFIG.setup.OPENAI_API_KEY,
	dangerouslyAllowAPIKeyInBrowser: true,
	debug: false,
});
function random_choice(l) {
	return l[Math.floor(Math.random() * l.length)];
}

const character = random_choice(CONFIG.codec.characters);
const introduction = random_choice(character.introductions);
client.updateSession({
	voice: character.voice,
});
client.updateSession({
	instructions: CONFIG.codec.prompt
		.replaceAll("{USER_NAME}", CONFIG.codec.you.name)
		.replaceAll("{USER_PERSONA}", CONFIG.codec.you.persona)
		.replaceAll("{CHARACTER_NAME}", character.name)
		.replaceAll("{CHARACTER_PERSONA}", character.persona),
});
client.updateSession({
	turn_detection: { type: "server_vad" }, // Enable server-side Voice Activity Detection
	input_audio_transcription: { model: "whisper-1" },
});

const characterVideoFeedElement = document.getElementById("leftVideo");
const freqElement = document.getElementById("freq");
const captionElement = document.getElementById("caption");

const LATEST_CONTEXT = "latest_context";
async function getLatestContext() {
	return new Promise((resolve) => {
		chrome.storage.local.get([LATEST_CONTEXT], (result) => {
			resolve(result.latest_context);
		});
	});
}

chrome.runtime.onMessage.addListener(async (message) => {
	if (message.codec?.commence) {
		new_session();
	}
	if (message.codec?.rag) {
		console.log("debug:live.js:rag", message.codec.rag);
		client.realtime.send("conversation.item.create", {
			item: {
				type: "message",
				role: "assistant",
				content: [
					{
						type: "text",
						text:
							`[context : data relevant to current discussion]` +
							`\n${message.codec.rag}` +
							`\n\n---\n\n` +
							`\n> if it is seen that it contributes to the discussion , it can be referred to ; but not necessarily` +
							`\n> keep continuing the discussion`,
					},
				],
			},
		});
		// client.realtime.send('response.create');
	}
});

chrome.runtime.sendMessage({ codec: { ready: true } });

function change_character_video_feed({ src }) {
	// console.log({ change_character_video_feed :src})
	characterVideoFeedElement.src = src;
}

async function new_session() {
	const context = await getLatestContext();
	console.log("debug:live.js:context", { context });
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		alert("Browser does not support microphone access");
		throw new Error("Browser does not support microphone access.");
	}
	freqElement.innerHTML = character.frequency;

	client.updateSession({
		instructions: CONFIG.codec.prompt
			.replaceAll("{USER_NAME}", CONFIG.codec.you.name)
			.replaceAll("{USER_PERSONA}", CONFIG.codec.you.persona)
			.replaceAll("{CHARACTER_NAME}", character.name)
			.replaceAll("{CHARACTER_PERSONA}", character.persona),
		// + "\n\n\n---------------------\n\n\n"
	});
	await client.connect();
	isStreaming = true;
	characterVideoFeedElement.poster = character.avatars.poster
		? character.avatars.poster
		: "";
	change_character_video_feed({ src: random_choice(character.avatars.idle) });
	await wavRecorder.begin();
	await new Promise((resolve) => setTimeout(resolve, 1000));

	client.realtime.send("conversation.item.create", {
		item: {
			type: "message",
			role: "assistant",
			content: [
				{
					type: "text",
					text:
						`received debriefing about ${CONFIG.codec.you.name} :` +
						`\n${context}` +
						`\n\n---\n\n` +
						`\n> my current mood as ${character.name} is : ${random_choice(character.moods)}` +
						`\n> i should : ${introduction}`,
				},
			],
		},
	});
	client.realtime.send("response.create");

	wavRecorder.record((data) => client.appendInputAudio(data.mono));
}

async function stopMicrophoneStreaming() {
	isStreaming = false;
	await wavRecorder.pause();
}
async function stop() {
	stopMicrophoneStreaming();
	client.disconnect();
	logMessage("System", "Conversation stopped.");
}
async function end_conversation() {
	// triggered by "over and out" found in transcript
	// closes session and streaming microphone
	stop();
	// triggers event to play sound codec over message
	chrome.runtime.sendMessage({
		play: { source: "media/audio/hangup.mp3", volume: 1 },
	});
	// closes window after timeout
	setTimeout(() => {
		window.close();
	}, 1.2 * 1e3);
}
function logMessage(role, message) {
	false;
}
async function playAudio(audioData) {
	if (!audioContext) {
		audioContext = new AudioContext();
	}
	// Convert the audio data to an Int16Array (PCM16 format)
	const int16Array = new Int16Array(Object.values(audioData));
	// Create a Float32Array from the Int16Array by normalizing the PCM16 data
	const float32Array = new Float32Array(int16Array.length);
	for (let i = 0; i < int16Array.length; i++) {
		float32Array[i] = int16Array[i] / 32768; // Normalize PCM16 to range [-1, 1]
	}
	// Create an AudioBuffer from the Float32Array
	const buffer = audioContext.createBuffer(1, float32Array.length, 24000);
	buffer.copyToChannel(float32Array, 0);
	// Stop any previous audio playback
	if (audioBufferSource) {
		audioBufferSource.stop();
	}
	// Create a new buffer source and play the audio
	audioBufferSource = audioContext.createBufferSource();
	audioBufferSource.buffer = buffer;
	audioBufferSource.connect(audioContext.destination);
	audioBufferSource.start();
}
async function stopAudio() {
	if (audioBufferSource) {
		audioBufferSource.stop();
	}
}
client.on("conversation.updated", (event) => {
	const { item, delta } = event;
	// console.log({ "debug:conversation.updated": event })
	if (item.type === "message") {
		if (item.role === "assistant") {
			logMessage("Assistant", item.formatted.text || "...");
		}
	}
	if (delta?.transcript) {
		if (item.role === "assistant") {
			captionElement.value = `${captionElement.value}${delta.transcript}`
				.split("\n")
				.slice(-2)
				.join("\n")
				.trim();
		} else {
			latest_user_quote += delta.transcript;
		}
	}
});

client.on("conversation.interrupted", () => {
	stopAudio();
	captionElement.value = ``;
	change_character_video_feed({ src: random_choice(character.avatars.idle) });
});

async function chrome_send_message(q) {
	console.log("debug:live.js:chrome_send_message", q);
	chrome.runtime.sendMessage(q);
}
client.on("conversation.item.completed", ({ item }) => {
	console.log("debug:conversation.item.completed", item);

	// --- rag logic : send after assistant without creating response , so that its created on user talking after

	if (latest_user_quote.trim().length) {
		if (!conversation_logs.includes(latest_user_quote.trim())) {
			try {
				console.log("debug:latest_user_quote:", latest_user_quote);
				chrome_send_message({
					codec: { quote: latest_user_quote },
				});
				conversation_logs = [latest_user_quote, ...conversation_logs];
			} catch (e) {
				console.error(e);
			}
		}
		latest_user_quote = "";
	}

	if (item.type === "message" && item.role === "assistant") {
		// console.log('Completed message:', item);
		// Check if the message contains audio content
		const audioContent = item.content.find((content) => content.type === "audio");
		if (audioContent && item.formatted && item.formatted.audio) {
			change_character_video_feed({ src: random_choice(character.avatars.yap) });
			playAudio(item.formatted.audio);
		}
	}

	if (item.type === "message") {

		if (item?.role === "assistant") {
			captionElement.value += `\n\n`;
		} else {
			change_character_video_feed({ src: random_choice(character.avatars.idle) });
		}

		if (captionElement.value.toLowerCase().includes("over and out")) {
			end_conversation();
		}
	}
});

client.on("close", ({ error }) => {
	if (error) {
		logMessage("System", "Connection closed due to an error.");
	} else {
		logMessage("System", "Connection closed.");
	}
});
client.on("error", (event) => {
	console.error("Error:", event);
	logMessage("System", `Error: ${event.message || "Unknown error"}`);
});
