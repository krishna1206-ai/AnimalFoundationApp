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
