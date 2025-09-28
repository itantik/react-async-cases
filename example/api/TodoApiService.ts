import { InMemoryTodoDB, Todo } from './InMemoryTodoDB';
import { delayedResponse } from './delayedResponse';

export const TodoApiService = {
  list(filter: string, abortSignal?: AbortSignal) {
    console.log('API list - request:', { filter });
    return delayedResponse(() => {
      const list = InMemoryTodoDB.list(filter);
      console.log('API list - response:', { list });
      return list;
    }, abortSignal);
  },

  add(item: Todo, abortSignal?: AbortSignal) {
    console.log('API add - request:', { item });
    return delayedResponse(() => InMemoryTodoDB.add(item), abortSignal);
  },

  remove(itemId: string, abortSignal?: AbortSignal) {
    console.log('API remove - request:', { itemId });
    return delayedResponse(() => InMemoryTodoDB.remove(itemId), abortSignal);
  },
};
