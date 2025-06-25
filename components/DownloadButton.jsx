import { MdCloudDownload } from "react-icons/md";

const DownloadButton = ({ fileUrl, fileName }) => {
   
    const handleDownload = () => {
      if (fileUrl) {
        fetch(fileUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName; // Optional: Customize filename
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Clean up
          })
          .catch((error) => console.error('Error downloading the file:', error));
      } else {
        console.error('No file URL found');
      }
    };
  
    return (
      <MdCloudDownload
        className="w-8 h-8 cursor-pointer"        
        color="#de2910"
        onClick={handleDownload}
      />
    );
  };
  
  export default DownloadButton;