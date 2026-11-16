import React from 'react';
import type { Product } from '../types';
import { formatRupiah } from '../utils/format';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Soft Pastel Theme Palette for Tabs
const PASTEL_THEMES = [
  '#BAE6FD', // Soft Pastel Sky Blue
  '#FEF08A', // Soft Pastel Butter Yellow
  '#FBCFE8', // Soft Pastel Rose Pink
  '#BBF7D0', // Soft Pastel Mint Green
  '#E9D5FF', // Soft Pastel Lavender
  '#FED7AA', // Soft Pastel Peach
];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onEdit,
  onDelete,
}) => {
  const tabColor = PASTEL_THEMES[index % PASTEL_THEMES.length];

  return (
    <div className="folder-card-wrapper">
      {/* Folder tab on top */}
      <div className="folder-tab" style={{ backgroundColor: tabColor }}></div>

      {/* Main folder card */}
      <div className="folder-card">
        <div className="folder-card-top">
          <span className="card-id-badge">ID: {product.id}</span>
        </div>

        <div className="folder-card-content">
          <h3 className="folder-title" title={product.name}>
            {product.name}
          </h3>
          <p className="folder-price-text">{formatRupiah(product.price)}</p>
        </div>

        <div className="folder-actions">
          <button
            type="button"
            className="btn-card-action btn-card-edit"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn-card-action btn-card-delete"
            onClick={() => onDelete(product)}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
