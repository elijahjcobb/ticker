import { Button } from "../button";
import styles from "./index.module.css";
import { RiSendPlaneFill } from "react-icons/ri";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetcher } from "../../front-helpers/fetch";
import clsx from "clsx";
import type { FeedItem } from "../../pages/api/user/feed";

export function Composer({
	show,
	setShow,
	onCreateTick
}: {
	show: boolean,
	setShow: (value: boolean) => void;
	onCreateTick: (tick: FeedItem) => void;
}) {

	const [value, setValue] = useState("");
	const ref = useRef<HTMLTextAreaElement>(null);
	const [loading, setLoading] = useState(false);

	const handleTick = useCallback(() => {
		setLoading(true);
		fetcher<FeedItem>({
			url: "/tick",
			method: "post",
			body: { content: value }
		}).then(res => {
			setShow(false);
			onCreateTick(res);
			setLoading(false);
			setValue("");
		}).catch(() => {
			setLoading(false);
		})
	}, [value, setShow, setLoading, onCreateTick]);

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