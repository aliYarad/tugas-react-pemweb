import { useState } from "react"
import type { Product } from "../../../types/product"
import { TbAlertTriangle, TbTrash } from "react-icons/tb"
import Button from "../../atoms/Button"
import styles from "./styles.module.css"

type DeleteConfirmModalProps = {
    isOpen: boolean
    product: Product | null
    onClose: () => void
    onConfirm: (id: number) => Promise<void>
}

export default function DeleteConfirmModal({
    isOpen,
    product,
    onClose,
    onConfirm,
}: DeleteConfirmModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    if (!isOpen || !product) return null

    async function handleConfirm() {
        if (!product) return
        setIsDeleting(true)
        try {
            await onConfirm(product.id)
            onClose()
        } catch {
            // handled
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true">
            <div className={styles.backdrop} onClick={onClose} />
            <div className={styles.modal}>
                <div className={styles.iconWrapper}>
                    <TbAlertTriangle className="size-6 text-red-600" />
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title}>Hapus Produk?</h3>
                    <p className={styles.description}>
                        Apakah Anda yakin ingin menghapus produk{" "}
                        <strong className="text-slate-900 font-semibold">
                            "{product.name}"
                        </strong>{" "}
                        (ID: #{product.id})? Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>

                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        {isDeleting ? (
                            "Menghapus…"
                        ) : (
                            <>
                                <TbTrash className="size-4.5" />
                                Hapus Produk
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
