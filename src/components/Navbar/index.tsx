"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

/**
 * Navbar
 *
 * Barra de navegación principal de la aplicación.
 * Muestra el logo, los links de navegación y el avatar del usuario.
 *
 * Se ubica en `app/layout.tsx` para que persista en todas las rutas.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import Navbar from "@/components/Navbar/Navbar";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Navbar />
 *         <main>{children}</main>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export default function Navbar() {
  const pathname = usePathname();

  /** Links de navegación de la app */
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mensual", label: "Mensual" },
    { href: "/anual", label: "Anual" },
  ];

  return (
    <header className={styles.topbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoDot} />
        Control de Gastos
      </div>

      {/* Navegación */}
      <nav className={styles.nav} aria-label="Navegación principal">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${
              pathname === href ? styles.active : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}