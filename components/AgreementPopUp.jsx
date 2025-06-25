import Image from 'next/image';
import React from 'react';
import { ImCross } from 'react-icons/im';

const TermsAndPoliciesPopup = ({ onClose }) => {
    return (
        <main className="relative">
            <div className="absolute inset-0 z-10 bg-black bg-opacity-50">
                <div className="fixed inset-0   flex items-center justify-center bg-black bg-opacity-50">
                    <div id="popup-body" className="sm:max-w-[58%]  max-w-[90%] absolute z-10 mt-4 h-[80vh]  w-full overflow-y-auto rounded-lg bg-white shadow-lg lg:mx-28">
            <button className="color-brand-1 absolute  sm:right-12 right-2  top-2 z-10 cursor-pointer mt-4 rounded px-4 py-2 font-semibold text-white transition duration-300 hover:text-red-300" onClick={onClose}>
                                <ImCross className="h-5 w-5" />
                            </button>
                        <div className="flex items-center justify-between"></div>

                        <div className="print-header absolute w-full">
                            <img src="/assets/images/invoiceheader.svg" alt="logo" className="h-full w-full" />
                        </div>
                     
                            <div className="flex flex-col items-center justify-center gap-2   pt-24   max-lg:pt-16 ">
                                <Image className="mr-1 flex  items-center justify-self-center  " alt="Blurred Ego" src="/assets/imgs/template/logo.png" width={158} height={55} />
                            </div>
                   
                          

                        <div className="container mx-auto  lg:px-20 max-lg:px-4 ">
                            <h2 className="color-brand-1  mt-4 text-center text-xl font-semibold">Membership Agreement</h2>

                            <p className="my-4">
                                We are committed to upholding the highest standards of business ethics in our dealings with Blurred Ego (BE) and all its members. Non-compliance with these
                                standards may result in the termination of membership.
                            </p>

                            <ol className="ol-custom">
                                <li>
                                    <b>Support for Fellow Members</b>
                                    <p>We pledge to provide full support to fellow members whenever possible.</p>
                                </li>
                                <li>
                                    <b>Standard Operating Procedures</b>
                                    <p>We will utilize standard operating and security procedures in our interactions and, when feasible, engage in mutually agreed contracts or written agreements.</p>
                                </li>
                                <li>
                                    <b>Timely Payment of Invoices</b>
                                    <p>We commit to settling all debit notes and invoices between members within the agreed timeframe.</p>
                                </li>
                                <li>
                                    <b>Active Participation in Sales</b>
                                    <p>We will actively engage in sales initiatives that promote mutual growth.</p>
                                </li>
                                <li>
                                    <b>Respect for Confidentiality</b>
                                    <p>We will respect the existing customer bases and confidential business information of other members, refraining from any back-selling activities.</p>
                                </li>
                                <li>
                                    <b>Responsibility for Freight Charges</b>
                                    <p>
                                        We acknowledge that the destination agent is responsible for the protection and remittance of all freight collect charges. Granting credit to a consignee is at
                                        the sole risk of the destination agent, unless otherwise agreed.
                                    </p>
                                </li>
                                <li>
                                    <b>Accountability for Branch Offices</b>
                                    <p>
                                        We recognize that our company, as registered within the network, is accountable for all branch offices, both financially and ethically, regardless of their
                                        membership status with Blurred Ego. Payment protection applies only to registered offices within Blurred Ego.
                                    </p>
                                </li>
                                <li>
                                    <b>Prompt Communication</b>
                                    <p>We commit to responding to all communications within 24 hours and providing detailed rate quotations in a timely manner.</p>
                                </li>
                                <li>
                                    <b>Compliance with Legal Standards</b>
                                    <p>
                                        We will ensure that our operations are adequately staffed to provide the highest level of service and will not engage in activities that we know or should
                                        reasonably know violate the laws of the importing, exporting, or transiting countries.
                                    </p>
                                </li>
                                <li>
                                    <b>Compliance with Shipping Advisories and Agreement</b>
                                    <p>
                                        I will operate in accordance with all documented shipping advisories and adhere to any existing written agreements or contracts between my company and other
                                        members.
                                    </p>
                                </li>
                                <li>
                                    <b>Profit Sharing and Charge Communication</b>
                                    <p>
                                        I will share profits in accordance with prior agreements or written agency contracts with other members. For any unforeseen charges, such as storage, demurrage,
                                        and fines, I will ensure these are communicated at cost, accompanied by official invoices or receipts.
                                    </p>
                                </li>
                                <li>
                                    <b>Solicitation Policy</b>
                                    <p>I will refrain from soliciting competitive bids from multiple members within our network in the same market.</p>
                                </li>
                                <li>
                                    <b>Commitment to Sharing Sales Leads</b>
                                    <p>
                                        I will actively contribute to the success of fellow members by providing a minimum of three genuine sales leads per month, fostering a mutually beneficial
                                        business environment.
                                    </p>
                                </li>
                                <li>
                                    <b>Reimbursement Commitment</b>
                                    <p>I will honor and reimburse any funds or disbursements made on my behalf by a fellow member.</p>
                                </li>
                                <li>
                                    <b>Reporting Responsibilities</b>
                                    <p>I acknowledge my responsibility to inform Blurred Ego of any delinquencies and to report any disputes, financial or otherwise, involving another Blurred Ego member.</p>
                                </li>
                                <li>
                                    <b>Participation in Dispute Resolution</b>
                                    <p>I will allow Blurred Ego administration to participate in dispute resolution processes by providing documented evidence related to any such disputes.</p>
                                </li>
                                <li>
                                    <b>Commitment to Conference Attendance</b>
                                    <p>I commit to attending the Blurred Ego annual conferences or at least every other conference.</p>
                                </li>
                                <li>
                                    <b>Blurred Ego Business Solicitation Policy</b>
                                    <p>
                                        As a member of Blurred Ego, I will not solicit business from Blurred Ego for other networks or establish and operate my own network without prior written notice to Geo Cargo
                                        Alliance Management.
                                    </p>
                                </li>
                                <li>
                                    <b>Update Responsibility Acknowledgment</b>
                                    <p>I acknowledge my responsibility to promptly inform Blurred Ego of any changes to my company’s name, staff, contact details, or any other relevant information.</p>
                                </li>
                                <li>
                                    <b>FOC Membership Liability Notice</b>
                                    <p>
                                        The FOC membership does not provide financial protection, and Blurred Ego shall not be held liable for any financial losses incurred in association with this
                                        membership.
                                    </p>
                                </li>
                            </ol>
                            <span className=" mt-4 flex max-w-[95%] flex-col gap-4 ">
                                <h6>
                                    We acknowledge our right to terminate our membership with Blurred Ego at any time. Please be advised that no fees will be refunded, either in whole or in part, upon
                                    termination.
                                </h6>
                                <h6>
                                    Additionally, I recognize that the terms and conditions governing our membership may be updated or amended. Any such changes will be communicated through email and
                                    other appropriate channels.
                                </h6>
                                <h6>
                                    I confirm that I have read, understood, and agree to comply with the terms and conditions. Furthermore, I acknowledge that nothing in this agreement or code of
                                    ethics shall be interpreted as restricting competition in the open market or violating any antitrust laws or regulations applicable in any jurisdiction.
                                </h6>
                            </span>
                            
                        </div>

                        {/* Footer Image */}
                        <div className="print-footer  relative">
                            <img src="/assets/images/invoicefooter.svg" alt="footer" className="h-[20%] w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TermsAndPoliciesPopup;
