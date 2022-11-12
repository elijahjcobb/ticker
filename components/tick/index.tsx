import { useMemo } from "react";
import type { ResponseTick } from "../../pages/api/tick/[id]";
import { CommentButton, HeartButton, RetickButton } from "../interactive-button";
import { formatDistanceToNow } from 'date-fns'
import styles from "./index.module.css";


export function Tick({
	user,
	created_at,
	content,
	comment_count,
	heart_count,
	id
}: ResponseTick) {

	const createdAt = useMemo(() => {
		const date = new Date(created_at);
		let value = formatDistanceToNow(date);
		value = value.replace("about ", "")
		value = value.replace("less than ", "")
		value = value.replace("over ", "")
		return `${value} ago`
	}, [created_at]);

	return <div className={styles.container}>
		<div className={styles.profile} />
		<div className={styles.content}>
			<div className={styles.top}>
				<span className={styles.name}>{user.username}</span>
				<span>·</span>
				<span>@{user.username}</span>
				<span>·</span>
				<span>{createdAt}</span>
			</div>
			<p>{content}</p>
			<div className={styles.buttons}>
				<HeartButton id={id} type='heart' initialCount={heart_count} />
				<CommentButton onClick={() => alert('comment')} count={comment_count} />
				<RetickButton id={id} type='retick' initialCount={0} />
			</div>
		</div>
	</div>
}