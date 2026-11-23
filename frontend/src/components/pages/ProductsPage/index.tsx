import { useState, useMemo, useCallback, useEffect } from "react"
import { TbPlus, TbRefresh, TbAlertCircle, TbCheck } from "react-icons/tb"
import type { Product } from "../../../types/product"
import Button from "../../atoms/Button"
import Badge from "../../atoms/Badge"
import SearchBar from "../../molecules/SearchBar"
import ViewToggle from "../../molecules/ViewToggle"
import ProductGrid from "../../organisms/ProductGrid"
import ProductList from "../../organisms/ProductList"
import ProductModal from "../../organisms/ProductModal"
import DeleteConfirmModal from "../../organisms/DeleteConfirmModal"
import ProductRemote from "../../../data/product/source/product-remote.ts"
import ProductRepository from "../../../data/product/repository/product-repository.ts"
import styles from "./styles.module.css"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    // View Mode: 'grid' | 'list' (retrieved from localStorage or default 'grid')
    const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("preferred_view_mode")
            if (saved === "grid" || saved === "list") return saved
        }
        return "grid"
    })

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

    const selectedProduct = products.find(
        (product) => product.id === selectedProductId,
    )

    // Save preferred view mode
    function handleToggleViewMode(mode: "grid" | "list") {
        setViewMode(mode)
        localStorage.setItem("preferred_view_mode", mode)
    }

    const handleLoadProducts = useCallback(async () => {
        setIsLoading(true)
        setError("")
        setMessage("Memuat produk…")
        try {
            const models = await repository.getProductList()
            setProducts(models.map((model) => model.toJSON()))
            setSelectedProductId(null)
            setMessage(`${models.length} produk berhasil dimuat dari API.`)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat produk.")
            setMessage("")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void handleLoadProducts()
    }, [handleLoadProducts])

    function handleSelectProduct(id: number) {
        setSelectedProductId(id)
        setMessage("")
    }

    async function handleCreateProduct(values: { name: string; price: number }) {
        try {
            const newModel = await repository.createProduct(values)
            const newProd = newModel.toJSON()
            setProducts((prev) => [...prev, newProd])
            setMessage(`Produk "${newProd.name}" berhasil ditambahkan.`)
            setError("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menambah produk.")
            throw err
        }
    }

    async function handleUpdateProduct(values: { name: string; price: number }) {
        if (!editingProduct) return
        try {
            const updatedModel = await repository.updateProduct(editingProduct.id, values)
            const updated = updatedModel.toJSON()
            setProducts((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p)),
            )
            setMessage(`Produk "${updated.name}" berhasil diperbarui.`)
            setError("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memperbarui produk.")
            throw err
        }
    }

    async function handleDeleteProduct(id: number) {
        try {
            await repository.deleteProduct(id)
            setProducts((prev) => prev.filter((p) => p.id !== id))
            setMessage("Produk berhasil dihapus.")
            setError("")
            if (selectedProductId === id) setSelectedProductId(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal menghapus produk.")
            throw err
        }
    }

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products
        const q = searchQuery.toLowerCase().trim()
        return products.filter((p) => p.name.toLowerCase().includes(q))
    }, [products, searchQuery])

    return (
        <div className={styles.container}>
            {/* Header section */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div>
                        <div className={styles.eyebrowWrapper}>
                            <Badge variant="info">Katalog Produk</Badge>
                            <span className={styles.eyebrow}>
                                {products.length} Total Produk
                            </span>
                        </div>
                        <h1 className={styles.title}>Manajemen Produk</h1>
                        <p className={styles.description}>
                            Kelola data produk Anda: tambah, lihat detail, edit, dan hapus dengan integrasi backend REST API.
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <Button
                            variant="primary"
                            onClick={() => setIsAddModalOpen(true)}
                            className="shadow-sm"
                        >
                            <TbPlus className="size-4.5" />
                            Tambah Produk
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Cari nama produk..."
                    />

                    <div className={styles.toolbarRight}>
                        <ViewToggle
                            viewMode={viewMode}
                            onToggle={handleToggleViewMode}
                        />

                        <Button
                            variant="secondary"
                            onClick={handleLoadProducts}
                            disabled={isLoading}
                            className="text-xs min-h-9 px-3"
                        >
                            <TbRefresh
                                className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                            />
                            {isLoading ? "Memuat…" : "Muat dari API"}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Error banner */}
            {error && (
                <div role="alert" className={styles.alertError}>
                    <TbAlertCircle className="size-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Success notification banner */}
            {message && !error && (
                <div className={styles.alertSuccess}>
                    <TbCheck className="size-5 shrink-0" />
                    <p>{message}</p>
                </div>
            )}

            {/* Products Listing */}
            <section
                            aria-label="Daftar produk"
                aria-busy={isLoading}
                className={styles.listSection}
            >
                {filteredProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.notice}>
                            {products.length === 0
                                ? isLoading
                                    ? "Memuat produk dari API..."
                                    : "Belum ada produk dari API."
                                : `Tidak ada produk yang cocok dengan pencarian "${searchQuery}".`}
                        </p>
                        {products.length === 0 ? (
                            <Button
                                variant="primary"
                                onClick={handleLoadProducts}
                                className="mt-4"
                            >
                                <TbRefresh className="size-4" />
                                Muat dari API
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                onClick={() => setSearchQuery("")}
                                className="mt-3 text-xs"
                            >
                                Bersihkan Pencarian
                            </Button>
                        )}
                    </div>
                ) : viewMode === "grid" ? (
                    <ProductGrid
                        products={filteredProducts}
                        onSelect={handleSelectProduct}
                        onEdit={(p) => setEditingProduct(p)}
                        onDelete={(p) => setDeletingProduct(p)}
                    />
                ) : (
                    <ProductList
                        products={filteredProducts}
                        onSelect={handleSelectProduct}
                        onEdit={(p) => setEditingProduct(p)}
                        onDelete={(p) => setDeletingProduct(p)}
                    />
                )}
            </section>

            {/* Selection callback status for testing & UX */}
            <p role="status" className={styles.statusFooter}>
                {message ||
                    (selectedProduct
                        ? `Produk dipilih: ${selectedProduct.name}.`
                        : "Klik Pilih produk untuk mempelajari callback dari kartu ke halaman.")}
            </p>

            {/* Modals */}
            <ProductModal
                isOpen={isAddModalOpen}
                mode="add"
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateProduct}
            />

            <ProductModal
                isOpen={Boolean(editingProduct)}
                mode="edit"
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSubmit={handleUpdateProduct}
            />

            <DeleteConfirmModal
                isOpen={Boolean(deletingProduct)}
                product={deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={handleDeleteProduct}
            />
        </div>
    )
}
