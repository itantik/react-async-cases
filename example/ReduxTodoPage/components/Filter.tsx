import React from 'react';
import { setFilter, useAppDispatch, useFilter } from '../reduxStore/todoStore';

export function Filter() {
  const filter = useFilter();
  const appDispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    appDispatch(setFilter(event.target.value));
  };

  const handleClear = () => {
    appDispatch(setFilter(''));
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
