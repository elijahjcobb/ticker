import { Field } from "../../components/field";
import styles from "./index.module.css";
import { IoPerson, IoLockClosed } from 'react-icons/io5';
import { useCallback, useMemo, useState } from "react";
import { Button } from "../../components/button";
import { GoSquirrel } from "react-icons/go";
import { fetcher } from "../../front-helpers/fetch";
import { useRouter } from "next/router";
import { APIError } from "../../api-helpers/api-error";

export default function Page() {

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSignIn, setIsSignIn] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const router = useRouter();

	const message = useMemo(() => `Sign ${isSignIn ? "In" : "Up"}`, [isSignIn]);

	const handleModeClickSwitch = useCallback(() => setIsSignIn(v => !v), []);

	const handleSubmit = useCallback(() => {
		setIsLoading(true);
		setErrorMessage(undefined);
		fetcher({
			url: `/user/sign-${isSignIn ? "in" : "up"}`,
			method: 'post',
			body: {
				username, password
			}
		}).then(() => {
			router.push("/");
		}).catch(err => {
			let message = "An error occurred.";
			if (err instanceof APIError) message = err.message;
			setErrorMessage(message);
		}).finally(() => {
			setIsLoading(false);
		})
	}, [isSignIn, username, password, router]);

	return <div className={styles.container}>
		<div className={styles.left}>
			<GoSquirrel size={64} />
			<h1>ticker</h1>
			<p>the web&apos;s town square</p>
		</div>
		<div className={styles.right}>
			<h2>{message}</h2>
			<div
				className={styles.form}>
				<Field
					icon={IoPerson}
					placeholder='username'
					value={username}
					onChange={setUsername}
				/>
				<Field
					icon={IoLockClosed}
					placeholder='password'
					value={password}
					type='password'
					onChange={setPassword}
					onEnter={handleSubmit}
				/>
			</div>
			<Button
				onClick={handleSubmit}
				value={message}
				loading={isLoading}
				disabled={isLoading}
				variant='pri' />
			{errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
			<Button
				value={`or sign ${isSignIn ? "up" : "in"} instead...`}
				inline
				onClick={handleModeClickSwitch}
				variant='sec' />
		</div>
	</div>
}