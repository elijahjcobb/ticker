import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";

export interface ResponseUser {
  id: string;
  username: string;
  name: string;
}

export default createEndpoint<ResponseUser>({
  GET: async ({ req, res }) => {
    const user = await verifyUser(req);
    res.json({
      username: user.username,
      id: user.id,
      name: user.name,
    });
  },
});
