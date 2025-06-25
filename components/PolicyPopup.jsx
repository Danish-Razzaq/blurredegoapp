
  import React from 'react';
  import { ImCross } from "react-icons/im";

  const TermsAndPoliciesPopup = ({ onClose }) => {
    return (
      
      <main className='relative'>
    <div className='absolute inset-0 bg-black bg-opacity-50 z-10'>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div  id="popup-body" className="bg-white mt-4  rounded-lg shadow-lg sm:max-w-[70%]  max-w-[90%] lg:mx-28 w-full overflow-y-auto h-[80vh]">
          <div className="flex justify-between items-center">
             <h2></h2>
            <h2 className="text-xl font-semibold color-brand-1 text-center">Financial Protection Policies</h2> 
          <button
            className="mt-4 px-4 py-2 color-brand-1 text-white font-semibold rounded hover:text-red-300 transition duration-300"
            onClick={onClose}
          >
           <ImCross className='w-5 h-5' />
          </button>
          </div>
          <div className="container mx-auto px-4 p-4 ">
      <h2 className="text-2xl font-bold mb-4 color-brand-1">
        Blurred Ego FINANCIAL PROTECTION FUND TERMS AND CONDITIONS
      </h2>
      <p className="mb-4">
        The Blurred Ego (BE) maintains a Financial Protection Fund to safeguard its members against financial losses related to specific transactions involving cargo movement within the Blurred Ego network.
      </p>

      <h2 className="text-xl font-semibold mb-2 color-brand-1">GENERAL INFORMATION</h2>
      <ul className="list-disc list-inside mb-4">
        <li>This financial protection is a backup benefit designed exclusively for Blurred Ego members to guard against financial losses.</li>
        <li>Coverage is up to USD 10,000 per member per claim, annually.</li>
        <li>A member may submit only one claim per year for the same company.</li>
        <li>This protection is not a credit line or pre-approved credit; it should not be used as such.</li>
        <li>Members should implement their own credit approval procedures to mitigate financial risks and losses.</li>
        <li>Coverage is valid only if the member’s membership is active when the shipment arrives and is completed.</li>
        <li>All members must adhere to these terms and conditions for protection to be valid.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 color-brand-1">FINANCIAL TERMS</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Costs and commercial value of goods are not covered under this plan.</li>
        <li>Only offices listed in the Blurred Ego Directory and with active memberships are protected.</li>
        <li>Claims are only valid if the member’s membership is active when the shipment arrives and is completed, within 30 days of departure, or longer if transit extends beyond 30 days.</li>
        <li>Frequent or negligent claims may result in membership review or suspension.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 color-brand-1">REIMBURSEMENT AND LIMITS</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>Remuneration is capped at USD 10,000 per enrolled company for losses, provided both parties are Blurred Ego members.</li>
        <li>The claimant must take steps to minimize damages. Failure to do so may reduce or nullify the compensation. Blurred Ego reserves the right to recover the amount owed from the claimant.</li>
        <li>All claims must be submitted to Blurred Ego and processed according to the outlined procedures before compensation is considered.</li>
        <li>Only members with active Blurred Ego membership are eligible for coverage.</li>
        <li>Failure to provide complete information may result in claim denial and possible membership termination.</li>
      </ol>

      <h2 className="text-xl font-semibold mb-2 color-brand-1">CLAIM INSTRUCTIONS</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>Submit claims within 90 to 120 days from the date of the pending invoice. Claims outside this period will not be accepted.</li>
        <li>Email claims to <a href="mailto:cathy.ho@Blurred Egohkg.com" className="text-blue-600 underline">cathy.ho@Blurred Egohkg.com</a> with a copy to <a href="mailto:Info@blurredego.com" className="text-blue-600 underline">Info@blurredego.com</a>.</li>
        <li>Payments received during the claim process will be applied to the oldest invoice first.</li>
        <li>Blurred Ego will investigate the claim upon receipt and determine the course of action.</li>
        <li>Membership may be terminated based on the claim’s nature if it violates Blurred Ego guidelines or code of conduct.</li>
        <li>Blurred Ego may involve a dispute resolution process if necessary.</li>
        <li>False information will result in immediate claim rejection.</li>
        <li>Claims processing may take up to 45 days. A settlement agreement will be sent for signature upon approval.</li>
        <li>The settlement agreement must be signed within 14 business days, or the claim will be deemed rejected, and no compensation will be awarded.</li>
      </ol>

      <h2 className="text-xl font-semibold mb-2 color-brand-1">EXCLUSIONS</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Costs related to cargo or containers, and commercial values, are not covered.</li>
        <li>Claims for non-quoted or unapproved charges, improper documentation, or negligence are excluded.</li>
        <li>Invoices with credit terms exceeding 30 days are not covered.</li>
        <li>Additional invoices for services provided to a defaulting member are excluded.</li>
        <li>Losses from chartering fees, insurance-covered payments, nonmembers, currency variations, expropriation, and various other exclusions apply.</li>
        <li>Claims involving illegal activities or sanctions are not covered.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2 color-brand-1">CANCELLATION OF FINANCIAL PROTECTION FUND</h2>
      <p className="mb-4">
        Blurred Ego reserves the right to cancel financial protection for any member not adhering to Blurred Ego guidelines, code of conduct, or fund terms. Updates or changes to these terms will be communicated through our website.
      </p>
      <p className="mb-4">
      By agreeing to these terms and conditions, you acknowledge and accept the above provisions.
      </p>

      <h2 className="text-xl font-semibold mb-2 color-brand-1">Acknowledgment</h2>
      <p className="mb-4">
        By checking the acceptance box, you agree to comply with the terms and conditions as described.
      </p>
    </div>
        
        </div>
      </div>
      </div>
      </main>
    );
  };
  
  export default TermsAndPoliciesPopup;
  
