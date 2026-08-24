# Local admin bootstrap tool

A standalone, local-only page for creating users and granting platform-admin
or organization roles directly against the live Supabase project. This is
how the very first Platform Owner Portal admin gets created — nothing in the
main app can safely self-grant that privilege.

## Setup

```
cp scripts/admin-tool/.env.local.example scripts/admin-tool/.env.local
# fill in SUPABASE_SERVICE_ROLE_KEY from Project Settings -> API
```

`.env.local` is gitignored (`*.local`). Never commit it, never paste the
service_role key into the main app's `.env`, never expose this server
publicly.

## Run

```
pnpm admin-tool
```

Opens on `http://localhost:5959`. From there you can:

- Create a new auth user (email + password, confirmed immediately).
- Grant or revoke platform-admin access for any user.
- Assign an existing user to an organization with a given role.

## Security notes

- Uses the `service_role` key, which bypasses every RLS policy in the
  database — this tool IS the trust boundary, not the app.
- Never runs as part of `pnpm dev` or the production build; it's a
  completely separate process you start manually when needed.
- Not linked from the main app's UI or router.
