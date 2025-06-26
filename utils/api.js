import { getUser } from './helperFunctions';
import axios from 'axios';
let isSessionExpiredAlertShown = false; 

export const apiCaller = async (method, endpoint, body, headers) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const user = getUser();

  let additionalHeader = headers ? headers : {};
  const header = {
    headers: {
      Authorization: `Bearer ${user?.jwt}`,
      ...additionalHeader,
    },
  };

  try {
    const response = await axios[method](
      `${'http://localhost:1338/api'}/${endpoint}`,
      body ? body : header,
      body ? header : null
    );
    return response.data;
  } catch (error) {
    console.error('API call error:', error);

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log(`this is the error of status ${error.response.status} token expired`);
      if (!isSessionExpiredAlertShown) {
        isSessionExpiredAlertShown = true; 
        if (window.confirm('Session expired. Please log in again.')) {
            window.location.href = '/login'; 
            localStorage.removeItem('userData');
        }
      }
    }
    return error.response ? error.response.data : { error: 'serverError' };
  }
};


// for image upload
export const apiCallerImgUpload = async (method, endpoint, body, headers = {}) => {
    const apiUrlImg = process.env.NEXT_PUBLIC_API_URL;
    // const apiUrlImg = 'http://localhost:1337/api';
    const user = getUser();
    const header = {
        headers: {
            Authorization: `Bearer ${user.jwt}`,
            'Content-Type': 'multipart/form-data',
            ...headers,
        },
    };

    try {
        const response = await axios[method](`${apiUrlImg}/${endpoint}`, body, header);
        // console.log('API response:', response.data); // Log response for debugging
        return response.data;
    } catch (error) {
        console.error('API call error:', error); 
    }
};


// i just added this function to get status code of the response upper function is not give us status code
//i don't want to change that function so i just added this function because whole website is use on that function so i create new one......

export const apiCallerWithStatusCode = async (method, endpoint, body, headers) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const user = getUser();
    let additionalHeader = headers ? headers : {};
    const header = {
        headers: {
            Authorization: `Bearer ${user?.jwt}`,
            ...additionalHeader,
        },
    };

    try {
        const response = await axios[method](`${apiUrl}/${endpoint}`, body ? body : header, body ? header : null);
        return {
            data: response.data,
            status: response.status

        };
    } catch (error) {
        console.error('API call error:', error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log(`this is the error of status ${error.response.status} token expired`);
          if (!isSessionExpiredAlertShown) {
            isSessionExpiredAlertShown = true; 
            if (window.confirm('Session expired. Please log in again.')) {
              window.location.href = '/login'; 
                localStorage.removeItem('userData');
            }
          }
        }
        return error.response ? error.response.data : { error: 'serverError' };

    }
}


// Api call to Sponsorship Fields

export const fetchSponsorshipFields = async (event) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/events?filters[event_name]=${event}&populate=*`
      , {
        // its non auth api so no need to pass token
        headers: {
          'Content-Type': 'application/json',
        }
     
    });
    return response.data.data[0]?.attributes?.event_sponsorship_fields;
  } catch (error) {
    console.error('Error fetching sponsorship fields:', error);
    return [];
  }
};