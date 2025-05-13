"use client";

import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSignUp = () => {
    startTransition(() => {
      authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onRequest: () => setResult("Signing up..."),
          onSuccess: () => {
            setResult("Signup successful!");
            window.location.href = "/protected";
          },
          onError: (ctx) => {
            console.log("error", ctx.error);
            setResult(`Error: ${ctx.error.message}`);
          },
        },
      );
    });
  };

  const handleLogin = () => {
    startTransition(() => {
      authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => setResult("Logging in..."),
          onSuccess: () => {
            setResult("Login successful!");
            window.location.href = "/protected"; // redirect to protected page
          },
          onError: (ctx) => setResult(`Error: ${ctx.error.message}`),
        },
      );
    });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Name (for sign-up)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={isPending}>
        {isPending ? "Logging in..." : "Log In"}
      </button>
      <button onClick={handleSignUp} disabled={isPending}>
        {isPending ? "Signing up..." : "Sign Up"}
      </button>

      {result && <div>{result}</div>}
    </>
  );
}
