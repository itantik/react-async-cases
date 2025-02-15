import { useEffect } from 'react';
import { LoadTodosCase } from './LoadTodosCase';
import { useCaseState } from '../../../../lib/useCaseState';
import { useAppStore, useFilter } from '../../reduxStore/todoStore';

export function useLoadTodos() {
  const filter = useFilter();

  const appStore = useAppStore();
  const loadTodos = useCaseState(() => new LoadTodosCase(appStore));
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
