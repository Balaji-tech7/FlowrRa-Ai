"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const express_1 = require("express");
function errorHandler(err, req, res, next) {
    console.error("global error handler", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
}
//# sourceMappingURL=error.middleware.js.map