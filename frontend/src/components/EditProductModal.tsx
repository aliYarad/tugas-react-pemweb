import React, { useState, useEffect } from 'react';
import type { Product } from '../types';

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (id: number, name: string, price: number) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setError('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

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
    onSubmit(product.id, name.trim(), numPrice);
  };

  return (
    <div className="modal-backdrop-neo" onClick={onClose}>
      <div className="modal-dialog-neo" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-neo"
          onClick={onClose}
          aria-label="Tutup"
        >
          ✕
        </button>

        <h2 className="modal-title-neo">Edit Produk</h2>
        <p className="modal-subtitle-neo">Perbarui detail produk yang dipilih.</p>
        <span className="modal-id-badge">ID: {product.id}</span>

        <form onSubmit={handleSubmit}>
          {error && <div className="neo-error-box">{error}</div>}

          <div className="neo-form-group">
            <label htmlFor="edit-name" className="neo-form-label">
              Nama Produk
            </label>
            <input
              id="edit-name"
              type="text"
              className="neo-form-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="neo-form-group">
            <label htmlFor="edit-price" className="neo-form-label">
              Harga (Rp)
            </label>
            <input
              id="edit-price"
              type="number"
              className="neo-form-input"
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
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn-neo-submit">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
