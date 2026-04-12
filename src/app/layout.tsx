import type { Metadata } from "next";
import { ExcelProvider } from "@/context/ExcelContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiApp",
  description: "Dashboard de reportes",
};

/**
 * RootLayout
 *
 * Layout raíz de la aplicación. Se aplica a todas las rutas.
 *
 * Incluye:
 * - El `<Navbar>` persistente en la parte superior.
 * - El área `<main>` donde cada página inyecta su contenido.
 *
 * Para agregar elementos globales (sidebar, footer global, etc.)
 * hacerlo aquí.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ExcelProvider>
          <Navbar />
          <main>{children}</main>
        </ExcelProvider>
      </body>
    </html>
  );
}