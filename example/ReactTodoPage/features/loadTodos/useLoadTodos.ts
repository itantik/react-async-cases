import { useEffect } from 'react';
import { LoadTodosCase } from './LoadTodosCase';
import { useCaseState } from '../../../../lib/useCaseState';

export function useLoadTodos(filter: string) {
  const loadTodos = useCaseState(() => new LoadTodosCase());
  const { run, abort } = loadTodos;

  useEffect(() => {
    void run(filter);

    return () => {
      // aborting all running requests
      abort();
    };
  }, [abort, filter, run]);

  return loadTodos;
}
