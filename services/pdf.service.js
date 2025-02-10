import PDFDocument from 'pdfkit'
import fs from 'fs'

export const pdfService = {
    buildBugsPDF,
}

function buildBugsPDF(bugs, fileName = 'Bugs') {
    try {
        const doc = new PDFDocument()

        const pdfDir = './pdf'
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir)
        }

        const filePath = `${pdfDir}/${fileName}.pdf`
        const writeStream = fs.createWriteStream(filePath)
        doc.pipe(writeStream)

        const fontPath = 'fonts/OpenSans-Regular.ttf'
        if (fs.existsSync(fontPath)) {
            doc.font(fontPath).fontSize(20)
        } else {
            console.warn('Font file not found, using default font.')
            doc.fontSize(20) 
        }

        bugs.forEach((bug) => {
            doc.text(`Title: ${bug.title}`, { align: 'left' })
            doc.text(`Description: ${bug.description}`, { align: 'left' })
            doc.text(`Severity: ${bug.severity}`, { align: 'left' })
            doc.moveDown() 
        })

        doc.end()

        writeStream.on('finish', () => {
            console.log(`PDF created successfully at: ${filePath}`)
        })

        writeStream.on('error', (err) => {
            console.error('Error writing PDF:', err)
        })
    } catch (err) {
        console.error('Error building PDF:', err)
    }
}
