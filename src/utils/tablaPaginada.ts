import { createPaginatedRowModel, rowPaginationFeature, tableFeatures } from '@tanstack/react-table'

/**
 * Features de TanStack Table v9 compartidas por las tablas paginadas del portal.
 * La tabla es headless: solo aporta estado y datos, el diseño lo pone la app.
 * Debe declararse una sola vez (module scope) para que la referencia sea estable.
 */
export const featuresTablaPaginada = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

export const OPCIONES_POR_PAGINA = [10, 20, 50, 100]

export const TAMANO_PAGINA_INICIAL = 20
