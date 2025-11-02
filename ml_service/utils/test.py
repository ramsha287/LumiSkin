import tensorflow as tf
import numpy as np
from tensorflow.keras.utils import load_img, img_to_array
from tensorflow.keras.preprocessing import image
import pandas as pd
import os
import requests
from tensorflow.keras.models import load_model
import gdown
from huggingface_hub import hf_hub_download
from dotenv import load_dotenv  

# -------------------------

#https://drive.google.com/file/d/1oGsi6iz2YQT7kVsCxRcUBZ7VOxljZz5B/view?usp=sharing
#https://drive.google.com/file/d/1Egj_OdxmMi3KRdAv21dFHj_-0u5TMnJw/view?usp=sharing
#https://drive.google.com/file/d/1xg2XrUKQZ0boPFw-E4R2t7QdVIsgrpFy/view?usp=sharing
#https://drive.google.com/file/d/1pOzJnIkYWaxtWb-stq-pCUrI7H-BIvmv/view?usp=sharing

# Model details: add your actual Google Drive file IDs here
# models_info = {
#     "acne_model.h5": "1oGsi6iz2YQT7kVsCxRcUBZ7VOxljZz5B",
#     "wrinkle.h5": "1Egj_OdxmMi3KRdAv21dFHj_-0u5TMnJw",
#     "pigmentation.h5": "1xg2XrUKQZ0boPFw-E4R2t7QdVIsgrpFy",  # Replace with actual file ID
#     "skintone.h5": "1pOzJnIkYWaxtWb-stq-pCUrI7H-BIvmv"   # Replace with actual file ID
# }

# dest_folder = "ml_service/models"

# # Create destination folder if it doesn't exist
# if not os.path.exists(dest_folder):
#     os.makedirs(dest_folder)

# # Download all models if they don't exist
# for filename, file_id in models_info.items():
#     dest_path = os.path.join(dest_folder, filename)
#     if not os.path.exists(dest_path):
#         url = f"https://drive.google.com/uc?id={file_id}"
#         print(f"Downloading {filename}...")
#         gdown.download(url, dest_path, quiet=False)
#     else:
#         print(f"{filename} already exists. Skipping download.")

# # Load the models
# acne_model_path = os.path.join(dest_folder, "acne_model.h5")
# wrinkle_model_path = os.path.join(dest_folder, "wrinkle.h5")
# pigmentation_model_path = os.path.join(dest_folder, "pigmentation.h5")
# skintone_model_path = os.path.join(dest_folder, "skintone.h5")

load_dotenv(dotenv_path="ml_service/.env")
acne_model_path = hf_hub_download(
    repo_id="ramsha01/skin-analyzer-model",
    filename="acne_model.h5",
    token=os.getenv("HF_token")  # use token if private
)
wrinkle_model_path = hf_hub_download(
    repo_id="ramsha01/skin-analyzer-model",
    filename="wrinkle.h5",
    token=os.getenv("HF_token")  # use token if private
)
pigmentation_model_path = hf_hub_download(
    repo_id="ramsha01/skin-analyzer-model",
    filename="pigmentation.h5",
    token=os.getenv("HF_token")  # use token if private
)
skintone_model_path = hf_hub_download(
    repo_id="ramsha01/skin-analyzer-model",
    filename="skintone.h5",
    token=os.getenv("HF_token")  # use token if private
)

acne_model = tf.keras.models.load_model(acne_model_path)
wrinkle_model = tf.keras.models.load_model(wrinkle_model_path) 
pigmentation_model = tf.keras.models.load_model(pigmentation_model_path)
skintone_model = tf.keras.models.load_model(skintone_model_path)

