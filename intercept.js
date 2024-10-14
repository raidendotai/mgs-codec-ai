function createMessageContainer() {
	const container = document.createElement("div");
	container.id = "mgs-codec-toast";
	container.style.position = "fixed";
	container.style.bottom = "10px";
	container.style.right = "10px";
	container.style.maxWidth = "300px";
	container.style.padding = "10px";
	container.style.backgroundColor = "#020e0b";
	container.style.color = "white";
	container.style.fontSize = "8px";
	container.style.zIndex = "9999";
	container.style.borderRadius = "5px";
	container.style.opacity = "0.5";
	container.style.display = "none";
	document.body.appendChild(container);
	return container;
}

const messageContainer = createMessageContainer();

function showMessage(message) {
	messageContainer.innerText = message;
	messageContainer.style.display = "block";
	setTimeout(() => {
		messageContainer.style.display = "none";
	}, 2000);
}

chrome.runtime.onMessage.addListener((message) => {
	if (message.toast) showMessage(toast);
	if (message.page?.fetch)
		showMessage(`> mgs-codec added : ${window.location.href.slice(0, 50)}...`);
});
