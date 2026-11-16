import React, { useState } from 'react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, price: number) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama produk tidak boleh kosong.');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Harga harus lebih dari 0.');
      return;
    }

    setError('');
    onSubmit(name.trim(), numPrice);
    setName('');
    setPrice('');
  };

  const handleClose = () => {
    setName('');
    setPrice('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-backdrop-neo" onClick={handleClose}>
      <div className="modal-dialog-neo" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-neo"
          onClick={handleClose}
          aria-label="Tutup"
        >
          ✕
        </button>

        <h2 className="modal-title-neo">Tambah Produk</h2>
        <p className="modal-subtitle-neo">Masukkan informasi koleksi produk baru.</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="neo-error-box">{error}</div>}

          <div className="neo-form-group">
            <label htmlFor="add-name" className="neo-form-label">
              Nama Produk
            </label>
            <input
              id="add-name"
              type="text"
              className="neo-form-input"
              placeholder="Contoh: Pulpen"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="neo-form-group">
            <label htmlFor="add-price" className="neo-form-label">
              Harga (Rp)
            </label>
            <input
              id="add-price"
              type="number"
              className="neo-form-input"
              placeholder="Contoh: 5000"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (error) setError('');
              }}
              min="1"
            />
            <span className="neo-form-hint">Harga harus lebih dari 0.</span>
          </div>

          <div className="modal-actions-neo">
            <button
              type="button"
              className="btn-neo-cancel"
              onClick={handleClose}
            >
              Batal
            </button>
            <button type="submit" className="btn-neo-submit">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
