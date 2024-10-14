import CONFIG from "./config.js";

// ------ collections ops

// ---------------------------------------
const RECORDING_KEY = "recording";
const HISTORY_KEY = "history";
const RANDOM_CALL_KEY = "random_call";
const POSTGRES_ACTIVE_KEY = "pg_active";
const LATEST_CONTEXT = "latest_context";

// --- collect docs mode enabled/disabled
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.get([RECORDING_KEY, HISTORY_KEY], (result) => {
		if (result.recording === undefined) {
			chrome.storage.local.set({ [RECORDING_KEY]: true });
		}
		if (result.history === undefined) {
			chrome.storage.local.set({ [HISTORY_KEY]: [] });
		}
		if (result.POSTGRES_ACTIVE_KEY === undefined) {
			chrome.storage.local.set({ [POSTGRES_ACTIVE_KEY]: false });
		}
		if (result.LATEST_CONTEXT === undefined) {
			chrome.storage.local.set({ [LATEST_CONTEXT]: false });
		}
		if (result.RANDOM_CALL_KEY === undefined) {
			chrome.storage.local.set({ [RANDOM_CALL_KEY]: false });
		}
	});
});

// listen for tab changes , if recording enabled , load its htmlcontent -> plain text then store
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.active) {
		const recording = await getRecordingStatus();
		const pgactive = await getPgStatus();
		// console.log({"debug:service-worker:recording,pgactive" : {recording,pgactive}})
		if (recording && pgactive) {
			/*
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['inject.js']
      });
      */
			const url = tab.url;
			try {
				getPageContentAsFormattedText({ tabId, url });
			} catch (error) {
				console.error("> error fetching page content:", error);
			}
		}
	}
});
// --- triggers event listened to inside content.js
async function getPageContentAsFormattedText({ tabId, url }) {
	return new Promise((resolve, reject) => {
		try {
			chrome.tabs.sendMessage(tabId, { page: { fetch: { url } } });
			resolve(true);
		} catch (e) {
			console.error(e);
			resolve(false);
		}
	});
}
// --- add collected doc to history
// --- note : this is old , to be updated with pglite
async function addUrlToHistory({ url, timestamp, content }) {
	return new Promise((resolve) => {
		chrome.storage.local.get([HISTORY_KEY], (result) => {
			const history = result.history || [];
			history.push({ url, timestamp, content });
			chrome.runtime.sendMessage({
				pg: {
					insert: {
						texts: [content],
					},
				},
			});
			chrome.storage.local.set({ [HISTORY_KEY]: history }, () => {
				resolve();
			});
		});
	});
}
// --- get current collecting docs status
async function getRecordingStatus() {
	return new Promise((resolve) => {
		chrome.storage.local.get([RECORDING_KEY], (result) => {
			resolve(result.recording);
		});
	});
}
async function getPgStatus() {
	return new Promise((resolve) => {
		chrome.storage.local.get([POSTGRES_ACTIVE_KEY], (result) => {
			resolve(result.pg_active);
		});
	});
}
async function getRandomCall() {
	return new Promise((resolve) => {
		chrome.storage.local.get([RANDOM_CALL_KEY], (result) => {
			resolve(result.random_call);
		});
	});
}
async function getLatestContext() {
	return new Promise((resolve) => {
		chrome.storage.local.get([LATEST_CONTEXT], (result) => {
			resolve(result.latest_context);
		});
	});
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	// --- listen for messages to trigger new codec calls
	// --- with context coming from offscreen.js
	// --- should be 3 parts:
	/*
      $ interval hits , check if recording & codec enabled to go further
      -> $ send message to offscreen pg.context(...CONFIG)
      $ in offscreen : once processed , it sends a new event with payload {codec:{context:{ready:true , ...context}}} to here
      -> $ wait for {codec:context} from offscreen.js , this calls make_popup() to initiate call
      -> $ waits for event {codec:ready} from live.js
      -> $ send {codec:{commence: { context } }} which is subscribed to in live.js
      $ (in live.js) on event start stuff
  */
	if (message.page?.retrieved) {
		const { url, content } = message.page.retrieved;
		addUrlToHistory({ url, timestamp: Date.now(), content });
	}
	if (message.codec?.context) {
		chrome.storage.local.set({ [LATEST_CONTEXT]: message.codec.context });
		codec_play({ source: "media/audio/ring.mp3" });
		setTimeout(() => {
			codec_play({ source: "media/audio/pickup.mp3" });
		}, 1800);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		create_call_popup();
	}
	if (message.codec?.ready) {
		// doesnt do much now but might help sync things
		chrome.runtime.sendMessage({ codec: { commence: true } });
	}

	if (message.codec?.quote) {
		// hopefully works because direct from live.js dont get through
		chrome.runtime.sendMessage({ pg: { rag: { query: message.codec.quote } } });
	}
	if (message.codec?.relevant) {
		// hopefully works because direct from live.js dont get through
		chrome.runtime.sendMessage({ code: { rag: message.codec.relevant } });
	}

	// --- codec call manuall triggered by user
	if (message.codec?.call) {
		initiate_codec_call();
	}
	// --- listen for calls to clear storage
	if (message.action === "clearStorage") {
		chrome.runtime.sendMessage({ pg: { clear: true } });
		chrome.storage.local.set({ [HISTORY_KEY]: [] }, () => {
			sendResponse({ success: true });
		});
	}
});

