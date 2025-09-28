import { useState } from 'react';
import { ReactTodoPage } from './ReactTodoPage/ReactTodoPage';
import { ZustandTodoPage } from './ZustandTodoPage/ZustandTodoPage';
import { ReduxTodoPage } from './ReduxTodoPage/ReduxTodoPage';
import { DELAY_MAX, DELAY_MIN } from './api/delayedResponse';

export function App() {
  const [page, setPage] = useState<'react' | 'zustand' | 'redux'>('react');

  return (
    <div className="page-columns">
      <div className="page page-left">
        <h1>Example</h1>
        <p>How to use the 'react-async-cases':</p>
        <ul>
          <li>
            <strong>
              with React useState(){' '}
              {page === 'react' ? '→' : <button onClick={() => setPage('react')}>Show me</button>}
            </strong>
          </li>
          <li>
            <strong>
              with Zustand store{' '}
              {page === 'zustand' ? (
                '→'
              ) : (
                <button onClick={() => setPage('zustand')}>Show me</button>
              )}
            </strong>
          </li>
          <li>
            <strong>
              with Redux store{' '}
              {page === 'redux' ? '→' : <button onClick={() => setPage('redux')}>Show me</button>}
            </strong>
          </li>
        </ul>
        <p className="note">
          This application demonstrates how to use the 'react-async-cases' library with different
          state management libraries.
        </p>
        <p className="note">
          Asynchronous requests are simulated with random delays ({`${DELAY_MIN}-${DELAY_MAX} ms`})
          to emphasize the pending phase.
        </p>
        <p className="note">Open the development tools and watch the app logs in the console.</p>
      </div>
      {page === 'react' && <ReactTodoPage />}
      {page === 'zustand' && <ZustandTodoPage />}
      {page === 'redux' && <ReduxTodoPage />}
    </div>
  );
}
