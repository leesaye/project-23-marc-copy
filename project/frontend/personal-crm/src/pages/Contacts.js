import Layout from '../components/Layout';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Contact from '../components/Contact';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Contacts() {
    const [searchQuery, setSearchQuery] = useState("");
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
        <Layout>
            <div className="conatiner bg-primary-subtle rounded p-3">
                <div className="row">
                    <div className="col-5">
                        <h2>Contacts</h2>
                    </div>
                    <div className="col-4 mt-2">
                        <Paper elevation={0} component="form" className="p-1 w-75">
                            <SearchIcon />
                            <InputBase placeholder="Search contacts" inputProps={{ 'aria-label': 'search contacts' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} />
                        </Paper>
                    </div>
                    <div className="col-2 mt-2">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <SwapVertIcon />
                                Sort by
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="sortDropdown">
                                <li><button class="dropdown-item">Name (asc)</button></li>
                                <li><button class="dropdown-item">Name (desc)</button></li>
                                <li><button class="dropdown-item">Relationship rating (asc)</button></li>
                                <li><button class="dropdown-item">Relationship rating (desc)</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-1 mt-2">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Import
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="sortDropdown">
                                <li><button class="dropdown-item">Upload CSV</button></li>
                                <li><button class="dropdown-item">Connect with LinkedIn</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-4">
                        <p>Name</p>
                    </div>
                    <div className="col-2">
                        <p>Job</p>
                    </div>
                    <div className="col-3">
                        <p>Relationship Rating</p>
                    </div>
                    <div className="col-2">
                        <p>Relationship</p>
                    </div>
                </div>
                {!contacts ? <p>Loading...</p>:
                contacts.filter((contacts) => contacts.name.toLowerCase().search(searchQuery) !== -1)
                .map(contact =>
                    <Contact contact={contact} />
                )}
                
            </div>
        </Layout>
    );
}

export default Contacts;