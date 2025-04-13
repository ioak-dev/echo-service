import express from "express";
import {
  getAll,
  createOne,
  updateOne,
  deleteOne,
  search,
  inferTypes,
  getByReference,
} from "./service";
import { authorizeApi } from "../../middlewares";

const router = express.Router();

module.exports = function (router: any) {
  router
    .route("/resources/:space/:domain")
    .get(authorizeApi, getAll)
    .post(authorizeApi, createOne);

  router
    .route("/resources/:space/:domain/:reference")
    .get(authorizeApi, getByReference)
    .put(authorizeApi, updateOne)
    .delete(authorizeApi, deleteOne);

  router.post("/resources/:space/:domain/search", authorizeApi, search);

  router.get("/inference/resources", inferTypes);
}
