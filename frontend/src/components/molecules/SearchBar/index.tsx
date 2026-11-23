import { TbSearch, TbX } from "react-icons/tb"
import styles from "./styles.module.css"

type SearchBarProps = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function SearchBar({
    value,
    onChange,
    placeholder = "Cari produk berdasarkan nama...",
}: SearchBarProps) {
    return (
        <div className={styles.wrapper}>
            <TbSearch className={styles.icon} aria-hidden="true" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className={styles.clearButton}
                    title="Hapus pencarian"
                >
                    <TbX className="size-4" />
                </button>
            )}
        </div>
    )
}
