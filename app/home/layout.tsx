import Link from "next/link";
import type { ReactNode } from "react"
import { Avatar } from "../../components/avatar";
import { AcornIcon } from "../../components/icons/icon";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: ReactNode }) {
	return <div className={styles.main}>
		<nav className={styles.nav}>
			<Link href='/home' className={styles.navIcon}>
				<AcornIcon />
				<h1>acorn</h1>
			</Link>
			<Avatar name={'user.name'} id={'user.id'} size={64} />
		</nav>
		<div className={styles.container}>
			{children}
		</div>
	</div>
}