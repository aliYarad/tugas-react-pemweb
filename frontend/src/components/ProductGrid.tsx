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
        <div style={{ fontSize: '38px', marginBottom: '10px' }}>🔍</div>
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
