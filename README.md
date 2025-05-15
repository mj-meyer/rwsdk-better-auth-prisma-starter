# redwoodsdk + better‑auth + prisma starter

a slim starter for building cloudflare‑native apps with **redwoodsdk**, **prisma + d1**, and **better‑auth**. the default session storage from the redwoodsdk “standard” template has been removed—authentication is handled entirely by better‑auth’s **email + password** flow, so no durable‑object session state is needed.

> **perfect if you just want: vite‑powered dev, a sqlite db, and a dead‑simple email/password login.**

---

## stack

| layer          | what we use                      | why                                                |
| -------------- | -------------------------------- | -------------------------------------------------- |
| runtime        | cloudflare workers               | edge‑native deployment, built‑in kv/r2/d1 bindings |
| dev server     | vite                             | instant hmr + first‑class typescript               |
| database       | prisma client + d1 (sqlite)      | familiar orm, serverless sqlite at the edge        |
| authentication | better‑auth (`emailAndPassword`) | battle‑tested auth with zero infra                 |

---

## getting started

```bash
npx degit mj-meyer/rwsdk-better-auth-prisma-starter my‑app
cd my‑app
pnpm install
pnpm dev
```

point your browser at the url vite prints ([http://localhost:5173](http://localhost:5173)).

you can go to [http://localhost:5173/protected](http://localhost:5173/protected) to see the protected route in action. it will redirect you to the login page if you’re not logged in.

sign up with an email + password, then log in—no extra setup required.

---

## configuration

### 1 · d1

1. create a database:

   ```bash
   npx wrangler d1 create my‑app‑db
   ```

2. copy the id wrangler prints and paste it into `wrangler.jsonc`:

   ```jsonc
   {
     "d1_databases": [
       {
         "binding": "DB",
         "database_name": "my‑app‑db",
         "database_id": "<your‑db‑id>",
       },
     ],
   }
   ```

3. run the prisma migrations (local dev only):

   ```bash
   pnpm db:migrate
   ```

### 2 · env vars

| variable             | purpose                      |
| -------------------- | ---------------------------- |
| `BETTER_AUTH_SECRET` | used to sign session cookies |
| `BETTER_AUTH_URL`    | full public url of your app  |

---

### 3 · extending authentication

want google, github, or any other social login? better‑auth ships a cli that patches your prisma schema for you:

```bash
npx @better-auth/cli@latest generate
```

that inserts the extra tables/fields your new providers need.

> **important :** the cli’s automatic migration runner only supports _kysely_ at the moment, so we use prisma’s own flow instead.

```bash
pnpm migrate:new   # creates a prisma migration file
pnpm migrate:dev   # applies it to your local d1 database
# or, for production
pnpm migrate:prd
```

see the better‑auth cli docs for details → [https://www.better-auth.com/docs/concepts/cli](https://www.better-auth.com/docs/concepts/cli)

## scripts

| command            | action                                                        |
| ------------------ | ------------------------------------------------------------- |
| `pnpm dev`         | vite dev server **+** workers runtime (hot‑reload everything) |
| `pnpm preview`     | run the built worker locally                                  |
| `pnpm release`     | clean build & publish to Cloudflare via `wrangler deploy`     |
| `pnpm migrate:new` | create a fresh prisma migration                               |
| `pnpm migrate:dev` | apply migrations to your _local_ d1 database                  |
| `pnpm migrate:prd` | apply migrations to the _remote_ d1 database                  |
| `pnpm seed`        | execute `src/scripts/seed.ts` through the worker runtime      |
| `pnpm generate`    | regenerate prisma client + wrangler type definitions          |

---

## release

```bash
pnpm release
```

---

## further reading

- **redwoodsdk docs** · [https://docs.rwsdk.com/](https://docs.rwsdk.com/)
- **better‑auth** · [https://www.better-auth.com/](https://www.better-auth.com/)
