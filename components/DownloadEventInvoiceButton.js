'use client';
import axios from 'axios';

export const handleInvoiceDownload = async (invoiceId, email, jwt, id) => {
    if (!jwt || !invoiceId || !email || !id) {
        console.error('Required data is missing.');
        return;
    }

    try {
        const postData = {
            id,
            invoiceId,
            jwt,
            email
        };
        const response = await axios.post('/api/event-invoice-pdf', postData, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const uploadedFileUrl = response.data.uploadedFileUrl;
        if (!uploadedFileUrl) {
            console.error('Failed to generate or upload file.');
            return;
        }

        // // Log success
        // console.log('Invoice URL updated successfully:', uploadedFileUrl);

        // // Trigger the download of the PDF using the URL received from the server
        // const link = document.createElement('a');
        // link.href = uploadedFileUrl;
        // link.setAttribute('download', `invoice-${invoiceId}.pdf`);
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
    } catch (error) {
        console.error('Error generating or uploading the PDF:', error);
    }
};