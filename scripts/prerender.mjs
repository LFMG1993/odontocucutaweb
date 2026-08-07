import { preview } from 'vite'
import puppeteer from 'puppeteer-core'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { mkdir, writeFile, copyFile, access } from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist')
const port = 4173

// Rutas estáticas a pre-renderizar. Las rutas dinámicas (servicios/:slug,
// blog/:slug) se pueden añadir generando aquí la lista de slugs.
const routes = ['/', '/nosotros', '/servicios', '/cita', '/blog', '/contacto']

const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const placeholders = ['odontocucutaweb', 'localhost']

async function main() {
  await access(dist).catch(() => {
    console.error('[prerender] No existe dist/. Ejecuta "npm run build" primero.')
    process.exit(1)
  })

  const server = await preview({
    root,
    preview: { port, strictPort: true, host: '127.0.0.1' },
  })

  const baseUrl = `http://127.0.0.1:${port}`
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    for (const route of routes) {
      const url = route === '/' ? baseUrl : `${baseUrl}${route}`
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })

      // Espera a que react-helmet-async actualice el <head> (title real).
      await page
        .waitForFunction(
          () => {
            const t = document.title || ''
            return !placeholders.some((p) => t.startsWith(p))
          },
          { timeout: 15000 },
        )
        .catch(() => {})

      // Da margen para que termine la hidratación / async del helmet.
      await new Promise((r) => setTimeout(r, 1000))

      const html = await page.content()
      const outDir = route === '/' ? dist : resolve(dist, route.replace(/^\//, ''))
      await mkdir(outDir, { recursive: true })
      const file = resolve(outDir, 'index.html')
      await writeFile(file, html)
      console.log(`[prerender] ${route} -> ${file.replace(dist, '')}/index.html`)
      await page.close()
    }

    // 200.html para que el host sirva el SPA en rutas no pre-renderizadas.
    const index = resolve(dist, 'index.html')
    await copyFile(index, resolve(dist, '200.html'))
    console.log('[prerender] 200.html creado (fallback SPA)')
  } finally {
    await browser.close()
    await new Promise((r) => server.httpServer.close(r))
  }
}

main().catch((err) => {
  console.error('[prerender] Error:', err)
  process.exit(1)
})
