import Layout from '../components/Layout';
import axiosInstance from "../endpoints/api";
import Paper from '@mui/material/Paper';
import Contact from '../components/Contact';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

function Contacts() {
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState([]);
    const [sortValue, setSearchValue] = useState("Name (asc)");
    const BASE_URL = `http://127.0.0.1:8000/`;
    const csvInputRef = useRef();
    const nav = useNavigate();

    useEffect(() => {
        // Fetch contacts from the Django backend on mount
        fetchContacts();
    }, []);

    const fetchContacts = () => {
        axiosInstance.get(`${BASE_URL}contacts/`)
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error("Error fetching contacts", error);
            });
    };

    const filteredContacts = contacts.filter((contacts) =>
        contacts.name.toLowerCase().search(searchQuery.toLowerCase()) !== -1
    );

    const sortedContacts = [...filteredContacts].sort((a, b) => {
        if (sortValue === "Name (desc)") return b.name.localeCompare(a.name);
        if (sortValue === "Relationship rating (asc)") return a.relationship_rating - b.relationship_rating;
        if (sortValue === "Relationship rating (desc)") return b.relationship_rating - a.relationship_rating;
        return a.name.localeCompare(b.name); // Default is Name (asc), including for any unknown values
    });

    return (
        <Layout>
            <div className="conatiner bg-primary-subtle rounded p-3 vh-100">
                <div className="row">
                    <div className="col-2">
                        <h2>Contacts</h2>
                    </div>
                    <div className="col-3 mt-1">
                        <Link to="/contacts/add/">
                            <button className="btn btn-success">
                                <AddIcon />
                                Add contact
                            </button>
                        </Link>
                    </div>
                    <div className="col-4 mt-1">
                        <Paper elevation={0} component="form" className="p-1 w-75">
                            <SearchIcon />
                            <InputBase placeholder="Search contacts" inputProps={{ 'aria-label': 'search contacts' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </Paper>
                    </div>
                    <div className="col-2 mt-1">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <SwapVertIcon />
                                Sort by
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                                <li><button className="dropdown-item" onClick={(e) => setSearchValue(e.target.innerHTML)} >Name (asc)</button></li>
                                <li><button className="dropdown-item" onClick={(e) => setSearchValue(e.target.innerHTML)} >Name (desc)</button></li>
                                <li><button className="dropdown-item" onClick={(e) => setSearchValue(e.target.innerHTML)} >Relationship rating (asc)</button></li>
                                <li><button className="dropdown-item" onClick={(e) => setSearchValue(e.target.innerHTML)} >Relationship rating (desc)</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-1 mt-1">
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Import
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                                <li><Link to="/contacts/importcsv/" className="link-underline link-underline-opacity-0"><button className="dropdown-item">Import LinkedIn contacts</button></Link></li>
                                <li><button className="dropdown-item">Connect with Google</button></li>
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
                sortedContacts.map(contact =>
                    <Contact contact={contact} />
                )}

            </div>
        </Layout>
    );
}

export default Contacts;
