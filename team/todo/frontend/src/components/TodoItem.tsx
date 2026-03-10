import type { Todo } from "shared/src/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <li className="todo-item">
      <label className="todo-label">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span
          className="todo-title"
          style={{
            textDecoration: todo.completed ? "line-through" : "none",
          }}
        >
          {todo.title}
        </span>
      </label>
      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
        aria-label="削除"
      >
        削除
      </button>
    </li>
  );
};

export default TodoItem;
