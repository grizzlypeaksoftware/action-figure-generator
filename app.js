// server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { OpenAI, toFile } = require('openai');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const upload = multer({ storage: multer.memoryStorage() });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// server.js (CommonJS style, assuming you did:
//    const { OpenAI, toFile } = require("openai");
//    const openai = new OpenAI({ apiKey: ... });

app.post("/action-figure", upload.single("photo"), async (req, res) => {
    try {
      const { toyName, tagline, supportingItems, moreInfo } = req.body;
      const basePrompt = `
      Make a picture of a 3D action figure toy, named "${toyName}".
      Make it look like it's displayed in transparent plastic blister packaging.
      ${req.file ? 'Use the uploaded photo as a reference so the figure resembles the subject.' : ''}
      The figure should be excited and happy—cartoonish but neat and comical.
      At the top of the package, show the toy name in large white text: "${toyName}",
      and directly beneath it, the tagline in smaller text: "${tagline}".
      Include supporting items like ${supportingItems} beside the figure.
      Packaging design should be minimalist (cardboard-colored background),
      with a clean retail toy-store aesthetic.
      Add the “Shreck-o” logo in the top right corner.
      The image size is 1024x1024 pixels.
      more info: ${moreInfo}
      `.trim();
  
      let b64Image;
      if (req.file) {
        // wrap your buffer in a File for the edit endpoint
        const imageFile = await toFile(
          req.file.buffer,
          "input.png",
          { type: req.file.mimetype }
        );
  
        // **NOTE: no `response_format` here**
        const editRsp = await openai.images.edit({
          model: "gpt-image-1",
          image: imageFile,
          prompt: basePrompt,
          n: 1,
          size: "1024x1024",
        });
        b64Image = editRsp.data[0].b64_json;
  
        res.json({
          image: b64Image,
          original: req.file.buffer.toString("base64"),
          photoMime: req.file.mimetype,
        });
  
      } else {
        // for text-only generation you can still ask for b64
        const genRsp = await openai.images.generate({
          model: "gpt-image-1",
          prompt: basePrompt,
          n: 1,
          size: "1024x1024",
        });
        b64Image = editRsp.data[0].b64_json;
        res.json({
            image: b64Image,
            original: req.file.buffer.toString("base64"),
            photoMime: req.file.mimetype,
          });
    }
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀  Listening on http://localhost:${PORT}`);
});
