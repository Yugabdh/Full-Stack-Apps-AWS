import express from 'express';
import axios from 'axios';
import { filterImageFromURL, deleteLocalFiles } from '../util/util.js';

export const router = express.Router();

router.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  // validate missing query parameter
  if (!image_url) {
    return res.status(400).json({
      error: 'image_url query parameter is required'
    });
  }

  // validate invalid URL format
  try {
    new URL(image_url);
  } catch {
    return res.status(400).json({
      error: 'image_url must be a valid URL'
    });
  }

  try {
    // validate if URL points to an image
    const headResponse = await axios.head(image_url);
    const contentType = headResponse.headers['content-type'];

    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(415).json({
        error: 'URL does not point to a valid image'
      });
    }

    const filteredImagePath = await filterImageFromURL(image_url);

    res.status(200).sendFile(filteredImagePath, {}, async () => {
      await deleteLocalFiles([filteredImagePath]);
    });

  } catch (error) {
    console.error(error);
    return res.status(422).json({
      error: 'Unable to process image from the provided URL'
    });
  }
});
