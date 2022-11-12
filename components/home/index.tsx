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

interface Props {
	ticks: ResponseTick[];
	user: ResponseUser;
}

export function Page({ ticks: initialTicks, user }: Props) {

	const [showModal, setShowModal] = useState(false);
	const [ticks, setTicks] = useState<ResponseTick[]>(initialTicks);
	const [parent] = useAutoAnimate<HTMLDivElement>();

	const handleAddTick = useCallback((tick: ResponseTick) => {
		setTicks(v => [
			tick,
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
				{ticks.map(tick => <Tick {...tick} key={tick.id} />)}
			</div>
		</div>
		<Composer onCreateTick={handleAddTick} show={showModal} setShow={setShowModal} />
		<ComposeButton setShow={setShowModal} />
	</div>
}


export const getServerSideProps: GetServerSideProps<Props> = async context => {

	const token = context.req.cookies.token;

	const ticks = await fetcher<ResponseTick[]>({
		url: "/user/feed",
		token
	});

	const user = await fetcher<ResponseUser>({
		url: "/user",
		token
	});

	return {
		props: {
			ticks,
			user
		}
	}
}