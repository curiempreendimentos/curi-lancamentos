import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'Curi Lancamentos', description: 'Sistema de coordenacao de lancamento imobiliario' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="pt-BR"><body>{children}</body></html>)
}