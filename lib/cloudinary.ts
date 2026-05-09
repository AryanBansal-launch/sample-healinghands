import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadImage = async (
  file: string,
  folder: string = "healinghands"
) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const uploadVideo = async (
  file: string,
  folder: string = "healinghands"
) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "video",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw error;
  }
};

export async function destroyMedia(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
  return result as { result?: string };
}

export const deleteImage = async (publicId: string) => {
  try {
    return await destroyMedia(publicId, "image");
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};
