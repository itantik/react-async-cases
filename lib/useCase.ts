import { useCallback, useEffect, useRef } from 'react';
import { Abortable } from './Abortable';
import { type Result } from './Result';
import { useAbortable } from './useAbortable';

export type CaseResult<Res, Err> = Promise<Result<Res, Err>>;

export interface Case<Res = unknown, Err = unknown, P = unknown> extends Abortable {
  execute(params: P): CaseResult<Res, Err>;
}

export type CaseFactory<Res, Err, P> = () => Case<Res, Err, P>;

export function useCase<Res, Err, P = void>(caseFactory: CaseFactory<Res, Err, P>) {
  const factoryRef = useRef(caseFactory);
  useEffect(() => {
    factoryRef.current = caseFactory;
  });

  const { watch, unwatch, abort } = useAbortable();

  const run = useCallback(
    async (params: P) => {
      const objCase = factoryRef.current();
      watch(objCase);
      const result = await objCase.execute(params);
      unwatch(objCase);
      return result;
    },
    [unwatch, watch],
  );

  return { run, abort };
}
