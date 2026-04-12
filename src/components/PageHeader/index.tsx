"use client";

import styles from "./PageHeader.module.css";

/**
 * PageHeaderTab
 *
 * Representa una pestaña dentro del PageHeader.
 */
export interface PageHeaderTab {
  /** Identificador único de la pestaña */
  id: string;
  /** Texto visible de la pestaña */
  label: string;
}

/**
 * PageHeaderProps
 */
export interface PageHeaderProps {
  /**
   * Título principal de la página.
   * @example "Reporte mensual"
   */
  title: string;

  /**
   * Texto del breadcrumb que aparece sobre el título.
   * Si no se pasa, no se renderiza el breadcrumb.
   * @example "Reportes"
   */
  breadcrumb?: string;

  /**
   * Lista de pestañas opcionales debajo del título.
   * Si no se pasa, no se renderiza la barra de tabs.
   */
  tabs?: PageHeaderTab[];

  /**
   * ID de la pestaña actualmente activa.
   * Debe coincidir con el `id` de algún elemento de `tabs`.
   */
  activeTab?: string;

  /**
   * Callback que se ejecuta al hacer clic en una pestaña.
   * @param tabId - El `id` de la pestaña clickeada.
   */
  onTabChange?: (tabId: string) => void;
}

/**
 * PageHeader
 *
 * Encabezado de página reutilizable. Muestra breadcrumb, título
 * y opcionalmente una barra de tabs para sub-secciones.
 *
 * Se usa dentro de cada `page.tsx` para contextualizar la vista actual.
 *
 * @example
 * ```tsx
 * // app/mensual/page.tsx
 * "use client";
 * import { useState } from "react";
 * import PageHeader from "@/components/PageHeader/PageHeader";
 *
 * export default function MensualPage() {
 *   const [activeTab, setActiveTab] = useState("resumen");
 *
 *   return (
 *     <>
 *       <PageHeader
 *         breadcrumb="Reportes"
 *         title="Reporte mensual"
 *         tabs={[
 *           { id: "resumen", label: "Resumen" },
 *           { id: "detalle", label: "Detalle" },
 *           { id: "exportar", label: "Exportar" },
 *         ]}
 *         activeTab={activeTab}
 *         onTabChange={setActiveTab}
 *       />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 */
export default function PageHeader({
  title,
  breadcrumb,
  tabs,
  activeTab,
  onTabChange,
}: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      {/* Breadcrumb */}
      {breadcrumb && (
        <p className={styles.breadcrumb}>
          <span>{breadcrumb}</span> / {title}
        </p>
      )}

      {/* Título */}
      <h1 className={styles.title}>{title}</h1>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className={styles.tabs} role="tablist" aria-label={`Secciones de ${title}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tab.id === activeTab}
              className={`${styles.tab} ${
                tab.id === activeTab ? styles.tabActive : ""
              }`}
              onClick={() => onTabChange?.(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}