import { useState } from "react"
import { Link } from "react-router"
import {
    TbSettings,
    TbLayoutGrid,
    TbList,
    TbServer,
    TbCheck,
    TbArrowLeft,
} from "react-icons/tb"
import Button from "../../atoms/Button"
import Badge from "../../atoms/Badge"
import styles from "./styles.module.css"

export default function SettingsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
        if (typeof window !== "undefined") {
            const savedView = localStorage.getItem("preferred_view_mode")
            if (savedView === "grid" || savedView === "list") return savedView
        }
        return "grid"
    })
    const [savedMessage, setSavedMessage] = useState("")
    const apiUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ""

    function handleSave(mode: "grid" | "list") {
        setViewMode(mode)
        localStorage.setItem("preferred_view_mode", mode)
        setSavedMessage(`Preferensi tampilan berhasil disimpan: Mode ${mode.toUpperCase()}.`)
        setTimeout(() => setSavedMessage(""), 3500)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className="flex items-center gap-3">
                    <div className={styles.iconWrapper}>
                        <TbSettings className="size-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className={styles.title}>Pengaturan Aplikasi</h1>
                        <p className={styles.description}>
                            Sesuaikan preferensi tampilan dan konfigurasi integrasi backend aplikasi.
                        </p>
                    </div>
                </div>
            </div>

            {savedMessage && (
                <div className={styles.successAlert}>
                    <TbCheck className="size-5 shrink-0" />
                    <span>{savedMessage}</span>
                </div>
            )}

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Preferensi Tampilan Produk</h2>
                    <p className={styles.sectionDesc}>
                        Pilih mode tata letak default saat melihat daftar produk di halaman utama.
                    </p>
                </div>

                <div className={styles.optionsGrid}>
                    <button
                        type="button"
                        onClick={() => handleSave("grid")}
                        className={`${styles.optionCard} ${viewMode === "grid" ? styles.optionActive : ""}`}
                    >
                        <div className={styles.optionIconWrapper}>
                            <TbLayoutGrid className="size-6" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <span className={styles.optionName}>Mode Kotak (Grid View)</span>
                                {viewMode === "grid" && (
                                    <Badge variant="success">Aktif</Badge>
                                )}
                            </div>
                            <p className={styles.optionDescription}>
                                Menampilkan produk dalam kartu-kartu responsif berdampingan.
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSave("list")}
                        className={`${styles.optionCard} ${viewMode === "list" ? styles.optionActive : ""}`}
                    >
                        <div className={styles.optionIconWrapper}>
                            <TbList className="size-6" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <span className={styles.optionName}>Mode Baris (List View)</span>
                                {viewMode === "list" && (
                                    <Badge variant="success">Aktif</Badge>
                                )}
                            </div>
                            <p className={styles.optionDescription}>
                                Menampilkan produk memanjang dalam baris vertikal dengan aksi langsung.
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Konfigurasi Server Backend API</h2>
                    <p className={styles.sectionDesc}>
                        Endpoint REST API yang digunakan untuk sinkronisasi data produk.
                    </p>
                </div>

                <div className={styles.serverInfoCard}>
                    <div className="flex items-center gap-3">
                        <TbServer className="size-5 text-slate-500" />
                        <div>
                            <span className="text-xs font-medium text-slate-500">API Base URL</span>
                            <p className="font-mono text-sm font-semibold text-slate-800">
                                {apiUrl || "Belum dikonfigurasi"}
                            </p>
                        </div>
                    </div>
                    <Badge variant={apiUrl ? "success" : "warning"}>
                        {apiUrl ? "URL dikonfigurasi" : "URL belum dikonfigurasi"}
                    </Badge>
                </div>
                {!apiUrl && (
                    <p className="mt-3 text-sm text-amber-800">
                        Salin .env.example menjadi .env.local, lalu jalankan ulang frontend.
                    </p>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-6">
                <Link to="/products">
                    <Button variant="secondary">
                        <TbArrowLeft className="size-4" />
                        Kembali ke Halaman Produk
                    </Button>
                </Link>
            </div>
        </div>
    )
}
