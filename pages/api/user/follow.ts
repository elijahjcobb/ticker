import { TObject, TStandard } from "@elijahjcobb/typr";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { APIError } from "../../../api-helpers/api-error";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";
import { verifyBody } from "../../../api-helpers/type-check";

export default createEndpoint({
  POST: async ({ req, res, db }) => {
    const { id: followedUserId } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    await db.follow.create({
      data: {
        followed_user_id: followedUserId,
        user_id: user.id,
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { follow_count: { increment: 1 } },
    });

    await db.user.update({
      where: { id: followedUserId },
      data: { follow_count: { increment: 1 } },
    });

    res.status(200).json({});
  },
});
