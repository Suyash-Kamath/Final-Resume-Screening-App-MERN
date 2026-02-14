const { ObjectId } = require("mongodb");
const { getFsBucket } = require("../config/db");

async function uploadToGridFS(filename, buffer, metadata) {
  const fsBucket = getFsBucket();
  return new Promise((resolve, reject) => {
    const uploadStream = fsBucket.openUploadStream(filename, { metadata });
    uploadStream.end(buffer);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", (err) => reject(err));
  });
}

function openDownloadStream(fileId) {
  const fsBucket = getFsBucket();
  return fsBucket.openDownloadStream(new ObjectId(fileId));
}

module.exports = {
  uploadToGridFS,
  openDownloadStream,
};
