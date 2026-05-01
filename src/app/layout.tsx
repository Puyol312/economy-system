import type { Metadata } from "next";
import { ExcelProvider } from "@/context/ExcelContext";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoS",
  description:
    "Visualizá y analizá tus movimientos financieros. Importá tu archivo Excel y explorá reportes mensuales y anuales de forma simple e interactiva.",
  icons: {
    icon: "/icon.png",
  },
};

/**
 * RootLayout
 *
 * Layout raíz de la aplicación. Se aplica a todas las rutas.
 *
 * Incluye:
 * - `ExcelProvider` — envuelve toda la app para que la data del
 *   Excel esté disponible globalmente en cualquier página.
 * - `Navbar` — barra de navegación persistente.
 * - `main` — área donde cada página inyecta su contenido.
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