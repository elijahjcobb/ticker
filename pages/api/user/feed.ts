import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { generateKey } from "../../../api-helpers/generate-key";
import { verifyUser } from "../../../api-helpers/token";

type Type = "tick" | "comment" | "retick" | "heart";
export interface RawRow {
  type: Type;
  comment_content: null | string;
  comment_id: null | string;
  tick_id: string;
  created_at: Date;
  id: string;
  user_id: string;
  user_name: string;
  user_username: string;
  user_follow_count: number;
  user_follower_count: number;
  tick_content: string;
  tick_heart_count: number;
  tick_comment_count: number;
  tick_retick_count: number;
  tick_updated_at: Date;
  tick_user_id: string;
  tick_created_at: Date;
  tick_user_follow_count: number;
  tick_user_follower_count: number;
  tick_user_username: string;
  tick_user_name: string;
  has_hearted: null | number;
  has_reticked: null | number;
}

export interface FeedItem {
  key: string;
  event: {
    type: Type;
    id: string;
    content: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string;
      username: string;
      followCount: number;
      followerCount: number;
    };
  };
  tick: {
    id: string;
    content: string;
    heartCount: number;
    retickCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    hearted: boolean;
    reticked: boolean;
    user: {
      id: string;
      name: string;
      username: string;
      followCount: number;
      followerCount: number;
    };
  };
}

export default createEndpoint<FeedItem[]>({
  GET: async ({ req, res, db }) => {
    const user = await verifyUser(req);
    const feed = (await db.$queryRawUnsafe(`SELECT *
FROM   (SELECT 'retick'       AS type,
               NULL           AS comment_content,
               NULL           AS comment_id,
               retick.tick_id AS tick_id,
               retick.created_at,
               retick.user_id
        FROM   public.retick retick
        UNION ALL
        SELECT 'heart'       AS type,
               NULL          AS comment_content,
               NULL          AS comment_id,
               heart.tick_id AS tick_id,
               heart.created_at,
               heart.user_id
        FROM   public.heart heart
        UNION ALL
        SELECT 'comment'       AS type,
               content         AS comment_content,
               CAST (comment.id AS TEXT) AS comment_id,
               comment.tick_id AS tick_id,
               comment.created_at,
               comment.user_id
        FROM   public.comment comment
        UNION ALL
        SELECT 'tick'  AS type,
               NULL    AS comment_content,
               NULL    AS comment_id,
               tick.id AS tick_id,
               tick.created_at,
               tick.user_id
        FROM   public.tick tick) raw_data
       JOIN (SELECT id             AS user_id,
                    name           AS user_name,
                    username       AS user_username,
                    follow_count   AS user_follow_count,
                    follower_count AS user_follower_count
             FROM   public.user) u
         ON raw_data.user_id = u.user_id
       JOIN (SELECT id       AS tick_id,
                    content       AS tick_content,
                    heart_count   AS tick_heart_count,
                    comment_count AS tick_comment_count,
                    retick_count  AS tick_retick_count,
                    updated_at    AS tick_updated_at,
                    user_id       AS tick_user_id,
                    created_at    AS tick_created_at
             FROM   public.tick) AS tick
         ON tick.tick_id = raw_data.tick_id
       JOIN (SELECT id,
                    follow_count   AS tick_user_follow_count,
                    follower_count AS tick_user_follower_count,
                    username       AS tick_user_username,
                    name           AS tick_user_name
             FROM   public.user) tick_u
         ON tick_u.id = tick.tick_user_id
       left JOIN (select count(*) as has_hearted, tick_id as h_id from public.heart where public.heart.user_id='${user.id}' GROUP BY tick_id) heart_status
         ON heart_status.h_id=raw_data.tick_id
       left JOIN (select count(*) as has_reticked, tick_id as rt_id from public.retick where public.retick.user_id='${user.id}' GROUP BY tick_id) retick_status
         ON retick_status.rt_id=raw_data.tick_id
ORDER  BY created_at DESC
LIMIT  300;`)) as RawRow[];
    res.json(
      feed.map((raw) => ({
        key: generateKey({
          userId: raw.user_id,
          tickId: raw.id,
          tickUserId: raw.tick_user_id,
          type: raw.type,
        }),
        event: {
          type: raw.type,
          id:
            raw.comment_id ??
            (raw.type === "tick"
              ? raw.tick_id
              : `${raw.tick_id}:${raw.user_id}`),
          content: raw.comment_content,
          createdAt: raw.created_at.toUTCString(),
          user: {
            id: raw.user_id,
            name: raw.user_name,
            username: raw.user_username,
            followCount: raw.user_follow_count,
            followerCount: raw.user_follower_count,
          },
        },
        tick: {
          id: raw.tick_id,
          content: raw.tick_content,
          heartCount: raw.tick_heart_count,
          retickCount: raw.tick_retick_count,
          commentCount: raw.tick_comment_count,
          hearted: (raw.has_hearted ?? 0) > 0,
          reticked: (raw.has_reticked ?? 0) > 0,
          createdAt: raw.tick_created_at.toUTCString(),
          updatedAt: raw.tick_updated_at.toUTCString(),
          user: {
            id: raw.tick_user_id,
            name: raw.tick_user_name,
            username: raw.tick_user_username,
            followCount: raw.tick_user_follow_count,
            followerCount: raw.tick_user_follower_count,
          },
        },
      }))
    );
  },
});
