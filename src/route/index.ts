import { authRouter } from "./auth.route";
import { postRouter } from "./post.route";
import { meRouter } from "./me.route";
import { userRouter } from "./user.route";

const routers = {
  ["auth"]: authRouter,
  ["post"]: postRouter,
  ["me"]: meRouter,
  ["user"]: userRouter,
};

export { routers };
