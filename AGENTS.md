# AGENTS.md — Reglas de desarrollo de Odontocúcuta Web

Este archivo es la fuente de verdad para cualquier agente que trabaje en el repositorio
(Codex, Cursor, Copilot, Claude Code, OpenCode, Gemini CLI, etc.).
Si una instrucción del usuario contradice este documento, prevalece el usuario.
Si algo no está cubierto aquí, sigue el patrón que ya existe en el código.

## 1. Contexto del proyecto

- PWA de la clínica odontológica Odontocúcuta: **React 19 + TypeScript + Vite 8 + Tailwind CSS 4**.
- Dos experiencias:
  - Sitio público: landing, citas, soporte (`src/pages`, `src/components/landing`).
  - **Portal de Profesionales** (rutas `/profesionales/*`): login con 2FA, liquidaciones, pagos, acuerdos, archivos y perfil.
- Autenticación por **cookie HttpOnly**; el frontend nunca guarda tokens de sesión.
- Toda la interfaz está en **español** y se diseña **mobile-first**.

## 2. Comandos y verificación

- Gestor de paquetes: **pnpm** (existe `pnpm-lock.yaml`). Nunca `npm install` ni `yarn`.
- `pnpm dev` · `pnpm build` (`tsc -b && vite build`) · `pnpm lint`.
- Antes de dar una tarea por terminada:
  1. `npx tsc -b`
  2. `npx eslint <archivos modificados>`
  3. `pnpm build` si se tocó configuración, dependencias o carga diferida.
  4. Probar visualmente en ~360 px y en escritorio.
- El repositorio arrastra errores de lint previos en algunos archivos; **no introduzcas errores nuevos**.
- Después de `pnpm add` / `pnpm install`, **reinicia el dev server**: el servidor viejo queda con la caché de dependencias anterior y rompe `@vite/client`.
- Nunca edites `dist/`, `node_modules/` ni archivos generados.

## 3. Estructura

```
src/
  pages/            # una carpeta por sección (profesionales/, etc.)
  components/
    ui/             # primitivas reutilizables (Modal, Toast, Confirm)
    shared/         # Button, SEO, Logo, modales públicos
    profesionales/  # componentes del portal
  hooks/            # hooks por dominio (profesionales/, soporte/)
  services/         # apiClient + servicios por dominio
  store/            # zustand
  types/            # contratos TypeScript
  utils/            # formatters, helpers, exportaciones
  router.tsx
```

- Alias de importación: `@/` → `src/`. No uses rutas relativas largas (`../../..`).
- Archivos de componentes en `PascalCase.tsx`; hooks en `useAlgo.ts`; utilidades en `camelCase.ts`.

## 4. Reglas de código

- TypeScript estricto: sin `any` (usa `unknown` + estrechamiento). `verbatimModuleSyntax` obliga a `import type` para tipos. `erasableSyntaxOnly`: **no enums ni namespaces**.
- Componentes funcionales tipados (`React.FC<Props>` o `FC<Props>`); props con `interface`.
- Textos visibles, comentarios y mensajes de error en **español** con tildes y ñ correctas.
- Fechas, moneda y sedes **siempre** con `@/utils/formatters`:
  `formatCurrency`, `formatDateShort`, `formatDateTime`, `formatSede`, `formatFileSize`.
  No uses `toLocaleString` suelto para dinero ni formatos manuales de fecha.
- Tailwind: paleta `slate` + `blue`; tarjetas `bg-white rounded-2xl border border-slate-200/80 shadow-xs`; títulos de sección `text-xs font-black uppercase tracking-wider text-slate-500`; acciones destructivas en `red-600`.
- Iconos de `lucide-react`, tamaño `w-4 h-4` (o `w-3.5 h-3.5` en textos pequeños) y `aria-hidden="true"` cuando son decorativos.
- Accesibilidad: botones con texto o `aria-label`; inputs con `<label>` visible o `sr-only`; foco visible (`focus:ring-2`).
- No agregues `console.log` de depuración; usa `console.error` solo para fallos inesperados.

## 5. Diálogos y notificaciones — OBLIGATORIO

- **Prohibido** `window.alert`, `window.confirm`, `window.prompt` y cualquier diálogo nativo.
- Notificaciones: `useToast()` desde `@/components/ui`
  ```ts
  const toast = useToast()
  toast.success('Excel descargado.')
  toast.error(`No se pudo descargar: ${msg}`)
  toast.show({ variant: 'info', title: 'Aviso', message: '...' })
  ```
