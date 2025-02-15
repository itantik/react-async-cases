import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Todo } from '../../api/InMemoryTodoDB';
import { useDispatch, useSelector, useStore } from 'react-redux';

type State = {
  todos: Todo[] | undefined;
  filter: string;
};

const initialState: State = {
  todos: undefined,
  filter: '',
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[] | undefined>) => {
      return { ...state, todos: action.payload };
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      return { ...state, todos: state.todos?.filter((todo) => todo.id !== action.payload) };
    },
    setFilter: (state, action: PayloadAction<string>) => {
      return { ...state, filter: action.payload };
    },
  },
});

export const { setTodos, removeTodo, setFilter } = todoSlice.actions;

export const reducer = todoSlice.reducer;

export const store = configureStore({
  reducer: {
    todo: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppStore = () => useStore<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useFilter = () => useAppSelector((state) => state.todo.filter);
export const useTodos = () => useAppSelector((state) => state.todo.todos);
