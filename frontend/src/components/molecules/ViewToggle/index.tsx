import { TbLayoutGrid, TbList } from "react-icons/tb"
import styles from "./styles.module.css"

type ViewToggleProps = {
    viewMode: "grid" | "list"
    onToggle: (mode: "grid" | "list") => void
}

export default function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
    return (
        <div className={styles.wrapper} role="group" aria-label="Tampilan produk">
            <button
                type="button"
                onClick={() => onToggle("grid")}
                className={`${styles.button} ${viewMode === "grid" ? styles.active : ""}`}
                title="Tampilan Kotak (Grid)"
                aria-pressed={viewMode === "grid"}
            >
                <TbLayoutGrid className="size-4.5" />
                <span className="hidden sm:inline text-xs font-medium">Grid</span>
            </button>
            <button
                type="button"
                onClick={() => onToggle("list")}
                className={`${styles.button} ${viewMode === "list" ? styles.active : ""}`}
                title="Tampilan Baris (List)"
                aria-pressed={viewMode === "list"}
            >
                <TbList className="size-4.5" />
                <span className="hidden sm:inline text-xs font-medium">List</span>
            </button>
        </div>
    )
}
