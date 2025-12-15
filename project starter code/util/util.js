import axios from "axios";
import fs from "fs";
import Jimp from "jimp";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  try {
    const response = await axios.get(inputURL, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Node.js Image Filter Service)"
      }
    });

    const photo = await Jimp.read(Buffer.from(response.data));

    const outpath =
      "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

    await photo
      .resize(256, 256)
      .quality(60)
      .greyscale()
      .writeAsync(outpath);

    return outpath;
  } catch (error) {
    throw error;
  }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
