# Economy System

Aplicación web para importar movimientos financieros desde archivos Excel (`.xlsx`) y explorar reportes mensuales y anuales de forma interactiva.

---

## Tecnologías

- **Next.js 16** — App Router
- **React 19**
- **TypeScript**
- **Recharts** — gráficos interactivos
- **CSS Modules** — estilos por componente
- **AVA** — pruebas automatizadas

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx                  # Layout raíz con Navbar y ExcelProvider
│   ├── page.tsx                    # Homepage — carga del archivo
│   ├── datos/
│   │   └── page.tsx                # Vista de datos importados
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
│           ├── datos/
│           │   └── route.ts         # POST — devuelve los datos importados
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
├── hooks/                          # Hooks para consumir reportes
├── lib/                            # Utilidades, formato y parseo de Excel
├── services/                       # Generación de reportes y procesamiento
└── types/                          # Tipos de dominio y DTOs
```

---

## Formato del Excel

El archivo `.xlsx` debe tener la siguiente estructura en cada hoja:

| Fecha      | Asunto       | Débito | Crédito |
| ---------- | ------------ | ------ | ------- |
| 04/01/2026 | Sueldo       |        | 50000   |
| 04/02/2026 | Supermercado | 8000   |         |
| 04/15/2026 | Alquiler     | 20000  |         |

- La **primera fila** debe contener los encabezados exactamente como se muestran.
- La **primera fila** debe contener los encabezados `Fecha`, `Asunto`, `Débito` y `Crédito`.
- Las fechas deben estar en formato `mm/dd/yyyy`.
- Cada fila debe tener un `Asunto` y un valor positivo en `Débito` o `Crédito`.
- Las filas con fecha, asunto o importe inválidos se ignoran.
- También se admiten las columnas opcionales `Número de documento`, `Descripción` y `Asunto Oficial`.
- Se soportan **múltiples hojas** en el mismo archivo; cada hoja se procesa por separado.

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Puyol312/economy-system.git
cd economy-system

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

**Servicios de reportes** — la generación de reportes está separada en servicios y funciones de cálculo puras, reutilizables tanto en los Route Handlers como en las pruebas automatizadas.

**CSS Modules** — cada componente tiene su propio archivo `.module.css` para evitar colisiones de estilos y mantener la colocación de estilos junto al componente.

---

## Scripts

```bash
pnpm dev        # Desarrollo con hot reload
pnpm build      # Build de producción
pnpm start      # Servidor de producción
pnpm test       # Pruebas automatizadas con AVA
pnpm lint       # Linting con ESLint
pnpm format     # Formatear archivos con Prettier
pnpm format:check # Comprobar el formato
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