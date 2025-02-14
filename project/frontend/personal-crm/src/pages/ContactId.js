import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

function ContactId() {
    const { contact_id } = useParams();
    const [contact, setContact] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/contacts/${contact_id}`)
        .then(response => {
            setContact(response.data);
        })
        .catch(error => {
            console.error("Error fetching contact:", error);
        });
    }, [contact_id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/contacts/${contact_id}/delete`);
            console.log(`Contact ${contact_id} deleted successfully`);
            alert("Contact successfully deleted!");
            nav('/contacts/');
        } catch (error) {
            console.error("Error deleting contact:", error);
            alert("Failed to delete contact.");
        }
    };

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

            <button className="btn btn-danger" onClick={handleDelete}>Delete contact</button>

        </Layout>
    );
}

export default ContactId;
