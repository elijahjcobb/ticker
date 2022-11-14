import clsx from "clsx";
import { MouseEvent, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import { IoHeartOutline, IoHeart, IoChatbubbleOutline } from "react-icons/io5";
import { HiOutlineSpeakerphone, HiSpeakerphone } from 'react-icons/hi';
import styles from "./index.module.css";
import { fetcher } from "../../front-helpers/fetch";
import type { ResponseHeart } from "../../pages/api/tick/heart";
import { useDebounce } from "../../front-helpers/debounce";
import { useDependencyEffect } from "../../front-helpers/use-dependency-effect";
import { AcornIcon } from "../icons/icon";

const COLOR_MAP = {
	heart: 'pri',
	comment: 'pri',
	retick: 'tri'
}

export function GenericButton({
	type,
	onClick,
	count,
	toggled = false,
	disabled = false,
	children
}: PropsWithChildren<{
	type: keyof typeof COLOR_MAP,
	onClick: () => void;
	count: number;
	toggled?: boolean;
	disabled?: boolean
}>) {

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
			disabled={disabled}
			onClick={handleClick}
			className={clsx(styles.button, customClass, toggled && styles.toggled)}>
			<div className={styles.iconContainer}>
				{children}
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
	initialCount,
	initialStatus,
	useAcorn = false,
}: {
	type: keyof typeof COLOR_MAP,
	icon: IconType,
	activeIcon?: IconType,
	useAcorn?: boolean;
	id: string,
} & Props) {

	const [count, setCount] = useState(initialCount);
	const [isToggled, setIsToggled] = useState(initialStatus);
	const debouncedToggle = useDebounce(isToggled);
	const Icon = useMemo(() => isToggled ? activeIcon : icon, [isToggled, icon, activeIcon]);

	useDependencyEffect(() => {
		fetcher<ResponseHeart>({
			url: `/tick/${type}`,
			method: "post",
			body: { id }
		}).then(res => {
			setCount(res.count);
		}).catch(e => {
			console.error(e)
			setCount(initialCount);
		});
	}, [debouncedToggle]);


	const handleClick = useCallback(() => {
		setIsToggled(v => !v);
	}, []);

	return <GenericButton
		onClick={handleClick}
		count={count}
		type={type}
		toggled={isToggled}
	>
		{useAcorn ? (<AcornIcon size={22} enabled={isToggled} />) : (<Icon size={22} />)}
	</GenericButton>
}

interface Props {
	initialCount: number;
	initialStatus: boolean;
	id: string;
	type: 'retick' | "heart";
}

export function HeartButton(props: Props) {
	return <GenericToggleableButton
		icon={IoHeartOutline}
		activeIcon={IoHeart}
		useAcorn
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
		type="comment"
		onClick={onClick}
		count={count}
	>
		<IoChatbubbleOutline size={22} />
	</GenericButton>
}

export function RetickButton(props: Props) {
	return <GenericToggleableButton
		icon={HiOutlineSpeakerphone}
		activeIcon={HiSpeakerphone}
		{...props}
	/>
}