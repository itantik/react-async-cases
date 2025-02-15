import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ErrorBox } from './ErrorBox';
import { Loader } from './Loader';
import { useAddTodo } from '../features/addTodo/useAddTodo';

type Props = {
  onAdded: () => void;
};

export function AddTodoForm({ onAdded }: Props) {
  const [title, setTitle] = useState('');

  const { run, state, error, actions } = useAddTodo();

  const handleCloseError = () => {
    actions.reset();
  };

  const handleSubmit = async () => {
    const result = await run({ id: uuid(), title });
    if (result.isOk()) {
      // reset form input
      setTitle('');
      onAdded();
    }
  };

  return (
    <div className="input-row">
      {state.isPending ? (
        <Loader>...sending...</Loader>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <input
            name="title"
            type="text"
            value={title}
            placeholder="New todo item..."
            onChange={(event) => setTitle(event.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      )}
      {!state.isPending && error && <ErrorBox onClose={handleCloseError}>{String(error)}</ErrorBox>}
    </div>
  );
}
