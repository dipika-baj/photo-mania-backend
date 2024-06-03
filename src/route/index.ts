import { authRouter } from "./auth.route";
import { postRouter } from "./post.route";
import { meRouter } from "./me.route";

const routers = {
  ["auth"]: authRouter,
  ["post"]: postRouter,
  ["me"]: meRouter,
};

export { routers };
