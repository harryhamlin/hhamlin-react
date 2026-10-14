
# React Portfolio

## Copenhagen recommendations

Use Node.js 22.13 or later. Add your Claude key to a local `.env` file:

```dotenv
ANTHROPIC_API_KEY=your-key-here
```

`CLAUDE_API_KEY` is also accepted. Never use a `REACT_APP_` prefix for the key.
`.env` files are ignored by Git; [.env.example](.env.example) lists the available settings.

```bash
npm install
npm start
```

This starts React on port 3000 and the recommendation backend on port 8787.
Open `http://localhost:3000/copenhagen` and expand “Recommend something to me.”
Restart `npm start` after changing the key or backend settings. The default model
is `claude-sonnet-5-5`; set `CLAUDE_MODEL` to use another model that supports web search.

The backend reads all eight lists directly from the same data module as the map.
It uses Claude's native web search, displays original source citations, supports
follow-up questions, and reports when live search fails. Requests have input and
time limits, at most three searches per API round, and at most three rounds if
Claude pauses. Each server process accepts at most 30 recommendation requests per
hour and two concurrently. Calls use your Anthropic account's paid API credits.

For production, deploy `server/` together with `src/data/` and
`src/utils/listMemberships.js` to any Node.js host. Start it with
`npm run start:api`; it accepts the host's `PORT` environment variable. Set the
key as a backend secret. The handler in `server/handler.mjs` also accepts standard
Web `Request` objects and returns `Response` objects for host-specific adapters.

GitHub Pages hosts only the frontend, so it cannot run this API itself. Set
`REACT_APP_COPENHAGEN_API_URL=https://your-backend-host/api/copenhagen/recommend`
when building the frontend, and include the website's origins in the backend's
`COPENHAGEN_ALLOWED_ORIGINS` setting. The default origins already include
`https://www.hhamlin.com`, `https://hhamlin.com`, and localhost port 3000.
The origin check and per-process limits are basic controls, not authentication;
add host-level authentication/rate limits if exposing it beyond personal use.

```bash
CI=true npm test -- --watch=false --runInBand
npm run test:api
npm run build
```

## Description

This challenge highlights a dev portfolio created with React.


  ## Table of Contents
1. [Usage](#usage)
2. [Contributing](#contributing)
3. [Questions](#questions)
  

## Usage

This portfolio can be viewed at <a href="https://www.hhamlin.com">hhamlin.com</a>. On load the application can be viewed as below:

<img src="assets/demo.jpg"/>

## Contributing

<a href="https://github.com/harryhamlin">github.com/harryhamlin</a>

## Questions

For any questions, please reach out directly to <a href="mailto:harryhamlin@gmail.com" target="_blank">harryhamlin@gmail.com</a>.

