import { Outlet } from "react-router"
import Navbar from "../../organisms/Navbar"
import styles from "./styles.module.css"

export default function PageLayout() {
    return (
        <div className={styles.wrapper}>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.container}>
                    <Outlet />
                </div>
            </main>
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <p className={styles.footerText}>
                        Pemrograman Web · Tugas 4: React Router, Tailwind CSS, & Integrasi Backend
                    </p>
                </div>
            </footer>
        </div>
    )
}
