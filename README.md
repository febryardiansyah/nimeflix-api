# Nimeflix API

<p align="center">
<img alt="GitHub issues" src="https://img.shields.io/github/issues/febryardiansyah/nimeflix-api">
<img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/febryardiansyah/nimeflix-api">
<img alt="GitHub" src="https://img.shields.io/github/license/febryardiansyah/nimeflix-api">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/febryardiansyah/nimeflix-api">
<img alt="GitHub forks" src="https://img.shields.io/github/forks/febryardiansyah/nimeflix-api">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/febryardiansyah/nimeflix-api">
</p>

**Unofficial, read-only REST API** that scrapes anime listings, schedules, genres, and episode/streaming links from [otakudesu.blog](https://otakudesu.blog/) and exposes them as clean JSON.

> This project is for educational purposes only. It is not affiliated with Otakudesu, and all anime content belongs to its respective owners/licensors.

## Features
- [x] Home (ongoing + complete highlights)
- [x] Ongoing anime (paginated)
- [x] Complete anime (paginated)
- [x] Release schedule
- [x] Genre list + anime by genre (paginated)
- [x] Search anime
- [x] Anime detail
- [x] Batch download links
- [x] Episode detail (download + streaming mirror links)

## Requirements
- Node.js 18+ (uses modern TypeScript/Express toolchain)
- npm or yarn

## Usage
1. Clone this repository
```bash
git clone https://github.com/febryardiansyah/nimeflix-api.git
cd nimeflix-api
```
2. Install packages (use `yarn` or `npm`)
```bash
npm install
```
3. Configure environment variables
```bash
cp .env.example .env
# then edit .env and set PORT
```
4. Start server
```bash
npm run start   # builds (prestart) then runs the compiled dist/server.js
```
or, for development with auto-reload on change:
```bash
npm run dev      # runs TypeScript directly via tsx, no build step needed
```

By default the server listens on `http://localhost:3000` (configurable via `PORT` in `.env`).

## Project Structure
```
server.ts                 # entrypoint: loads env, starts express
src/
  app.ts                   # express app wiring (middleware, routes, 404)
  config/                  # env loading, otakudesu source urls
  routes/                  # express routers, grouped by domain
  controllers/             # thin HTTP handlers (request/response only)
  services/
    scrapers/               # cheerio HTML parsing per page type
    episodeStream.service.ts  # resolves episode stream/mirror embed urls
  types/                   # shared domain interfaces (AnimeDetail, EpisodeDetail, etc.)
  utils/                   # response envelope, error helpers, shared parsers
dist/                     # compiled JS output (npm run build), gitignored
```

This project is written in TypeScript (`strict` mode). Run `npm run build` to type-check and compile to `dist/`, or `npx tsc --noEmit` to only type-check without emitting files.

## API Documentation
All endpoints are prefixed with `/api` and return JSON in the shape `{ success, message, data }`.

| Endpoint | Params | Description |
| -------- | ------ | ------------ |
| `/api/home` | - | Homepage (ongoing + complete highlights) |
| `/api/complete` | - | Complete/finished anime |
| `/api/complete/page/:page` | `page` | Complete anime pagination |
| `/api/ongoing/page/:page` | `page` | Ongoing anime pagination |
| `/api/schedule` | - | Anime release schedule |
| `/api/genres` | - | Genre list |
| `/api/genres/:id/page/:pageNumber` | `id`, `pageNumber` | Anime by genre |
| `/api/search/:query` | `query` | Search anime |
| `/api/anime/:id` | `id` | Anime detail |
| `/api/batch/:id` | `id` | Anime batch download links |
| `/api/eps/:id` | `id` | Episode detail (download links + mirror list) |
| `/api/eps/:animeId/mirror` *(POST)* | `animeId`, body `mirrorId` | Resolve a mirror's streaming link |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://github.com/febryardiansyah/nimeflix-api/blob/master/LICENSE)
