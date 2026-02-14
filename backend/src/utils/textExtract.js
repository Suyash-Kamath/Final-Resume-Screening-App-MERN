const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const pdfParse = require("pdf-parse");
const { fromPath } = require("pdf2pic");
const mammoth = require("mammoth");
const AdmZip = require("adm-zip");
const iconv = require("iconv-lite");
const openai = require("../config/openai");

function stripHtmlTags(input) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function extractTextFromPdf(filePath) {
  const dataBuffer = await fs.promises.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  if (data && data.text && data.text.trim()) {
    return data.text.trim();
  }

  try {
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "pdf-ocr-"));
    const converter = fromPath(filePath, {
      density: 150,
      saveFilename: `page-${crypto.randomUUID()}`,
      savePath: tmpDir,
      format: "png",
    });
    const pages = await converter.bulk(-1, true);
    const fullOcrText = [];

    for (const page of pages) {
      const imgBuffer = await fs.promises.readFile(page.path);
      const imgBase64 = imgBuffer.toString("base64");
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${imgBase64}` },
              },
              {
                type: "text",
                text: "Please extract all readable text from this image of a resume.",
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });
      const ocrText = response.choices?.[0]?.message?.content?.trim();
      if (ocrText) {
        fullOcrText.push(ocrText);
      }
    }

    return fullOcrText.length ? fullOcrText.join("\n") : "❌ No text found in image using OCR.";
  } catch (err) {
    return `❌ Error during OCR fallback: ${err.message || err}`;
  }
}

async function extractTextFromDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    if (result && result.value && result.value.trim()) {
      return result.value.trim();
    }
  } catch (err) {
    // fall through
  }

  try {
    const zip = new AdmZip(filePath);
    const entry = zip.getEntry("word/document.xml");
    if (entry) {
      const xml = entry.getData().toString("utf8");
      const matches = xml.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
      const text = matches
        .map((m) => m.replace(/<w:t[^>]*>/, "").replace("</w:t>", ""))
        .map((t) => t.trim())
        .filter(Boolean);
      if (text.length) {
        const unique = [];
        const seen = new Set();
        for (const line of text) {
          const key = line.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(line);
          }
        }
        return unique.join("\n").trim();
      }
    }
  } catch (err) {
    // fall through
  }

  return "❌ Unable to extract text from DOCX file. Please ensure the file is not corrupted.";
}

async function extractTextFromDoc(filePath) {
  const encodings = ["utf8", "latin1", "cp1252", "iso-8859-1"];
  for (const encoding of encodings) {
    try {
      const buffer = await fs.promises.readFile(filePath);
      const content = iconv.decode(buffer, encoding);
      const lower = content.toLowerCase();
      if (
        lower.includes("<html") ||
        lower.includes("<body") ||
        lower.includes("<div") ||
        lower.includes("<p") ||
        lower.includes("<table")
      ) {
        const stripped = stripHtmlTags(content);
        if (stripped && stripped.length > 10) {
          return stripped;
        }
      }

      const cleaned = content.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
      if (cleaned && cleaned.length > 50) {
        return cleaned;
      }
    } catch (err) {
      // try next encoding
    }
  }
  return "❌ Unable to extract text from DOC file. Please convert to PDF or DOCX format.";
}

async function extractTextFromImage(filePath) {
  try {
    const imageData = await fs.promises.readFile(filePath);
    const base64Image = imageData.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all the text from this image. Return only the extracted text without any additional formatting or explanations.",
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.1,
    });

    const extractedText = response.choices?.[0]?.message?.content;
    if (extractedText && extractedText.trim()) {
      return extractedText.trim();
    }
    return "❌ Could not extract text from this image. Please ensure the image contains clear, readable text.";
  } catch (err) {
    return `❌ Error extracting text from image: ${err.message || err}`;
  }
}

module.exports = {
  extractTextFromPdf,
  extractTextFromDocx,
  extractTextFromDoc,
  extractTextFromImage,
};
