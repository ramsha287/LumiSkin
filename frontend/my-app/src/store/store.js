import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import analysisSlice from './analysisSlice';
import recommendationSlice from './recommendationSlice';
import routineSlice from './routineSlice';
import trackingSlice from './trackingSlice';
import chatbotSlice from './chatbotSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    analysis: analysisSlice,
    recommendations: recommendationSlice,
    routine: routineSlice,
    tracking: trackingSlice,
    chatbot: chatbotSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // ✅ ignore persist actions
      },
    }),
});

export default store;
