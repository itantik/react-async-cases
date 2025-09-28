import { useCaseState } from '../../../../lib/useCaseState';
import { RemoveTodoCase } from './RemoveTodoCase';

export function useRemoveTodo() {
  return useCaseState(() => new RemoveTodoCase());
}