# -------------------------
# 2. Knowledge base
# -------------------------
knowledge_base = {
    "wrinkles": {
        "ingredients": ["retinol", "peptides", "bakuchiol", "hyaluronic acid", "vitamin C"],
        "avoid_if_sensitive": ["strong acids", "high % retinol"]
    },
    "acne": {
        "ingredients": ["salicylic acid", "niacinamide", "benzoyl peroxide", "tea tree oil", "sulfur"],
        "avoid_if_sensitive": ["high % acids", "fragrance"]
    },
    "hyperpigmentation": {
        "ingredients": ["vitamin C", "niacinamide", "alpha arbutin", "kojic acid", "licorice extract"],
        "avoid_if_sensitive": ["hydroquinone", "strong acids"]
    },
    "dryness": {
        "ingredients": ["hyaluronic acid", "ceramides", "squalane", "glycerin", "panthenol"],
        "avoid_if_sensitive": ["strong retinoids", "alcohol-based products"]
    },
    "redness": {
        "ingredients": ["centella asiatica", "panthenol", "niacinamide", "colloidal oatmeal", "azelaic acid"],
        "avoid_if_sensitive": ["fragrance", "alcohol", "menthol"]
    },
    "sensitive_skin": {
        "ingredients": ["aloe vera", "oat extract", "squalane", "panthenol"],
        "avoid_if_sensitive": ["fragrance", "essential oils", "strong acids"]
    },
    "dullness": {
        "ingredients": ["vitamin C", "glycolic acid", "niacinamide", "licorice extract"],
        "avoid_if_sensitive": ["high % acids", "strong exfoliants"]
    },
    "uneven_tone": {
        "ingredients": ["niacinamide", "alpha arbutin", "kojic acid", "vitamin C"],
        "avoid_if_sensitive": ["strong acids", "hydroquinone"]
    },
    "oiliness": {
        "ingredients": ["niacinamide", "salicylic acid", "zinc", "kaolin clay"],
        "avoid_if_sensitive": ["strong acids", "alcohol-based toners"]
    }
}


# -------------------------
# 3. Dummy product dataset
# -------------------------
products = pd.DataFrame([
    {"name":"The Ordinary Retinol 0.5%", "ingredients":["retinol"], "price":750, "rating":4.5, "preferences":["fragrance-free"]},
    {"name":"Minimalist Peptide Serum", "ingredients":["peptides"], "price":1050, "rating":4.2, "preferences":["vegan"]},
    {"name":"Bakuchiol Face Oil", "ingredients":["bakuchiol"], "price":1299, "rating":4.0, "preferences":[]},
    {"name":"Salicylic Acid Cleanser", "ingredients":["salicylic acid"], "price":299, "rating":4.3, "preferences":["fragrance-free"]},
    {"name":"Niacinamide 10% + Zinc 1%", "ingredients":["niacinamide"], "price":550, "rating":4.4, "preferences":["vegan"]},
    {"name":"Vitamin C Serum 20%", "ingredients":["vitamin C"], "price":899, "rating":4.6, "preferences":["fragrance-free"]},
    {"name":"Hyaluronic Acid Hydrating Serum", "ingredients":["hyaluronic acid"], "price":699, "rating":4.5, "preferences":[]},
    {"name":"Ceramide Moisturizing Cream", "ingredients":["ceramides"], "price":1200, "rating":4.3, "preferences":["sensitive skin"]},
    {"name":"Squalane + Vitamin E Oil", "ingredients":["squalane"], "price":850, "rating":4.1, "preferences":["vegan"]},
    {"name":"Centella Asiatica Soothing Gel", "ingredients":["centella asiatica"], "price":650, "rating":4.4, "preferences":["fragrance-free"]},
    {"name":"Panthenol Repair Cream", "ingredients":["panthenol"], "price":499, "rating":4.0, "preferences":[]},
    {"name":"Benzoyl Peroxide Acne Treatment", "ingredients":["benzoyl peroxide"], "price":399, "rating":4.2, "preferences":["fragrance-free"]},
    {"name":"Alpha Arbutin Brightening Serum", "ingredients":["alpha arbutin"], "price":950, "rating":4.5, "preferences":["vegan"]},
    {"name":"Niacinamide + Zinc Cleanser", "ingredients":["niacinamide"], "price":350, "rating":4.1, "preferences":[]},
    {"name":"Retinol Night Cream", "ingredients":["retinol"], "price":1300, "rating":4.3, "preferences":["fragrance-free"]},
    {"name":"Bakuchiol Anti-Aging Serum", "ingredients":["bakuchiol"], "price":1400, "rating":4.2, "preferences":["vegan"]},
    {"name":"Vitamin C + E Brightening Cream", "ingredients":["vitamin C"], "price":999, "rating":4.4, "preferences":["fragrance-free"]},
    {"name":"Salicylic Acid Spot Treatment", "ingredients":["salicylic acid"], "price":299, "rating":4.3, "preferences":[]},
])

