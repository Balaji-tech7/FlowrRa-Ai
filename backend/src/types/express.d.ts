import { User } from "../models/user.model";

// this file provides a module augmentation to the express Request type
// by adding an optional `user` property matching our User interface.
// the export ensures this file is treated as a module and the
// augmentation is applied globally.

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
