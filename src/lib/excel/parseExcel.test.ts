import test from "ava";
import * as XLSX from "xlsx";

import { parseExcel } from "./parseExcel";

test("parseExcel: debería parsear un Excel con una hoja", (t) => {
  const rows = [
    {
      Fecha: "04/01/2026",
      Asunto: "Sueldo",
      Crédito: 50000,
    },
    {
      Fecha: "04/02/2026",
      Asunto: "Supermercado",
      Débito: 3000,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Abril"
  );

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  const resultado = parseExcel(buffer);

  t.deepEqual(resultado.hojas, ["Abril"]);

  t.is(
    resultado.movimientosPorHoja["Abril"].length,
    2
  );

  t.deepEqual(
    resultado.movimientosPorHoja["Abril"],
    [
      {
        dia: "2026-04-01",
        concepto: "Sueldo",
        monto: 50000,
        tipo: "credito",
      },
      {
        dia: "2026-04-02",
        concepto: "Supermercado",
        monto: 3000,
        tipo: "debito",
      },
    ]
  );
});

test("parseExcel: debería procesar múltiples hojas", (t) => {
  const workbook = XLSX.utils.book_new();

  const abril = XLSX.utils.json_to_sheet([
    {
      Fecha: "04/01/2026",
      Asunto: "Sueldo",
      Crédito: 50000,
    },
  ]);

  const mayo = XLSX.utils.json_to_sheet([
    {
      Fecha: "05/01/2026",
      Asunto: "Sueldo",
      Crédito: 50000,
    },
  ]);

  XLSX.utils.book_append_sheet(
    workbook,
    abril,
    "Abril"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    mayo,
    "Mayo"
  );

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  const resultado = parseExcel(buffer);

  t.deepEqual(resultado.hojas, [
    "Abril",
    "Mayo",
  ]);

  t.is(
    resultado.movimientosPorHoja.Abril.length,
    1
  );

  t.is(
    resultado.movimientosPorHoja.Mayo.length,
    1
  );
});