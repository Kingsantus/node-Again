const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { default: Packer } = require('docx');

// Function to convert PDF to DOCX
async function pdfToDocx(inputPath, outputPath) {
  const pdfBytes = await fs.promises.readFile(inputPath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const { body } = pdfDoc;
  const docx = new Packer().toBuffer(body);

  await fs.promises.writeFile(outputPath, docx);
}

// Function to convert DOCX to PDF
async function docxToPdf(inputPath, outputPath) {
  const doc = await Packer.toBuffer(fs.readFileSync(inputPath));
  await fs.promises.writeFile(outputPath, doc);
}

// Example usage
const inputPath = 'example.pdf';
const outputPdfPath = path.parse(inputPath).name + '.pdf';
const outputDocxPath = path.parse(inputPath).name + '.docx';

pdfToDocx(inputPath, outputDocxPath)
  .then(() => console.log(`Converted ${inputPath} to ${outputDocxPath}`))
  .catch((err) => console.error(`Error converting ${inputPath} to ${outputDocxPath}: ${err}`));

docxToPdf(outputDocxPath, outputPdfPath)
  .then(() => console.log(`Converted ${outputDocxPath} to ${outputPdfPath}`))
  .catch((err) => console.error(`Error converting ${outputDocxPath} to ${outputPdfPath}: ${err}`));
