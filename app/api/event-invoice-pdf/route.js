import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs'; // For debugging purposes (saving PDF locally)

export async function POST(request) {
    try {
        const body = await request.json();
        const { jwt, invoiceId, email, id } = body;

        if (!jwt || !invoiceId || !email || !id) {
            throw new Error('Missing required data');
        }

        // console.log('Request data:', body);

        const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

        // Fetch related application data
        const relatedApplication = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/event-participants?filters[id][$eq]=${id}&populate=*`);
        // console.log('Related Application:', relatedApplication?.data?.data[0]?.attributes);

        if (!relatedApplication.data) throw new Error('Missing application data');

        // Puppeteer: Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        const invoicePreviewURL = `${FRONTEND_URL}/components/eventInvoice/preview/${id}`;
        console.log('Invoice Preview URL:', invoicePreviewURL);

        // Navigate to the invoice preview page
        await page.goto(invoicePreviewURL, { waitUntil: 'networkidle0' });

        // Wait for the page to fully render by checking the presence of #invoice-loaded
        try {
            await page.waitForSelector('#invoice-loaded-event', { timeout: 10000 });
        } catch (error) {
            throw new Error('Invoice page did not load correctly or #invoice-loaded selector not found.');
        }

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true, // Use CSS page size if defined
        });

        // console.log(await page.content());
        // await page.screenshot({ path: 'D:/debug-screenshot.png', fullPage: true });

        // Optional: Save the PDF locally for debugging
        // fs.writeFileSync(`debug-invoice-${invoiceId}.pdf`, pdfBuffer);

        // Close the browser
        await browser.close();

        // Step 2: Upload the PDF to Strapi
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

        const formData = new FormData();
        formData.append('files', pdfBlob, `invoice-${invoiceId}.pdf`);

        const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        const uploadedFileUrl = uploadResponse.data[0]?.url;

        if (!uploadedFileUrl) {
            console.error('Failed to upload file.');
            return new Response('Failed to upload file', { status: 500 });
        }

        const existingInvoiceData = relatedApplication?.data?.data[0]?.attributes?.Invoice_data;
        // console.log('Existing Invoice Data:', existingInvoiceData);

        const updatedInvoiceData = {
            ...existingInvoiceData,
            invoiceUrl: uploadedFileUrl,
            sentToEventInvoice: true,
            pdfEmail: true,
        };
        // console.log('Updated Invoice Data:', updatedInvoiceData);
        if(uploadResponse.status === 200) {
        // Step 3: Update the invoice in Strapi
        await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/event-participants/${invoiceId}`,
            {
                data: {
                    Invoice_data: updatedInvoiceData,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        console.log('Invoice URL updated successfully:', uploadedFileUrl);
    }

        // Return success response
        return new Response(JSON.stringify({ success: true, uploadedFileUrl }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error.message);

        return new Response(`Error generating PDF: ${error.message}`, { status: 500 });
    }
}
