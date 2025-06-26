import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="z-50 w-[50vw] max-w-[90vw] rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">{title}</h2>
                <div className="mb-4">{children}</div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-[#30CFCE]">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Modal;
// export default function ExampleComponent() {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleConfirm = () => {
//         // Handle confirmation logic here
//         setIsModalOpen(false);
//     };

//     return (
//         <div className="p-4">
//             <button onClick={handleOpenModal} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
//                 Open Modal
//             </button>

//             <Modal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirm} title="Confirm Action">
//                 <p>Are you sure you want to perform this action?</p>
//             </Modal>
//         </div>
//     );
// }
