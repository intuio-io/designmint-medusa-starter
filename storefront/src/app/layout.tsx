import { getBaseURL } from "@lib/util/env"
import { Toaster } from 'react-hot-toast'
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <Toaster position="top-right" />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
