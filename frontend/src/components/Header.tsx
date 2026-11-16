import React from 'react';

interface HeaderProps {
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  return (
    <header className="dashboard-header">
      <div className="header-info">
        <h1 className="header-title">Manajemen Produk</h1>
        <p className="header-subtitle">
          Kelola daftar produk dan harga dalam satu tempat.
        </p>
      </div>

      <button
        type="button"
        className="btn-pastel-add"
        onClick={onOpenAddModal}
      >
        <span className="btn-plus-symbol">+</span> Tambah Produk
      </button>
    </header>
  );
};
