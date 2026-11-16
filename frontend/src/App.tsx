import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, ModalType } from './types';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  saveLocalProducts,
} from './services/api';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { AddProductModal } from './components/AddProductModal';
import { EditProductModal } from './components/EditProductModal';
import { DeleteProductModal } from './components/DeleteProductModal';
import './App.css';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState<ModalType>('none');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  }, []);

  const loadProducts = useCallback(async () => {
    const { products: loaded, isApi } = await fetchProducts();
    setProducts(loaded);
    setIsApiConnected(isApi);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(term));
  }, [products, searchTerm]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setModalType('add');
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setModalType('edit');
  };

  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setModalType('delete');
  };

  const handleCloseModal = () => {
    setModalType('none');
    setSelectedProduct(null);
  };

  // CRUD Operations
  const handleAddProduct = async (name: string, price: number) => {
    const newProduct = await createProduct(name, price, isApiConnected);
    const updated = [...products, newProduct];
    setProducts(updated);
    saveLocalProducts(updated);
    handleCloseModal();
    showToast(`Produk "${name}" berhasil ditambahkan.`);
  };

  const handleEditProduct = async (id: number, name: string, price: number) => {
    const updatedItem = await updateProduct(id, name, price, isApiConnected);
    const updated = products.map((p) => (p.id === id ? updatedItem : p));
    setProducts(updated);
    saveLocalProducts(updated);
    handleCloseModal();
    showToast(`Produk "${name}" berhasil diperbarui.`);
  };

  const handleDeleteProduct = async (id: number) => {
    const deletedName = selectedProduct?.name ?? 'Produk';
    await deleteProduct(id, isApiConnected);
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveLocalProducts(updated);
    handleCloseModal();
    showToast(`${deletedName} berhasil dihapus.`);
  };

  return (
    <div className="fullscreen-dashboard">
      <Header onOpenAddModal={handleOpenAddModal} />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalFiltered={filteredProducts.length}
      />

      <ProductGrid
        products={filteredProducts}
        totalCount={products.length}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Modals */}
      <AddProductModal
        isOpen={modalType === 'add'}
        onClose={handleCloseModal}
        onSubmit={handleAddProduct}
      />

      <EditProductModal
        isOpen={modalType === 'edit'}
        product={selectedProduct}
        onClose={handleCloseModal}
        onSubmit={handleEditProduct}
      />

      <DeleteProductModal
        isOpen={modalType === 'delete'}
        product={selectedProduct}
        onClose={handleCloseModal}
        onConfirm={handleDeleteProduct}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-neo">
          <span>✓</span> {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
