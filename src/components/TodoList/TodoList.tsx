/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import * as todoService from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

interface Props {
  userId: number;
}

const filterTodos = (initialTodos: Todo[], filter: string): Todo[] => {
  const filteredTodos = [...initialTodos];

  switch (filter) {
    case 'Completed':
      return filteredTodos.filter(todo => todo.completed === true);
    case 'Active':
      return filteredTodos.filter(todo => todo.completed === false);
    default:
      return initialTodos;
  }
};

export const TodoList: React.FC<Props> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    todoService
      .getTodos(userId)
      .then(todos => {
        setTodos(todos);
      })
      .catch(() => {
        setError('Unable to load todos');
        new Error('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000); // 3 секунды

      return () => clearTimeout(timer); // очистка при размонтировании/смене ошибки
    }
  }, [error]);

  const filteredTodos = todos ? filterTodos(todos, filter) : [];

  const handleSubmit = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    if (query.trimStart().length === 0) {
      setError('Title should not be empty');
      return;
    }

    const newTodo = {
      title: query.trimStart(),
      userId: userId,
      completed: false,
    };

    addTodo(newTodo);
  };

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setLoading(true);

    const maxId =
      todos && todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;

    const tempId = maxId + 1;

    setTodos(prev => [...(prev || []), { ...newTodo, id: tempId }]);

    return todoService
      .addTodo(newTodo)
      .then(addedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === tempId ? addedTodo : todo)),
        );
        setQuery('');
      })
      .catch(() => {
        setTodos(todos);
        setError('Unable to add a todo');
        new Error('Unable to add a todo');
      })
      .finally(() => setLoading(false));
  };

  const deleteTodo = (todoId: number) => {
    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos?.filter(todo => todo.id != todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
        new Error('Unable to delete a todo');
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    return todoService
      .updateTodo(updatedTodo)
      .then(post => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, post);

          return newTodos;
        });
      })
      .catch(error => {
        setError('Unable to update a todo');
        new Error(error);
      });
  };

  const handleToggleAllButton = (allTodos: Todo[]) => {
    if (allTodos.some(todo => todo.completed !== true)) {
      allTodos.map(todo => updateTodo({ ...todo, completed: true }));

      return;
    }

    allTodos.map(todo => updateTodo({ ...todo, completed: false }));
  };

  const handleClearCompleted = () => {
    todos?.map(todo => todo.completed && deleteTodo(todo.id));
  };

  return (
    <>
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
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos &&
          filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              key={todo.id}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
      </section>
      {/* Hide the footer if there are no todos */}
      {todos?.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos?.filter(todo => todo.completed === false).length} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={() => setFilter('All')}
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={() => setFilter('Active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilter('Completed')}
            >
              Completed
            </a>
          </nav>

          {/* this button should be disabled if there are no completed todos */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        {error && (
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError('')}
          />
        )}
        {/* show only one message at a time */}
        {error}
      </div>
    </>
  );
};
