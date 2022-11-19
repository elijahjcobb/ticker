"use client";
import styles from "./index.module.css";
import { useCallback, useEffect, useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { ResponseFeedItem } from "../../pages/api/user/feed";
import { Composer } from "../../components/composer";
import { Nut } from "../../components/nut";
import { Ghost } from "../../components/ghost";
import { useFetch } from "../../front-helpers/fetch";
import { useRouter } from "next/navigation";


const GHOSTS: number[] = new Array(10);
for (let i = 0; i < 10; i++) GHOSTS[i] = i;

export default function HomePage() {

	const router = useRouter();
	const { data, error } = useFetch<ResponseFeedItem[]>({ path: "/user/feed" })

	if (error) router.push('/sign-in');

	const [feed, setFeed] = useState<ResponseFeedItem[]>([]);
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const handleAddTick = useCallback((feedItem: ResponseFeedItem) => {
		setFeed(v => [
			feedItem,
			...v
		]);
		window.scrollTo({ top: 0 });
	}, []);

	useEffect(() => {
		if (data) setFeed(data);
	}, [data]);

	if (!data) return <>
		<Ghost height={380} />
		{GHOSTS.map(v => <Ghost key={v} />)}
	</>

	return <>
		<Composer onCreateTick={handleAddTick} />
		<div className={styles.ticks} ref={parent}>
			{feed.map(feedItem => <Nut {...feedItem} key={feedItem.key} />)}
		</div>
	</>
}