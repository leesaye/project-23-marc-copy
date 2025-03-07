import Layout from '../components/Layout';
import axiosInstance from "../endpoints/api";
import Paper from '@mui/material/Paper';
import Contact from '../components/Contact';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { useEffect, useState, useRef } from 'react';

function Contacts() {
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState([]);
    const [sortValue, setSearchValue] = useState("Name (asc)");
    const [user, setUser] = useState(null);
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

    // Google Login Function
    const login = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/contacts.readonly",
        onSuccess: (response) => {
            console.log("Google OAuth Token:", response.access_token);
            setUser(response);
            fetchGoogleContacts(response.access_token);
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    // Logout Function
    const logout = () => {
        googleLogout();
        setUser(null);
        //setEvents([]); // Clear events on logout
    };

    const fetchGoogleContacts = async (accessToken) => {
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations,relations",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const googleContacts = await response.json();

        if (googleContacts.connections) {
            const contactsData = googleContacts.connections.map((contact) => {
                return {
                    name: contact.names && contact.names[0] ? contact.names[0].displayName : "",
                    email: contact.emailAddresses && contact.emailAddresses[0] ? contact.emailAddresses[0].value : "",
                    phone: contact.phoneNumbers && contact.phoneNumbers[0] ? contact.phoneNumbers[0].value : "",
                    job: contact.organizations && contact.organizations[0] ? contact.organizations[0].title : "",
                    relationship: contact.relations && contact.relations[0] ? contact.relations[0].value : "",
                };
            });

            await axiosInstance.post(`${BASE_URL}contacts/googlesync`, contactsData)
                .then(() => {
                    axiosInstance.get(`${BASE_URL}contacts/`)
                        .then(response => {
                            setContacts(response.data);
                        })
                        .catch(error => {
                            console.error("Error fetching contacts", error);
                        });
                    }
                ).catch(error => {
                    console.error("Error adding google contacts to backend", error);
                });
        }
    }


    return (
        <Layout>
            <div className="container bg-primary-subtle rounded p-3 min-vh-100">
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
                                {!user ? (
                                    <li><button onClick={login} className="dropdown-item">Connect with Google</button></li>
                                ) : (
                                    <li><button onClick={logout} className="dropdown-item">Log out of Google</button></li>
                                )
                                }
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
