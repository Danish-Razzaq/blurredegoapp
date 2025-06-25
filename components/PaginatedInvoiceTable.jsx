import Image from 'next/image';
import React from 'react';

const PaginatedInvoiceTable = ({ items, columns, itemsPerPage = 6}) => {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const pageItems = Array.from({ length: totalPages }, (_, pageIndex) => {
    const startIdx = pageIndex * itemsPerPage;
    return items.slice(startIdx, startIdx + itemsPerPage);
  });

  const PageHeader = () => (
    <div className="flex flex-col items-center justify-center gap-2 py-8 print-page-header">
      <Image 
        className="mr-1 pt-3 flex items-center justify-self-center" 
        alt="Blurred Ego" 
        src="/assets/imgs/template/logo.png" 
        width={158} 
        height={55} 
      />
      <p className="text-2xl font-semibold uppercase underline">Invoice</p>
    </div>
  );

  return (
    <div className="invoice-container">
      {/* Web View - Show all items in one table */}
      <div className="web-view">
        <table className="table-striped w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={column?.class}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td className="ltr:text-right rtl:text-left">${item.price}</td>
                <td className="ltr:text-right rtl:text-left">${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Print View - Paginated tables */}
      <div className="print-view hidden">
        {pageItems.map((pageContent, pageIndex) => (
          <div key={pageIndex} className={` ${pageIndex > 0 ? 'page-break-before' : ''}`}>
            {pageIndex > 0 && <PageHeader />}
            <div className="table-responsive">
              <table className="table-striped w-full">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className={column?.class}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageContent.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td className="ltr:text-right rtl:text-left">${item.price}</td>
                      <td className="ltr:text-right rtl:text-left">${item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pageIndex < pageItems.length - 1 && (
                <div className="flex justify-end mt-4 text-sm text-gray-500">
                  Continued on next page...
                </div>
              )}


            </div>
          

          </div>
        ))}
      </div>
    </div>
  );
};

export default PaginatedInvoiceTable;