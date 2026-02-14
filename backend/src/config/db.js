const { MongoClient, GridFSBucket } = require("mongodb");
const env = require("./env");

let client;
let db;
let fsBucket;
let collections;

async function connectDb() {
  if (db) {
    return { db, fsBucket, collections };
  }

  client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  db = client.db("resume_screening");
  fsBucket = new GridFSBucket(db);
  collections = {
    mis: db.collection("mis"),
    recruiters: db.collection("recruiters"),
    resetTokens: db.collection("reset_tokens"),
  };

  return { db, fsBucket, collections };
}

function getCollections() {
  if (!collections) {
    throw new Error("Database not initialized. Call connectDb() first.");
  }
  return collections;
}

function getFsBucket() {
  if (!fsBucket) {
    throw new Error("Database not initialized. Call connectDb() first.");
  }
  return fsBucket;
}

module.exports = {
  connectDb,
  getCollections,
  getFsBucket,
};