// --- codec calls ops

async function create_call_popup() {
	// Create a new window to request audio and webcam access
	chrome.windows.create(
		{
			url: "codec.html", // This will be the new file we create to handle permissions
			type: "popup",
			width: 1060,
			height: 600,
		},
		(newWindow) => {
			console.log("New window created with ID:", newWindow.id);
		},
	);
}

async function codec_play({ source = "media/audio/ring.mp3", volume = 1 }) {
	await chrome.runtime.sendMessage({ play: { source, volume } });
	// await openCallPopup();
}

async function initiate_codec_call() {
	// send a pg context retrieval event which triggers chain of events
	chrome.runtime.sendMessage({
		pg: {
			context: {
				recent: CONFIG.codec.you.context.memories.recent,
				branches: CONFIG.codec.you.context.memories.branches,
			},
		},
	});
}
async function codecCallRandomIntervals() {
	const interval =
		Math.floor(
			Math.random() *
				(CONFIG.setup.calls.interval.max - CONFIG.setup.calls.interval.min + 1),
		) + CONFIG.setup.calls.interval.max;

	setTimeout(async () => {
		const random_call_enabled = await getRandomCall();
		if (random_call_enabled) {
			initiate_codec_call();
		}
		setTimeout(codecCallRandomIntervals, interval); // Schedule the next codec call
	}, interval); // Initial delay before the first codec call
}

async function start_working() {
	/*
    unless im wrong, core loop should be scoped here
  */
	chrome.storage.local.set({ [POSTGRES_ACTIVE_KEY]: true });
	chrome.runtime.sendMessage({ pg: { loaded: true } });

	codecCallRandomIntervals();

	// await new Promise(resolve => setTimeout(resolve, 5 *1e3));
	// initiate_codec_call()
}

async function createOffscreen() {
	if (await chrome.offscreen.hasDocument()) return;
	await chrome.offscreen.createDocument({
		url: "offscreen.html",
		reasons: ["LOCAL_STORAGE"],
		justification: "testing", // details for using the API
	});
	console.log("> debug : createOffscreen() done");
	let pong = false;
	chrome.storage.local.set({ [POSTGRES_ACTIVE_KEY]: false });
	while (!pong) {
		pong = await new Promise(async (resolve, reject) => {
			try {
				chrome.runtime.sendMessage(
					{ ping: { timestamp: Date.now() } },
					(response) => {
						if (chrome.runtime.lastError) {
							resolve(false);
						} else {
							resolve(true);
						}
					},
				);
			} catch (e) {
				console.log(e);
				resolve(false);
			}
		});
		if (!pong) await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	console.log("> debug : offscreen loaded (with pglite imported)");
	start_working();
}
createOffscreen();