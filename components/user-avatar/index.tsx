import { useFetch } from "../../front-helpers/fetch";
import type { ResponseUser } from "../../pages/api/user";
import { Avatar } from "../avatar";
import { Ghost } from "../ghost";

export function UserAvatar(): JSX.Element {
	const { data: user, error } = useFetch<ResponseUser>({ path: "/user" })
	return !user || error ?
		<Ghost height={64} width={64} borderRadius={32} />
		: <Avatar size={64} name={user.name} id={user.id} />
}