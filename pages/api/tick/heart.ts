import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";
import { verifyBody } from "../../../api-helpers/type-check";

export interface ResponseHeart {
  count: number;
  status: boolean;
}

export default createEndpoint<ResponseHeart>({
  POST: async ({ req, res, db }) => {
    const { id } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    const { tick, hasLikedTick } = await db.$transaction(async (tx) => {
      const heartCount = await tx.heart.count({
        where: {
          tick_id: id,
          user_id: user.id,
        },
      });
      const hasLikedTick = heartCount > 0;
      const delta = hasLikedTick ? -1 : 1;

      let tick = await tx.tick.update({
        where: { id },
        data: { heart_count: { increment: delta } },
      });

      if (tick.heart_count < 0) {
        tick = await tx.tick.update({
          where: { id },
          data: { heart_count: 0 },
        });
      }

      if (hasLikedTick) {
        await tx.heart.deleteMany({
          where: {
            tick_id: id,
            user_id: user.id,
          },
        });
      } else {
        await tx.heart.create({
          data: {
            tick_id: id,
            user_id: user.id,
          },
        });
      }
      return { tick, hasLikedTick };
    });

    res.status(200).json({ count: tick.heart_count, status: !hasLikedTick });
  },
});
