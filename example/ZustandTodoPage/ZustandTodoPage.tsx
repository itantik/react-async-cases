import { AddTodoForm } from './components/AddTodoForm';
import { ErrorBox } from './components/ErrorBox';
import { Loader } from './components/Loader';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { useLoadTodos } from './features/loadTodos/useLoadTodos';

export function ZustandTodoPage() {
  const { state, error, run, abort } = useLoadTodos();

  const handleListChanged = () => {
    // reload todo list
    abort();
    void run();
  };

  return (
    <div className="page">
      <h1>Todo List</h1>
      <p>Example with Zustand store.</p>
      <Filter />
      {state.isPending ? <Loader>...loading...</Loader> : <Loader>&nbsp;</Loader>}
      {!state.isPending && error && <ErrorBox>{String(error)}</ErrorBox>}
      <TodoList onChange={handleListChanged} />
      <AddTodoForm onAdded={handleListChanged} />
    </div>
  );
}
