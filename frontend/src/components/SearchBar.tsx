import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalFiltered: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  totalFiltered,
}) => {
  return (
    <div className="search-bar-row">
      <div className="search-neo-box">
        <svg
          className="search-svg-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-neo-input"
          placeholder="Cari nama produk..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-neo"
            onClick={() => onSearchChange('')}
            title="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </div>

      <div className="counter-badge-pastel">
        <span>{totalFiltered} produk</span>
      </div>
    </div>
  );
};
