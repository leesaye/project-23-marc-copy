import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useEffect, useState } from 'react';
import LogMission from "../components/LogMission";

function Log() {
    const [searchQuery, setSearchQuery] = useState("");
    const [logItems, setLogItems] = useState([]); // The list of log items to be set in the api get call
    const [missionItems, setMissionItems] = useState([]); // The list of mission items to be set in the api get call
    const [sortValue, setSortValue] = useState("Newest");
    const [activities, setActivities] = useState([]);
    const [contacts, setContacts] = useState({});
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [weeks, setWeeks] = useState(4);
    const BASE_URL = "http://127.0.0.1:8000/";

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}log/`)
        .then(response => {
            console.log(response.data);
            setMissionItems(response.data);
        })
        .catch(error => {
            console.error("Error fetching mission log:", error);
        });
    }, []);

    const filteredLogItems = logItems.filter((logItems) =>
        (logItems.title.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
        (logItems.type.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
        (logItems.contact.name.toLowerCase().search(searchQuery.toLowerCase()) !== -1)
    );

    const sortedLogItems = [...filteredLogItems].sort((a, b) => {
        if (sortValue === "Oldest") return a - b;
        return b - a; // Default newest date order
    });

    // filter by tag
    const filterByTag = (activities, tag) => {
        if (!tag) return activities; // No filter applied
        return activities.filter(event => event.tags.includes(tag));
    };

    // filter by past X weeks
    const filterByWeeks = (activities, weeks) => {
        if (weeks < 0) weeks = 0;
        const cutoffDate = new Date();
        console.log("Current Date:", cutoffDate);
        cutoffDate.setDate(cutoffDate.getDate() - weeks * 7); // Go back X weeks

        return activities.filter(event => new Date(event.start) >= cutoffDate);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [eventsRes, tasksRes, contactsRes] = await Promise.all([
                    axiosInstance.get(`${BASE_URL}api/events/`),
                    axiosInstance.get(`${BASE_URL}api/tasks/`),
                    axiosInstance.get(`${BASE_URL}contacts/`)
                ]);

                // convert contacts arr to { uuid: name } dictionary
                const contactsMap = contactsRes.data.reduce((acc, contact) => {
                    acc[contact.id] = contact.name;
                    return acc;
                }, {});

                // combo events and tasks into activities, and set
                setActivities([...eventsRes.data, ...tasksRes.data]);
                setContacts(contactsMap);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        fetchEvents();
    }, []);

    // apply filters
    useEffect(() => {
        let filtered = filterByWeeks(activities, weeks);
        filtered = filterByTag(filtered, selectedTag);
        setFilteredEvents(filtered);
    }, [activities, selectedTag, weeks]);

    return (
        <Layout>
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
                        {!missionItems ? <p>Loading...</p>:
                        missionItems.map(missionItem =>
                            <LogMission key={missionItem.id} missionItem={missionItem}></LogMission>
                        )}
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
                    {/* Filter Controls */}
                    <div>
                        <label>Filter by Tag: </label>
                        <select onChange={(e) => setSelectedTag(e.target.value)}>
                            <option value="">All</option>
                            <option value="school related">School</option>
                            <option value="work related">Work</option>
                        </select>

                        <label> Filter by Time: </label>
                        <select value={weeks} onChange={(e) => setWeeks(Number(e.target.value))}>
                            <option value={1}>Last Week</option>
                            <option value={4}>Last Month</option>
                            <option value={24}>Last 6 Months</option>
                        </select>
                    </div>
                    <div className="container mt-1 mx-1 bg-info-subtle rounded-3 overflow-auto" style={{maxHeight:"15rem"}}>
                        <br />
                        {filteredEvents.map((activity) => (
                            <div className="row bg-light pt-2">
                                <div className="col-4">
                                    <p>{activity.title}</p>
                                </div>
                                <div className="col-2">
                                    <p>Tag: {activity.tags.join(", ")}</p>
                                </div>
                                <div className="col-2">
                                    <p>Contact: {contacts[activity.contact] || ""}</p>
                                </div>
                                <div className="col-4">
                                    <p>End date: {new Date(activity.end).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Log;
