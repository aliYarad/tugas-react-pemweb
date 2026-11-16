import React from 'react';
import type { Product } from '../types';
import { formatRupiah } from '../utils/format';

interface DeleteProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

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

        <h2 className="modal-title-neo">Hapus Produk?</h2>
        <p className="modal-subtitle-neo">
          Koleksi yang dihapus tidak dapat dikembalikan.
        </p>

        <div className="delete-preview-neo">
          <span className="modal-id-badge">ID: {product.id}</span>
          <h3 className="delete-preview-name">{product.name}</h3>
          <p className="delete-preview-price">{formatRupiah(product.price)}</p>
        </div>

        <div className="modal-actions-neo">
          <button
            type="button"
            className="btn-neo-cancel"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn-neo-delete-confirm"
            onClick={() => onConfirm(product.id)}
          >
            Hapus Produk
          </button>
        </div>
      </div>
    </div>
  );
};
