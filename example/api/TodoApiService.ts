import { InMemoryTodoDB, Todo } from './InMemoryTodoDB';
import { delayedResponse } from './delayedResponse';

export const TodoApiService = {
  list(filter: string, abortSignal?: AbortSignal) {
    return delayedResponse(() => {
      const list = InMemoryTodoDB.list(filter);
      console.log('API: list', list);
      return list;
    }, abortSignal);
  },

  add(todo: Todo, abortSignal?: AbortSignal) {
    console.log('API: add', todo);
    return delayedResponse(() => InMemoryTodoDB.add(todo), abortSignal);
  },

  remove(todoId: string, abortSignal?: AbortSignal) {
    console.log('API: remove', todoId);
    return delayedResponse(() => InMemoryTodoDB.remove(todoId), abortSignal);
  },
};
