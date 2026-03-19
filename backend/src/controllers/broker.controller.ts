import { fromNodeHeaders } from "better-auth/node";
import { tryCatch } from "../utils/async-handler";
import { auth } from "../lib/auth";

export default {
  signIn: tryCatch(async (req, res, next) => {
    const { token } = await auth.api.signInEmail({
      body: { email: "", password: "" },
    });

    console.log("Login successfull", token);
    res.send({ token });
  }),
};
