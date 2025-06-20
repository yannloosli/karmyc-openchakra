import '@reach/combobox/styles.css'
import { Metadata } from 'next'
import './globals.css'
import '@gamesberry/karmyc-core/style.css'


export const metadata: Metadata = {
  title: 'Open Chakra', 
  description: 'Open source visual editor for Chakra UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
            {children}
      </body>
    </html>
  )
} 
