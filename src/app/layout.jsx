import '../styles/globals.css'

export const metadata = {
  title: 'African Aspirations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
