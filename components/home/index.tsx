import { GetServerSideProps } from "next"
import { fetcher } from "../../front-helpers/fetch";
import { ResponseTick } from "../../pages/api/tick/[id]";
import { ResponseUser } from "../../pages/api/user";
import { GoSquirrel } from "react-icons/go";
import styles from "./index.module.css";
import { Tick } from "../tick";
import { Composer } from "../composer";
import { ComposeButton } from "../composer/button";
import { useCallback, useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Avatar } from "../avatar";
import type { FeedItem } from "../../pages/api/user/feed";

interface Props {
	feed: FeedItem[];
	user: ResponseUser;
}

export function Page({ feed: initialFeed, user }: Props) {

	const [showModal, setShowModal] = useState(false);
	const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const handleAddTick = useCallback((feedItem: FeedItem) => {
		setFeed(v => [
			feedItem,
			...v
		]);
		window.scrollTo({ top: 0 });
	}, []);

	return <div className={styles.main}>
		<div className={styles.container}>
			<nav className={styles.nav}>
				<div className={styles.navIcon}>
					<GoSquirrel className={styles.icon} />
					<h1>ticker</h1>
				</div>
				<Avatar name={user.name} id={user.id} size={64} />
			</nav>
			<div className={styles.ticks} ref={parent}>
				{feed.map(feedItem => <Tick {...feedItem} key={feedItem.key} />)}
			</div>
		</div>
		<Composer onCreateTick={handleAddTick} show={showModal} setShow={setShowModal} />
		<ComposeButton setShow={setShowModal} />
	</div>
}


export const getServerSideProps: GetServerSideProps<Props> = async context => {

	const token = context.req.cookies.token;

	const feed = await fetcher<FeedItem[]>({
		url: "/user/feed",
		token
	});

	const user = await fetcher<ResponseUser>({
		url: "/user",
		token
	});

	return {
		props: {
			feed,
			user
		}
	}
}