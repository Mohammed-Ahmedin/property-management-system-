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
  signUp: tryCatch(async (req, res, next) => {
    const { email, password, name } = req.body;

    const { token,user } = await auth.api.signUpEmail({
      body: { email, password, name, rememberMe: true } as any,
    });

    res.send({ token, user });
    res.send(email);
  }),
  signOut: tryCatch(async (req, res, next) => {
    res.send("Signout done");
  }),
  me: tryCatch(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    res.send(session);
  }),
};
