import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LinearProgress } from '@mui/material';

function Log() {
    const [searchQuery, setSearchQuery] = useState("");
    const [logItems, setLogItems] = useState([]); // The list of log items to be set in the api get call
    const [missionItems, setMissionItems] = useState([]); // The list of mission items to be set in the api get call
    const [sortValue, setSortValue] = useState("Newest");
    const BASE_URL = "http://127.0.0.1:8000/";

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}log/`)
        .then(response => {
            setMissionItems(response.data);
        })
        .catch(error => {
            console.error("Error fetching mission log:", error);
        });
    });

    const filteredLogItems = logItems.filter((logItems) =>
        (logItems.title.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
        (logItems.type.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
        (logItems.contact.name.toLowerCase().search(searchQuery.toLowerCase()) !== -1)
    );

    const sortedLogItems = [...filteredLogItems].sort((a, b) => {
        if (sortValue === "Oldest") return a - b;
        return b - a; // Default newest date order
    });

    return (
        <Layout>
            <div>
                <h2>Mission Data:</h2>
                {missionItems ? <p>No mission items</p>:
                missionItems.map(missionItem =>
                    <div>
                        <p>text: {missionItem.mission_text}</p>
                        <p>last_rest: {missionItem.last_reset}</p>
                        <p>actions_required: {missionItem.actions_required}</p>
                        <p>completed: {missionItem.completed}</p>
                    </div>
                )}
            </div>
            <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                <div className="row">
                    <div className="col-8">
                        <h1>Log</h1>
                    </div>
                    <div className="col-4 mt-3">
                        <h4>Last login: </h4>
                    </div>
                </div>
                <div className="container mx-1">
                    <div className="row mt-3">
                        <div className="col-6">
                            <h2>My Mission Log</h2>
                        </div>
                    </div>
                    <div className="container mt-1 mx-1 bg-info-subtle rounded-3">
                        <div className="row">
                            <div className="col-12">
                                <h5>Weekly quests</h5>
                            </div>
                        </div>
                        <div className="row bg-light">
                            <div>
                                <p>Here is where the mission info goes</p>
                            </div>
                        </div>
                        <div className="row bg-light justify-content-center">
                            <div className="col-8">
                                <LinearProgress variant="determinate" value="75" sx={{ height: 25, borderRadius: 5 }}></LinearProgress>
                            </div>
                            <div className="col-4">
                                <p>3/4</p>
                            </div>
                        </div>
                        <br />
                        <div className="row bg-light">
                            <div>
                                <p>Here is where the mission info goes</p>
                            </div>
                        </div>
                        <div className="row bg-light justify-content-center">
                            <div className="col-8">
                                <LinearProgress variant="determinate" value="75" sx={{ height: 25, borderRadius: 5 }}></LinearProgress>
                            </div>
                            <div className="col-4">
                                <p>3/4</p>
                            </div>
                        </div>
                        <br />
                    </div>


                    <div className="row mt-5">
                        <div className="col-3">
                            <h2>My Activity Log</h2>
                        </div>
                        <div className="col-5 mt-1">
                            <Paper elevation={0} component="form" className="p-1 w-75">
                                <SearchIcon />
                                <InputBase className="w-75" placeholder="Search log" inputProps={{ 'aria-label': 'search log' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </Paper>
                        </div>
                        <div className="col-4 mt-1">
                            <div className="dropdown">
                                <button className="btn btn-primary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    <SwapVertIcon />
                                    Sort by
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                                    <li><button className="dropdown-item" onClick={(e) => setSortValue(e.target.innerHTML)} >Newest</button></li>
                                    <li><button className="dropdown-item" onClick={(e) => setSortValue(e.target.innerHTML)} >Oldest</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-1 mx-1 bg-info-subtle rounded-3 overflow-auto" style={{maxHeight:"15rem"}}>
                        <br />
                        <div className="row bg-light pt-2">
                            <div className="col-4">
                                <p>Attended meeting with Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Type: meeting</p>
                            </div>
                            <div className="col-2">
                                <p>Contact: Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Date: Mar 20</p>
                            </div>
                        </div>
                        <br />
                        <div className="row bg-light pt-2">
                            <div className="col-4">
                                <p>Attended meeting with Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Type: meeting</p>
                            </div>
                            <div className="col-2">
                                <p>Contact: Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Date: Mar 20</p>
                            </div>
                        </div>
                        <br />
                        <div className="row bg-light pt-2">
                            <div className="col-4">
                                <p>Attended meeting with Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Type: meeting</p>
                            </div>
                            <div className="col-2">
                                <p>Contact: Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Date: Mar 20</p>
                            </div>
                        </div>
                        <br />
                        <div className="row bg-light pt-2">
                            <div className="col-4">
                                <p>Attended meeting with Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Type: meeting</p>
                            </div>
                            <div className="col-2">
                                <p>Contact: Humraj</p>
                            </div>
                            <div className="col-2">
                                <p>Date: Mar 20</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Log;
