import { Case } from '../../../../lib/useCase';
import { apiResult } from '../../../api/apiResult';
import { Todo } from '../../../api/InMemoryTodoDB';
import { TodoApiService } from '../../../api/TodoApiService';

export class AddTodoCase implements Case {
  async execute(todoItem: Todo) {
    // send API request
    const result = await apiResult(() => TodoApiService.add(todoItem));

    if (result.isErr()) {
      // log error
      console.error('AddTodoCase error:', result.error.message);
    }

    return result;
  }
}
