import { TObject, TStandard } from "@elijahjcobb/typr";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { APIError } from "../../../api-helpers/api-error";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";
import { verifyBody } from "../../../api-helpers/type-check";

export default createEndpoint({
  POST: async ({ req, res, db }) => {
    const { id } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    try {
      await db.heart.create({
        data: {
          tick_id: id,
          user_id: user.id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        throw new APIError(403, "You have already hearted this tick.");
      }
      throw e;
    }

    await db.tick.update({
      where: { id },
      data: { heart_count: { increment: 1 } },
    });

    res.status(200).json({ status: "Success" });
  },
});
