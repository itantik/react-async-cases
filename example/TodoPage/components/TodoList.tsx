import { Todo } from '../../api/InMemoryTodoDB';
import { TodoItem } from './TodoItem';

type Props = {
  list?: Todo[];
  filtered?: boolean;
  onChange: () => void;
};

export function TodoList({ list, filtered, onChange }: Props) {
  return (
    <>
      {!list?.length && <div className="empty">Empty list.</div>}
      {!list?.length && filtered && <div className="empty">(Try clearing the filter.)</div>}

      {list && list.map((todo) => <TodoItem key={todo.id} todo={todo} onChange={onChange} />)}
    </>
  );
}
