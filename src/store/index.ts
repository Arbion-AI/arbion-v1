import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.ts";
import agentReducer from "./slices/agentSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    agents: agentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
