import { useState } from "react"
import type { Product } from "../../../types/product"
import { TbX, TbPlus, TbDeviceFloppy } from "react-icons/tb"
import Button from "../../atoms/Button"
import Input from "../../atoms/Input"
import styles from "./styles.module.css"

type ProductModalProps = {
    isOpen: boolean
    mode: "add" | "edit"
    product?: Product | null
    onClose: () => void
    onSubmit: (values: { name: string; price: number }) => Promise<void>
}

function ProductModalForm({
    mode,
    product,
    onClose,
    onSubmit,
}: {
    mode: "add" | "edit"
    product?: Product | null
    onClose: () => void
    onSubmit: (values: { name: string; price: number }) => Promise<void>
}) {
    const [name, setName] = useState(mode === "edit" && product ? product.name : "")
    const [price, setPrice] = useState(
        mode === "edit" && product ? product.price.toString() : "",
    )
    const [errors, setErrors] = useState<{ name?: string; price?: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    function validate() {
        const nextErrors: { name?: string; price?: string } = {}
        if (!name.trim()) {
            nextErrors.name = "Nama produk wajib diisi"
        }
        const numericPrice = Number(price)
        if (!price.trim()) {
            nextErrors.price = "Harga produk wajib diisi"
        } else if (isNaN(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericPrice)) {
            nextErrors.price = "Harga harus berupa bilangan bulat positif lebih dari 0"
        }
        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            await onSubmit({
                name: name.trim(),
                price: Number(price),
            })
            onClose()
        } catch {
            // error handled by parent or toast
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.modal}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {mode === "add" ? "Tambah Produk Baru" : `Edit Produk #${product?.id}`}
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.closeButton}
                    title="Tutup dialog"
                >
                    <TbX className="size-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Nama Produk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Buku Tulis Campus"
                    error={errors.name}
                    autoFocus
                />

                <Input
                    label="Harga (Rupiah)"
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Contoh: 15000"
                    error={errors.price}
                    helperText="Masukkan angka tanpa tanda titik atau koma"
                />

                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            "Menyimpan…"
                        ) : mode === "add" ? (
                            <>
                                <TbPlus className="size-4.5" />
                                Tambah Produk
                            </>
                        ) : (
                            <>
                                <TbDeviceFloppy className="size-4.5" />
                                Simpan Perubahan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default function ProductModal({
    isOpen,
    mode,
    product,
    onClose,
    onSubmit,
}: ProductModalProps) {
    if (!isOpen) return null

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true">
            <div className={styles.backdrop} onClick={onClose} />
            <ProductModalForm
                key={mode === "edit" && product ? `edit-${product.id}` : "add-new"}
                mode={mode}
                product={product}
                onClose={onClose}
                onSubmit={onSubmit}
            />
        </div>
    )
}
