import { Case } from '../../../../lib/useCase';
import { apiResult } from '../../../api/apiResult';
import { TodoApiService } from '../../../api/TodoApiService';
import { AppStore, removeTodo } from '../../reduxStore/todoStore';

export class RemoveTodoCase implements Case {
  constructor(private appStore: AppStore) {}

  async execute(todoId: string) {
    // send API request
    const result = await apiResult(() => TodoApiService.remove(todoId));

    if (result.isErr()) {
      // log error
      console.log('RemoveTodoCase error:', result.error);
      return result;
    }

    // optimistic update the store (before loading the new todos)
    this.appStore.dispatch(removeTodo(todoId));

    return result;
  }
}
