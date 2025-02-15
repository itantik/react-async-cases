# react-async-cases

Separating async business logic from user interface in React applications.

You can extract plain business logic (i.e. cases) into independent classes. The `react-async-cases` hooks connect these cases to React components and give you the result value and state of the async process. Your components can remain clear and simple.

Features:

- `useCase` hook - separating async use-cases
- `useCaseState` hook - separating async use-cases and async state monitoring
- `Result<Value, Error>` type - bypassing exception handling
- `useAsynState` hook - storing async state and resulting value
- abortable execution of the Case

Simple example:

```tsx
// Case implementation
export class LoadTodosCase implements Case {
  async execute() {
    // send API request
    const result = await apiResult(() => axios.get('/todos'));

    if (result.isErr()) {
      // we can do something with the result.error
      console.log('LoadTodosCase error:', result.error);
    }

    if (result.isOk()) {
      // we can do something with the result.value
      console.log('LoadTodosCase value:', result.value);
    }

    return result;
  }
}

// React component
export function TodoList() {
  // make a connection with LoadTodosCase
  const { state, error, value, run } = useCaseState(() => new LoadTodosCase());

  useEffect(() => {
    // initial loading
    // the run() function executes the case
    void run();
  }, [run]);

  return (
    <>
      <h1>Todo List</h1>

      {state.isPending ? <Loader />}

      {!state.isPending && error && <ErrorPanel error={error} />}

      <TodoList list={value} />
    </>
  );
}
```

Later we will see how to write cases.

## Installation

    $ npm install react-async-cases

## Usage

### 1. Case Definition

In terms of the `react-async-cases` library, the case is a separate unit that covers one application feature. We might also call it an application service or a use case.

The case is implemented as a class with this interface:

```typescript
interface Case<Res, Err, P> {
  execute(params: P): Promise<Result<Res, Err>>;
  onAbort?: () => void;
}
```

The case is separated from the rest of the application. It declares all its dependencies in its `contructor`, so it is well testable.

### 2. Case Result

The `execute` method **must not throw an exception**. Instead, it returns a `Result` object, which is a union type of a success or error value.

```typescript
type Result<V, E> = Ok<V> | Err<E>;
```

The `Ok` object wraps a `value` and offers it via the `result.value` getter.

The `Err` object wraps an `error` and offers it via the `result.error` getter.

Both `Ok` and `Err` objects implement `isOk()` and `isErr()` methods, which act as type guards.

Examples of creating a `Result` instance:

```typescript
import { ok, err } from 'react-async-cases';

// Ok result
const okResult = ok('success');

if (okResult.isOk()) {
  console.log(okResult.value); // -> 'success'
  // okResult.error // -> TS: Property 'error' does not exist on type Ok
}
if (okResult.isErr()) {
  // -> never
}

// Err result
const errResult = err('error message');

if (errResult.isErr()) {
  console.log(errResult.error); // -> 'error message'
  // errResult.value // -> TS: Property 'value' does not exist on type Err
}
if (errResult.isOk()) {
  // -> never
}
```

### 3. Case Creation

First, we'll create a generic helper function. It sends an API request as async function and then returns a Result. It does not throw an exception. And in addition, an error is strictly typed.

Sure, we can wrap the async function in a try/catch block in each case, but this helper function is reusable and will make our code more readable.

```typescript
import { err, ok } from 'react-async-cases';

export async function apiResult<T>(fn: () => Promise<T>) {
  try {
    const response = await fn();
    return ok(response);
  } catch (e) {
    const error = e instanceof Error ? e : new Error('Unexpected API error');
    return err(error);
  }
}
```

Now we will use it in the Case.

```typescript
import axios from 'axios';
import { Case } from 'react-async-cases';
import { apiResult } from './apiResult';

export class LoadTodosCase implements Case {
  constructor(private abortController: AbortController = new AbortController()) {}

  async execute(filter: string) {
    // send API request
    const result = await apiResult(() => axios.get('/todos', { params: { filter } }));

    if (result.isErr()) {
      // we can do something with result.error
      // e.g. log error
      console.log('LoadTodosCase:', result.error);
    }

    if (result.isOk()) {
      // we can do something with result.value
      // e.g. save to some store (zustand, redux, ...)
    }

    return result;
  }

  /**
   * Implementation of case aborting. We will use it in component.
   * This is optional feature, not every case needs it.
   */
  onAbort() {
    this.abortController.abort();
  }
}
```

No exceptions, just a simple object.

### 4. Connection With a Component

Cases are independent pieces of code. How can we use them in React components?

As an adapter, we can choose from prepared library hooks: `useCase` or `useCaseState`.

Hooks gets a Case factory method as a parameter. Factory method must create an instance and not throw an exception.

Example:

```typescript
const loadTodos = useCaseState(() => new LoadTodosCase());
```

