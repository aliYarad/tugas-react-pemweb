import { Link } from "react-router"
import { TbError404, TbHome, TbArrowLeft } from "react-icons/tb"
import Button from "../../atoms/Button"
import styles from "./styles.module.css"

export default function NotFoundPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <TbError404 className={styles.icon} aria-hidden="true" />
                </div>

                <div className={styles.badge}>Status HTTP: 404 Not Found</div>

                <h1 className={styles.title}>Halaman Tidak Ditemukan</h1>

                <p className={styles.description}>
                    Maaf, alamat URL yang Anda tuju tidak terdaftar di aplikasi atau mungkin sudah dipindahkan. Silakan kembali ke halaman utama atau daftar produk.
                </p>

                <div className={styles.actions}>
                    <Link to="/products">
                        <Button variant="primary">
                            <TbHome className="size-4" />
                            Kembali ke Daftar Produk
                        </Button>
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className={styles.backButton}
                    >
                        <TbArrowLeft className="size-4" />
                        Kembali ke Halaman Sebelumnya
                    </button>
                </div>
            </div>
        </div>
    )
}
