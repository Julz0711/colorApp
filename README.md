# Color Palette Generator

Generate five-color palettes from a theme description or a random selection, then copy colors and a theme snippet into your design workflow.

## Features

- **Prompt-based palettes:** describe a mood such as sunset, cyberpunk, or soft pastels.
- **Model fallback:** the current UI tries `openai/o4-mini` through GitHub Models, then `xai/grok-3-mini` if the first request fails.
- **Random generation:** create a fresh palette with one click.
- **Copy tools:** copy hex values and a generated `@theme` snippet.
- **Request feedback:** loading indicators, model labels, and error messages show what happened.

Built with React, TypeScript, Vite, Radix UI Themes, Tailwind CSS, and the Azure AI Inference REST SDK.

## Run locally

Use Node.js 22.12+ and npm.

```sh
git clone https://github.com/Julz0711/colorApp.git
cd colorApp
npm ci
```

Create `.env.local` with a GitHub token that can access the configured GitHub Models:

```dotenv
VITE_GITHUB_TOKEN=your-token
```

Then start the app:

```sh
npm run dev
```

Open the URL printed by Vite, enter a description, and choose **AI Generate**, or choose **Random**.

**Current implementation:** the AI modules validate the token during import, so it is required at startup even if you only use random generation. Model access and rate limits depend on your GitHub Models account. Because `VITE_*` values are included in browser code, this setup is for local experimentation; a public deployment needs a server-side API proxy to keep the token private.

## Development

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite. |
| `npm run build` | Check TypeScript and build to `dist/`. |
| `npm run preview` | Preview the build. |
| `npm run lint` | Run ESLint. |

## Code map

| File | Responsibility |
| --- | --- |
| [src/App.tsx](src/App.tsx) | Prompt input, random generation, and model fallback. |
| [src/components/Palette.tsx](src/components/Palette.tsx) | Swatches and copyable output. |
| [src/utils/colorUtils.ts](src/utils/colorUtils.ts) | Random colors, HSL helpers, and theme-snippet generation. |
| [src/utils/o4mini.ts](src/utils/o4mini.ts) | Primary GitHub Models request and response parsing. |
| [src/utils/grokmini.ts](src/utils/grokmini.ts) | Fallback model request. |

Other provider experiments remain in `src/utils/`; the app's active flow is defined in `src/App.tsx`.
