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
        <span className="search-icon-symbol">🔍</span>
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
