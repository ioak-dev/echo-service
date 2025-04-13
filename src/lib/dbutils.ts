import mongoose from "mongoose";

export const getCollection = (
  realm: string,
  collection: any,
  schema: any
): any => {
  const db = mongoose.connection.useDb(`echo_${realm}`);
  return db.model(collection, schema);
};

export const getGlobalCollection = (collection: any, schema: any): any => {
  const db = mongoose.connection.useDb(`echo`);
  return db.model(collection, schema);
};

const defaultSchema = new mongoose.Schema({}, { strict: false });

export const getCollectionByName = (
  realm: string,
  collectionName: string
): any => {
  const db = mongoose.connection.useDb(`echo_${realm}`);
  return db.model(collectionName, defaultSchema, collectionName);
};

export const getGlobalCollectionByName = (collectionName: string): any => {
  const db = mongoose.connection.useDb(`echo`);
  return db.model(collectionName, defaultSchema, collectionName);
};