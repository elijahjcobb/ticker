import styles from "./index.module.css";
import { RiSendPlaneFill } from "react-icons/ri";

export function ComposeButton({
	setShow
}: {
	setShow: (value: boolean) => void
}) {
	return <button className={styles.button} onClick={() => setShow(true)}>
		<RiSendPlaneFill className={styles.buttonIcon} />
	</button>
}