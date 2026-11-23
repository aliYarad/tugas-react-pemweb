import type { HTMLAttributes, ReactNode } from "react"
import styles from "./styles.module.css"

type BadgeVariant = "info" | "success" | "warning" | "danger" | "neutral"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant
    children: ReactNode
}

export default function Badge({
    variant = "neutral",
    className = "",
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={`${styles.badge} ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}
