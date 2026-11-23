import type { InputHTMLAttributes } from "react"
import styles from "./styles.module.css"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
    helperText?: string
}

export default function Input({
    label,
    error,
    helperText,
    id,
    className = "",
    ...props
}: InputProps) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
                {...props}
            />
            {error ? (
                <p className={styles.errorText} role="alert">
                    {error}
                </p>
            ) : helperText ? (
                <p className={styles.helperText}>{helperText}</p>
            ) : null}
        </div>
    )
}
