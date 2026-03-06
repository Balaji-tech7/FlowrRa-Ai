"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const express_1 = require("express");
function notFoundHandler(req, res, next) {
    res.status(404).json({ error: "Not Found" });
}
//# sourceMappingURL=notFound.middleware.js.map