# Animal Foundation App

Two Expo (React Native) apps for World Animal Foundation, kept in one repo so they can share data and a backend.

| Folder | App | Who uses it |
|---|---|---|
| [`admin/`](admin) | **Animal Foundation Admin**: dashboard to view and manage help/contact requests | The foundation owner |
| [`client/`](client) | **World Animal Foundation**: website content (articles, categories, about) and a contact / help form | The public |

The client's contact form uses the same request fields as the admin app (`type`, `name`, `email`, `phone`, `subject`, `message`, `location`). Once a backend is added, requests sent from the client will appear in the admin app.

## Run an app

Each app is its own Expo project. Install and start it from its folder:

```bash
cd admin      # or: cd client
npm install
npx expo start
```

Press `w` to open it in the browser, or scan the QR code with **Expo Go** on your phone.

## Status

- **admin:** uses sample data. Login accepts any email/password until the backend is connected.
- **client:** home content is copied from worldanimalfoundation.org. Articles and category pages load live from the website. The contact form currently sends by email.
- **Next step:** add a shared backend (e.g. Supabase) so client requests go straight into the admin app, and lock down admin login.

## Connect client → admin (Supabase)

Both apps share one Supabase database. The client can only **add** requests; only admins can read or change them.

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Authentication → Users → Add user**: create the owner's email + password.
   Copy the new user's **UID**, then in SQL Editor run:
   ```sql
   insert into public.admins (user_id) values ('PASTE-USER-UID-HERE');
   ```
4. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up".
5. **Project Settings → API**: copy the **Project URL** and **anon public** key.
6. Add them as environment variables, named as in `.env.example`:
   - **Vercel:** in *both* projects → Settings → Environment Variables → `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` → then **Redeploy**.
   - **Local:** copy `admin/.env.example` and `client/.env.example` to `.env` in each folder.

Without these variables the admin app runs in **demo mode** (sample data) and the client form falls back to email.
