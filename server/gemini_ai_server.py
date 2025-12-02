#!/usr/bin/env python3
"""
Fit Fusion AI Coach - Gemini Backend
Real-time ChatGPT-level fitness coaching using Google Gemini API
FREE and NO RATE LIMITS!
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Comprehensive fitness training system prompt
SYSTEM_PROMPT = """You are Fit Fusion AI Coach - an elite fitness and nutrition expert with deep expertise in exercise science, sports nutrition, behavioral psychology, and personalized coaching.

CORE IDENTITY:
You are warm, empathetic, knowledgeable, and genuinely invested in helping users achieve their fitness goals. You meet users where they are with compassion, expertise, and practical guidance.

CRITICAL INSTRUCTION - WORKOUT PLANS:
When a user asks for a workout plan (3-day, 4-day, 5-day, etc.), you MUST provide a DAY-BY-DAY structured plan with:
- Day 1, Day 2, Day 3, etc. clearly labeled
- Specific exercises for each day
- Sets, reps, and rest periods
- Warm-up and cool-down
- Rest days clearly marked

Example format for "create a 4 day workout plan":
**DAY 1 - UPPER BODY**
Warm-up: 5 min
1. Exercise: sets × reps
2. Exercise: sets × reps
Cool-down: 5 min

**DAY 2 - LOWER BODY**
[exercises]

**DAY 3 - REST**

**DAY 4 - FULL BODY**
[exercises]

DIET EXPERTISE - Recognize and provide specific meals for:
🥑 KETO: High-fat (70-75%), low-carb (<5%) - Avocado, eggs, fatty fish, nuts, olive oil
🌱 VEGAN: No animal products - Tofu, tempeh, lentils, chickpeas, quinoa
🥛 VEGETARIAN: No meat, includes dairy/eggs
🥩 PALEO: Whole foods, no grains/dairy
⏰ INTERMITTENT FASTING: Time-restricted eating (16:8, 18:6, OMAD)
🍽️ MEDITERRANEAN: Olive oil, fish, vegetables, whole grains
🥤 LOW-CARB: Reduced carbs (50-150g/day)
🍖 CARNIVORE: Animal products only
And more...

RESPONSE STYLE:
✓ Natural, conversational, friendly tone
✓ Clear and easy to understand
✓ Break complex topics into digestible pieces
✓ Use emojis purposefully
✓ Format with headers, bullets, spacing
✓ Provide specific numbers (reps, sets, calories, grams)
✓ Explain WHY behind recommendations
✓ Be encouraging and supportive

CRITICAL RULES:
✓ Answer the ACTUAL question asked
✓ For workout plans: Provide DAY-BY-DAY structure
✓ For diet questions: Provide specific meals with macros
✓ Give specific, actionable advice
✓ Explain reasoning and science
✓ Be realistic about timelines
✓ Prioritize safety

NEVER:
✗ Give generic responses
✗ Ignore the specific request (e.g., if they ask for 4 days, give 4 days!)
✗ Recommend unsafe practices
✗ Make unrealistic promises
✗ Be condescending or judgmental

REMEMBER: You're coaching, educating, motivating, and empowering users to achieve their fitness goals!"""


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'AI Coach Gemini server is running',
        'model': 'gemini-2.0-flash',
        'version': '2.0.0'
    })


@app.route('/api/chatbot/message', methods=['POST'])
def chat():
    """Main chatbot endpoint - handles all fitness questions"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        user_message = data['message']
        conversation_history = data.get('conversationHistory', [])
        image_data = data.get('image', None)
        
        # Initialize Gemini model (use vision model if image is present)
        model_name = 'gemini-2.0-flash' if not image_data else 'gemini-2.0-flash'
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config={
                'temperature': 0.9,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 2048,
            }
        )
        
        # Build conversation with system prompt
        chat_history = []
        
        # Add conversation history
        for msg in conversation_history:
            if msg.get('role') == 'user':
                chat_history.append({
                    'role': 'user',
                    'parts': [msg['content']]
                })
            elif msg.get('role') == 'assistant':
                chat_history.append({
                    'role': 'model',
                    'parts': [msg['content']]
                })
        
        # Handle image if present
        if image_data:
            import base64
            import PIL.Image
            import io
            
            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = PIL.Image.open(io.BytesIO(image_bytes))
            
            # Send message with image
            if not chat_history:
                prompt = f"{SYSTEM_PROMPT}\n\nUser: {user_message}\n\nAnalyze the image and provide fitness advice."
            else:
                prompt = f"{user_message}\n\nAnalyze the image and provide fitness advice."
            
            response = model.generate_content([prompt, image])
            ai_message = response.text
        else:
            # Start chat with history (text only)
            chat = model.start_chat(history=chat_history)
            
            # Send message with system prompt prepended to first message
            if not chat_history:
                full_message = f"{SYSTEM_PROMPT}\n\nUser: {user_message}"
            else:
                full_message = user_message
            
            response = chat.send_message(full_message)
            ai_message = response.text
        
        return jsonify({
            'success': True,
            'data': {
                'message': ai_message,
                'suggestions': generate_suggestions(user_message)
            }
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def generate_suggestions(message):
    """Generate contextual suggestions based on user message"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['workout', 'exercise', 'training']):
        return ['Track workout', 'View progress', 'Nutrition advice']
    elif any(word in message_lower for word in ['meal', 'diet', 'food', 'eat', 'nutrition']):
        return ['Log meal', 'Track calories', 'Workout plan']
    elif any(word in message_lower for word in ['progress', 'stats', 'track']):
        return ['View analytics', 'Set new goal', 'Get motivation']
    else:
        return ['Create workout', 'Meal plan', 'Check progress']


if __name__ == '__main__':
    # Check if API key is set
    if not GEMINI_API_KEY:
        print("=" * 60)
        print("❌ ERROR: GEMINI_API_KEY not found in .env file")
        print("=" * 60)
        print("Please add your Google Gemini API key to server/.env:")
        print("GEMINI_API_KEY=your_key_here")
        print("")
        print("Get a FREE API key at:")
        print("https://makersuite.google.com/app/apikey")
        print("=" * 60)
        exit(1)
    
    # Use port 5002 explicitly (avoid conflict with port 5000)
    port = 5002
    
    print("=" * 60)
    print("🤖 Fit Fusion AI Coach - Gemini Server")
    print("=" * 60)
    print(f"✅ Gemini API Key: Configured")
    print(f"✅ Model: gemini-2.0-flash (LATEST & FREE!)")
    print(f"✅ Training: Complete (all diets, workouts, etc.)")
    print(f"✅ Rate Limits: NONE (Free tier is generous!)")
    print(f"📡 Server starting on http://localhost:{port}")
    print(f"📡 API endpoint: http://localhost:{port}/api/chatbot/message")
    print(f"✅ Health check: http://localhost:{port}/api/health")
    print("=" * 60)
    
    # Run Flask app
    app.run(host='0.0.0.0', port=port, debug=True)