You can inject an additional dependency:

```typescript
const additionalDependency = useSomething();
const anotherCase = useCaseState(() => new AnotherCase(additionalDependency));
```

`useCase` and `useCaseState` returns a `run` function. React component can call this `run` function to execute the case.

Internally, the `run` function creates an instance of the `Case` object using its factory method, then calls the `execute` function with arguments passed to `run` function, and finally returns the `Result` object.

Additionally, the `useCaseState` hook returns a `state` object, so the component can monitor the state of the async process.

### 5. Usage in Component

```tsx
export function TodoList() {
  const [filter, setFilter] = useState('');

  // make a connection with LoadTodosCase
  const { state, error, value, run, abort } = useCaseState(() => new LoadTodosCase());

  useEffect(() => {
    // initial loading and loading when changing the filter
    void run(filter);
    return () => {
      // abort running requests
      abort();
    };
  }, [abort, filter, run]);

  /** Todo item was created/updated/removed. */
  const handleListChanged = () => {
    // abort running requests
    abort();
    // reload todo list
    void run(filter);
  };

  return (
    <div>
      <h1>Todo List</h1>

      <Filter filter={filter} onChange={setFilter} />

      {state.isPending ? <Loader />}

      {!state.isPending && error && <ErrorPanel error={error} />}

      <TodoList list={value} onChange={handleListChanged} />
    </div>
  );
}
```

### 6. Chaining of Cases

Cases may call other cases within the `execute` method. Components call such a compound case once and does not need to trigger a chain of cases using the `useEffect` hook.

Example:

```typescript
export class AddTodoItemCase implements Case {
  async execute(todoItem: Todo) {
    // post a new item
    const result = await apiResult(() => axios.post('/todo/add', todoItem);


    if (result.isErr()) {
      // result is Err object
      // do something with result.error
      return result;
    }

    // New item is created on backend,
    // so we want to update the todo list.

    // Create the LoadTodosCase
    const loadTodosCase = new LoadTodosCase();
    // and execute it
    const loadingResult = await loadTodosCase.execute('');
    if (loadingResult.isErr()) {
      return loadingResult;
    }

    return result;
  }
}
```

### 7. Aborting of Cases

The `Case` interface offers `onAbort` method. When the component is unmounted, the `onAbort` method is callled. It is up to you how your case will behave in this situation. A common approach is to use [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) API.

It is also possible to abort the case manually. Both hooks `useCase` and `useCaseState` returns an `abort` method that can be called in components.

Aborted case does not change any of the `value`, `error`, `state` values returned from the `useCaseState` hook. E.g. manually aborted pending case remains pending. Therefore, the last properly finished case will return the correct `value`, `error` and `state`.

You saw the use of aborting in the `LoadTodosCase` example. When we type a few characters in the filter input field, a series of request is sent. To prevent a request race, we need to abort old requests every time a new character is typed.

### 8. Usage with state management libraries

In general, when a case requires an external dependency, we can pass that dependency as a parameter in the case constructor.

#### 8.1. With Redux

