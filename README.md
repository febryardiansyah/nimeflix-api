# OtakuDesu API
<p align="center">
<img alt="GitHub issues" src="https://img.shields.io/github/issues/Kaede-No-Ki/otakudesu-rest-api">
<img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/Kaede-No-Ki/otakudesu-rest-api">
<img alt="GitHub" src="https://img.shields.io/github/license/Kaede-No-Ki/otakudesu-rest-api"> 
<img alt="GitHub stars" src="https://img.shields.io/github/stars/Kaede-No-Ki/otakudesu-rest-api">
<img alt="GitHub forks" src="https://img.shields.io/github/forks/Kaede-No-Ki/otakudesu-rest-api">
<img alt="GitHub watchers" src="https://img.shields.io/github/watchers/Kaede-No-Ki/otakudesu-rest-api">
<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/Kaede-No-Ki/otakudesu-rest-api">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Kaede-No-Ki/otakudesu-rest-api">
</p>

**Unofficial API of** : https://otakudesu.org/

## TODO
- [x] Home
  - [x] Ongoing
  - [x] complete
- [x] Ongoing Pagination
- [x] Complete Pagination
- [x] Schedule
- [x] Genre List
  - [x] Anime By Genre
- [x] Detail Anime
  - [x] Detail
  - [x] Batch
  - [x] Episode List
- [x] Detail Batch
  - [x] Download Link
- [x] Detail Episode
  - [x] Download Link
  - [x] Streaming Link
- [x] Search

## Usage
1. Clone this repository
```bash
git clone https://github.com/Kaede-No-Ki/otakudesu-rest-api.git
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

## Project Structure
```
server.ts               # entrypoint: loads env, starts express
src/
  app.ts                 # express app wiring (middleware, routes, 404)
  config/                # env loading, otakudesu source urls
  routes/                # express routers, grouped by domain
  controllers/            # thin HTTP handlers (request/response only)
  services/
    scrapers/             # cheerio HTML parsing per page type
    episodeStream.service.ts  # resolves episode stream/mirror embed urls
  types/                  # shared domain interfaces (AnimeDetail, EpisodeDetail, etc.)
  utils/                  # response envelope, error helpers, shared parsers
dist/                    # compiled JS output (npm run build), gitignored
```

This project is written in TypeScript (`strict` mode). Run `npm run build` to type-check and compile to `dist/`, or `npx tsc --noEmit` to only type-check without emitting files.

## API Documentation
__Api Path__ : https://otakudesu-api.herokuapp.com/api/</br>
__API Version__ : v2

| Endpoint | Params | Description |
| -------- | ------ | -----------|
| /home | - | Homepage |
| /complete | - | Complete/Finished Anime |
| /complete/page/${page} | pageNumber | Complete Pagination |
| /ongoing | - | Ongoing Anime |
| /schedule | - | Schedule Anime |
| /genres | - | Genre List |
| /genres/${id}/page/${page} | id,pageNumber | Show Anime by Genre |
| /search/${query} | query | Search Anime |
| /anime/${id} | id | Detail Anime |
| /batch/${id} | id | Detail Anime's Batch |
| /eps/${id} | id | Detail Anime's Episode |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://github.com/Kaede-No-Ki/otakudesu-rest-api/blob/master/LICENSE)