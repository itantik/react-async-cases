import { Case } from '../../../../lib/useCase';
import { apiResult } from '../../../api/apiResult';
import { TodoApiService } from '../../../api/TodoApiService';

export class LoadTodosCase implements Case {
  constructor(private abortController: AbortController = new AbortController()) {}

  async execute(filter: string) {
    // send API request
    const result = await apiResult(() => TodoApiService.list(filter, this.abortController.signal));

    if (result.isErr()) {
      // log error
      console.log('LoadTodosCase error:', result.error);
    }

    return result;
  }

  onAbort() {
    this.abortController.abort();
  }
}
