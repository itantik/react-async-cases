import { Todo } from '../../api/InMemoryTodoDB';
import { useRemoveTodo } from '../features/removeTodo/useRemoveTodo';

type Props = {
  todo: Todo;
  onChange: () => void;
};

export function TodoItem({ todo, onChange }: Props) {
  const { run, state } = useRemoveTodo();

  const { id, title } = todo;

  const handleRemove = async () => {
    const result = await run(id);
    if (result.isErr()) {
      alert(`Removing failed: ${result.error.message}`);
    }
    onChange();
  };

  return (
    <div className={state.isPending ? 'todo-item disabled' : 'todo-item'}>
      <span className="title">{title}</span>
      <button
        onClick={() => void handleRemove()}
        title="Remove this todo item"
        disabled={state.isPending}
      >
        ×
      </button>
    </div>
  );
}
