import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setToken } from "./authSlice"; // optional if you want token refresh handling

// ✅ Backend API URL (adjust to your FastAPI base URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Async thunk for analysis
export const analyzeSkin = createAsyncThunk(
  "analysis/analyzeSkin",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState(); // get token from authSlice
      const token = auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.post(`${API_URL}/analyze/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.message || "Analysis failed"
      );
    }
  }
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    result: null,
    loading: false,
    error: null,
    history: [], // if you want to keep multiple analysis results
  },
  reducers: {
    clearAnalysis: (state) => {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeSkin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeSkin.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.history.unshift(action.payload); // keep history
      })
      .addCase(analyzeSkin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalysis } = analysisSlice.actions;
export default analysisSlice.reducer;
