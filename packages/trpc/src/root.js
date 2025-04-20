"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var trpc_1 = require("./trpc");
var post_1 = require("./router/post");
var moments_1 = require("./router/moments");
var recaps_1 = require("./router/recaps");
var user_1 = require("./router/user");
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    post: post_1.postRouter,
    moments: moments_1.momentsRouter,
    recaps: recaps_1.recapsRouter,
    user: user_1.userRouter,
});
