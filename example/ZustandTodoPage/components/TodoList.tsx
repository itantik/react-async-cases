import { useFilter, useTodos } from '../zustandStore/todoStore';
import { TodoItem } from './TodoItem';

type Props = {
  onChange: () => void;
};

export function TodoList({ onChange }: Props) {
  const list = useTodos();
  const filter = useFilter();

  return (
    <>
      {!list?.length && <div className="empty">Empty list.</div>}
      {!list?.length && Boolean(filter) && <div className="empty">(Try clearing the filter.)</div>}

      {list && list.map((todo) => <TodoItem key={todo.id} todo={todo} onChange={onChange} />)}
    </>
  );
}
