"use client";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { RequestInfo } from "rwsdk/worker";

export function Home({ ctx }: RequestInfo) {
  const [isPending, startTransition] = useTransition();
  const handleSignOut = () => {
    startTransition(() => {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/user/login";
          },
        },
      });
    });
  };

  return (
    <div>
      <p>
        {ctx.user?.email
          ? `You are logged in as user email ${ctx.user.email}`
          : "You are not logged in"}
      </p>
      <button onClick={handleSignOut} disabled={isPending}>
        {isPending ? "Logging out..." : "Log Out"}
      </button>
    </div>
  );
}
