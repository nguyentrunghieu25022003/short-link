const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UrlCollectionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  urls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const UrlCollection = mongoose.model("UrlCollection", UrlCollectionSchema);

module.exports = UrlCollection;