// --- listen for html to md ops , trigged from service-worker.js
chrome.runtime.onMessage.addListener((message) => {
	if (message.page?.fetch) {
		try {
			const plain = ProcessHtml.convertHtmlToText(
				`<body>\n${document.body.innerHTML}\n</body>`,
			);
			if (plain.length && plain.length >= 2000) {
				chrome.runtime.sendMessage({
					page: {
						retrieved: {
							url: message.page.fetch.url,
							content: plain,
						},
					},
				});
			}
		} catch (error) {
			console.error("html->doc conversion failed:", error);
		}
	}
});
