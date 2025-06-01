import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ImageRun,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';

const createDocx = async (entries, imageUrl = null) => {
  // Header Title
  const title = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'VM Mart Recruitment 2025',
        bold: true,
        size: 56, // 28 half-points = 14pt
      }),
    ],
    spacing: { after: 300 },
  });

  // Optional Image
  let imageParagraph = null;
  if (imageUrl) {
    try {
      const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());
      imageParagraph = new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: imageBuffer,
            transformation: { width: 500, height: 100 },
          }),
        ],
      });
    } catch (err) {
      console.error('Image load failed:', err);
    }
  }

  // Function to create left-right aligned metadata line
  const makeMetadataLine = (left, right) =>
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: left,
          size: 24,
        }),
        new TextRun({
          text: '\t'.repeat(1),
          size: 24,
        }),
        new TextRun({
          text: right,
          size: 24,
        }),
      ],
      tabStops: [
        {
          type: 'right',
          position: 9000, // Set right tab stop position
        },
      ],
    });

  // Metadata section
  const today = new Date();
  let dayString = today.getDate().toString();
  let Month = String(today.getMonth()+1);
  const metadata = [
    makeMetadataLine('Exam Code: VBMEGA2025', 'Centre Code: 0805'),
    makeMetadataLine('Job: Group S', 'Month: May-June'),
    makeMetadataLine('Exam Duration: 3 Hours', `Result on: ${dayString.padStart(2,"0")}/${Month.padStart(2,"0")}`),
    new Paragraph(''),
  ];

  // Table Header
  const headerRow = new TableRow({
    children: ['Seat No', 'Candidate Name', 'Place of Birth'].map(text =>
      new TableCell({
        width: { size: 33, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            text,
            bold: true,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
        ],
      })
    ),
  });

  // Table Data Rows
  const dataRows = entries.map(({ seatNo, name }) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 33, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ text: seatNo, alignment: AlignmentType.CENTER })],
        }),
        new TableCell({
          width: { size: 33, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ text: name, alignment: AlignmentType.CENTER })],
        }),
        new TableCell({
          width: { size: 33, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ text: 'Earth', alignment: AlignmentType.CENTER })],
        }),
      ],
    })
  );

  // Footer paragraphs
  const footerParagraphs = [
    new Paragraph({
      text: '\nResult to be declared on: vsmega2025.vercel.app',
      spacing: { before: 300 },
    }),
    new Paragraph({
      text:
        '\nNote: All results declared by VSMEGA are final. No grievance can be raised against the marks earned by the candidate.',
      spacing: { before: 100 },
    }),
  ];

  // Compile the document
  const doc = new Document({
    sections: [
      {
        children: [
          title,
          ...(imageParagraph ? [imageParagraph] : []),
          ...metadata,
          new Table({ rows: [headerRow, ...dataRows] }),
          ...footerParagraphs,
        ],
      },
    ],
  });

  // Export and save the DOCX
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'VMega_Results.docx');
};

export { createDocx };
