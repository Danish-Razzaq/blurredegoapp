import { apiCaller } from './api';
import { MenuItemsList } from '@/app/(dashboard)/components/MenuItemsList';

//store user data in local storage
export const storeUser = (data) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userName: data.user.username,
                name: data.user.fullName,
                email: data.user.email,
                city: data.user.city,
                country: data.user.country,
                referMember: data.user.referMember,
                jwt: data.jwt,
                role: {
                    ...(data.user['memberManager'] ? { memberManager: true } : {}),
                    ...(data.user['hasManagementRole'] ? { hasManagementRole: true } : {}),
                    ...(data.user['regular'] ? { member: true } : {}),
                },
            })
        );
    }
};

// authenticated user
export const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('userData');
        if (user) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};


// member manager function

export const isMemberManager = () => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('userData'));
        if (user?.role?.memberManager) {
            // console.log('isMemberManager boolean', user["member-manager"]);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const hasManagementAccess = () => {
    if (typeof window === 'undefined') return false;

    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    return !!(user.role?.memberManager || user.role?.hasManagementRole);
};



// get user data
export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem('userData'));
        return user;
    }
    return null;
};

// remove user data
export const removeUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
    }
};

const user = getUser();
// application data api functino

export const getSingleApplicationRecord = async () => {
    try {
        const applications = await apiCaller('get', `applications?filters[email][$eq]=${user?.email}&populate=*`);
        return applications;
    } catch (error) {
        console.error('Error fetching Application:', error);
        return null;
    }
};
export const getApplicationRecord = async () => {
    try {
        const applications = await apiCaller('get', `applications`);
        return applications;
    } catch (error) {
        console.error('Error fetching Application:', error);
        return null;
    }
};
// const defaultMTypes = [
//     { name: 'Platinum', amount: 1500 },
//     { name: 'Gold', amount: 1000 },
//     { name: 'Silver', amount: 500 },
// ];
export const getMemberShipTypes = async (returnOptions = false) => {
    let mTypes = [];
    try {
        let setting = await apiCaller('get', 'settings?filters[membershipType][$null]=false&pagination[pageSize]=1');
        if (setting?.data[0]?.attributes?.membershipType) {
            mTypes = setting?.data[0]?.attributes?.membershipType;
            console.log('mTypes', mTypes);
            if (returnOptions) return mTypes.map((m) => <option value={m.name}>{m.name}</option>);
            return mTypes;
        }
    } catch (err) {
        console.error('Error fetching Application:', err);
        return [];
    }
};

// Function to ensure the URL has a protocol
export const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`; // Add https:// if the protocol is missing
    }
    return url; // Return the URL as it is if it already has a protocol
};

// Function to convert a file to a base64 string
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!(file instanceof File)) {
            resolve(file); // Return the file if it's already a base64 string
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// function to convert Base64 to File
export const base64ToFile = (base64String, fileName) => {
    const byteString = atob(base64String.split(',')[1]);
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], fileName, { type: mimeString });
};

export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');

    if (user.role?.memberManager) return 'manager';
    if (user.role?.hasManagementRole) return 'management';
    if (user.role?.member) return 'member';

    return null;
};

// Function to protect routes based on user roles

export const canAccessRoute = (pathname) => {
    const userRole = getUserRole();
    if (!userRole) return console.log('User role not found'); // User is not authenticated

    const routeRule = MenuItemsList.find((r) => pathname.startsWith(r.path));
    if (!routeRule) return true;

    return routeRule.roles.includes(userRole);
};
