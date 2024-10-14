(function () {
	window.addEventListener("message", function (event) {
		if (event.source !== window) return;
		if (event.data && event.data.type === "mgs-toast") {
			chrome.runtime.sendMessage({
				toast: event.data.payload,
			});
		}
	});

	const script = document.createElement("script");
	script.src = chrome.runtime.getURL("intercept.js");
	(document.head || document.documentElement).appendChild(script);
})();
