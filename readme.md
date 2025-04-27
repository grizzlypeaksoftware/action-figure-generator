# Action-Figure Generator

A minimalist Node.js + Express application that uses OpenAI's **gpt-image-1** model to create blister-pack action figure mockups from user inputs.

The app hosts a single **static HTML** page at `public/index.html` featuring a multi-field form:

- **Toy Name**
- **Tagline**
- **Supporting Items** (comma-separated)
- **More Info** (optional extra prompt details)
- **Reference Photo** (optional image upload)

Upon submission, the server (in **app.js**) uses the **Images Edit** endpoint (when a photo is provided) or **Images Generate** fallback to produce a cartoonish, retail-ready action figure image, displayed live alongside a download button.

---

## Features

- **Action-Figure Generation**: Customize name, tagline, items, extra info, and optionally upload a reference image.
- **Image Editing**: Incorporates uploaded photo into the blister-pack output via `images.edit` + `gpt-image-1`.
- **Clean UX**: Responsive two-column layout that stays above the fold on desktop, color accents, spinners, and download links.

---

## Getting Started

### Prerequisites

- Node.js v18+
- An OpenAI API key with access to `gpt-image-1`

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/grizzlypeaksoftware/action-figure-generator
   cd image-gen-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file:
   ```ini
   OPENAI_API_KEY=sk-<your_key_here>
   ```

4. **Start the server**
   ```bash
   node app.js
   ```

5. **Open in browser**
   Visit: `http://localhost:3000/index.html`

---

## API Endpoint

### POST `/action-figure`
Generate a blister-pack action figure.

**Content-Type:** multipart/form-data

**Form fields:**
- `toyName` (string, required)
- `tagline` (string, required)
- `supportingItems` (string, required)
- `moreInfo` (string, optional)
- `photo` (file, optional)

**Response:**
```json
{
  "image": "<base64_png>",   // Generated action figure
  "original": "<base64_png>",// Only if photo was uploaded
  "photoMime": "image/jpeg"  // MIME type of uploaded file
}
```

---

## Project Structure

```
image-gen-demo/
├── public/
│   └── index.html         # Action-figure form UI
├── app.js                 # Express server + OpenAI logic
├── .env                   # API key (gitignored)
├── .gitignore
└── README.md
```

---

## .gitignore

```gitignore
node_modules/
.env
public/*.png
.DS_Store
.vscode/
.idea/
# Logs
npm-debug.log*
```

---

## Dependencies

- **express** — Web server
- **multer** — File upload handling
- **openai** — OpenAI SDK
- **dotenv** — Environment variable loader

---

## License

MIT License

