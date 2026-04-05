# ViralTitle🚀

A modern, full-stack application designed to generate highly-optimized, high-CTR YouTube video titles using the power of Gemini AI. Built with a premium, minimalist "Digital Curator" design aesthetic.

![ViralTitle Screenshot](SS/Screenshot%202026-04-05%20143157.png)

## Features

- **Gemini-Powered Engine**: Leverages the `gemini-2.5-flash` model for blazing fast, highly relevant titles.
- **Premium UI/UX**: Designed with the "Algorithm Flux" design system. Minimalist layout using Vite, Tailwind CSS, and Native DOM rendering.
- **Categories**: Generates titles automatically organized into distinct performance buckets (e.g., Curiosity Gap, Emotional Connection, Explosive/High-CTR).
- **Interactive Mechanics**: Click-to-copy animations, beautifully rendered spinner states, responsive UI.
- **Python Fast API Backend**: Robust and fast lightweight API server to handle the prompt logic and proxy AI requests.

## Tech Stack

- **Frontend**: Vite, Tailwind CSS v4, Vanilla JavaScript, HTML5.
- **Backend**: Python 3, FastAPI, Uvicorn, Google Generative AI SDK, python-dotenv.

## Quick Start

### 1. Setup the Backend

Ensure you have Python installed.

```bash
cd backend
# Optional: Setup a virtual environment
# python -m venv venv
# venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file inside the `/backend` folder and add your Gemini API Key:
```env
GEMINI_API_KEY="your_api_key_here"
```

Start the FastAPI server:
```bash
python -m uvicorn main:app --reload
```

### 2. Setup the Frontend

Ensure you have Node.js installed, then open a new terminal in the root directory:

```bash
npm install
npm run dev
```

The application will be running live on `http://localhost:3000`.

## Architecture Details

- The frontend sends a single `/generate-titles` HTTP POST to the backend with the user's video topic.
- The backend injects the topic into a heavily tuned system prompt tailored for YouTube growth.
- The AI responds with 10 pure JSON titles which the backend safely streams directly back to the frontend.
- The Vanilla JS frontend utilizes a dynamically attached skeleton structure to render the resulting elements fluidly onto the DOM with Tailwind animations.

