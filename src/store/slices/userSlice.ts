import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  user: {
    email: string;
    image_url: string;
    name: string;
    exp: number;
    credentials: string;
    current_credits: number;
    origin: string;
  } | null;
  loading: boolean;
  error: string | null;
}

// Define the default initial state separately
const defaultInitialState: UserState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Load user from storage with the default initial state
const loadUserFromStorage = (): UserState => {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return defaultInitialState;

    const parsedUser = JSON.parse(savedUser);
    return {
      isAuthenticated: true,
      user: parsedUser,
      loading: false,
      error: null,
    };
  } catch (error) {
    return defaultInitialState;
  }
};

const initialState: UserState = loadUserFromStorage();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      // Persist to localStorage
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear from localStorage
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
