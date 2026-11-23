import type { Product } from "../../../types/product"
import { Link } from "react-router"
import { TbPackage, TbEye, TbEdit, TbTrash } from "react-icons/tb"
import Button from "../../atoms/Button"
import Badge from "../../atoms/Badge"
import { formatRupiah } from "../../../utils/formatRupiah"
import styles from "./styles.module.css"

type Props = {
    product: Product
    viewMode?: "grid" | "list"
    onSelect?: (id: number) => void
    onEdit?: (product: Product) => void
    onDelete?: (product: Product) => void
}

export default function ProductCard({
    product,
    viewMode = "grid",
    onSelect,
    onEdit,
    onDelete,
}: Props) {
    if (viewMode === "list") {
        return (
            <article className={styles.listCard}>
                <div className={styles.listLeft}>
                    <div className={styles.listIconWrapper}>
                        <TbPackage className={styles.icon} aria-hidden="true" />
                    </div>
                    <div>
                        <div className={styles.listHeader}>
                            <Badge variant="neutral">ID: #{product.id}</Badge>
                            <Link
                                to={`/products/${product.id}`}
                                className={styles.listNameLink}
                            >
                                <h2 className={styles.listName}>{product.name}</h2>
                            </Link>
                        </div>
                        <p className={styles.listPrice}>
                            {formatRupiah(product.price)}
                        </p>
                    </div>
                </div>

                <div className={styles.listActions}>
                    <Link to={`/products/${product.id}`}>
                        <Button variant="secondary" className="text-xs px-3 py-1.5 min-h-9">
                            <TbEye className="size-4" />
                            Detail
                        </Button>
                    </Link>
                    {onEdit && (
                        <Button
                            variant="secondary"
                            onClick={() => onEdit(product)}
                            className="text-xs px-3 py-1.5 min-h-9 text-blue-600 hover:text-blue-700"
                        >
                            <TbEdit className="size-4" />
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="subtleDanger"
                            onClick={() => onDelete(product)}
                            className="text-xs px-3 py-1.5 min-h-9"
                        >
                            <TbTrash className="size-4" />
                            Hapus
                        </Button>
                    )}
                </div>
            </article>
        )
    }

    return (
        <article className={styles.card}>
            <div className={styles.header}>
                <Badge variant="neutral">ID: #{product.id}</Badge>
                <div className={styles.iconWrapper}>
                    <TbPackage className={styles.icon} aria-hidden="true" />
                </div>
            </div>

            <Link to={`/products/${product.id}`} className={styles.nameLink}>
                <h2 className={styles.name}>{product.name}</h2>
            </Link>
            <p className={styles.price}>{formatRupiah(product.price)}</p>

            <div className={styles.actions}>
                <Link to={`/products/${product.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full text-xs min-h-9">
                        <TbEye className="size-4" />
                        Detail
                    </Button>
                </Link>
                {onEdit && (
                    <Button
                        variant="secondary"
                        onClick={() => onEdit(product)}
                        className="text-xs min-h-9 px-3 text-blue-600 hover:text-blue-700"
                        title="Edit Produk"
                    >
                        <TbEdit className="size-4" />
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="subtleDanger"
                        onClick={() => onDelete(product)}
                        className="text-xs min-h-9 px-3"
                        title="Hapus Produk"
                    >
                        <TbTrash className="size-4" />
                    </Button>
                )}
            </div>

            {onSelect && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                    <Button
                        variant="secondary"
                        onClick={() => onSelect(product.id)}
                        className="w-full text-xs min-h-8 py-1 text-slate-500 hover:text-slate-700"
                    >
                        Pilih produk
                    </Button>
                </div>
            )}
        </article>
    )
}
