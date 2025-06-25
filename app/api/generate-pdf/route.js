import puppeteer from 'puppeteer';
import axios from 'axios';

export async function POST(request) {
    try {
        const body = await request.json();
        const { jwt, invoiceId, email } = body;
        if (!jwt || !invoiceId || !email) {
            throw new Error('Missing required data');
        }

        const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

        const relatedApplication = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/applications?filters[email][$eq]=${email}&populate=*`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        // If no application is found for the given email, use a default application ID (103023098128)
        // This likely means the invoice is a custom invoice
        const applicationId = relatedApplication?.data.data.length > 0 ? relatedApplication?.data.data[0].id : 103023098128;

        if (applicationId === 103023098128) {
            console.info(`No application found for email: ${email}. This is likely a custom invoice.`);
        }
        console.log('Application ID:', applicationId);

        // Step 1: Launch Puppeteer to generate the PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        let invoicePreviewURL = `${FRONTEND_URL}/components/Application/PreviewInvoice?invoiceId=${invoiceId}&applicationId=${applicationId}&token=${jwt}`;
        // Pass jwt and invoiceId as query parameters to the PreviewInvoice page
        await page.goto(invoicePreviewURL, {
            waitUntil: 'networkidle0',
        });
        // Wait for the #invoice-loaded element, ensuring the data has been rendered
        try {
            await page.waitForSelector('#invoice-loaded', { timeout: 20000 });
        } catch (error) {
            console.log('error', error);
            throw new Error('Invoice page did not load correctly or #invoice-loaded selector not found.');
        }
        // await page.waitForSelector('#invoice-loaded', { timeout: 10000 });

        // Generate PDF from the fully rendered PreviewInvoice page
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();
        // Step 2: Upload the generated PDF to Strapi
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

        // Create FormData and append the Blob
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

        // Step 3: Update the invoice in Strapi
        if(uploadResponse.status === 200) {
        await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`,
            {
                data: {
                    invoiceUrl: uploadedFileUrl,
                    sentToMember: true,
                    invoiceMailTrigger: false,
                    mcMailTrigger: false,
                    pdfEmail: true,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        // Log success
        console.log('Invoice URL updated successfully:', uploadedFileUrl);
    }

        // Step 4: Return a success response
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
