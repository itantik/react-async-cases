import { create } from 'zustand';
import { Todo } from '../../api/InMemoryTodoDB';

type State = {
  todos: Todo[] | undefined;
  filter: string;
};
type Actions = {
  actions: {
    setTodos: (todos: Todo[] | undefined) => void;
    removeTodo: (todoId: string) => void;
    setFilter: (filter: string) => void;
  };
};

const useTodoStore = create<State & Actions>()((set) => ({
  todos: undefined,
  filter: '',
  actions: {
    setTodos: (todos) => set((state) => ({ ...state, todos })),
    removeTodo: (todos) =>
      set((state) => ({ ...state, todos: state.todos?.filter((todo) => todo.id !== todos) })),
    setFilter: (filter) => set((state) => ({ ...state, filter })),
  },
}));

export const useTodos = () => useTodoStore((state) => state.todos);
export const useFilter = () => useTodoStore((state) => state.filter);

export const useTodoActions = () => useTodoStore((state) => state.actions);

export const todoStoreState = useTodoStore.getState;
