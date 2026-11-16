import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onOpenAddModal: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  totalCount,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  if (products.length === 0) {
    return (
      <div className="empty-state-fullscreen">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: '12px', color: '#666666' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <h3>Tidak ada produk yang ditemukan</h3>
        <p>Coba gunakan kata kunci pencarian lain atau tambahkan produk baru.</p>
        <button
          type="button"
          className="btn-pastel-add"
          onClick={onOpenAddModal}
        >
          + Tambah Produk Baru
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="products-fullscreen-grid">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="footer-fullscreen-summary">
        <p>Menampilkan {products.length} dari {totalCount} produk</p>
      </div>
    </div>
  );
};