- Confirmaciones: `useConfirm()` devuelve `Promise<boolean>`
  ```ts
  const confirmar = useConfirm()
  const ok = await confirmar({
    title: 'Cerrar sesión',
    description: '¿Deseas salir del portal?',
    confirmLabel: 'Cerrar sesión',
    destructive: true,
  })
  ```
- Capas/diálogos: usa `Modal` de `@/components/ui` (portal, ESC, foco atrapado, scroll bloqueado). Sirve para confirmaciones, formularios, previsualizaciones y menús; **no crees overlays ad-hoc**.
- Errores de validación de formularios: inline junto al campo. Errores de red/acción: toast (o inline contextual si el error pertenece a una tarjeta concreta, como la exportación). No dupliques el mismo mensaje en ambos.
- `ToastProvider` y `ConfirmProvider` ya están montados en `App.tsx`; no los dupliques por página.

## 6. Datos y API

- Cliente propio en `src/services/apiClient.ts` (fetch con `credentials: 'include'`). **No axios** y no `fetch` directo dentro de componentes.
- Endpoints en `src/services/profesionales/doctorService.ts`; contratos en `src/types/profesionales.ts`.
- 2FA y recuperación de contraseña: los tokens (`challenge_token`, `setup_token`, `reset_token`) **nunca** se guardan en `localStorage`/`sessionStorage`.
- Errores con `getApiErrorMessage(err, 'mensaje por defecto')` y `getApiErrorStatus`.
- Hooks: manejan `loading`, `error` y `refetch`; descartan respuestas fuera de orden (contador de petición) y **no llaman `setState` de forma síncrona dentro de un efecto** (regla `react-hooks`).

## 7. Listas y paginación

- TanStack Table **v9 headless** con el registro compartido `featuresTablaPaginada` de `@/utils/tablaPaginada`; no declares `features` por página.
- La tabla solo aporta estado/datos: **renderiza tarjetas**, no `<table>` en móvil.
- Pagina con `PaginationBar` y `OPCIONES_POR_PAGINA` (10/20/50/100; inicial 20).
- Al cambiar búsqueda, filtros o datos: `table.resetPageIndex()`.

## 8. Exportaciones (Excel / PDF)

- Librerías pesadas **solo** con `await import()` (`write-excel-file/universal`, `jspdf`, `jspdf-autotable`).
- Excel: **una sola hoja**, resumen arriba y listado debajo. Con `columnSpan`, las celdas tapadas deben ser `null`.
- PDF: se abre en el visor del navegador/teléfono y el usuario decide si descarga. La pestaña se abre con `window.open` **antes** de generar el archivo (dentro del gesto del usuario) y hay fallback a descarga.
- El “% pagado” se calcula como `pago_profesional / base_calculo`; no uses `porcentaje_pagado_paciente` del backend.
- Si agregas dependencias que se cargan bajo demanda, exclúyelas del precache de la PWA en `vite.config.ts`.

## 9. PWA

- `vite-plugin-pwa` con `registerType: 'autoUpdate'`. Los chunks de exportación están en `workbox.globIgnores`.
- No cargues librerías pesadas en el bundle inicial; usa `React.lazy` o `import()`.

## 10. Dependencias y cambios sensibles

- No instales dependencias sin una razón clara; primero busca lo que ya existe en el proyecto.
- Evita `xlsx` de npm (avisos de seguridad); usa `write-excel-file` o `@e965/xlsx`.
- No modifiques `package.json` ni el lockfile más allá de la dependencia que necesitas; no reviertas cambios del usuario.
- Nunca commitees `.env`, credenciales ni tokens.
- Actualiza `docs/API_PORTAL_PROFESIONALES_REACT.md` cuando cambie un contrato de API.

## 11. Definición de terminado

- [ ] `npx tsc -b` sin errores.
- [ ] ESLint sin errores nuevos en los archivos tocados.
- [ ] `pnpm build` correcto si cambió configuración o carga diferida.
- [ ] Probado en móvil (~360 px) y escritorio.
- [ ] Sin `alert`/`confirm` nativos; usa Toast/Confirm.
- [ ] Textos con tildes y ñ correctas; sin `console.log` de depuración.
- [ ] Sin regresiones en rutas existentes del portal.

## 12. Jerarquía de instrucciones

- Este `AGENTS.md` aplica a todo el repositorio.
- Si en el futuro existe un `AGENTS.md` dentro de una subcarpeta, ese prevalece para los archivos de esa carpeta.
- Ante una duda de diseño o producto, pregunta antes de inventar flujos nuevos.
