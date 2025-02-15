import { useState } from 'react';
import { TodoPage } from './TodoPage/TodoPage';
import { ZustandTodoPage } from './ZustandTodoPage/ZustandTodoPage';
import { ReduxTodoPage } from './ReduxTodoPage/ReduxTodoPage';

export function App() {
  const [page, setPage] = useState<'todo' | 'zustand' | 'redux'>('todo');

  return (
    <div className="page-columns">
      <div className="page page-left">
        <h1>Example</h1>
        <ul>
          <li>
            Example of how to use the 'react-async-cases' <strong>with React useState</strong>.{' '}
            {page !== 'todo' && <button onClick={() => setPage('todo')}>Show me →</button>}
          </li>
          <li>
            Example of how to use the 'react-async-cases' <strong>with Zustand store</strong>.{' '}
            {page !== 'zustand' && <button onClick={() => setPage('zustand')}>Show me →</button>}
          </li>
          <li>
            Example of how to use the 'react-async-cases' <strong>with Redux store</strong>.{' '}
            {page !== 'redux' && <button onClick={() => setPage('redux')}>Show me →</button>}
          </li>
        </ul>
        <p className="note">
          This application demonstrates how to use the 'react-async-cases' library with different
          state management libraries.
        </p>
        <p className="note">
          Asynchronous requests are simulated with random delays to emphasize the pending phase.
        </p>
      </div>
      {page === 'todo' && <TodoPage />}
      {page === 'zustand' && <ZustandTodoPage />}
      {page === 'redux' && <ReduxTodoPage />}
    </div>
  );
}
