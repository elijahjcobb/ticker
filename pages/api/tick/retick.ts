import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";
import { verifyBody } from "../../../api-helpers/type-check";
import { ResponseHeart } from "./heart";

export default createEndpoint<ResponseHeart>({
  POST: async ({ req, res, db }) => {
    const { id } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    const { tick, hasReticked } = await db.$transaction(async (tx) => {
      const tickCount = await tx.retick.count({
        where: {
          tick_id: id,
          user_id: user.id,
        },
      });
      const hasReticked = tickCount > 0;
      const delta = hasReticked ? -1 : 1;

      let tick = await tx.tick.update({
        where: { id },
        data: { retick_count: { increment: delta } },
      });

      if (tick.retick_count < 0) {
        tick = await tx.tick.update({
          where: { id },
          data: { retick_count: 0 },
        });
      }

      if (hasReticked) {
        await tx.retick.deleteMany({
          where: {
            tick_id: id,
            user_id: user.id,
          },
        });
      } else {
        await tx.retick.create({
          data: {
            tick_id: id,
            user_id: user.id,
          },
        });
      }
      return { tick, hasReticked };
    });

    res.status(200).json({ count: tick.retick_count, status: !hasReticked });
  },
});
