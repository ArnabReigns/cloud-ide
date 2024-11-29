const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const baseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        template: {
            type: String,
            required: true,
        },
        containerId: {
            type: String,
            required: true,
        },
        port: String,
        image: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Base = mongoose.model("Base", baseSchema);

module.exports = Base;
