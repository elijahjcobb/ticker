import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";
import type { ResponseTick } from "./[id]";

export default createEndpoint<ResponseTick[]>({
  GET: async ({ req, res, db }) => {
    await verifyUser(req);
    const ticks = await db.tick.findMany({
      take: 100,
      orderBy: [
        {
          updated_at: "desc",
        },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });
    res.json(ticks);
  },
});
