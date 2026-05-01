"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

/**
 * Navbar
 *
 * Barra de navegación principal de la aplicación.
 * Muestra el logo con border radius, el nombre de la app
 * y los links de navegación.
 */
export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/",        label: "Home"    },
    { href: "/mensual", label: "Mensual" },
    { href: "/anual",   label: "Anual"   },
  ];

  return (
    <header className={styles.topbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/icon.png"
          alt="EcoS logo"
          width={28}
          height={28}
          className={styles.logoImage}
        />
        EcoS
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