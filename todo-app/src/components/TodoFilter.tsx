import type { Filter } from '../types';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
];

interface Props {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export default function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: Props) {
  return (
    <footer className="footer">
      <span className="count-label">
        {activeCount}개 남음
      </span>

      <nav className="filter-tabs" aria-label="필터">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-tab${filter === f.value ? ' is-active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      <button
        className="clear-btn"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        완료 삭제
      </button>
    </footer>
  );
}
