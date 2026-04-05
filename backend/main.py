import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI(title="AI YouTube Title Generator API")

# Setup CORS for frontend to bypass same-origin policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TitleRequest(BaseModel):
    topic: str

@app.post("/generate-titles")
async def generate_titles(request: TitleRequest):
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")
    
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = f"""You are an expert YouTube growth strategist.

Generate 10 viral YouTube titles for this topic.

Make them:
- Highly clickable
- Natural, not spammy
- Mix curiosity, emotional, and high-CTR styles
- Return the list in a raw JSON format exactly like this: {{"titles": ["title 1", "title 2", ...]}}

Topic: {request.topic}
"""
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Error generating titles: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate titles from Gemini API.")
