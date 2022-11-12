import clsx from "clsx";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { IoHeartOutline, IoHeart, IoChatbubbleOutline } from "react-icons/io5";
import { HiOutlineSpeakerphone, HiSpeakerphone } from 'react-icons/hi';
import styles from "./index.module.css";
import { fetcher } from "../../front-helpers/fetch";

const COLOR_MAP = {
	heart: 'sec',
	comment: 'pri',
	retick: 'tri'
}

export function GenericButton({
	type,
	icon: Icon,
	onClick,
	count,
	toggled = false
}: {
	type: keyof typeof COLOR_MAP,
	icon: IconType,
	onClick: () => void;
	count: number;
	toggled?: boolean
}) {

	const handleClick = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
		ev.stopPropagation();
		onClick();
	}, [onClick]);

	const color = useMemo(() => COLOR_MAP[type], [type]);
	const customClass = useMemo(() => `interative-button-${type}`, [type])
	return <>
		<style>{`
			.${customClass} {
				--col: var(--${color});
				--col-rgb: var(--${color}-rgb);
			}
		`}</style>
		<button
			onClick={handleClick}
			className={clsx(styles.button, customClass, toggled && styles.toggled)}>
			<div className={styles.iconContainer}>
				<Icon className={styles.icon} />
			</div>
			<span>{count}</span>
		</button>
	</>
}


export function GenericToggleableButton({
	type,
	icon,
	activeIcon = icon,
	id,
	initialCount
}: {
	type: keyof typeof COLOR_MAP,
	icon: IconType,
	activeIcon?: IconType
	id: string,
} & Props) {

	const [count, setCount] = useState(initialCount);
	const [isToggled, setIsToggled] = useState(false);
	const Icon = useMemo(() => isToggled ? activeIcon : icon, [isToggled, icon, activeIcon]);

	const handleApiCall = useCallback(async () => {
		try {
			const res = await fetcher<{ count: number }>({
				url: `/tick/${type}`,
				method: "post",
				body: { id }
			});

			setCount(res.count);

		} catch (e) {
			console.error(e)
			setCount(initialCount);
			setIsToggled(false);
		}

	}, [id, type, initialCount]);

	const handleClick = useCallback(() => {
		setIsToggled(old => {
			const delta = old ? -1 : 1;
			setCount(v => v + delta);
			handleApiCall();
			return !old
		});
	}, [handleApiCall]);

	return <GenericButton
		onClick={handleClick}
		count={count}
		icon={Icon}
		type={type}
		toggled={isToggled}
	/>
}

interface Props {
	initialCount: number;
	id: string;
	type: 'retick' | "heart";
}

export function HeartButton(props: Props) {
	return <GenericToggleableButton
		icon={IoHeartOutline}
		activeIcon={IoHeart}
		{...props}
	/>
}

export function CommentButton({
	onClick,
	count
}: {
	onClick: () => void;
	count: number;
}) {
	return <GenericButton
		icon={IoChatbubbleOutline}
		type="comment"
		onClick={onClick}
		count={count}
	/>
}

export function RetickButton(props: Props) {
	return <GenericToggleableButton
		icon={HiOutlineSpeakerphone}
		activeIcon={HiSpeakerphone}
		{...props}
	/>
}