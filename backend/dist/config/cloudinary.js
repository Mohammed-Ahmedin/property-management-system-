"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const arrayBuffer = yield file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({ folder: folder ? folder : "charapia", resource_type: "auto" }, function (err, result) {
            if (err) {
                console.log(err);
                reject({ message: "Some error occured try again" });
                return;
            }
            resolve(result);
        })
            .end(buffer);
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
exports.default = cloudinary_1.v2;
