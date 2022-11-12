import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { verifyUser } from "../../../api-helpers/token";
import { verifyBody } from "../../../api-helpers/type-check";
import { ResponseTick } from "./[id]";

export default createEndpoint<ResponseTick>({
  POST: async ({ req, db, res }) => {
    const user = await verifyUser(req);
    const { content } = verifyBody(
      req,
      TObject.follow({
        content: TStandard.string,
      })
    );

    const tick = await db.tick.create({
      data: {
        user_id: user.id,
        content,
      },
    });

    res.status(200).json({
      ...tick,
      user: {
        username: user.username,
        id: user.id,
        name: user.name,
      },
    });
  },
});
