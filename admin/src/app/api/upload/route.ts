import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await cloudinary.v2.uploader.upload_stream(
      { folder: "nextjs_uploads" },
      (error, result) => {
        if (error) {
          console.error(error);
          return NextResponse.json({ error: "Upload failed" }, { status: 500 });
        }
        return result;
      }
    );

    // Cloudinary's upload_stream requires a stream
    const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
      if (error) throw error;
      return result;
    });

    stream.end(buffer);
    

    return NextResponse.json({ message: "Upload success" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
