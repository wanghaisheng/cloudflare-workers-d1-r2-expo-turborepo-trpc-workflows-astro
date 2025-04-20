"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = getDB;
// packages/db/src/client.ts
var schema = require("./schema");
var d1_1 = require("drizzle-orm/d1");
function getDB(env) {
    return (0, d1_1.drizzle)(env.DB, { schema: schema });
}
