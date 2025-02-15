import { Case } from '../../../../lib/useCase';
import { apiResult } from '../../../api/apiResult';
import { TodoApiService } from '../../../api/TodoApiService';
import { AppStore, setTodos } from '../../reduxStore/todoStore';

export class LoadTodosCase implements Case {
  constructor(
    private appStore: AppStore,
    private abortController: AbortController = new AbortController(),
  ) {}

  async execute() {
    const filter = this.appStore.getState().todo.filter;

    // send API request
    const result = await apiResult(() => TodoApiService.list(filter, this.abortController.signal));

    if (result.isErr()) {
      // log error
      console.log('LoadTodosCase error:', result.error);
      return result;
    }

    // set todos to store
    this.appStore.dispatch(setTodos(result.value));

    return result;
  }

  onAbort() {
    this.abortController.abort();
  }
}
