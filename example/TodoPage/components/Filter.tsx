import React from 'react';

type Props = {
  filter: string;
  onChange: (value: string) => void;
};

export function Filter({ filter, onChange }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
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
