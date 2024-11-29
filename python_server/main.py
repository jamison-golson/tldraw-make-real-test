import os
import json
from typing import Dict, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import logging
import llm
import uvicorn
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
PORT = int(os.getenv("PORT", 3002))

@app.post("/api/claude")
async def claude_endpoint(request: Request):
    try:
        # Read raw request body from Make Real call
        request_data = await request.json()
        
        # Log request data
        logger.info(f"Received request body size: {len(json.dumps(request_data))}")
        logger.info(f"Received request body: {json.dumps(request_data, indent=2)}")

        # Validate request data
        if not isinstance(request_data, dict):
            raise HTTPException(status_code=400, detail="Invalid request format")

        # Get model from request data
        model_name = request_data.get("model")
        if not model_name:
            raise HTTPException(status_code=400, detail="Model not specified in request")

        # Initialize model for this request
        try:
            model = llm.get_model(model_name)
            print(model)
            # model.key = ANTHROPIC_API_KEY
        except Exception as e:
            logger.error(f"Failed to initialize model {model_name}: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to initialize model: {str(e)}")
        
        # Had to create sepearate logic for Gemini models because I have not found the proper 'messaging structure' that llm uses for it's underlying API calls yet
        # Add file upload/retrieval managment for prompt AND images greater than 20MB if LLM does not do this automatically 
        # How do I calculate file size for prompt AND images?
        if 'gemini' in model_name:
            # Create a prompt with both text and image
            text_content = ""
            messages_gemini = request_data.get("messages", [])
            parts_gemini = messages_gemini[1].get("parts", [])
            system_message_gemini = messages_gemini[0].get("system_instruction").get('parts').get('text')
            for part in parts_gemini:
                if 'text' in part:
                    text_content += part['text'] + "\n"

            response = model.prompt(text_content, 
                                    system= system_message_gemini,
                                    attachments=[
                        llm.Attachment(content=base64.b64decode(parts_gemini[1]['fileData']['fileUri'].split(',')[1]),
                        type="image/png")
                    ],
                    
                    )
            response_text_gemini = response.text()
            # Format response to match Anthropic's API response structure
            response_data = {
                "content": response_text_gemini,
                "role": "assistant",
                "model": model_name
            }
            # logger.info(response.prompt)

            logger.info(f"Successful response: {json.dumps(response_data, indent=2)}")
            return JSONResponse(content=response_data)
        
        # Extract necessary fields from request_data
        messages = request_data.get("messages", [])
        system = request_data.get("system", "")
        
        # Get the last message content (assuming it's the user's prompt)
        if not messages:
            raise HTTPException(status_code=400, detail="No messages provided")
        
        prompt = messages[-1].get("content", "")
        if not prompt:
            raise HTTPException(status_code=400, detail="Empty prompt")

        # Create a new conversation if there are multiple messages
        if len(messages) > 1:
            conversation = model.conversation()
            # Add previous messages to conversation
            for msg in messages[:-1]:
                if msg.get("role") == "user":
                    conversation.prompt(msg.get("content", ""))
            # Get response for the last message
            response = conversation.prompt(prompt, system=system, stream=False)
        else:
            # Single message case
            response = model.prompt(prompt, system=system, stream=False)

        # Get the response text
        # print(response.text())
        response_text = response.text()
        
        # Format response to match Anthropic's API response structure
        response_data = {
            "content": response_text,
            "role": "assistant",
            "model": model_name
        }

        logger.info(f"Successful response: {json.dumps(response_data, indent=2)}")
        return JSONResponse(content=response_data)

    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid JSON in request body")

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Failed to process request",
                "message": str(e)
            }
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

if __name__ == "__main__":
    logger.info(f"Starting server on port {PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT)