import { useState } from 'react';
import { MdCloudDownload } from 'react-icons/md';
import { ImSpinner2 } from 'react-icons/im'; 

const DownloadButtonForms = ({ fileUrl, fileName }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!fileUrl) {
            console.error('No file URL found');
            return;
        }

        setIsLoading(true); 
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`btn ${
                fileName === 'Conference Brochure'
                    ? 'btn-link-medium bg-white hover:transition-none'
                    : 'btn-brand-1-big'
            } h-14 text-nowrap rounded px-2 font-bold flex items-center justify-center gap-2`}
            style={{ fontSize: fileName === 'Conference Brochure' ? '1rem' : '1.5rem' }}
        >
            {isLoading ? 'Downloading...' : fileName}
            {isLoading ? (
                <ImSpinner2 className="h-6 w-6 animate-spin" color="#de2910" />
            ) : (
                <MdCloudDownload
                    className="h-8 w-8 cursor-pointer pl-1"
                    color={fileName === 'Conference Brochure' ? '#de2910' : 'white'}
                    style={{ transform: 'none', transition: 'none' }}
                />
            )}
        </button>
    );
};

export default DownloadButtonForms;
