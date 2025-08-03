# 🎙️ Voice ChatBot

A real-time, voice-interactive chatbot built using **Node.js**, **Express**, and the **Google Gemini Live API**. This project integrates audio input/output with low latency and supports conversation interruption, making it ideal for natural and responsive human-computer interaction.

---

## 🚀 Features

- 🎤 Real-time voice input/output with Gemini API  
- ⚡ Low-latency streaming responses  
- ⏹️ Button to stop the current conversation  
- 🔄 User-interruptable speech (talk while it's speaking)  
- 🌐 REST API backend (Node.js + Express)  
- 🧠 Gemini Pro API integration  
- 🔊 Audio streaming with `@google/generative-ai`  

---

## 🧱 Tech Stack

- **Frontend:** React (Vite)  
- **Backend:** Node.js, Express  
- **Voice API:** Google Gemini Live API  
- **Audio Processing:** Web Audio API, WaveFile  
- **Deployment-ready:** Easily extendable to cloud platforms  

---

## 📁 Folder Structure

```
Voice-ChatBot/
├── client/                  # React Vite frontend (UI for chatbot)
│   └── ...
├── server/                  # Node.js backend
│   ├── index.js             # Entry point
│   ├── routes/              # API endpoints
│   └── utils/               # Audio utilities
├── .env                     # API keys & environment configs
├── package.json             # Dependencies
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/vikas9616/Voice-ChatBot.git
cd Voice-ChatBot
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `server` folder:

```
GOOGLE_API_KEY=your_gemini_api_key_here
```

> ⚠️ Get your API key from [Google AI Studio](https://makersuite.google.com/app)

### 4. Run the backend server

```bash
npm start
```

### 5. (Optional) Run the frontend client

If you are using the React Vite frontend:

```bash
cd client
npm install
npm run dev
```

---

## 🎧 Example

Test with a sample audio file:

```js
import { GoogleGenAI, Modality } from "@google/genai";
import fs from "node:fs";
import { WaveFile } from "wavefile";
```

> Refer to the `/server/index.js` for full implementation.

---


## 🙌 Acknowledgements

- [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)  
- [WaveFile Library](https://www.npmjs.com/package/wavefile)  
- Inspired by [Revolt Motors Voice Bot Demo](https://www.revoltmotors.com)  

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## ✨ Author

**Vikas Maurya**

- GitHub: [@vikas9616](https://github.com/vikas9616)  
- LinkedIn: [linkedin.com/in/vikas9616](https://linkedin.com/in/vikas9616)
