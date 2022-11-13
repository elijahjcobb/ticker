import { useMemo } from "react";
import { HeartButton, RetickButton } from "../interactive-button";
import { formatDistanceToNow } from 'date-fns'
import styles from "./index.module.css";
import { Avatar } from "../avatar";
import type { FeedItem } from "../../pages/api/user/feed";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { IoChatbubbleOutline, IoHeartOutline } from "react-icons/io5";

function formatDateString(dateString: string): string {
	const date = new Date(dateString);
	let value = formatDistanceToNow(date);
	value = value.replace("about ", "")
	value = value.replace("less than ", "")
	value = value.replace("over ", "")
	return `${value} ago`
}

export function Tick({
	tick,
	event
}: FeedItem) {

	const { user,
		createdAt: createdAtRaw,
		content,
		retickCount,
		heartCount,
		hearted,
		reticked,
		id
	} = tick;

	const createdAt = useMemo(() => formatDateString(createdAtRaw), [createdAtRaw])
	const eventDate = useMemo(() => formatDateString(event.createdAt), [event.createdAt]);

	const eventMessage = useMemo(() => {
		switch (event.type) {
			case "comment":
				return "commented on";
			case "retick":
				return "reticked";
			case "heart":
				return "hearted";
			default:
				return "";
		}
	}, [event.type]);

	const EventIcon = useMemo(() => {
		switch (event.type) {
			case "comment":
				return IoChatbubbleOutline;
			case "retick":
				return HiOutlineSpeakerphone;
			default:
				return IoHeartOutline;
		}
	}, [event.type]);

	return <div className={styles.container}>
		{event.type === 'tick' ? null : <div className={styles.event}>
			<EventIcon className={styles.eventIcon} />
			<span>@{event.user.username}</span>
			<span>{eventMessage}</span>
			<span>@{tick.user.username}&apos;s tick</span>
			<span>{eventDate}</span>
		</div>}
		<div
			className={styles.tick}>
			<Avatar name={user.name} id={user.id} />
			<div className={styles.content}>
				<div className={styles.top}>
					<span className={styles.name}>{user.name}</span>
					<span>·</span>
					<span>@{user.username}</span>
					<span>·</span>
					<span>{createdAt}</span>
				</div>
				<p>{content}</p>
				<div className={styles.buttons}>
					<HeartButton id={id} type='heart' initialStatus={hearted} initialCount={heartCount} />
					{/* <CommentButton onClick={() => alert('comment')} count={comment_count} /> */}
					<RetickButton id={id} type='retick' initialStatus={reticked} initialCount={retickCount} />
				</div>
			</div>
		</div>
	</div>
}