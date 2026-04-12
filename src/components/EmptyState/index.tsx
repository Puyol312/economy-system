import Link from "next/link";
import styles from "./EmptyState.module.css";

/**
 * EmptyStateProps
 */
export interface EmptyStateProps {
  /**
   * Título principal del estado vacío.
   * @example "Sin datos cargados"
   */
  title: string;

  /**
   * Descripción explicativa debajo del título.
   * @example "Para ver el reporte anual necesitás subir un archivo primero."
   */
  description: string;

  /**
   * Ruta a la que navega el botón.
   * @example "/"
   */
  href: string;

  /**
   * Texto del botón de acción.
   * @example "Ir a cargar archivo"
   */
  buttonLabel: string;
}

/**
 * EmptyState
 *
 * Componente genérico para mostrar cuando una página no tiene datos disponibles.
 * Muestra un ícono, título, descripción y un botón que redirige al usuario
 * a donde debe realizar la acción necesaria.
 *
 * Se reutiliza en cualquier página que dependa de datos del Excel
 * y el usuario aún no haya subido ningún archivo.
 *
 * @example
 * ```tsx
 * // app/anual/page.tsx
 * if (!data) {
 *   return (
 *     <EmptyState
 *       title="Sin datos cargados"
 *       description="Para ver el reporte anual necesitás subir un archivo primero."
 *       href="/"
 *       buttonLabel="Ir a cargar archivo"
 *     />
 *   );
 * }
 * ```
 */
export default function EmptyState({
  title,
  description,
  href,
  buttonLabel,
}: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="14 2 14 8 20 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="9"
            y1="13"
            x2="15"
            y2="13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="9"
            y1="17"
            x2="12"
            y2="17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      <Link href={href} className={styles.button}>
        {buttonLabel}
      </Link>
    </div>
  );
}