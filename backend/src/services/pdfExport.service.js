// services/pdfExport.service.js
const PDFDocument = require("pdfkit");

class PDFExportService {
    /**
     * Generate PDF from document content
     */
    async generateDocumentPDF(document, user) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: "A4",
                    margin: 50,
                    info: {
                        Title: document.title,
                        Author: user?.username || "GameForge User",
                        Subject: document.type,
                        CreationDate: new Date()
                    }
                });

                const chunks = [];
                doc.on("data", chunk => chunks.push(chunk));
                doc.on("end", () => resolve(Buffer.concat(chunks)));

                // Header
                this.addHeader(doc, document);

                // Metadata
                this.addMetadata(doc, document);

                // Content with better HTML parsing
                this.parseAndAddContent(doc, document.content);

                // Footer
                this.addFooter(doc);

                doc.end();
            } catch (error) {
                console.error("PDF generation error:", error);
                reject(error);
            }
        });
    }

    addHeader(doc, document) {
        // Title
        doc.fontSize(24)
            .font("Helvetica-Bold")
            .text(document.title, { 
                align: "center",
                width: doc.page.width - 100
            })
            .moveDown(0.5);

        // Document type
        doc.fontSize(12)
            .font("Helvetica")
            .fillColor("#666666")
            .text(document.type, { 
                align: "center",
                width: doc.page.width - 100
            })
            .moveDown(1);

        // Decorative line
        doc.strokeColor("#dddddd")
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke()
            .moveDown(1);
    }

    addMetadata(doc, document) {
        const startY = doc.y;

        doc.fontSize(10)
            .font("Helvetica")
            .fillColor("#666666");

        // Left column
        doc.text("Created:", 50, startY, { continued: true })
            .font("Helvetica-Bold")
            .fillColor("#000000")
            .text(` ${new Date(document.createdAt).toLocaleDateString()}`, { 
                continued: false,
                width: 200 
            });

        doc.text("Last Updated:", 50, doc.y + 5, { continued: true })
            .font("Helvetica-Bold")
            .fillColor("#000000")
            .text(` ${new Date(document.updatedAt).toLocaleDateString()}`, { 
                continued: false,
                width: 200 
            });

        // Right column
        doc.text("Word Count:", 300, startY, { continued: true })
            .font("Helvetica-Bold")
            .fillColor("#000000")
            .text(` ${document.wordCount}`, { 
                continued: false,
                width: 200 
            });

        doc.text("Reading Time:", 300, doc.y + 5, { continued: true })
            .font("Helvetica-Bold")
            .fillColor("#000000")
            .text(` ${document.readingTime} min`, { 
                continued: false,
                width: 200 
            });

        doc.moveDown(2);
    }

    /**
     * Parse HTML content and add to PDF with proper formatting
     */
    parseAndAddContent(doc, htmlContent) {
        if (!htmlContent) return;

        // Remove script tags for security
        let safeContent = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        
        // Handle different HTML elements
        // First, extract headings
        const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
        let lastIndex = 0;
        let match;

        // We'll process the content sequentially
        const contentParts = [];
        let tempContent = safeContent;

        // Replace headings with markers and extract them
        const headingMatches = [];
        let headingMatch;
        while ((headingMatch = headingRegex.exec(safeContent)) !== null) {
            headingMatches.push({
                tag: `h${headingMatch[1]}`,
                content: headingMatch[2].replace(/<[^>]*>/g, ''), // Remove inner HTML tags
                index: headingMatch.index
            });
        }

        // Replace lists with markers
        const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
        const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
        
        // Process paragraphs
        const paragraphs = safeContent.split(/<\/p>|<br\s*\/?>/i);
        
        for (let para of paragraphs) {
            // Remove opening tags and clean
            para = para.replace(/<[^>]+>/g, '').trim();
            
            if (!para) continue;
            
            // Check if it's a heading
            const isHeading = headingMatches.some(h => h.content === para);
            
            if (isHeading) {
                // Find which heading level
                const heading = headingMatches.find(h => h.content === para);
                const fontSize = {
                    'h1': 20,
                    'h2': 18,
                    'h3': 16,
                    'h4': 14,
                    'h5': 12,
                    'h6': 11
                }[heading.tag] || 14;
                
                doc.fontSize(fontSize)
                    .font("Helvetica-Bold")
                    .fillColor("#000000")
                    .text(para, {
                        align: "left",
                        width: doc.page.width - 100,
                        lineGap: 8
                    })
                    .moveDown(0.5);
            }
            // Check if it's a list item
            else if (para.startsWith('•') || para.startsWith('-') || para.match(/^\d+\./)) {
                doc.fontSize(11)
                    .font("Helvetica")
                    .fillColor("#000000")
                    .text(para, {
                        align: "left",
                        width: doc.page.width - 100,
                        indent: 20,
                        lineGap: 4
                    })
                    .moveDown(0.3);
            }
            // Regular paragraph
            else {
                doc.fontSize(11)
                    .font("Helvetica")
                    .fillColor("#000000")
                    .text(para, {
                        align: "left",  // Changed from "justify" to "left" for better readability
                        width: doc.page.width - 100,
                        lineGap: 6,
                        paragraphGap: 8
                    })
                    .moveDown(0.5);
            }
        }

        // Add a final moveDown to ensure spacing
        doc.moveDown(1);
    }

    addFooter(doc) {
        const pages = doc.bufferedPageRange();

        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);

            // Page number
            doc.fontSize(9)
                .font("Helvetica")
                .fillColor("#999999")
                .text(
                    `Page ${i + 1} of ${pages.count}`,
                    50,
                    doc.page.height - 40,
                    { 
                        align: "center",
                        width: doc.page.width - 100
                    }
                );

            // Generated by
            doc.fontSize(8)
                .fillColor("#cccccc")
                .text(
                    "Generated by GameForge",
                    doc.page.width - 150,
                    doc.page.height - 40,
                    { 
                        width: 100, 
                        align: "right" 
                    }
                );
        }
    }
}

module.exports = new PDFExportService();