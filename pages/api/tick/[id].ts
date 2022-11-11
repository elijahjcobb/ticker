import { tick } from "@prisma/client";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";

export default createEndpoint<tick>({
  GET: async ({ req, res, db }) => {
    const tickId = req.query.id as string;
    await verifyUser(req);
    const tick = await db.tick.findUniqueOrThrow({ where: { id: tickId } });
    res.json(tick);
  },
});
