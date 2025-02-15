import { useCaseState } from '../../../../lib/useCaseState';
import { AddTodoCase } from './AddTodoCase';

export function useAddTodo() {
  return useCaseState(() => new AddTodoCase());
}
