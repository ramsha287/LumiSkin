import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Safe helper
const safeLocalStorage = {
  get: (key) => (typeof window !== "undefined" ? localStorage.getItem(key) : null),
  set: (key, value) => { if (typeof window !== "undefined") localStorage.setItem(key, value); },
  remove: (key) => { if (typeof window !== "undefined") localStorage.removeItem(key); },
};

// Async thunks
export const register = createAsyncThunk('/api/auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.register(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Registration failed');
  }
});

export const login = createAsyncThunk('/api/auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

export const getProfile = createAsyncThunk('/api/auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getProfile();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to get profile');
  }
});

export const updateProfile = createAsyncThunk('/api/auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await authService.updateProfile(profileData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update profile');
  }
});

export const logout = createAsyncThunk('/api/auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Logout failed');
  }
});

// Initial state (safe for SSR)
const initialState = {
  user: JSON.parse(safeLocalStorage.get("user")) || null,
  token: safeLocalStorage.get("token"),
  isAuthenticated: !!safeLocalStorage.get("token"),
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        safeLocalStorage.set("token", action.payload);
      } else {
        safeLocalStorage.remove("token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        safeLocalStorage.set("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        safeLocalStorage.set("token", action.payload.token);
        safeLocalStorage.set("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        safeLocalStorage.remove("token");
        safeLocalStorage.remove("user");
      });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
