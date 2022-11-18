import styles from "./index.module.css";

export function Ghost({ height = 135 }: { height?: number }) {
	return <div style={{ height }} className={styles.container}>
		<div style={{ height }} className={styles.ghost} />
	</div>
}