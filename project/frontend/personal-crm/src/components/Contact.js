import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Contact() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        // Fetch contacts from the Django backend
        axios.get('http://127.0.0.1:8000/contacts/')
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error("Error fetching contacts", error);
            });
    }, []);

    return (
        <div>
            {contacts.map(contact => (
                <div className="row" key={contact.id}>
                    <hr />
                    <div className="col-4">
                        <p>{contact.name}</p>
                    </div>
                    <div className="col-2">
                        <p>{contact.job}</p>
                    </div>
                    <div className="col-3">
                        <p>{contact.relationship_rating}</p>
                    </div>
                    <div className="col-2">
                        <p>{contact.relationship}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Contact;
