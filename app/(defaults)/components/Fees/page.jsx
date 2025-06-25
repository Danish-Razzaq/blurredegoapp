import React from 'react';

const Fees = () => {
    return (
        <div className="max-sm:flex-col container mt-5 flex flex-grow justify-between  gap-4">
            <div className="w-full  rounded shadow-lg">
                <div className="red p-4  text-center">
                    <h3 className="text-white">Types of Membership</h3>
                </div>
                <div className="space-y-3 p-6">
                    <h4>Founding Membership</h4>
                    <p className="text-lg text-gray-500 ">Open to all logistics and freight forwarding companies.</p>
                    <p className="text-gray-500">
                        <strong className="font-bold text-black">Fee:</strong> USD 1,500 per year
                    </p>

                    {/* <h4>Silver Membership</h4>
                    <p className="text-lg text-gray-500 ">Open to all container traders, container manufacturers, container owners, NVOEC, and NVOCC companies.</p>
                    <p>
                        <strong>Fee:</strong> USD 1,500 per year
                    </p>

                    <h4>Gold Membership</h4>
                    <p className="text-lg text-gray-500 ">
                        Ideal for freight forwarding companies, container depots, transport operators, shipping agencies, or entities closely associated with the freight forwarding and logistics
                        industry.
                    </p>
                    <p>
                        <strong>Fee:</strong> USD 1,800 per year
                    </p>
                    <h4>Diamond Membership</h4>
                    <p className="text-lg text-gray-500 ">
                        Exclusively for government agencies, other trade associations, direct shippers, and industry service providers who wish to participate, understand, and support the industry at
                        a higher level.
                    </p>
                    <p>
                        <strong>Fee: </strong> Customized based on participation and contribution level.
                    </p> */}
                </div>
            </div>
        </div>
    );
};

export default Fees;
