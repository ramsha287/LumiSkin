# 🌟 LumiSkin - AI-Powered Skincare Analysis Platform

A comprehensive **MERN + Python microservice** application that provides AI-powered skin analysis, personalized recommendations, and skincare tracking.

---

## ✨ Features

### 🔹 Backend

* **User Authentication** – JWT-based signup/login/profile management
* **Image Analysis** – Upload skin photos for AI-powered analysis (acne, pores, pigmentation, skin tone)
* **Severity Scoring** – Convert AI outputs into mild/moderate/severe levels
* **Product Recommendations** – Suggest products and ingredients based on skin conditions
* **Routine Management** – Create, view, and edit personalized skincare routines
* **Progress Tracking** – Store before/after photos and monitor improvements
* **Ingredient Check** – Detect harmful ingredients & suggest alternatives

### 🔹 Frontend

* **Modern UI** – Responsive design with TailwindCSS
* **Real-time Analysis** – Instant AI analysis with visual results
* **Mobile Responsive** – Optimized for all devices

### 🔹 ML Service

* **Multi-Model Analysis** – Separate CNNs for different concerns
* **Severity Mapping** – Converts probabilities to severity levels
* **Image Preprocessing** – Enhancement & normalization
* **Batch Processing** – Supports multiple images

---

## 🏗️ Architecture

```bash
LumiSkin/
├── backend/                 # Node.js/Express API
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   ├── models/              # MongoDB schemas
│   ├── middleware/          # Auth & upload middleware
│   └── utils/               # Helper functions
├── frontend/                # React + Redux app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   └── store/           # Redux state management
└── ml-service/              # Python FastAPI ML service
    ├── utils/               # ML utilities
    └── models/              # Pre-trained CNN models
```

---

## 🛠️ Tech Stack

### Backend
`Node.js` · `Express.js` · `MongoDB` · `Mongoose` · `JWT` · `Multer` · `bcryptjs`  

### Frontend
`Next.js` · `Redux Toolkit` · `TailwindCSS` · `Axios` · `React Dropzone` · `Lucide React`  

### ML Service
`FastAPI` · `Uvicorn` · `TensorFlow` · `OpenCV` · `NumPy` · `Pillow` · `Pydantic`  


---

## 📦 Installation

### Prerequisites

* Node.js (v16+)
* Python (v3.8+)
* MongoDB
* Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LumiSkin
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lumiskin
JWT_SECRET=your-secret-key
ML_SERVICE_URL=http://localhost:8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. ML Service Setup

```bash
cd ml-service
pip install -r requirements.txt
```

### 5. Database Setup

Start MongoDB:

```bash
mongod
```

---

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB**

   ```bash
   mongod
   ```

2. **Start Backend**

   ```bash
   cd backend
   npm run dev
   ```

3. **Start ML Service**

   ```bash
   cd ml-service
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Start Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

### Production Mode

1. **Build Frontend**

   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend**

   ```bash
   cd backend
   npm start
   ```

3. **Start ML Service**

   ```bash
   cd ml-service
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

---

## 📖 Usage

### Getting Started

1. Register a new account or sign in
2. Upload a clear photo of your skin
3. Get instant AI analysis results
4. View personalized recommendations
5. Create and track your skincare routine

### Key Features

* **Skin Analysis** – Upload photos & get severity levels + confidence scores
* **Recommendations** – Product suggestions + ingredient safety checks
* **Progress Tracking** – Before/after comparisons & health trends
* **AI Chatbot** – Ask skincare questions & get tailored advice

---

## 🔧 API Endpoints

### Authentication

* `POST /api/auth/register` – User registration
* `POST /api/auth/login` – User login
* `GET /api/auth/profile` – Get profile
* `PUT /api/auth/profile` – Update profile

### Analysis

* `POST /api/analysis/analyze` – Analyze skin image
* `GET /api/analysis/history` – Get analysis history
* `GET /api/analysis/:id` – Get specific analysis

### Recommendations

* `GET /api/recommendations/personalized` – Personalized recommendations
* `GET /api/recommendations/ingredients` – Ingredient recommendations
* `POST /api/recommendations/compatibility` – Check ingredient compatibility

### ML Service (FastAPI)

* `POST /ml-service/predict` – AI image analysis
* `GET /ml-service/health` – Health check
* `GET /ml-service/models/status` – Model status
* `GET /docs` – Swagger API docs

---

## ⚡ FastAPI Benefits

* High-performance async framework
* Auto API docs with Swagger UI
* Strong type validation with Pydantic
* Easy testing & modern Python support

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch:

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes:

   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push & open a PR

---

## 📜 License

MIT License – see [LICENSE](LICENSE)

---

## 🌍 Future Roadmap

* [ ] **Sustainability Features** – Eco-index, footprint analysis, hazard alerts
* [ ] **Minimalism Guidance** – Reduce redundant routines & purchases
* [ ] **LLM-Powered Skin Trainer** – Smart chatbot with eco-advice
* [ ] **Community Engagement** – Peer recommendations, eco-challenges

---

## 🙏 Acknowledgments

* [FastAPI](https://fastapi.tiangolo.com/)
* [TensorFlow](https://www.tensorflow.org/)
* [React](https://react.dev/)
* [MongoDB](https://www.mongodb.com/)
* All contributors & supporters

---

**LumiSkin** – Transform your skincare routine with AI-powered insights ✨
