import { Case } from '../../../../lib/useCase';
import { apiResult } from '../../../api/apiResult';
import { TodoApiService } from '../../../api/TodoApiService';

export class RemoveTodoCase implements Case {
  async execute(todoId: string) {
    // send API request
    const result = await apiResult(() => TodoApiService.remove(todoId));

    if (result.isErr()) {
      // log error
      console.error('RemoveTodoCase error:', result.error.message);
    }

    return result;
  }
}
