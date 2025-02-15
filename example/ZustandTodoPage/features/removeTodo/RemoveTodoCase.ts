import { Case } from '../../../../lib/useCase';
import { apiResult } from '../../../api/apiResult';
import { TodoApiService } from '../../../api/TodoApiService';
import { todoStoreState } from '../../zustandStore/todoStore';

export class RemoveTodoCase implements Case {
  async execute(todoId: string) {
    // send API request
    const result = await apiResult(() => TodoApiService.remove(todoId));

    if (result.isErr()) {
      // log error
      console.log('RemoveTodoCase error:', result.error);
      return result;
    }

    // optimistic update the store (before loading the new todos)
    const { removeTodo } = todoStoreState().actions;
    removeTodo(todoId);

    return result;
  }
}
