import { GetServerSideProps } from "next"
import { fetcher } from "../../front-helpers/fetch";
import { ResponseTick } from "../../pages/api/tick/[id]";
import { ResponseUser } from "../../pages/api/user";
import { GoSquirrel } from "react-icons/go";
import styles from "./index.module.css";
import { Tick } from "../tick";
import { Composer } from "../composer";
import { ComposeButton } from "../composer/button";
import { useState } from "react";

interface Props {
	ticks: ResponseTick[];
	user: ResponseUser;
}

export function Page({ ticks, user }: Props) {

	const [showModal, setShowModal] = useState(false);

	return <div className={styles.main}>
		<div className={styles.container}>
			<nav className={styles.nav}>
				<div className={styles.navIcon}>
					<GoSquirrel className={styles.icon} />
					<h1>ticker</h1>
				</div>
				<div className={styles.profile} />
			</nav>
			<div className={styles.ticks}>
				{ticks.map(tick => <Tick {...tick} key={tick.id} />)}
			</div>
		</div>
		<Composer show={showModal} setShow={setShowModal} />
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