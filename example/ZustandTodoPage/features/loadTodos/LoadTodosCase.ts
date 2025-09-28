import { Case } from '../../../../lib/useCase';
import { apiResult } from '../../../api/apiResult';
import { TodoApiService } from '../../../api/TodoApiService';
import { todoStoreState } from '../../zustandStore/todoStore';

export class LoadTodosCase implements Case {
  constructor(private abortController: AbortController = new AbortController()) {}

  async execute() {
    const filter = todoStoreState().filter;

    // send API request
    const result = await apiResult(() => TodoApiService.list(filter, this.abortController.signal));

    if (result.isErr()) {
      // log error
      console.error('LoadTodosCase error:', result.error.message);
      return result;
    }

    const { setTodos } = todoStoreState().actions;
    setTodos(result.value);

    return result;
  }

  onAbort() {
    this.abortController.abort();
  }
}
