# node-game-template

This project is a template for future game projects based on Node.js.
It contains basic implementations for:
 * Easy to use Websocket wrapper for client/ server
 * PlayerData handling for the server
 * MongoDB Connection
 * Inactivity / logoff handling
 * Basic Webpack Configuration
 * Automated Deployment

Basic game relevant features:
 * Game Lobbies
 * Synced in-game position
 * Highscore Board

All the issues and difficulties found during developmenmt are documented in the [wiki](https://github.com/H0rn0chse/node-game-template/wiki).

## Local Setup
Because of the websocket library used this project uses `yarn` and needs additional efforts to be used in a `npm` only environment.

 * Install all dependencies via `yarn install`
 * Add a `.env` file containing `DB_URL=<MongoDBConnectionString>` replace the `<MongoDBConnectionString>` with the actual connection string provided by MongoDB.
 * Start __local mode__ via `yarn run startLocal`. In the local mode the server serves the `client/index-local.html` and with that all the files in a unbundled way.
 * Start __production mode__ via `yarn start`. In the production mode the server serves the `client/dist/index.html` and with that all the files bundled. Keep in mind to bundle them first with `yarn build`.

The setup steps for deployment are documented in the [wiki](https://github.com/H0rn0chse/node-game-template/wiki).
## Assets and libraries
 * Font: [Olive's Font](https://www.1001freefonts.com/olive-s-font.font)
 * CSS: [github.com/franciscop/picnic](https://github.com/franciscop/picnic)
 * Websocket Handling: [github.com/uNetworking/uWebSockets.js](https://github.com/uNetworking/uWebSockets.js)
 * FileServe: [github.com/sifrr/sifrr-server](https://github.com/sifrr/sifrr/tree/master/packages/server/sifrr-server)
 * MongoDB Handling: [github.com/Automattic/mongoose](https://github.com/Automattic/mongoose)
