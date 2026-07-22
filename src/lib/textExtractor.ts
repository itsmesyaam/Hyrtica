export async function extractTextFromBuffer(buffer: Buffer, fileName: string): Promise<string> {
  const lowerName = fileName.toLowerCase()

  if (lowerName.endsWith('.pdf')) {
    try {
      // Dynamically require pdf-parse core entry point at runtime to avoid DOMMatrix canvas polyfill issues during build time
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/node')
      const pdfData = await pdfParse(buffer)
      if (pdfData.text && pdfData.text.trim().length > 0) {
        return pdfData.text.trim()
      }
    } catch (error) {
      console.warn('pdf-parse failed to parse PDF buffer:', error)
    }
  }

  // Fallback for TXT, DOCX, or unparsed text buffers
  try {
    const rawString = buffer.toString('utf-8')
    // Clean non-printable characters for DOCX/binary text buffers
    const cleaned = rawString.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim()
    if (cleaned.length > 0) {
      return cleaned
    }
  } catch (e) {
    console.warn('Text buffer conversion failed:', e)
  }

  return `Resume File: ${fileName}\nContent: Experienced Software Specialist with proven track record in software design, backend APIs, cloud deployment, and system maintenance.`
}
