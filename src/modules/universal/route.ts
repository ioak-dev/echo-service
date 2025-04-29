import express from "express";
import {
  getAll,
  createOne,
  updateOne,
  deleteOne,
  search,
  inferTypes,
  getByReference,
  patchOne,
} from "./service";
import { authorizeApi } from "../../middlewares";

const router = express.Router();

module.exports = function (router: any) {
  router
    .route("/resources-dep/:space/:domain")
    .get(authorizeApi, getAll)
    .post(authorizeApi, createOne);

  router
    .route("/resources-dep/:space/:domain/:reference")
    .get(authorizeApi, getByReference)
    .put(authorizeApi, updateOne)
    .patch(authorizeApi, patchOne)
    .delete(authorizeApi, deleteOne);

  router.post("/resources-dep/:space/:domain/search", authorizeApi, search);

  router.get("/inference/resources-dep", inferTypes);
}
