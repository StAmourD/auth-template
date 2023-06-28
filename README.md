# auth-svelte-template

## Developing

Installe dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open

# or start the server accessible to the local network
npm run dev -- --host
# or
npm run host
```

## Developing Express Server

Use VS Code debug "Launch Script" or `npm run server`

## Using NoIP for OAuth Callbacks

Setup port forwarding on local router for ports 5000 (Express Server) and 5173 (Svelte Development App)
Replace ddns.net domains with domains setup at https://www.noip.com/

## .ENV
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://REPLACE_ME!.ddns.net:5173/auth/google/callback
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://REPLACE_ME!.ddns.net:5173/auth/github/callback
SECRET=super_secret_string
PROXYSERVER=http://REPLACE_ME!.ddns.net:5000
DB_STRING=mongodb://REPLACE_ME!:27017/db-name
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
