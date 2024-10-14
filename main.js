const RECORDING_KEY = "recording";
const HISTORY_KEY = "history";

const POSTGRES_ACTIVE_KEY = "pg_active";
const RANDOM_CALL_KEY = "random_call";

document.addEventListener("DOMContentLoaded", async () => {
	const containerDiv = document.getElementById("container");
	const spinnerDiv = document.getElementById("spinner");

	async function getPgStatus() {
		return new Promise((resolve) => {
			chrome.storage.local.get([POSTGRES_ACTIVE_KEY], (result) => {
				resolve(result.pg_active);
			});
		});
	}

	chrome.runtime.onMessage.addListener(async (message) => {
		if (message.pg?.loaded) {
			containerDiv.style.display = "block";
			spinnerDiv.style.display = "none";
		}
		if (message.codec?.context) {
			window.close();
		}
	});

	const pg_loaded = await getPgStatus();
	// alert(JSON.stringify({ pg_loaded }))
	if (!pg_loaded) {
		containerDiv.style.display = "none";
		spinnerDiv.style.display = "block";
	} else {
		containerDiv.style.display = "block";
		spinnerDiv.style.display = "none";
	}

	const startCallButton = document.getElementById("startCall");
	const toggleButton = document.getElementById("toggleRecording");
	const toggleRandomCallButton = document.getElementById("toggleRandomCall");

	const showHistoryButton = document.getElementById("showHistory");
	const clearStorageButton = document.getElementById("clearStorage");
	const githubButton = document.getElementById("github");
	const twitterButton = document.getElementById("twitter");
	const toast = document.getElementById("toast");
	const historyModal = document.getElementById("historyModal");
	const viewModal = document.getElementById("viewModal");
	const historyList = document.getElementById("historyList");
	const markdownContent = document.getElementById("markdownContent");
	const closeButtons = document.querySelectorAll(".close");

	for (let elem of [
		startCallButton,
		toggleButton,
		toggleRandomCallButton,
		showHistoryButton,
		clearStorageButton,
		githubButton,
		twitterButton,
	]) {
		elem.addEventListener("mouseover", function () {
			chrome.runtime.sendMessage({
				play: { source: "media/audio/0x1F.wav", volume: 1 },
			});
		});
		elem.addEventListener("click", function () {
			chrome.runtime.sendMessage({
				play: { source: "media/audio/0x20.wav", volume: 1 },
			});
		});
	}

	// Initialize button state
	const recording = await getRecordingStatus();
	updateToggleButton(recording);
	const randomcall = await getRandomCall();
	updateToggleRandomCallButton(randomcall);

	startCallButton.addEventListener("click", async () => {
		chrome.runtime.sendMessage({ codec: { call: true } });
		containerDiv.style.display = "none";
		spinnerDiv.style.display = "block";
	});

	toggleButton.addEventListener("click", async () => {
		const currentStatus = await getRecordingStatus();
		const newStatus = !currentStatus;
		await setRecordingStatus(newStatus);
		updateToggleButton(newStatus);
	});
	toggleRandomCallButton.addEventListener("click", async () => {
		const currentStatus = await getRandomCall();
		const newStatus = !currentStatus;
		await setRandomCall(newStatus);
		updateToggleRandomCallButton(newStatus);
		if (newStatus) {
			alert(
				"WARNING :\n\n- random codec calls automatically start new openAI realtime sessions , at random intervals defined in your config\n\n- be careful about api consumption costs or disable it\n\nie. don't enable & forget about it,\nthen leave your chrome on, away from your computer\nthen come back to a find an open session that consumed all your (autorenewable ?) credits !",
			);
		}
	});

	showHistoryButton.addEventListener("click", async () => {
		const history = await getHistory();
		displayHistory(history);
		historyModal.style.display = "block";
	});

	clearStorageButton.addEventListener("click", async () => {
		const confirmClear = confirm(
			"Are you sure you want to clear all stored data?",
		);
		if (confirmClear) {
			await clearStorage();
		}
	});

	// Close modals when close button is clicked
	closeButtons.forEach((btn) => {
		btn.onclick = () => {
			btn.parentElement.parentElement.style.display = "none";
			if (btn.parentElement.parentElement.id === "historyModal") {
				historyList.innerHTML = "";
			}
			if (btn.parentElement.parentElement.id === "viewModal") {
				markdownContent.textContent = "";
			}
		};
	});

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == historyModal) {
			historyModal.style.display = "none";
			historyList.innerHTML = "";
		}
		if (event.target == viewModal) {
			viewModal.style.display = "none";
			markdownContent.textContent = "";
		}
	};

	// Functions
	async function getRecordingStatus() {
		return new Promise((resolve) => {
			chrome.storage.local.get([RECORDING_KEY], (result) => {
				resolve(result.recording);
			});
		});
	}

	async function setRecordingStatus(status) {
		return new Promise((resolve) => {
			chrome.storage.local.set({ [RECORDING_KEY]: status }, () => {
				resolve();
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
	async function setRandomCall(status) {
		return new Promise((resolve) => {
			chrome.storage.local.set({ [RANDOM_CALL_KEY]: status }, () => {
				resolve();
			});
		});
	}

	async function getHistory() {
		return new Promise((resolve) => {
			chrome.storage.local.get([HISTORY_KEY], (result) => {
				resolve(result.history || []);
			});
		});
	}

	async function clearStorage() {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({ action: "clearStorage" }, (response) => {
				if (response && response.success) {
					resolve();
				}
			});
		});
	}

	function updateToggleButton(isRecording) {
		toggleButton.textContent = isRecording
			? "Collect Enabled 🟢"
			: "Collect Disabled 🔴";
	}
	function updateToggleRandomCallButton(isEnabled) {
		toggleRandomCallButton.textContent = isEnabled
			? "Random Calls Enabled 🟢⚠️"
			: "Random Calls Disabled 🔴";
	}

	function showToast(message) {}

	async function displayHistory(history) {
		historyList.innerHTML = "";
		if (history.length === 0) {
			historyList.innerHTML = "<p>No history available.</p>";
			return;
		}

		// Reverse to show latest first
		const reversedHistory = [...history].reverse();

		reversedHistory.forEach((entry, index) => {
			const div = document.createElement("div");
			div.style = "border-color:#444;";
			div.className =
				"url-item border-b p-1 pb-2 m-1 flex justify-between items-center whitespace-pre-wrap break-all";

			const info = document.createElement("div");
			const displayUrl =
				entry.url.length > 30 ? entry.url.slice(0, 30) + "..." : entry.url;
			info.innerHTML = `<strong>${displayUrl}</strong><br><em>${new Date(entry.timestamp).toLocaleString()}</em>`;

			const viewButton = document.createElement("button");
			viewButton.textContent = "View";
			viewButton.className =
				"bg-green-900 hover:bg-green-800 text-white font-bold py-1 px-3 rounded";
			viewButton.addEventListener("click", () => {
				markdownContent.textContent = entry.content;
				viewModal.style.display = "block";
			});

			div.appendChild(info);
			div.appendChild(viewButton);
			historyList.appendChild(div);
		});
	}
});
