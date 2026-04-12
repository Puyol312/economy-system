"use client";

import PageHeader from "@/components/PageHeader";
import UploadZone from "@/components/UploadZone";
import styles from "./page.module.css";

/**
 * HomePage — `/`
 *
 * Página principal de la aplicación. Permite al usuario subir
 * un archivo `.xlsx` que será procesado por la API y almacenado
 * en el contexto global para ser consumido por `/mensual` y `/anual`.
 *
 * Estructura:
 * - Panel izquierdo: instrucciones y requisitos del archivo.
 * - Panel derecho: zona de carga del archivo.
 */
export default function HomePage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Importar datos" />

      <div className={styles.layout}>
        {/* ── Panel izquierdo: instrucciones ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarTitle}>¿Cómo funciona?</h2>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <div>
                  <p className={styles.stepTitle}>Subí tu archivo</p>
                  <p className={styles.stepDesc}>
                    Seleccioná un archivo <code>.xlsx</code> desde tu computadora.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <div>
                  <p className={styles.stepTitle}>Procesamos la data</p>
                  <p className={styles.stepDesc}>
                    El archivo se envía a la API y los datos quedan disponibles globalmente.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <div>
                  <p className={styles.stepTitle}>Explorá los reportes</p>
                  <p className={styles.stepDesc}>
                    Navegá a <strong>Mensual</strong> o <strong>Anual</strong> para ver los resultados.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarTitle}>Requisitos del archivo</h2>
            <ul className={styles.requirements}>
              <li>Formato <code>.xlsx</code> únicamente</li>
              <li>Primera fila como encabezados de columna</li>
              <li>Tamaño máximo: 10 MB</li>
            </ul>
          </div>
        </aside>

        {/* ── Panel derecho: upload ── */}
        <section className={styles.uploadArea}>
          <UploadZone />
        </section>
      </div>
    </div>
  );
}