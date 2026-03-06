"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
const express_1 = require("express");
const validation_1 = require("../utils/validation");
function validationMiddleware(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
}
//# sourceMappingURL=validation.middleware.js.map