# node-game-template

 * [Local Setup](#local-setup)
 * [Assets and Licenses](#assets-and-licenses)
 * [Libraries](#libraries)

This project is a template for future game projects based on Node.js.
It contains basic implementations for:
 * Easy to use Websocket wrapper for client/ server
 * PlayerData handling for the server
 * MongoDB Connection
 * Inactivity / logoff handling
 * Basic Webpack Configuration
 * Automated Deployment

Basic game relevant features:
 * Lobbies
    * Avatar Select
    * Level Select
    * Kick / Leave
    * Maximum size
 * Game example
    * Phaser example
        * Custom GameObjects
        * Custom ScenePlugins
    * [Tiled](https://www.mapeditor.org/) levels with custom hitboxes
    * Synced in-game position
    * Sounds
    * Scoring
    * Results
 * Highscore Board

All the issues and difficulties found during developmenmt are documented in the [wiki](https://github.com/H0rn0chse/node-game-template/wiki).

## Local Setup
Because of the websocket library used this project uses `yarn` and needs additional efforts to be used in a `npm` only environment.

 * Install all dependencies via `yarn install`
 * Add a `.env` file containing `DB_URL=<MongoDBConnectionString>` replace the `<MongoDBConnectionString>` with the actual connection string provided by MongoDB.
 * Start __local mode__ via `yarn run startLocal`. In the local mode the server serves the `client/index-local.html` and with that all the files in a unbundled way.
 * Start __production mode__ via `yarn start`. In the production mode the server serves the `client/dist/index.html` and with that all the files bundled. Keep in mind to bundle them first with `yarn build`.

The setup steps for deployment are documented in the [wiki](https://github.com/H0rn0chse/node-game-template/wiki).
## Assets and Licenses
* The **code** of this repository is licensed under [MIT](https://opensource.org/licenses/MIT)
* Sprites from [Kenney](www.kenney.nl) licensed under [CC0](http://creativecommons.org/publicdomain/zero/1.0/):
    * Avatars: [Link](https://www.kenney.nl/assets/animal-pack-redux)
    * Background: [Link](https://www.kenney.nl/assets/background-elements)
    * Coin: [Link](https://www.kenney.nl/assets/jumper-pack)
    * Saw + Spikes + Arrow: [Link](https://www.kenney.nl/assets/platformer-pack-industrial)
    * Tiles: [Link](https://www.kenney.nl/assets/platformer-art-extended-tileset)

* Font: [Olive's Font](https://www.1001freefonts.com/olive-s-font.font)
* Please checkout the [Sound Licenses](./client/assets/sound/License.md) for further details.

## Libraries
 * CSS: [github.com/franciscop/picnic](https://github.com/franciscop/picnic)
 * uWebSockets.js + sifrr-server
    * Websocket Handling: [github.com/uNetworking/uWebSockets.js](https://github.com/uNetworking/uWebSockets.js)
    * FileServe: [github.com/sifrr/sifrr-server](https://github.com/sifrr/sifrr/tree/master/packages/server/sifrr-server)
 * ws + express
    * Websocket Handling: [github.com/websockets/ws](https://github.com/websockets/ws)
    * FileServe: [github.com/expressjs/express](https://github.com/expressjs/express)
 * MongoDB Handling: [github.com/Automattic/mongoose](https://github.com/Automattic/mongoose)
 * Game Engine: [github.com/photonstorm/phaser](https://github.com/photonstorm/phaser)
