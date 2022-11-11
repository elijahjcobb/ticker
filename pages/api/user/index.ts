import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";

export default createEndpoint<{
  id: string;
  username: string;
}>({
  GET: async ({ req, res }) => {
    const user = await verifyUser(req);
    res.json({
      username: user.username,
      id: user.id,
    });
  },
});
