import { TObject, TStandard } from "@elijahjcobb/typr";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { setCookie } from "cookies-next";
import { APIError } from "../../../api-helpers/api-error";
import { createEndpoint } from "../../../api-helpers/create-endpoint";
import { createPassword } from "../../../api-helpers/password";
import { tokenSign, TOKEN_AGE_SEC } from "../../../api-helpers/token";
import { verifyBody } from "../../../api-helpers/type-check";

export default createEndpoint<{
  token: string;
}>({
  POST: async ({ req, res, db }) => {
    const { username, password: rawPassword } = verifyBody(
      req,
      TObject.follow({
        username: TStandard.string,
        password: TStandard.string,
      })
    );

    if (rawPassword.length < 8)
      throw new APIError(
        406,
        "C'mon, at least make your password 8 characters long..."
      );

    const password = await createPassword(rawPassword);

    try {
      const user = await db.user.create({
        data: {
          username,
          password,
        },
      });

      const token = await tokenSign(user.id);
      setCookie("token", token, { req, res, maxAge: TOKEN_AGE_SEC });
      res.json({ token });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new APIError(406, "Someone already took that username.");
        }
      }
      throw e;
    }
  },
});
