import pg from "./postgres.js";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.ping) {
		// alert('hello from offscreen ping')
		sendResponse({ pong: Date.now() });
	}
	if (message.play) playAudio(message.play);
	// if (message.debug_call) sendResponse({pg:{loaded:true}})
	if (message.pg) {
		if (message.pg.context) {
			const { context } = await pg.context(message.pg.context);
			console.log("debug:offscreen:pg.context", { context });
			chrome.runtime.sendMessage({
				codec: {
					context,
				},
			});
		}
		if (message.pg.rag) {
			console.log("debug:offscreen:pg.rag : query", message.pg.rag);
			const { rag } = await pg.rag(message.pg.rag);
			console.log("debug:offscreen:pg.rag : response", rag);
			if (rag.length) {
				chrome.runtime.sendMessage({
					codec: {
						relevant: rag,
					},
				});
			}
		}
		if (message.pg.insert) {
			// alert(JSON.stringify({ "offscreen:pg.insert : query": message.pg.insert }))
			await pg.insert(message.pg.insert);
			// alert(JSON.stringify({ "offscreen:pg.insert : response": response }))
			// const debug_latest_check = await pg.latest({amount:1})
			// alert(JSON.stringify({ "offscreen:pg.insert : latest_check": debug_latest_check }))
		}
		if (message.pg.clear) {
			await pg.clear({});
			alert("pg db cleared :)");
		}
	}
});

// Play sound with access to DOM APIs
function playAudio({ source, volume }) {
	const audio = new Audio(source);
	audio.volume = volume;
	audio.play();
}