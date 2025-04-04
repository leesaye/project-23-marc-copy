import axios from 'axios'

// const BASE_URL = "http://127.0.0.1:8000/api/"
// const BASE_URL = "https://project-23-marc-backend-deployment.onrender.com/api/"
// const BASE_URL = `https://project-23-marc.onrender.com/api/`;
//const BASE_URL = `https://project-23-marc-backend-d4.onrender.com/api/`;
const BASE_URL = `https://project-23-marc-1.onrender.com/api/`;


const LOGIN_URL = `${BASE_URL}token/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`
const REGISTER_URL = `${BASE_URL}register/`

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
    withCredentials: true, //ensure cookies and tokens are sent all the time
})

// Function to refresh the token
export const refresh_token = async () => {
    try {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });
        return true;
    } catch (error) {
        return false;
    }
};

// Axios response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
    response => response,  // If response is OK, just return it
    async error => {
        if (error.response && error.response.status === 401) {  // Handle unauthorized error
            const tokenRefreshed = await refresh_token();
            if (tokenRefreshed) {
                // Retry the original request
                return axiosInstance(error.config);
            }
        }
        return Promise.reject(error);
    }
);
export default axiosInstance

export const login = async (username, password) => {
    await axios.post(
        LOGIN_URL,
        { username, password },  // Object shorthand for cleaner syntax
        { withCredentials: true }  // Ensures cookies are included
    );
};

const call_refresh = async (error, func) => { //call this when ever there is an error doing a request where the token has expired
    if (error.response && error.response.startus === 401){ //not authorized
        const tokenRefreshed = await refresh_token();

        if (tokenRefreshed){
            const retryResponse = await func();
            return retryResponse.data
        }
    }

    return false
}

export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL,
            {},
            {withCredentials: true}
        )
        return true
    } catch (error){
        return false
    }
}

export const is_authenticated = async () => {
    try {
        await axios.get(AUTH_URL,
            {withCredentials: true}
        )
        return true
    } catch (error){
        return false
    }
}

export const register = async (username, email, password) => {
    const response = axios.post(REGISTER_URL,
        {username, email, password},
    )
    return response.data
}
