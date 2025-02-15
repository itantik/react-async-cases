import { useState } from 'react';
import { AddTodoForm } from './components/AddTodoForm';
import { ErrorBox } from './components/ErrorBox';
import { Loader } from './components/Loader';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { useLoadTodos } from './features/loadTodos/useLoadTodos';

export function TodoPage() {
  const [filter, setFilter] = useState('');

  const { state, error, value, run, abort } = useLoadTodos(filter);

  const handleListChanged = () => {
    // reload todo list
    abort();
    void run(filter);
  };

  return (
    <div className="page">
      <h1>Todo List</h1>
      <p>Example with React useState</p>
      <Filter filter={filter} onChange={setFilter} />
      {state.isPending ? <Loader>...loading...</Loader> : <Loader>&nbsp;</Loader>}
      {!state.isPending && error && <ErrorBox>{String(error)}</ErrorBox>}
      <TodoList
        list={value}
        filtered={Boolean(!state.isPending && filter)}
        onChange={handleListChanged}
      />
      <AddTodoForm onAdded={handleListChanged} />
    </div>
  );
}
