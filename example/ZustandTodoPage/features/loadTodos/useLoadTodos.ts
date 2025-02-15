import { useEffect } from 'react';
import { LoadTodosCase } from './LoadTodosCase';
import { useCaseState } from '../../../../lib/useCaseState';
import { useFilter } from '../../zustandStore/todoStore';

export function useLoadTodos() {
  const filter = useFilter();
  const loadTodos = useCaseState(() => new LoadTodosCase());
  const { run, abort } = loadTodos;

  useEffect(() => {
    void run();

    return () => {
      // aborting all running requests
      abort();
    };
  }, [abort, filter, run]);

  return loadTodos;
}
