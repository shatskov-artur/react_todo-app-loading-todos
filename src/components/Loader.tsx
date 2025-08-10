/* eslint-disable prettier/prettier */
import React from 'react';

interface Props{
  todoId: number;
  updatingTodoIds: number[];
}


/* eslint-disable prettier/prettier */
export const Loader: React.FC<Props> = ({todoId, updatingTodoIds}) => {
  const isUpdating = updatingTodoIds.includes(todoId);

  if (!isUpdating) {
    return null;
  }

  return (
    <div
      data-cy="TodoLoader"
      className={`modal overlay is-active`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
