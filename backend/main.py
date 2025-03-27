"""
Copyright © 2025 Christophe Manzi. All rights reserved.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import Dict, List, Optional
from datetime import datetime
from agents.model_builder import ModelBuilder
from agents.knowledge_processor import KnowledgeProcessor

app = FastAPI(title="AI Model Builder API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
    config: Optional[Dict] = None

class ModelResponse(BaseModel):
    id: str
    status: str
    architecture: Dict
    knowledge_graph: Optional[Dict]
    progress: float
    created_at: str

# Initialize agents
model_builder = ModelBuilder()
knowledge_processor = KnowledgeProcessor()

# Ensure required directories exist
os.makedirs("data/logs", exist_ok=True)
os.makedirs("data/generated", exist_ok=True)

def process_model_building(model_id: str, prompt: str, config: Dict):
    """
    Background task for model building process
    """
    try:
        # Process knowledge from prompt
        knowledge = knowledge_processor.process_conversation(prompt)
        
        # Update progress log
        _update_progress(model_id, 0.2, "Knowledge processing complete")
        
        # Interpret prompt and select architecture
        spec = model_builder.interpret_prompt(prompt)
        _update_progress(model_id, 0.4, "Architecture selected")
        
        # Build model
        model = model_builder.build_model(spec)
        _update_progress(model_id, 0.8, "Model built")
        
        # Save model
        _save_model(model_id, model)
        _update_progress(model_id, 1.0, "Complete")
        
    except Exception as e:
        _update_progress(model_id, -1, f"Error: {str(e)}")
        raise

def _update_progress(model_id: str, progress: float, message: str):
    """
    Update progress log for model building
    """
    log_file = f"data/logs/{model_id}.log"
    with open(log_file, "a") as f:
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "progress": progress,
            "message": message
        }
        f.write(json.dumps(log_entry) + "\n")

def _save_model(model_id: str, model: Dict):
    """
    Save built model to disk
    """
    model_file = f"data/generated/{model_id}.json"
    with open(model_file, "w") as f:
        json.dump(model, f)

@app.post("/api/agent", response_model=ModelResponse)
async def process_prompt(request: PromptRequest, background_tasks: BackgroundTasks):
    try:
        model_id = f"model_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Start background processing
        background_tasks.add_task(
            process_model_building,
            model_id,
            request.prompt,
            request.config or {}
        )
        
        # Initial response
        return {
            "id": model_id,
            "status": "processing",
            "architecture": {},
            "knowledge_graph": {},
            "progress": 0.0,
            "created_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models")
async def list_models():
    try:
        models = []
        for file in os.listdir("data/generated"):
            if file.endswith(".json"):
                model_id = file[:-5]
                with open(f"data/generated/{file}", "r") as f:
                    model_data = json.load(f)
                models.append({
                    "id": model_id,
                    "created_at": datetime.fromtimestamp(
                        os.path.getctime(f"data/generated/{file}")
                    ).isoformat(),
                    "config": model_data.get("model_config", {})
                })
        return models
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/logs/{model_id}")
async def get_logs(model_id: str):
    try:
        log_file = f"data/logs/{model_id}.log"
        if not os.path.exists(log_file):
            raise HTTPException(status_code=404, detail="Log not found")
        
        with open(log_file, "r") as f:
            logs = [json.loads(line) for line in f]
        return {"logs": logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model/{model_id}")
async def get_model(model_id: str):
    try:
        model_file = f"data/generated/{model_id}.json"
        if not os.path.exists(model_file):
            raise HTTPException(status_code=404, detail="Model not found")
        
        with open(model_file, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))