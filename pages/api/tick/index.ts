import { TObject, TStandard } from "@elijahjcobb/typr";
import { raw } from "@prisma/client/runtime";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { generateKey } from "../../../api-helpers/generate-key";
import { verifyUser } from "../../../api-helpers/token";
import { verifyBody } from "../../../api-helpers/type-check";
import type { FeedItem } from "../user/feed";

export default createEndpoint<FeedItem>({
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
      key: generateKey({
        userId: user.id,
        tickId: tick.id,
        tickUserId: user.id,
        type: "tick",
      }),
      event: {
        type: "tick",
        id: tick.id,
        content: null,
        createdAt: tick.created_at.toUTCString(),
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          followCount: user.follow_count,
          followerCount: user.follower_count,
        },
      },
      tick: {
        id: tick.id,
        content: tick.content,
        heartCount: tick.heart_count,
        retickCount: tick.retick_count,
        commentCount: tick.comment_count,
        hearted: false,
        reticked: false,
        createdAt: tick.created_at.toUTCString(),
        updatedAt: tick.updated_at.toUTCString(),
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          followCount: user.follow_count,
          followerCount: user.follower_count,
        },
      },
    });
  },
});