# -------------------------
# 4. Preprocess selfie
# -------------------------
def preprocess_selfie(img_path):
    img = image.load_img(img_path, target_size=(224,224))
    img_array = image.img_to_array(img)/255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# -------------------------
# 5. Predict all concerns
# -------------------------
# def predict_skin_attributes(img_path):
#     img_array = preprocess_selfie(img_path)
    
#     profile = {}
#     profile['wrinkles'] = wrinkle_model.predict(img_array)[0][0] > 0.5
#     profile['acne'] = acne_model.predict(img_array)[0][0] > 0.5
#     profile['hyperpigmentation'] = pigmentation_model.predict(img_array)[0][0] > 0.5
    
#     # Assume skintone_model outputs classes like ['fair', 'medium', 'tan', 'dark']
#     skintone_class = np.argmax(skintone_model.predict(img_array), axis=1)[0]
#     skin_tone_mapping = ['fair','medium','tan','dark']
#     profile['skin_tone'] = skin_tone_mapping[skintone_class]
    
#     return profile

def predict_skin_attributes(image_path: str) -> dict:
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    wrinkles_pred = bool((wrinkle_model.predict(img_array)[0][0] > 0.5).item())
    acne_pred = bool((acne_model.predict(img_array)[0][0] > 0.5).item())
    pigmentation_pred = bool((pigmentation_model.predict(img_array)[0][0] > 0.5).item())

    skintone_idx = int(np.argmax(skintone_model.predict(img_array)[0]))
    skintone_labels = ["fair", "medium", "dark"]
    skintone_pred = skintone_labels[skintone_idx]

    return {
        "wrinkles": wrinkles_pred,
        "acne": acne_pred,
        "hyperpigmentation": pigmentation_pred,
        "skin_tone": skintone_pred
    }


# -------------------------
# 6. Merge with user quiz
# -------------------------
def build_skin_profile(img_path, user_quiz):
    profile = user_quiz.copy()
    model_attrs = predict_skin_attributes(img_path)
    profile.update(model_attrs)
    return profile

# -------------------------
# 7. Map profile to recommended ingredients
# -------------------------
def get_ingredients(profile, knowledge_base):
    recommended = []
    for concern, info in knowledge_base.items():
        if profile.get(concern):
            if profile.get('sensitivity') == 'high':
                safe_ings = [i for i in info['ingredients'] if i not in info['avoid_if_sensitive']]
                recommended.extend(safe_ings)
            else:
                recommended.extend(info['ingredients'])
    return list(set(recommended))

# -------------------------
# 8. Recommend products
# -------------------------
def recommend_products(profile, ingredients, products_df):
    filtered = products_df.copy()
    filtered = filtered[filtered['ingredients'].apply(lambda x: any(i in ingredients for i in x))]
    filtered = filtered[filtered['price'] <= profile.get('budget', 20000)]
    
    user_prefs = profile.get('preferences', [])
    if user_prefs:
        filtered = filtered[filtered['preferences'].apply(lambda x: all(p in x for p in user_prefs) or not x)]
    
    filtered = filtered.sort_values(by='rating', ascending=False)
    return filtered.head(5)

# -------------------------
# 9. Example Usage
# -------------------------
user_quiz = {
    "dryness": False,
    "redness": False,
    "skin_type": "oily",
    "sensitivity": "mild",
    "budget": 1500,
    "preferences": ["fragrance-free"]
}

