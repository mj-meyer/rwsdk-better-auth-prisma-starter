import { Document } from "@/app/Document";
import { setCommonHeaders } from "@/app/headers";
import { Home } from "@/app/pages/Home";
import { userRoutes } from "@/app/pages/user/routes";
import type { User } from "@prisma/client";
import { prefix, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { auth } from "./lib/auth";

export type AppContext = {
  user: User | null;
};

export default defineApp([
  setCommonHeaders(),
  async ({ ctx, request }) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      ctx.user = session?.user
        ? { ...session.user, image: session.user.image ?? null }
        : null;
    } catch (error) {
      console.error("Session error:", error);
      ctx.user = null;
    }
  },
  route("/api/auth/*", ({ request }) => auth.handler(request)),
  render(Document, [
    route("/", () => new Response("Hello, World!")),
    route("/protected", [
      ({ ctx }) => {
        if (!ctx.user) {
          return new Response(null, {
            status: 302,
            headers: { Location: "/user/login" },
          });
        }
      },
      Home,
    ]),
    prefix("/user", userRoutes),
  ]),
]);
