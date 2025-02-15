import React from 'react';
import { todoStoreState, useFilter } from '../zustandStore/todoStore';

export function Filter() {
  const filter = useFilter();
  const { setFilter } = todoStoreState().actions;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleClear = () => {
    setFilter('');
  };

  return (
    <div className="input-row">
      <input
        name="filter"
        type="text"
        value={filter}
        placeholder="Filter..."
        onChange={handleChange}
      />
      <button type="button" title="Clear the filter" onClick={handleClear}>
        ×
      </button>
    </div>
  );
}
