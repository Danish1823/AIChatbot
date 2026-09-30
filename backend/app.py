import os
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai


# -----------------------------
# Load environment variables
# -----------------------------

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")


# -----------------------------
# Get Gemini API key
# -----------------------------

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not found in .env")


# -----------------------------
# Create Gemini client
# -----------------------------

client = genai.Client(api_key=api_key)


# -----------------------------
# Create Flask application
# -----------------------------

app = Flask(__name__)

CORS(app)


# -----------------------------
# Home route
# -----------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "AI Chatbot Backend is running!"
    })


# -----------------------------
# Chat API
# -----------------------------

@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message", "")

    if not user_message:
        return jsonify({
            "error": "Message is required"
        }), 400

    try:

        print("User message:", user_message)

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=user_message
        )

        print("Gemini response:", response.text)

        return jsonify({
            "reply": response.text
        })

    except Exception as e:

        print("GEMINI ERROR:", repr(e))

        return jsonify({
            "error": str(e)
        }), 500


# -----------------------------
# Start Flask server
# -----------------------------

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )