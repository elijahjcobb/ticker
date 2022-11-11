import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyBody } from "../../../api-helpers/type-check";
import { verifyUser } from "../../../api-helpers/token";

export default createEndpoint({
  POST: async ({ req, res, db }) => {
    const { id, content } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
        content: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    const comment = await db.comment.create({
      data: {
        tick_id: id,
        user_id: user.id,
        content,
      },
    });

    await db.tick.update({
      where: { id },
      data: { comment_count: { increment: 1 } },
    });

    res.status(200).json({ id: comment.id });
  },
});
