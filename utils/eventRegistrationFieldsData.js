export const stepsCreateFormFields = [
    {
        title: 'Personal Information',
        sections: [
            {
                title: 'Company  Information',
                fields: [
                    { name: 'companyName', label: 'Company Name', type: 'text', validation: { required: 'Company name is required' } },
                    { name: 'position', label: 'Position', type: 'text', validation: {} },
                    { name: 'companyEmail', label: 'Company Email', type: 'email', validation: { required: 'Company Email is required' } },
                    { name: 'telephone', label: 'Telephone', type: 'tel', validation: { required: 'Telephone is required' } },
                    { name: 'mobile', label: 'Mobile', type: 'tel', validation: { required: 'Mobile number is required' } },
                    { name: 'website', label: 'Website', type: 'url' },
                    { name: 'iataNumber', label: 'IATA Number', type: 'text', validation: {} },
                    { name: 'city', label: 'City', type: 'text', validation: { required: 'City is required' } },
                    { name: 'country', label: 'Country', type: 'text', validation: { required: 'Country is required' } },
                    { name: 'address', label: 'Address', type: 'text', validation: { required: 'Address is required' } },
                    { name: 'companyLogo', label: 'Company Logo', type: 'file', validation: { required: 'Company Logo is required' } },
                ],
            },
            {
                title: 'Personal Details',
                fields: [
                    { name: 'title', label: 'Title', type: 'select', options: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'], validation: { required: 'Title is required' } },
                    { name: 'firstName', label: 'First Name ', type: 'text', validation: { required: 'First name is required' } },
                    { name: 'lastName', label: 'Last Name', type: 'text', validation: { required: 'Last name is required' } },
                    {name:'personalEmail',label:'Email',type:'email',validation:{required:'Email is required'}},
                    { name: 'shirtSize', label: 'Shirt Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], validation: { required: 'Shirt size is required' } },
                    { name: 'formalPhoto', label: 'Formal Photo', type: 'file', validation: { required: 'Formal Photo is required' } },
                    // { name: 'registerSpouse', label: ' Register Spouse (USD 900)', type: 'checkbox', validation: {} },
                ],
            },

            {
                title: 'Dietary Restrictions:',
                fields: [
                    { name: 'vegetarian', label: 'Vegetarian', type: 'checkbox', validation: {} },
                    { name: 'vegan', label: 'Vegan', type: 'checkbox', validation: {} },
                    { name: 'halal', label: 'Halal', type: 'checkbox', validation: {} },
                    { name: 'kosher', label: 'Kosher', type: 'checkbox', validation: {} },
                    { name: 'glutenFree', label: 'Gluten-free', type: 'checkbox', validation: {} },
                    { name: 'lactoseIntolerant', label: 'Lactose Intolerant', type: 'checkbox', validation: {} },
                    { name: 'other', label: 'Other', type: 'text', validation: {} },
                    { name: 'allergies', label: 'Food Allergy', type: 'text', validation: {} },
                    // {name: 'otherDietary', label: 'Other Dietary Requirements', type: 'textarea', validation: {}},
                ],
            },

            {
                title: 'Add Additional Attendees',
                fields: [],
            },
        ],
    },
    {
        title: 'Specialization',
        sections: [
            {
                title: 'Specialization',
                fields: [
                    { name: 'airfreight', label: 'Airfreight', type: 'checkbox', validation: {} },
                    { name: 'householdremovals', label: 'Household Removals', type: 'checkbox', validation: {} },
                    { name: 'courier&express', label: 'Courier & Express', type: 'checkbox', validation: {} },
                    { name: 'lclconsolidation', label: 'LCL Consolidation (Wholesale)', type: 'checkbox', validation: {} },
                    { name: 'dangerousgoods', label: 'Dangerous Goods', type: 'checkbox', validation: {} },
                    { name: 'lclforwarding', label: 'LCL Forwarding (Retail)', type: 'checkbox', validation: {} },
                    { name: 'ecommercecargo', label: 'E-Commerce Cargo', type: 'checkbox', validation: {} },
                    { name: 'liquidbulkhandling', label: 'Liquid Bulk Handling', type: 'checkbox', validation: {} },
                    { name: 'eventslogistics', label: 'Events Logistics', type: 'checkbox', validation: {} },
                    { name: 'perishable', label: 'Perishable', type: 'checkbox', validation: {} },
                    { name: 'exhibitionlogistics', label: 'Exhibition Logistics', type: 'checkbox', validation: {} },
                    { name: 'pharmaceutical', label: 'Pharmaceutical', type: 'checkbox', validation: {} },
                    { name: 'exporterofrecords', label: 'Exporter of Records / Importer of Records (EOR / IOR)', type: 'checkbox', validation: {} },
                    { name: 'projectforwarding', label: 'Project Forwarding', type: 'checkbox', validation: {} },
                    { name: 'fclforwarding', label: 'FCL Forwarding', type: 'checkbox', validation: {} },
                    { name: 'silkrouterail', label: 'Silk Route Rail', type: 'checkbox', validation: {} },
                    { name: 'timecritical', label: 'Time Critical', type: 'checkbox', validation: {} },
                ],
            },
            {
                title: 'Vendor only section',
                note: 'Note: This section if FOR VENDORS only. If you are a freight forwarder, you may proceed to the next section below.',
                fields: [
                    { name: 'insurance', label: 'Insurance', type: 'checkbox', validation: {} },
                    { name: 'it', label: 'IT', type: 'checkbox', validation: {} },
                    { name: 'trucking', label: 'Trucking', type: 'checkbox', validation: {} },
                    { name: 'craftingpacking', label: 'Crafting & Packing', type: 'checkbox', validation: {} },
                    { name: 'media', label: 'Media', type: 'checkbox', validation: {} },
                    { name: 'consolidators', label: 'Consolidators', type: 'checkbox', validation: {} },
                    { name: 'digitalforwarding', label: 'Digital Forwarding', type: 'checkbox', validation: {} },
                    { name: 'outsourcing', label: 'Outsourcing', type: 'checkbox', validation: {} },
                    { name: 'others', label: 'Others (please specify)?', type: 'text', validation: {} },
                ],
            },
        ],
    },
    {
        title: 'Brand Sponsorship',
        sections: [
            {
                title: 'Onsite Branding Sponsorship',
                note: "Let your company be known worldwide. Blurred Ego 1st Annual Conference offers you several advertising options to help you market your company. Don't miss out on these and make the right decision!",

                fields: [
                    { name: 'meetingScheduler', label: 'Meeting Scheduler Sponsorship (USD 1500.00)', price: 1500, type: 'checkbox', validation: {} },
                    { name: 'welcomeCocktail', label: 'Welcome Cocktail Sponsorship (USD 2500.00)', price: 2500, type: 'checkbox', validation: {} },
                    { name: 'lanyard', label: 'Lanyard Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'shirt', label: 'Shirt Sponsorship (USD 2500.00)', price: 2500, type: 'checkbox', validation: {} },
                    { name: 'galaDinner', label: 'Gala & Award Dinner Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    {
                        name: 'cruiseDinner',
                        label: 'Cruise Dinner Sponsorship (USD 2500.00)',
                        price: 2500,
                        type: 'checkbox',
                        validation: {},
                    },
                    { name: 'booth', label: 'Conference Booth (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },

                    { name: 'lunch', label: 'Lunch Sponsorship (USD 1500.00)', price: 1500, type: 'checkbox', validation: {} },
                    { name: 'coffeeBreak', label: 'Coffee Break Sponsorship (USD 1500.00)', price: 1500, type: 'checkbox', validation: {} },
                    { name: 'tableNumber', label: 'Table Number Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'agenda', label: 'Agenda Sponsorship (USD 1000.00)', price: 1000, type: 'checkbox', validation: {} },
                    { name: 'groupPhoto', label: 'Group Photo Sponsorship (Digital) (USD 1000.00)', price: 1000, type: 'checkbox', validation: {} },
                    { name: 'bag', label: 'Bag Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'badgeID', label: 'Badge ID Sponsorship (USD 3000.00) ', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'pen', label: 'Pen Sponsorship (USD 2000.00)', price: 2000, type: 'checkbox', validation: {} },
                ],
            },
        ],
    },

    {
        title: 'About Us',
        sections: [
            {
                title: 'How did you learn about us?',
                fields: [
                    { name: 'emailinvitation', label: 'Email Invitation', type: 'email', validation: {} },
                    { name: 'message', label: 'Message', type: 'textarea', validation: {} },
                ],
            },
        ],
    },
];

export const stepViewFormFields = [
    {
        title: 'Personal Information',
        sections: [
            {
                title: 'Company  Information',
                fields: [
                    { name: 'companyName', label: 'Company Name', type: 'text', validation: { required: 'Company name is required' } },
                    { name: 'position', label: 'Position', type: 'text', validation: {} },
                    { name: 'companyEmail', label: 'Company Email', type: 'email', validation: { required: 'Email is required' } },
                    { name: 'telephone', label: 'Telephone', type: 'tel', validation: { required: 'Telephone is required' } },
                    { name: 'mobile', label: 'Mobile', type: 'tel', validation: { required: 'Mobile number is required' } },
                    { name: 'website', label: 'Website', type: 'url' },
                    { name: 'iataNumber', label: 'IATA Number', type: 'text', validation: {} },
                    { name: 'city', label: 'City', type: 'text', validation: { required: 'City is required' } },
                    { name: 'country', label: 'Country', type: 'text', validation: { required: 'Country is required' } },
                    { name: 'address', label: 'Address', type: 'textarea', validation: { required: 'Address is required' } },
                    { name: 'companyLogo', label: 'Company Logo', type: 'file', validation: { required: 'Company Logo is required' } },
                ],
            },
            {
                title: 'Personal Details',
                fields: [
                    { name: 'title', label: 'Title', type: 'select', options: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'], validation: { required: 'Title is required' } },
                    { name: 'firstName', label: 'First Name ', type: 'text', validation: { required: 'First name is required' } },
                    { name: 'lastName', label: 'Last Name', type: 'text', validation: { required: 'Last name is required' } },
                    { name:'personalEmail', label: 'Email', type: 'email', validation: { required: 'Email is required' } },
                    { name: 'shirtSize', label: 'Shirt Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], validation: { required: 'Shirt size is required' } },
                    { name: 'formalPhoto', label: 'Formal Photo', type: 'file', validation: { required: 'Formal Photo is required' } },
                    { name: 'registerSpouse', label: ' Register Spouse (USD 600)', type: 'checkbox', validation: {} },
                ],
            },

            {
                title: 'Dietary Restrictions:',
                fields: [
                    { name: 'vegetarian', label: 'Vegetarian', type: 'checkbox', validation: {} },
                    { name: 'vegan', label: 'Vegan', type: 'checkbox', validation: {} },
                    { name: 'halal', label: 'Halal', type: 'checkbox', validation: {} },
                    { name: 'kosher', label: 'Kosher', type: 'checkbox', validation: {} },
                    { name: 'glutenFree', label: 'Gluten-free', type: 'checkbox', validation: {} },
                    { name: 'lactoseIntolerant', label: 'Lactose Intolerant', type: 'checkbox', validation: {} },
                    { name: 'other', label: 'Other', type: 'text', validation: {} },
                    { name: 'allergies', label: 'Food Allergy', type: 'text', validation: {} },
                    // {name: 'otherDietary', label: 'Other Dietary Requirements', type: 'textarea', validation: {}},
                ],
            },

            {
                title: 'Add Additional Attendees',
                fields: [
                    {
                        title: 'Personal Details',
                        fields: [
                            {
                                name: `title`,
                                label: 'Title',
                                type: 'select',
                                options: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
                                validation: {
                                    required: 'Title is required',
                                },
                            },
                            {
                                name: `firstName`,
                                label: 'First Name',
                                type: 'text',
                                validation: { required: 'First name is required' },
                            },

                            {
                                name: `lastName`,
                                label: 'Last Name',
                                type: 'text',
                                validation: { required: 'Last name is required' },
                            },
                            {
                                name:`personalEmail`,
                                label:'Email',
                                type:'email',
                                validation:{required:'Email is required'}
                            },
                            {
                                name: `shirtSize`,
                                label: 'Shirt Size',
                                type: 'select',
                                options: ['S', 'M', 'L', 'XL', 'XXL'],
                                validation: { required: 'Shirt size is required' },
                            },

                            {
                                name: `formalPhoto`,
                                label: 'Formal Photo',
                                type: 'file',
                                validation: { required: 'Formal Photo is required' },
                            },
                            {
                                name: `registerSpouse`,
                                label: 'Register Spouse (USD 600)',
                                type: 'checkbox',
                                validation: {},
                            },
                            {
                                name: `shareRoom`,
                                label: '25% off for delegates sharing a room',
                                type: 'checkbox',
                                validation: {},
                            },
                        ],
                    },
                    {
                        title: 'Dietary Restrictions',
                        fields: [
                            {
                                name: `vegetarian`,
                                label: 'Vegetarian',
                                type: 'checkbox',
                                validation: {},
                            },
                            {
                                name: `vegan`,
                                label: 'Vegan',
                                type: 'checkbox',
                                validation: {},
                            },
                            {
                                name: `halal`,
                                label: 'Halal',
                                type: 'checkbox',
                                validation: {},
                            },
                            {
                                name: `kosher`,
                                label: 'Kosher',
                                type: 'checkbox',
                                validation: {},
                            },
                            {
                                name: `glutenFree`,
                                label: 'Gluten-free',
                                type: 'checkbox',
                                validation: {},
                            },
                            {
                                name: `lactoseIntolerant`,
                                label: 'Lactose Intolerant',
                                type: 'checkbox',
                                validation: {},
                            },
                            {
                                name: `other`,
                                label: 'Other',
                                type: 'text',
                                validation: {},
                            },
                            {
                                name: `allergies`,
                                label: 'Food Allergy',
                                type: 'text',
                                validation: {},
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        title: 'Specialization',
        sections: [
            {
                title: 'Specialization',
                fields: [
                    { name: 'airfreight', label: 'Airfreight', type: 'checkbox', validation: {} },
                    { name: 'householdremovals', label: 'Household Removals', type: 'checkbox', validation: {} },
                    { name: 'courier&express', label: 'Courier & Express', type: 'checkbox', validation: {} },
                    { name: 'lclconsolidation', label: 'LCL Consolidation (Wholesale)', type: 'checkbox', validation: {} },
                    { name: 'dangerousgoods', label: 'Dangerous Goods', type: 'checkbox', validation: {} },
                    { name: 'lclforwarding', label: 'LCL Forwarding (Retail)', type: 'checkbox', validation: {} },
                    { name: 'ecommercecargo', label: 'E-Commerce Cargo', type: 'checkbox', validation: {} },
                    { name: 'liquidbulkhandling', label: 'Liquid Bulk Handling', type: 'checkbox', validation: {} },
                    { name: 'eventslogistics', label: 'Events Logistics', type: 'checkbox', validation: {} },
                    { name: 'perishable', label: 'Perishable', type: 'checkbox', validation: {} },
                    { name: 'exhibitionlogistics', label: 'Exhibition Logistics', type: 'checkbox', validation: {} },
                    { name: 'pharmaceutical', label: 'Pharmaceutical', type: 'checkbox', validation: {} },
                    { name: 'exporterofrecords', label: 'Exporter of Records / Importer of Records (EOR / IOR)', type: 'checkbox', validation: {} },
                    { name: 'projectforwarding', label: 'Project Forwarding', type: 'checkbox', validation: {} },
                    { name: 'fclforwarding', label: 'FCL Forwarding', type: 'checkbox', validation: {} },
                    { name: 'silkrouterail', label: 'Silk Route Rail', type: 'checkbox', validation: {} },
                    { name: 'timecritical', label: 'Time Critical', type: 'checkbox', validation: {} },
                ],
            },
            {
                title: 'Vendor only section',
                note: 'Note: This section if FOR VENDORS only. If you are a freight forwarder, you may proceed to the next section below.',
                fields: [
                    { name: 'insurance', label: 'Insurance', type: 'checkbox', validation: {} },
                    { name: 'it', label: 'IT', type: 'checkbox', validation: {} },
                    { name: 'trucking', label: 'Trucking', type: 'checkbox', validation: {} },
                    { name: 'craftingpacking', label: 'Crafting & Packing', type: 'checkbox', validation: {} },
                    { name: 'media', label: 'Media', type: 'checkbox', validation: {} },
                    { name: 'consolidators', label: 'Consolidators', type: 'checkbox', validation: {} },
                    { name: 'digitalforwarding', label: 'Digital Forwarding', type: 'checkbox', validation: {} },
                    { name: 'outsourcing', label: 'Outsourcing', type: 'checkbox', validation: {} },
                    { name: 'others', label: 'Others (please specify)?', type: 'text', validation: {} },
                ],
            },
        ],
    },
    {
        title: 'Brand Sponsorship',
        sections: [
            {
                title: 'Onsite Branding Sponsorship',
                note: "Let your company be known worldwide. Blurred Ego 1st Annual Conference offers you several advertising options to help you market your company. Don't miss out on these and make the right decision!",

                fields: [
                    { name: 'meetingScheduler', label: 'Meeting Scheduler Sponsorship (USD 1500.00)', price: 1500, type: 'checkbox', validation: {} },
                    { name: 'welcomeCocktail', label: 'Welcome Cocktail Sponsorship (USD 2500.00)', price: 2500, type: 'checkbox', validation: {} },
                    { name: 'lanyard', label: 'Lanyard Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'shirt', label: 'Shirt Sponsorship (USD 2500.00)', price: 2500, type: 'checkbox', validation: {} },
                    { name: 'galaDinner', label: 'Gala & Award Dinner Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    {
                        name: 'cruiseDinner',
                        label: 'Cruise Dinner Sponsorship (USD 2500.00)',
                        price: 2500,
                        type: 'checkbox',
                        validation: {},
                    },
                    { name: 'booth', label: 'Conference Booth (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },

                    { name: 'lunch', label: 'Lunch Sponsorship (USD 1500.00)', price: 1500, type: 'checkbox', validation: {} },
                    { name: 'coffeeBreak', label: 'Coffee Break Sponsorship (USD 1500.00)', price: 1500, type: 'checkbox', validation: {} },
                    { name: 'tableNumber', label: 'Table Number Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'agenda', label: 'Agenda Sponsorship (USD 1000.00)', price: 1000, type: 'checkbox', validation: {} },
                    { name: 'groupPhoto', label: 'Group Photo Sponsorship (Digital) (USD 1000.00)', price: 1000, type: 'checkbox', validation: {} },
                    { name: 'bag', label: 'Bag Sponsorship (USD 3000.00)', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'badgeID', label: 'Badge ID Sponsorship (USD 3000.00) ', price: 3000, type: 'checkbox', validation: {} },
                    { name: 'pen', label: 'Pen Sponsorship (USD 2000.00)', price: 2000, type: 'checkbox', validation: {} },
                ],
            },
        ],
    },

    {
        title: 'About Us',
        sections: [
            {
                title: 'How did you learn about us?',
                fields: [
                    { name: 'emailinvitation', label: 'Email Invitation', type: 'email', validation: {} },
                    { name: 'message', label: 'Message', type: 'textarea', validation: {} },
                ],
            },
        ],
    },
];

// For adding additional attendees to the form fields
export const createAttendeeFormSections = (attendeeIndex) => [
    {
        title: `Attendee ${attendeeIndex + 2}`,
        sections: [
            {
                title: 'Personal Details',
                fields: [
                    {
                        name: `attendees.${attendeeIndex}.title`,
                        label: 'Title',
                        type: 'select',
                        options: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
                        validation: {
                            required: 'Title is required',
                        },
                    },
                    {
                        name: `attendees.${attendeeIndex}.firstName`,
                        label: 'First Name',
                        type: 'text',
                        validation: { required: 'First name is required' },
                    },

                    {
                        name: `attendees.${attendeeIndex}.lastName`,
                        label: 'Last Name',
                        type: 'text',
                        validation: { required: 'Last name is required' },
                    },
                    {
                        name: `attendees.${attendeeIndex}.shirtSize`,
                        label: 'Shirt Size',
                        type: 'select',
                        options: ['S', 'M', 'L', 'XL', 'XXL'],
                        validation: { required: 'Shirt size is required' },
                    },
                    {
                        name: `attendees.${attendeeIndex}.personalEmail`,
                        label: 'Email',
                        type: 'email',
                        validation: { required: 'Email is required' },
                    },

                    {
                        name: `attendees.${attendeeIndex}.formalPhoto`,
                        label: 'Formal Photo',
                        type: 'file',
                        validation: { required: 'Formal Photo is required' },
                    },
                    {
                        name: `attendees.${attendeeIndex}.registerSpouse`,
                        label: 'Register Spouse (USD 600.00)',
                        type: 'checkbox',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.shareRoom`,
                        label: '25% off for delegates sharing a room',
                        type: 'checkbox',
                        validation: {},
                    },
                ],
            },
            {
                title: 'Dietary Restrictions',
                fields: [
                    {
                        name: `attendees.${attendeeIndex}.vegetarian`,
                        label: 'Vegetarian',
                        type: 'checkbox',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.vegan`,
                        label: 'Vegan',
                        type: 'checkbox',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.halal`,
                        label: 'Halal',
                        type: 'checkbox',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.kosher`,
                        label: 'Kosher',
                        type: 'checkbox',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.glutenFree`,
                        label: 'Gluten-free',
                        type: 'checkbox',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.lactoseIntolerant`,
                        label: 'Lactose Intolerant',
                        type: 'checkbox',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.other`,
                        label: 'Other',
                        type: 'text',
                        validation: {},
                    },
                    {
                        name: `attendees.${attendeeIndex}.allergies`,
                        label: 'Food Allergy',
                        type: 'text',
                        validation: {},
                    },
                ],
            },
        ],
    },
];
