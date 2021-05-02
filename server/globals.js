/* eslint-disable no-underscore-dangle */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const __root = path.join(__dirname, "../");

// Choose null for unlimited sized lobbies
export const MAXIMUM_LOBBY_SIZE = null;