Define the type and hook of the Redux store (see [Redux Toolkit with TypeScript](https://redux-toolkit.js.org/tutorials/typescript)):

```typescript
export type RootState = ReturnType<typeof store.getState>;
export const useAppStore = () => useStore<RootState>();
```

Inject the app Redux store to the case:

```typescript
export function useLoadTodos() {
  const appStore = useAppStore();
  return useCaseState(() => new LoadTodosCase(appStore));
}
```

Define the case:

```typescript
export class LoadTodosCase implements Case {
  constructor(private appStore: AppStore) {}

  async execute() {
    // get a value from the store
    const filter = this.appStore.getState().todo.filter;

    // send API request
    const result = await apiResult(() => TodoApiService.list(filter));

    if (result.isErr()) {
      // log error
      console.log('LoadTodosCase error:', result.error);
      return result;
    }

    // set todos to the store
    this.appStore.dispatch(setTodos(result.value));

    return result;
  }
}
```

See the full code in the sample application.

#### 8.2. With Zustand

We can use a similar constructor injection as with Redux or we can use the Zustand store directly in the case class.

Example of direct use of the Zustand instance:

```typescript
export class LoadTodosCase implements Case {
  async execute() {
    // get a value from the store
    const filter = useTodoStore.getState().filter;

    // send API request
    const result = await apiResult(() => TodoApiService.list(filter));

    if (result.isErr()) {
      // log error
      console.log('LoadTodosCase error:', result.error);
      return result;
    }

    // set todos to the store
    const { setTodos } = useTodoStore.getState().actions;
    setTodos(result.value);

    return result;
  }
}
```

See the full code in the sample application.

## Sample Application

The sample application is part of this repository. It shows the use of the `react-async-cases` library not only in pure React, but also with Redux and Zustand.

Asynchronous requests are simulated with random delays to emphasize the penging phase.

Download this repository and as usual:

```
$ npm install
```

And run the sample app:

```
$ npm run dev
```

## API

### `useCaseState(caseFactory)`

The `useCaseState(caseFactory)` hook returns `run` and `abort` methods and values for state monitoring.

**Parameters**

- `caseFactory`: `() => Case` - it must not throw an exception. The returned object should implement the `Case` interface.

**Returns**

Case controlling:

- `run`: `async (params) => Promise<Result>` - it calls the `execute(params)` method of the `Case`
  - `run` is an async function, in components you can wait for its Result
- `abort`: `() => void` - it calls the the `onAbort()` method of the `Case`

Async state monitoring:

- `value`: resolved promise value from the `run` method, it is unwrapped `value` of the `Result` object
- `error`: rejected promise value from the `run` method, it is unwrapped `error` of the `Result` object
- `state`: state object
  - `state`: 'initial' | 'pending' | 'resolved' | 'rejected'
  - `isInitial`: boolean - true when no `run` has started
  - `isPending`: boolean - true when `run` method is awaiting
  - `isResolved`: boolean - true when `run` was resolved
  - `isRejected`: boolean - true when `run` was rejected
  - `isFinished`: boolean - true when `run` was resolved or rejected
- `actions`: control the state manually (rarely usable)
  - `start`: `() => void` - marks the state as 'pending'
  - `resolve`: `(value) => void` - marks the state as 'resolved' and sets the resolved `value`
  - `reject`: `(error) => void` - marks the state as 'rejected' and sets the rejected `error` value
  - `reset`: `() => void` - marks the state as 'initial' and resets `value` and `error`

### `useCase(caseFactory)`

The `useCase(caseFactory)` hook returns `run` and `abort` methods.

**Parameters**

- `caseFactory`: `() => Case`

**Returns**

- `run`: `async (params) => Promise<Result>`
- `abort`: `() => void`

### `Case`

The `Case` is interface.

**Methods**

- `execute`: `async (params) => Result` - async function returns the `Result` object. It must not throw an exception. The `run` method of the hooks calls the `execute` method of the case.
- `onAbort`: `() => void` - method is optional. The `abort` method of the hooks calls the `onAbort` method of the case.

### `Result`

`Result` is a union type of the `Ok` or `Err` value.

```typescript
type Result<V, E> = Ok<V> | Err<E>;
```

### `Ok`

Class `Ok` wraps a `value` of any type. To create a new instance, you can use the constructor or helper function `ok(value)`.

Example with constructor:

```typescript
import { Ok } from 'react-async-cases';
const result = new Ok({ title: 'Success' });
```

Example with `ok(value)` function:

```typescript
import { ok } from 'react-async-cases';
const result = ok({ title: 'Success' });
```

**Class members**

- `constructor(value)` - the `value` can be of any type
- `value`: readonly value
- `isOk()`: type guard, returns true
- `isErr()`: type guard, returns false

### `Err`

Class `Err` wraps an `error` of any type. To create a new instance, you can use the constructor or helper function `err(error)`.

Example with constructor:

```typescript
import { Err } from 'react-async-cases';
const result = new Err({ reason: 'Bad credentials' });
```

Example with `err(error)` function:

```typescript
import { err } from 'react-async-cases';
const result = err({ reason: 'Bad credentials' });
```

**Class members**

- `constructor(error)` - the `error` can be of any type
- `error`: readonly error value
- `isOk()`: type guard, returns false
- `isErr()`: type guard, returns true

### `ok(value)`

The `ok(value)` helper function creates a new instance of the `Ok` class.

- `ok`: `(value) => Ok`

### `err(error)`

The `err(error)` helper function creates a new instance of the `Err` class.

- `err`: `(error) => Err`

### `useAsyncState()`

`useAsyncState()` helps to monitor the state of an async process. Hook stores the result value or error of an async process and its current state. It does not control the process itself.

**Returns**

- `value`: resolved value
- `error`: rejected value
- `state`: the state of the async process
  - `state`: 'initial' | 'pending' | 'resolved' | 'rejected'
  - `isInitial`: boolean - true when state is 'initial'
  - `isPending`: boolean - true when state is 'pending'
  - `isResolved`: boolean - true when state was 'resolved'
  - `isRejected`: boolean - true when state was 'rejected'
  - `isFinished`: boolean - true when state was 'resolved' or 'rejected'
- `actions`: setting the state and result
  - `start`: `() => void` - marks the state as 'pending'
  - `resolve`: `(value) => void` - marks the state as 'resolved' and sets the resolved `value`
  - `reject`: `(error) => void` - marks the state as 'rejected' and sets the rejected `error` value
  - `reset`: `() => void` - marks the state as 'initial' and resets `value` and `error` to `undefined`

## License

MIT
