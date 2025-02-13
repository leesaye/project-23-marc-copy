import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

function ContactId() {
    const { contact_id } = useParams();
    const [contact, setContact] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/contacts/${contact_id}`)
        .then(response => {
            setContact(response.data);
        })
        .catch(error => {
            console.error("Error fetching contact:", error);
        });
    }, [contact_id]);

    return (
        <Layout>
            {!contact ? <p>Loading...</p>:
            <div>
                <h1>Edit contact: {contact.name}</h1>
                <div>
                    <p>Name: {contact.name}</p>
                    <p>Email: {contact.email}</p>
                    <p>Phone #: {contact.phone}</p>
                    <p>Job: {contact.job}</p>
                    <p>Relationship: {contact.relationship}</p>
                    <p>Relationship rating: {contact.relationship_rating}</p>
                    <p>Notes: {contact.notes}</p>
                </div>
            </div>
            }

            <button className="btn btn-danger">Delete contact</button>

        </Layout>
    );
}

export default ContactId;