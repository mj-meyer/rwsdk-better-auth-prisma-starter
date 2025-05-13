import { route } from "rwsdk/router";
import { Login } from "./Login";

export const userRoutes = [route("/login", [Login])];
