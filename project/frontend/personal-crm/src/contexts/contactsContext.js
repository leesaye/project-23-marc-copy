import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../endpoints/api';

const BASE_URL = "http://127.0.0.1:8000/";

export const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}contacts/`)  
            .then(response => setContacts(response.data))
            .catch(error => console.error("Error fetching contacts", error));
    }, []);

    return (
        <ContactsContext.Provider value={{ contacts }}>
            {children}
        </ContactsContext.Provider>
    );
};
