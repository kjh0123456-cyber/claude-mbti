import { useState } from 'react';

interface Props {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <span className="input-icon" aria-hidden="true">+</span>
      <input
        className="input-field"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="새 할 일 추가..."
        autoFocus
        autoComplete="off"
      />
    </form>
  );
}
