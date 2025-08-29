backend/
│
├── server.js                # Entry point for Express app
├── config/                  
│   └── db.js                 # MongoDB connection config
│
├── controllers/              # Route business logic
│   ├── analysisController.js
│   ├── recommendationController.js
│   ├── routineController.js
│   ├── trackingController.js
│   ├── ingredientController.js
│   ├── chatbotController.js
│   ├── authController.js
│   └── userController.js
│
├── routes/                   # API route definitions
│   ├── analysisRoutes.js
│   ├── recommendationRoutes.js
│   ├── routineRoutes.js
│   ├── trackingRoutes.js
│   ├── ingredientRoutes.js
│   ├── chatbotRoutes.js
│   ├── authRoutes.js
│   └── userRoutes.js
│
├── models/                   # MongoDB schemas
│   ├── User.js
│   ├── Routine.js
│   ├── Product.js
│   └── Tracking.js
│
├── middleware/               # Request middlewares
│   ├── authMiddleware.js     # JWT auth check
│   └── uploadMiddleware.js   # Multer for image uploads
│
└── utils/                    # Helper functions
    ├── severityMapping.js
    ├── ingredientMapping.js
    ├── productRecommender.js
    └── pythonConnector.js    # Connect Node to Python CNN models

frontend/
│
├── src/
│   ├── index.js               # App entry point
│   ├── App.js                 # Route structure
│
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── UploadImage.js
│   │   ├── SeverityCard.js
│   │   ├── IngredientList.js
│   │   ├── ProductCard.js
│   │   ├── RoutineStep.js
│   │   └── ChatBotWidget.js
│
│   ├── pages/                  # Page-level views
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Analysis.js
│   │   ├── Recommendations.js
│   │   ├── Routine.js
│   │   ├── Tracking.js
│   │   ├── IngredientCheck.js
│   │   ├── Chatbot.js
│   │   └── Profile.js
│
│   ├── services/               # API calls
│   │   ├── authService.js
│   │   ├── analysisService.js
│   │   ├── recommendationService.js
│   │   ├── routineService.js
│   │   ├── trackingService.js
│   │   ├── ingredientService.js
│   │   └── chatbotService.js
│
│   ├── store/                  # Redux store (or Context)
│   │   ├── store.js
│   │   ├── authSlice.js
│   │   ├── analysisSlice.js
│   │   ├── recommendationSlice.js
│   │   ├── routineSlice.js
│   │   ├── trackingSlice.js
│   │   └── chatbotSlice.js
│
│   └── assets/                 # Static images/icons
