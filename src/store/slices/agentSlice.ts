import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SwingXStandardBalance } from "@/types/swingx";

interface AgentState {
  agent: SwingXStandardBalance | null;
  selectedAgent: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  agent: null,
  selectedAgent: null,
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<SwingXStandardBalance>) => {
      state.agent = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAgents, setLoading, setError } = agentSlice.actions;
export default agentSlice.reducer;
