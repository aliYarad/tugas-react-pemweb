import React from 'react';
import type { Product } from '../types';
import { formatRupiah } from '../utils/format';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Function to get the matching icon based on product name
const getProductEmoticon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('pulpen') || lower.includes('pena')) return '🖊️';
  if (lower.includes('buku')) return '📓';
  if (lower.includes('spidol')) return '🖍️';
  if (lower.includes('penggaris') || lower.includes('garis')) return '📏';
  if (lower.includes('penghapus') || lower.includes('tipex')) return '🧼';
  if (lower.includes('pensil')) return '✏️';
  if (lower.includes('kertas')) return '📄';
  if (lower.includes('gunting')) return '✂️';
  if (lower.includes('tas')) return '🎒';
  return '📦';
};

// Soft Pastel Theme Palette
const PASTEL_THEMES = [
  { tab: '#BAE6FD', iconBg: '#E0F2FE' }, // Soft Pastel Sky Blue (Pulpen)
  { tab: '#FEF08A', iconBg: '#FEF9C3' }, // Soft Pastel Butter Yellow (Buku Tulis)
  { tab: '#FBCFE8', iconBg: '#FCE7F3' }, // Soft Pastel Rose Pink (Spidol)
  { tab: '#BBF7D0', iconBg: '#DCFCE7' }, // Soft Pastel Mint Green (Penggaris)
  { tab: '#E9D5FF', iconBg: '#F3E8FF' }, // Soft Pastel Lavender (Penghapus)
  { tab: '#FED7AA', iconBg: '#FFEDD5' }, // Soft Pastel Peach
];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onEdit,
  onDelete,
}) => {
  const theme = PASTEL_THEMES[index % PASTEL_THEMES.length];
  const emoticon = getProductEmoticon(product.name);

  return (
    <div className="folder-card-wrapper">
      {/* Folder tab on top */}
      <div className="folder-tab" style={{ backgroundColor: theme.tab }}></div>

      {/* Main folder card */}
      <div className="folder-card">
        <div className="folder-card-top">
          <span className="card-id-badge">ID: {product.id}</span>
          <div
            className="folder-icon-box"
            style={{ backgroundColor: theme.iconBg }}
          >
            <span>{emoticon}</span>
          </div>
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
