import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk, Roboto_Mono } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })
const space = Space_Grotesk({ subsets: ['latin'] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });


export default function App({ Component, pageProps }: AppProps) {
  return <>
    <style jsx global>{`
      :root {
        --font: ${inter.style.fontFamily};
        --font-mono: ${robotoMono.style.fontFamily};
        --font-title: ${space.style.fontFamily};
      }
    `}</style>
    <Component {...pageProps} />
  </>
}
