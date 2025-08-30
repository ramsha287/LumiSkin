from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv, find_dotenv
from datetime import datetime
from bson import ObjectId, Binary
import jwt
from utils.test import build_skin_profile, get_ingredients, recommend_products, knowledge_base, products, predict_skin_attributes
import logging
from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


logger = logging.getLogger("auth")
logging.basicConfig(level=logging.DEBUG)
bearer_scheme = HTTPBearer()


app = FastAPI()

# Load env
load_dotenv(dotenv_path="ml_service/.env")
MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB = os.getenv("MONGO_DB", "test")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "analysis")
JWT_SECRET = os.getenv("JWT_SECRET", "mySuperSecretKey123!")

# Connect Mongo
client = MongoClient(MONGO_URL)
db = client[MONGO_DB]
collection = db[MONGO_COLLECTION]

origins = [
    "https://lumiskin-skincare.netlify.app",
    "http://localhost:3000", 
    "http://127.0.0.1:3000",

]

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://lumiskin-skincare.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def to_python(obj):
    if isinstance(obj, (np.int64, np.int32)):
        return int(obj)
    elif isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, (np.bool_)):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime): 
        return obj.isoformat()
    return obj



# JWT dependency
def get_current_user_id(credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)):
    token = credentials.credentials  # This is just the JWT part, no "Bearer " prefix
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("_id") or payload.get("userId")
        if not user_id:
            raise HTTPException(status_code=401, detail="user_id not found in token")
        if ObjectId.is_valid(user_id):
            return ObjectId(user_id)
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# POST /analyze/
@app.post("/analyze/")
async def analyze(
    file: UploadFile = File(...),
    skin_type: str = Form("oily"),
    sensitivity: str = Form("mild"),
    budget: int = Form(1500),
    preferences: str = Form("fragrance-free"),
    dryness: str = Form("false"),
    redness: str = Form("false"),
    user_id: str = Depends(get_current_user_id)
):
    def str_to_bool(value: str) -> bool:
        return str(value).lower() in ("true", "1", "yes")

    if not file.content_type.startswith("image/"):
        return JSONResponse(status_code=400, content={"error": "File must be an image"})

    temp_file_path = f"temp_{file.filename}"
    try:
        # Save temporary file
        
        image_bytes = await file.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        # Save temp file
        with open(temp_file_path, "wb") as f:
            f.write(image_bytes)

        # Validate that the image can be read
        import cv2
        img = cv2.imread(temp_file_path)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")



        # User quiz preferences
        prefs_list = [p.strip() for p in preferences.split(",")] if preferences else []
        user_quiz = {
            "dryness": str_to_bool(dryness),
            "redness": str_to_bool(redness),
            "skin_type": skin_type,
            "sensitivity": sensitivity,
            "budget": int(budget),
            "preferences": prefs_list,
        }

        # Build skin profile from quiz + image
        profile = build_skin_profile(temp_file_path, user_quiz)
        logger.debug(f"Built skin profile: {profile}")
        # Predict skin attributes from image
        skin_attributes = predict_skin_attributes(temp_file_path)
        logger.debug(f"Predicted skin attributes: {skin_attributes}")
        # Combine profile with predicted attributes
        full_profile = {**profile, **skin_attributes}

        # Get recommended ingredients and products
        ingredients_to_use = get_ingredients(full_profile, knowledge_base)
        top_products = recommend_products(full_profile, ingredients_to_use, products)
        top_products_dicts = top_products.to_dict(orient="records")

        # Build response
        response = {
            "user_id": str(user_id),
            "skin_profile": {k: to_python(v) for k, v in full_profile.items()},
            "recommended_ingredients": [to_python(i) for i in ingredients_to_use],
            "recommended_products": [{k: to_python(v) for k, v in product.items()} for product in top_products_dicts],
            "created_at": datetime.utcnow(),
            # "image": Binary(image_bytes),
            # "image_content_type": file.content_type,
        }
        logger.debug(f"Response to be stored: {response}")
        try:
            result = collection.insert_one(response)
            logger.info(f"Inserted document id: {result.inserted_id}")
        except Exception as e:
            logger.error(f"MongoDB insert error: {e}")
            raise HTTPException(status_code=500, detail="Database insertion error")
        # Safe response without image
        safe_response = {k: to_python(v) for k, v in {"_id": str(result.inserted_id), **response}.items()}
        safe_response.pop("image", None)

        return safe_response

    except Exception as e:
        logger.error(f"Analyze error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)



