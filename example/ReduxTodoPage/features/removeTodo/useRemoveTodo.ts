import { useCaseState } from '../../../../lib/useCaseState';
import { useAppStore } from '../../reduxStore/todoStore';
import { RemoveTodoCase } from './RemoveTodoCase';

export function useRemoveTodo() {
  const appStore = useAppStore();
  return useCaseState(() => new RemoveTodoCase(appStore));
}
