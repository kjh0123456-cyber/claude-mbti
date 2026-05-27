import { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commitEdit() {
    if (editValue.trim()) {
      onEdit(todo.id, editValue);
    } else {
      setEditValue(todo.text);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setEditValue(todo.text);
      setEditing(false);
    }
  }

  return (
    <li className={`todo-item${todo.completed ? ' is-completed' : ''}`}>
      <button
        className={`checkbox${todo.completed ? ' is-checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '완료 취소' : '완료로 표시'}
      >
        <svg className="checkmark" viewBox="0 0 10 8" fill="none" aria-hidden="true">
          <path d="M1 4L3.5 6.5L9 1" />
        </svg>
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className="edit-input"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className={`todo-text${todo.completed ? ' is-done' : ''}`}
          onDoubleClick={() => { if (!todo.completed) setEditing(true); }}
          title={todo.completed ? undefined : '더블클릭으로 편집'}
        >
          {todo.text}
        </span>
      )}

      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="삭제"
      >
        ×
      </button>
    </li>
  );
}
