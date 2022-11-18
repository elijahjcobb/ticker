import { TObject, TStandard } from "@elijahjcobb/typr";
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

    const nut = await db.nut.create({
      data: {
        user_id: user.id,
        content,
      },
    });

    res.status(200).json({
      key: generateKey({
        userId: user.id,
        nutId: nut.id,
        nutUserId: user.id,
        type: "tick",
      }),
      event: {
        type: "nut",
        id: nut.id,
        content: null,
        createdAt: nut.created_at.toUTCString(),
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          followCount: user.follow_count,
          followerCount: user.follower_count,
        },
      },
      nut: {
        id: nut.id,
        content: nut.content,
        likeCount: nut.like_count,
        shareCount: nut.share_count,
        commentCount: nut.comment_count,
        liked: false,
        shared: false,
        createdAt: nut.created_at.toUTCString(),
        updatedAt: nut.updated_at.toUTCString(),
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
