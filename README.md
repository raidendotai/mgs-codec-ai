## Overview

- Metal Gear Solid codec call simulator, real-time AI agent as a Chrome extension.
- say hi 👋 [@n_raidenai](https://x.com/n_raidenai)

---

### Install

1. Clone the repo.
2. Edit `config.js`
   - Replace `REPLACE_YOUR_OPENAI_API_KEY_HERE` with your OpenAI API key.
   - Optional : Make other edits to personas/... in the same file.
3. In Chrome, go to `chrome://extensions`, enable Developer Mode, load the unpacked extension, and select the downloaded extension folder.
4. Enable the extension and pin it.
5. 🎉

---

### Technical Details

Everything local , only external API calls are made to the openAI api

- When collection is enabled:
  - Fetches tab content, processes HTML to text (see `bundled-process-html.js`), and forwards it.
  - Content is embedded via `openai/text-embedding-3-small`, stored in a local Postgres vector DB (powered by `pglite` + `pgvector`). Which enabled both vector search and content retrieval, all locally.
- Real-time codec calls use `openai/realtime` API:
  - Context includes recent docs and similarity search results.
  - Continuous RAG whenever user audio transcript is received back , to provide more context as the dicussion goes on
- Additional
  - GL shaders on user cam feed , via `threejs` , `tf.js` and `bodypix` model segmentation for background blurring and codec visual effects.
  - Can be used later to augment realtime visual aspects (ie. LCM / video-2-video , generate visual variants from transcript sentiment analysis , ... )

---

### ⚠️ Warnings ⚠️

At the time of writing, the OpenAI real-time API is **very** costly to run.  
You can easily burn through your budget by playing with this extension !

- Monitor costs very closely.
- Preferably, avoid using auto-renewable or unlimited API keys.
- Do not enable or forget that you enabled random codec calls, as they automatically start a real-time session.  
  - For example, you could be away from your computer with Chrome open, and return to find a real-time session that was talking to itself and burning credits.
- The same applies to `Collection enabled` feature, as it embeds the plain text version of every page you visit using the OpenAI embedding model. Do not forget you have enabled it (although, small toast messages will appear at the bottom right of pages whenever it's called as a reminder).

You have been warned ! Only you are responsible from this point forward :D

---

### Rights

- This extension includes media from Metal Gear Solid 2.  
- All rights belong to Konami, Kojima Productions, and Metal Gear Solid.
- This project is not affiliated with any of these entities and is an experimental open-source project to demonstrate realtime agents capabilities.