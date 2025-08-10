/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  query: string;
  loading: boolean;
  setQuery: (value: string) => void;
  handleSubmit: (value: React.FormEvent<HTMLFormElement>) => void;
  updateTodo: (value: Todo) => void;
}
/* eslint-disable prettier/prettier */
export const Header: React.FC<Props> = ({
  query,
  todos,
  loading,
  setQuery,
  handleSubmit,
  updateTodo,
}) => {
  const handleToggleAllButton = (allTodos: Todo[]) => {
    if (allTodos.some(todo => !todo.completed)) {
      allTodos
        .filter(todo => !todo.completed) // обновляем только те, что false
        .forEach(todo => updateTodo({ ...todo, completed: true }));
    } else {
      allTodos
        .filter(todo => todo.completed) // обновляем только те, что true
        .forEach(todo => updateTodo({ ...todo, completed: false }));
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => handleToggleAllButton(todos)}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
