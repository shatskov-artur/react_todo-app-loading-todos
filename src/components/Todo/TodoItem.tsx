/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import './TodoItem.scss';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (value: number) => Promise<void>;
  onUpdate: (value: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
}) => {
  const [focusedTodo, setFocusedTodo] = useState<Todo>();
  const [todoTitleField, setTodoTitleFild] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSave = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    setLoading(true);
    onUpdate({ ...todo, title: todoTitleField }).finally(() => {
      setLoading(false);
      setFocusedTodo(undefined);
    });
  };

  const handleInputChange = () => {
    setLoading(true);

    onUpdate({
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: todo.completed === true ? false : true,
    }).finally(() => setLoading(false));
  };

  const handleRemoveTodo = () => {
    setLoading(true);
    onDelete(todo.id).finally(() => setLoading(false));
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleInputChange}
        />
      </label>

      {focusedTodo ? (
        <form onBlur={handleFormSave} onSubmit={handleFormSave}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitleField}
            onChange={event => setTodoTitleFild(event.target.value)}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setFocusedTodo(todo);
            setTodoTitleFild(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleRemoveTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
