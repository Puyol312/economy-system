# 📊 Finance Dashboard

Aplicación web para visualizar y analizar movimientos financieros a partir de archivos Excel (`.xlsx`). Permite explorar reportes mensuales y anuales de forma interactiva.

---

## Tecnologías

- **Next.js 14** — App Router
- **TypeScript**
- **Recharts** — gráficos interactivos
- **CSS Modules** — estilos por componente

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx                  # Layout raíz con Navbar y ExcelProvider
│   ├── page.tsx                    # Homepage — carga del archivo
│   ├── anual/
│   │   ├── page.tsx                # Reporte anual
│   │   └── components/
│   │       ├── BalanceAnualChart/
│   │       ├── TotalesPorMesChart/
│   │       └── ResumenAnual/
│   ├── mensual/
│   │   ├── page.tsx                # Reporte mensual
│   │   └── components/
│   │       ├── MesesSidebar/
│   │       ├── BalanceDiarioChart/
│   │       ├── TotalesPorDiaChart/
│   │       ├── ResumenMensual/
│   │       └── ConceptosTable/
│   └── api/
│       ├── upload/
│       │   └── route.ts            # POST — parsea el Excel
│       └── reportes/
│           ├── anual/
│           │   └── route.ts        # POST — cálculos anuales
│           └── mensual/
│               └── route.ts        # POST — cálculos mensuales
├── components/
│   ├── Navbar/
│   ├── PageHeader/
│   ├── UploadZone/
│   └── EmptyState/
├── context/
│   └── ExcelContext.tsx            # Estado global del archivo cargado
├── controllers/
│   ├── SingleMonthController.ts    # Cálculos de un mes
│   ├── MultiMonthController.ts     # Cálculos multi-mes
├── lib/
│   └── excel/
│       ├── mapearMovimientos.ts    # Transforma filas crudas a Movimiento[]
│       └── parseExcel.ts          # Parseo server-side con xlsx
└── types.ts                        # Tipos globales (Movimiento, RowExcel)
```

---

## Formato del Excel

El archivo `.xlsx` debe tener la siguiente estructura en cada hoja:

| DIA        | CONCEPTO     | DEBITO | CREDITO |
|------------|--------------|--------|---------|
| 2026-04-01 | Sueldo       |        | 50000   |
| 2026-04-02 | Supermercado | 8000   |         |
| 2026-04-15 | Alquiler     | 20000  |         |

- La **primera fila** debe contener los encabezados exactamente como se muestran.
- Las fechas deben estar en formato `YYYY-MM-DD`.
- Cada fila tiene valor en `DEBITO` o en `CREDITO`, nunca en ambos.
- Se soportan **múltiples hojas** en el mismo archivo.

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Puyol312/economy-system.git
cd finance-dashboard

# Instalar dependencias
pnpm install

# Iniciar en desarrollo
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Uso

1. **Subir archivo** — en la homepage arrastrá o seleccioná un `.xlsx`.
2. **Seleccionar hoja** — si el archivo tiene múltiples hojas, elegí la que querés analizar.
3. **Reporte anual** — navegá a `/anual` para ver el balance por mes, totales y el mejor mes del año.
4. **Reporte mensual** — navegá a `/mensual`, seleccioná el mes en el sidebar y explorá el balance diario, créditos, débitos y gastos por concepto.

---

## Arquitectura

### Flujo de datos

```
Usuario sube .xlsx
      ↓
POST /api/upload
  → parsea todas las hojas con xlsx
  → devuelve { hojas, movimientosPorHoja }
      ↓
ExcelContext (cliente)
  → guarda movimientosPorHoja en memoria del browser
  → expone hojaActiva y setHojaActiva
      ↓
Páginas /anual y /mensual
  → leen movimientos del context
  → POST /api/reportes/anual  o  /api/reportes/mensual
  → reciben JSON con todos los cálculos listos
  → renderizan los gráficos y tablas
```

### Decisiones de diseño

**Estado en el cliente** — los movimientos se guardan en el `ExcelContext` (browser) y se mandan en el body de cada request a los endpoints de reportes. Esto permite deployar en plataformas serverless como Vercel sin necesidad de base de datos ni estado en el servidor.

**Controladores puros** — `SingleMonthController` y `MultiMonthController` son funciones puras sin efectos secundarios, reutilizables tanto en el cliente como en el servidor.

**CSS Modules** — cada componente tiene su propio archivo `.module.css` para evitar colisiones de estilos y mantener la colocación de estilos junto al componente.

---

## Scripts

```bash
pnpm dev        # Desarrollo con hot reload
pnpm build      # Build de producción
pnpm start      # Servidor de producción
pnpm lint       # Linting con ESLint
```

---

## Deploy en Vercel

1. Importá el repositorio en [vercel.com](https://vercel.com).
2. Dejá el **Root Directory** vacío (`./`).
3. Vercel detecta Next.js automáticamente.
4. No se requieren variables de entorno.

---

## Licencia

MIT © 2026