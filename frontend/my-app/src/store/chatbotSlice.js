import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { addMessage, setLoading, clearMessages, clearError } = chatbotSlice.actions;
export default chatbotSlice.reducer; 