import { useFetch } from "../../front-helpers/fetch";
import type { ResponseUser } from "../../pages/api/user";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Ghost } from "../ghost";

export function UserAvatar(): JSX.Element | null {
	const { data: user, error } = useFetch<ResponseUser>({ path: "/user" })
	if (error) return <Button href="/sign-up" value="Sign Up" />;
	return !user ?
		<Ghost height={64} width={64} borderRadius={32} />
		: <Avatar size={64} name={user.name} id={user.id} />
}