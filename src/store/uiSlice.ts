import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TodoFilter = "all" | "active" | "completed";

interface UiState {
  todoFilter: TodoFilter;
}

const initialState: UiState = {
  todoFilter: "all",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTodoFilter(state, action: PayloadAction<TodoFilter>) {
      state.todoFilter = action.payload;
    },
  },
});

export const { setTodoFilter } = uiSlice.actions;

export default uiSlice.reducer;
