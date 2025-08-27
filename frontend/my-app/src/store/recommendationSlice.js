import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recommendationService } from '../services/recommendationService';

export const getPersonalizedRecommendations = createAsyncThunk(
  'recommendations/getPersonalized',
  async (params, { rejectWithValue }) => {
    try {
      const response = await recommendationService.getPersonalized(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get recommendations');
    }
  }
);

const initialState = {
  recommendations: null,
  loading: false,
  error: null,
};

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRecommendations: (state) => {
      state.recommendations = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPersonalizedRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPersonalizedRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(getPersonalizedRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearRecommendations } = recommendationSlice.actions;
export default recommendationSlice.reducer; 