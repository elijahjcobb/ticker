import { Inter, Space_Grotesk, Roboto_Mono } from '@next/font/google'
import Head from 'next/head';
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })
const space = Space_Grotesk({ subsets: ['latin'] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<style jsx global>{`
      :root {
        --font: ${inter.style.fontFamily};
        --font-mono: ${robotoMono.style.fontFamily};
        --font-title: ${space.style.fontFamily};
      }
    `}</style>
			<Head>
				<title>acorn</title>
				<link rel="icon" type="image/svg" href="/icon.svg" />
			</Head>
			<body>{children}</body>
		</html>
	);
}