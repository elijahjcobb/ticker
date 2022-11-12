import { Button } from "../button";
import styles from "./index.module.css";
import { RiSendPlaneFill } from "react-icons/ri";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetcher } from "../../front-helpers/fetch";
import clsx from "clsx";

export function Composer({
	show,
	setShow
}: {
	show: boolean,
	setShow: (value: boolean) => void
}) {

	const [value, setValue] = useState("");
	const ref = useRef<HTMLTextAreaElement>(null);
	const [loading, setLoading] = useState(false);

	const handleTick = useCallback(() => {
		setLoading(true);
		fetcher({
			url: "/tick",
			method: "post",
			body: { content: value }
		}).then(() => {
			setShow(false);
		}).catch(() => {
			setLoading(false);
		})
	}, [value, setShow, setLoading]);

	useEffect(() => {
		ref.current?.focus();
	}, [show]);

	return <>
		<div
			className={clsx(styles.container, show && styles.show)}
			onClick={() => setShow(false)}>
			<div onClick={(ev) => ev.stopPropagation()} className={styles.modal}>
				<textarea
					ref={ref}
					placeholder="What's happening?"
					className={styles.field}
					value={value}
					onChange={ev => setValue(ev.target.value)}
				/>
				<Button
					value="Tick"
					icon={RiSendPlaneFill}
					hoverIcon={RiSendPlaneFill}
					onClick={handleTick}
					loading={loading}
					disabled={loading}
				/>
			</div>
		</div></>
}