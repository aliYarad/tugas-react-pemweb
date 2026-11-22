import { NavLink, Link } from "react-router"
import { TbBuildingStore, TbPackage, TbSettings } from "react-icons/tb"
import styles from "./styles.module.css"

export default function Navbar() {
    return (
        <header className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/products" className={styles.brand}>
                    <div className={styles.logoWrapper}>
                        <TbBuildingStore className="size-5" />
                    </div>
                    <div>
                        <span className={styles.brandName}>Manajemen Produk</span>
                        <span className={styles.badge}>Tugas 4</span>
                    </div>
                </Link>

                <nav className={styles.nav}>
                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                        }
                    >
                        <TbPackage className="size-4.5" />
                        <span>Produk</span>
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                        }
                    >
                        <TbSettings className="size-4.5" />
                        <span>Pengaturan</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
