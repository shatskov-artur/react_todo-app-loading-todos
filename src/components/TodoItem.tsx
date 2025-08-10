/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

interface Props {
  todo: Todo;
  updateTodo: (value: Todo) => Promise<void>;
  deleteTodo: (value: number) => Promise<void>;
  updatingTodoIds: number[];
}

/* eslint-disable prettier/prettier */
export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  deleteTodo,
  updatingTodoIds,
}) => {
  const [focusedTodo, setFocusedTodo] = useState<Todo>();
  const [todoTitleField, setTodoTitleFild] = useState('');

  const handleFormSave = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    updateTodo({ ...todo, title: todoTitleField }).finally(() => {
      setFocusedTodo(undefined);
    });
  };

  const handleInputChange = () => {
    updateTodo({
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: todo.completed === true ? false : true,
    });
  };

  const handleRemoveTodo = () => {
    deleteTodo(todo.id);
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
      {updatingTodoIds.includes(todo.id) && (
        <Loader todoId={todo.id} updatingTodoIds={updatingTodoIds} />
      )}
    </div>
  );
};
