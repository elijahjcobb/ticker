import styles from "./index.module.css";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { Button } from "../../components/button";
import { GoSquirrel } from "react-icons/go";
import { useRouter } from "next/router";

export function AuthPage({
	children,
	onSubmit,
	errorMessage,
	isLoading,
	type
}: PropsWithChildren<{
	onSubmit: () => void;
	errorMessage?: string;
	isLoading?: boolean;
	type: "in" | "up";
}>) {

	const oppositeType = useMemo(() => type === 'in' ? 'up' : 'in', [type])
	const title = useMemo(() => `Sign ${type}`, [type]);
	const router = useRouter();

	const handleSwapMode = useCallback(() => {
		router.push(`/sign-${oppositeType}`);
	}, [router, oppositeType]);

	return <div className={styles.container}>
		<div className={styles.left}>
			<GoSquirrel size={64} />
			<h1>ticker</h1>
			<p>the web&apos;s town square</p>
		</div>
		<div className={styles.right}>
			<h2>{title}</h2>
			<div
				className={styles.form}>
				{children}
			</div>
			<Button
				onClick={onSubmit}
				value={title}
				loading={isLoading}
				disabled={isLoading}
				variant='pri' />
			<Button
				value={`or sign ${oppositeType} instead...`}
				inline
				onClick={handleSwapMode}
				variant='sec' />
			{errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
		</div>
	</div>
}