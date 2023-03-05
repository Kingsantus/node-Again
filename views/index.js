const form = document.querySelector('#uploadForm');
const message = document.querySelector('#message');
const downloadLink = document.querySelector('#downloadLink');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = event.target.file.files[0];

    if (!file) {
        message.textContent = 'Please choose a file';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
              message.textContent = `Conversion successful. Click the link to download:`;
              downloadLink.style.display = 'block';
              downloadLink.textContent = data.filename;
              downloadLink.href = `/${data.filename}`;
            } else {
              message.textContent = `Error: ${data.message}`;
            }
        } else {
            message.textContent = `Error: ${response.status} ${response.statusText}`;
        }
    } catch (err) {
        message.textContent = `Error: ${err.message}`;
    }
});

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
