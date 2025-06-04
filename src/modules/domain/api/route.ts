import express from "express";
import { Request, Response, NextFunction } from "express";
import {
  create,
  deleteOne,
  getMeta,
  getOne,
  inferTypes,
  patch,
  search,
  update,
  generate
} from "./service";
import { authorizeApi } from "../../../middlewares";

const router = express.Router();
// middleware/transformDomain.ts
function kebabToCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

export const transformDomain = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params && req.params.domain) {
    req.params.domain = kebabToCamelCase(req.params.domain);
  }
  next();
};

module.exports = function (router: any) {
  router
    .route("/resources/:space/:domain")
    .get(authorizeApi, transformDomain, getMeta)
    .post(authorizeApi, transformDomain, create);

  router
    .route("/resources/:space/:domain/:reference")
    .get(authorizeApi, transformDomain, getOne)
    .put(authorizeApi, transformDomain, update)
    .patch(authorizeApi, transformDomain, patch)
    .delete(authorizeApi, transformDomain, deleteOne);

  router.post("/resources/:space/:domain/search", authorizeApi, transformDomain, search);

  router.post("/resources/:space/:domain/generate/:generationId", authorizeApi, transformDomain, generate);

  router.get("/inference/resources", inferTypes);
}