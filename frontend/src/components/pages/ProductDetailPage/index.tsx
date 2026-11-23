import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router"
import {
    TbArrowLeft,
    TbPackage,
    TbEdit,
    TbTrash,
    TbAlertCircle,
    TbTag,
    TbInfoCircle,
    TbCheck,
} from "react-icons/tb"
import type { Product } from "../../../types/product"
import Button from "../../atoms/Button"
import Badge from "../../atoms/Badge"
import ProductModal from "../../organisms/ProductModal"
import DeleteConfirmModal from "../../organisms/DeleteConfirmModal"
import ProductRemote from "../../../data/product/source/product-remote.ts"
import ProductRepository from "../../../data/product/repository/product-repository.ts"
import { formatRupiah } from "../../../utils/formatRupiah"
import styles from "./styles.module.css"

const repository = ProductRepository(
    ProductRemote({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "" }),
)

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const numericId = Number(id)
    const isInvalidId = !id || isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)
    const invalidError = isInvalidId
        ? `Parameter ID "${id}" tidak valid. ID produk harus berupa angka bulat positif.`
        : ""

    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(!isInvalidId)
    const [fetchError, setFetchError] = useState("")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [actionError, setActionError] = useState("")

    const displayError = invalidError || fetchError
    const productNotFound =
        isInvalidId || fetchError.toLowerCase().includes("tidak ditemukan")

    useEffect(() => {
        if (isInvalidId) return

        let isMounted = true
        async function fetchDetail() {
            setIsLoading(true)
            setFetchError("")
            try {
                const model = await repository.getProductById(numericId)
                if (!isMounted) return

                if (!model) {
                    setFetchError(`Produk dengan ID #${id} tidak ditemukan di sistem.`)
                    setProduct(null)
                } else {
                    setProduct(model.toJSON())
                }
            } catch (err) {
                if (!isMounted) return
                setFetchError(err instanceof Error ? err.message : "Gagal memuat detail produk.")
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        fetchDetail()
        return () => {
            isMounted = false
        }
    }, [id, numericId, isInvalidId])

    async function handleUpdate(values: { name: string; price: number }) {
        if (!product) return
        setActionError("")
        try {
            const updated = await repository.updateProduct(product.id, values)
            setProduct(updated.toJSON())
            setSuccessMessage("Data produk berhasil diperbarui.")
            setTimeout(() => setSuccessMessage(""), 4000)
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Gagal memperbarui produk.")
            throw err
        }
    }

    async function handleDelete(deleteId: number) {
        setActionError("")
        try {
            await repository.deleteProduct(deleteId)
            navigate("/products", { replace: true })
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Gagal menghapus produk.")
            throw err
        }
    }

    return (
        <div className={styles.container}>
            {/* Breadcrumb & Back Link */}
            <div className={styles.topNavigation}>
                <Link to="/products" className={styles.backLink}>
                    <TbArrowLeft className="size-4" />
                    <span>Kembali ke Daftar Produk</span>
                </Link>
            </div>

            {/* Loading state */}
            {isLoading && !isInvalidId && (
                <div className={styles.loadingCard}>
                    <div className="flex items-center justify-center gap-3 text-slate-500">
                        <div className="size-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        <span>Memuat data produk #{id}…</span>
                    </div>
                </div>
            )}

            {/* Error or Not Found State */}
            {!isLoading && displayError && (
                <div className={styles.notFoundCard} role="alert">
                    <div className={styles.notFoundIconWrapper}>
                        <TbAlertCircle className="size-8 text-amber-600" />
                    </div>
                    <h2 className={styles.notFoundTitle}>
                        {productNotFound ? "Produk Tidak Ditemukan" : "Gagal Memuat Produk"}
                    </h2>
                    <p className={styles.notFoundDescription}>{displayError}</p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/products">
                            <Button variant="primary">
                                <TbArrowLeft className="size-4" />
                                Kembali ke Daftar Produk
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {actionError && (
                <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                    <TbAlertCircle className="size-5 shrink-0" />
                    <span>{actionError}</span>
                </div>
            )}

            {/* Success message */}
            {successMessage && (
                <div className={styles.successAlert}>
                    <TbCheck className="size-5 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Product detail card */}
            {!isLoading && !displayError && product && (
                <div className={styles.detailCard}>
                    <div className={styles.cardHeader}>
                        <div className="flex items-center gap-3">
                            <div className={styles.iconWrapper}>
                                <TbPackage className="size-8 text-blue-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="info">ID: #{product.id}</Badge>
                                    <Badge variant="success">Tersedia</Badge>
                                </div>
                                <h1 className={styles.productName}>{product.name}</h1>
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            <Button
                                variant="secondary"
                                onClick={() => setIsEditModalOpen(true)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                <TbEdit className="size-4" />
                                Edit Produk
                            </Button>
                            <Button
                                variant="subtleDanger"
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                <TbTrash className="size-4" />
                                Hapus
                            </Button>
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <div className={styles.infoLabel}>
                                    <TbTag className="size-4 text-slate-400" />
                                    <span>Harga Satuan</span>
                                </div>
                                <p className={styles.priceValue}>
                                    {formatRupiah(product.price)}
                                </p>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.infoLabel}>
                                    <TbInfoCircle className="size-4 text-slate-400" />
                                    <span>ID Referensi Database</span>
                                </div>
                                <p className={styles.infoValue}>
                                    PRODUCT-{String(product.id).padStart(4, "0")}
                                </p>
                            </div>
                        </div>

                        <div className={styles.additionalDetails}>
                            <h3 className={styles.sectionHeading}>Deskripsi Informasi</h3>
                            <p className={styles.detailText}>
                                Produk <strong>"{product.name}"</strong> terdaftar secara resmi di sistem inventaris dengan nomor identifikasi <strong>#{product.id}</strong> dan harga jual sebesar <strong>{formatRupiah(product.price)}</strong>. Data ini tersinkronisasi langsung dengan endpoint REST API backend.
                            </p>
                        </div>
                    </div>

                    <div className={styles.cardFooter}>
                        <Link to="/products">
                            <Button variant="secondary">
                                <TbArrowLeft className="size-4" />
                                Kembali ke Daftar Produk
                            </Button>
                        </Link>
                    </div>

                    {/* Edit Modal */}
                    <ProductModal
                        isOpen={isEditModalOpen}
                        mode="edit"
                        product={product}
                        onClose={() => setIsEditModalOpen(false)}
                        onSubmit={handleUpdate}
                    />

                    {/* Delete Modal */}
                    <DeleteConfirmModal
                        isOpen={isDeleteModalOpen}
                        product={product}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDelete}
                    />
                </div>
            )}
        </div>
    )
}
