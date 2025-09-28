import { Case, Result } from '../lib/main';
import { waitPlease } from './testUtils';

type TestCaseOptions = { testOption: string };

export class TestCase implements Case {
  constructor(
    private options: TestCaseOptions,
    private abortController?: AbortController,
  ) {}

  // case factory
  static create = (options?: TestCaseOptions) => {
    return new TestCase(options || { testOption: 'once' }, new AbortController());
  };

  async execute(params: { runParam: number }) {
    if (this.aborted()) {
      return Result.err(new Error('Aborted'));
    }

    await waitPlease(10);

    if (this.aborted()) {
      return Result.err(new Error('Aborted'));
    }

    switch (this.options.testOption) {
      case 'once':
        return Result.ok(`Once - ${params.runParam}`);
      case 'double':
        return Result.ok(`Double - ${params.runParam * 2}`);
      case 'triple':
        return Result.ok(`Triple - ${params.runParam * 3}`);
      default:
        return Result.err(new Error('Invalid testOption value'));
    }
  }

  onAbort() {
    this.abortController?.abort();
  }

  private aborted() {
    return this.abortController?.signal.aborted;
  }
}
