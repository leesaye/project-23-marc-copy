import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useEffect, useState } from 'react';
import LogMission from "../components/LogMission";
import LogActivity from "../components/LogActivity";
import { useMediaQuery } from 'react-responsive';

function Log() {
    const [searchQuery, setSearchQuery] = useState("");
    const [missionItems, setMissionItems] = useState([]); // The list of mission items to be set in the api get call
    const [sortValue, setSortValue] = useState("Newest");
    const [activities, setActivities] = useState([]);
    const [contacts, setContacts] = useState({});
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [weeks, setWeeks] = useState(0);
    const [lastLogin, setLastLogin] = useState("No previous login");
    const isSmallScreen = useMediaQuery({ query: '(max-width: 1224px)' });
    const isTinyScreen = useMediaQuery({ query: '(max-width: 600px)' });
    const BASE_URL = "http://127.0.0.1:8000/";

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}log/`)
        .then(response => {
            setMissionItems(response.data);
        })
        .catch(error => {
            console.error("Error fetching mission log:", error);
        });

        axiosInstance.get(`${BASE_URL}api/profile/`)
        .then(response => {
            setLastLogin(response.data.last_login);
        })
        .catch(error => {
            console.error("Error fetching last login:", error);
        });
    }, []);

    // filter by past X weeks
    const filterByWeeks = (activities, weeks) => {
        if (weeks < 0) weeks = 0;
        const today = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - weeks * 7); // Go back X weeks

        if (weeks === 0 || weeks === "0") {
            return activities.filter((activity) => {
                if (activity.start) {
                    const eventDate = new Date(activity.start);
                    return eventDate <= today;
                }
                else if (activity.date && activity.completed) {
                    const taskDate = new Date(activity.date);
                    return taskDate <= today;
                }
                return false;
            });
        }
        return activities.filter((activity) => {
            if (activity.start) {
                const eventDate = new Date(activity.start);
                if (eventDate <= today) {
                    return new Date(activity.start) >= cutoffDate;
                }
            }
            else if (activity.date && activity.completed) {
                const taskDate = new Date(activity.date);
                if (taskDate <= today) {
                    return new Date(activity.date) >= cutoffDate;
                }
            }
            return false;
        });
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
        setFilteredActivities(filtered);
    }, [activities, weeks]);

    const filteredLogItems = filteredActivities.filter((activity) => {
            let title = (activity.title) ? activity.title : "";
            let tag = (activity.tag) ? activity.tag : "";
            let contact = (contacts[activity.contact]) ? contacts[activity.contact] : "";
            return (title.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
                    (tag.toLowerCase().search(searchQuery.toLowerCase()) !== -1) ||
                    (contact.toLowerCase().search(searchQuery.toLowerCase()) !== -1)
        }
    );

    const sortedLogItems = [...filteredLogItems].sort((a, b) => {
        let aDate = (a.start) ? new Date(a.start) : new Date(a.date);
        let bDate = (b.start) ? new Date(b.start) : new Date(b.date);
        if (sortValue === "Oldest") return aDate - bDate;
        return bDate - aDate; // Default newest date order
    });

    // export activity in csv
    const handleExportCSV = async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}log/export-activities/`, {
                responseType: "blob", // ensures the response is treated as a file
            });

            // Create a URL for the downloaded CSV file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "activity_log.csv"); // Set file name
            document.body.appendChild(link);
            link.click(); // Trigger download
            document.body.removeChild(link); // Clean up

        } catch (error) {
            console.error("Error downloading CSV:", error);
        }
    };

    return (
        <Layout>
            {!isSmallScreen ? ( /*For desktop screen size*/
            <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                <div className="container">
                    <div className="row mt-3">
                        <div className="col-6">
                            <h2>My Mission Log</h2>
                        </div>
                        <div className="col-6 mt-2">
                            <h4>Last login: {new Date(lastLogin).toLocaleString()}</h4>
                        </div>
                    </div>
                    <div className="container mt-1 mx-1 bg-info-subtle rounded-3">
                        <div className="row">
                            <div className="col-12">
                                <h5>Weekly quests</h5>
                            </div>
                        </div>
                        {!missionItems ? <p>Loading...</p>:
                        missionItems.map((missionItem, index) =>
                            <LogMission key={index} missionItem={missionItem}></LogMission>
                        )}
                    </div>


                    <div className="row mt-5">
                        <div className="col-3 mt-1">
                            <h2>My Activity Log</h2>
                        </div>
                        <div className="col-4 mt-2">
                            <Paper elevation={0} component="form" className="p-1 w-75">
                                <SearchIcon />
                                <InputBase className="w-75" placeholder="Search log" inputProps={{ 'aria-label': 'search log' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </Paper>
                        </div>
                        <div className="col-2 mt-2">
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
                        <div className="col-2 mt-2">
                            <div className="dropdown">
                                <button className="btn btn-primary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    <SwapVertIcon />
                                    Date Filter
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                                    <li><button className="dropdown-item" value={1} onClick={(e) => setWeeks(e.target.value)} >Last Week</button></li>
                                    <li><button className="dropdown-item" value={4} onClick={(e) => setWeeks(e.target.value)} >Last Month</button></li>
                                    <li><button className="dropdown-item" value={24} onClick={(e) => setWeeks(e.target.value)} >Last 6 Months</button></li>
                                    <li><button className="dropdown-item" value={0} onClick={(e) => setWeeks(e.target.value)} >All Time</button></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-1">
                            <button className="btn btn-primary" onClick={handleExportCSV}>
                                CSV Export
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3 mx-3">
                        <div className="col-4">
                            <h5>Title</h5>
                        </div>
                        <div className="col-3">
                            <h5>Tag</h5>
                        </div>
                        <div className="col-3">
                            <h5>Contact</h5>
                        </div>
                        <div className="col-2">
                            <h5>Date</h5>
                        </div>
                    </div>
                    <div className="container mx-1 bg-info-subtle rounded-3 overflow-auto" style={{maxHeight:"20rem"}}>
                        <br />
                        {sortedLogItems.map((activity, index) => (
                            <LogActivity key={`${activity.id}-${index}`} activity={activity} contacts={contacts} />
                        ))}
                    </div>
                </div>
            </div>
            ) : ( /*For laptop/phone screen*/
                <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                    <div className="container mx-1">
                        <div className="row mt-3 text-center">
                            <div className="col-12">
                                <h2>My Mission Log</h2>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col-12">
                                <h4>Last login: {new Date(lastLogin).toLocaleDateString()}</h4>
                            </div>
                        </div>
                        <div className="container mt-1 mx-1 bg-info-subtle rounded-3">
                            <div className="row">
                                <div className="col-12">
                                    <h5>Weekly quests</h5>
                                </div>
                            </div>
                            {!missionItems ? <p>Loading...</p>:
                            missionItems.map((missionItem, index) =>
                                <LogMission key={index} missionItem={missionItem}></LogMission>
                            )}
                        </div>

                        {!isTinyScreen ? ( /*For laptop/phone screen (not smallest size)*/
                        <div className="row mt-5">
                            <div className="col-6 text-center">
                                <h2>My Activity Log</h2>
                            </div>
                            <div className="col-6 my-1 text-center">
                                <button className="btn btn-primary" onClick={handleExportCSV}>
                                    CSV Export
                                </button>
                            </div>
                        </div>
                        ) : ( /*For smallest phone size*/
                            <div>
                            <div className="row mt-5">
                                <div className="col-12 text-center">
                                    <h2>My Activity Log</h2>
                                </div>
                            </div>
                            <div className="row my-1">
                                <div className="col-12 text-center">
                                    <button className="btn btn-primary" onClick={handleExportCSV}>
                                        CSV Export
                                    </button>
                                </div>
                            </div>
                            </div>
                        )}
                        <div className="row justify-content-center">
                            <div className="col-12 my-1">
                                <Paper elevation={0} component="form" className="p-1 w-75 mx-auto">
                                    <SearchIcon />
                                    <InputBase className="w-75" placeholder="Search log" inputProps={{ 'aria-label': 'search log' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </Paper>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-6 mt-1 text-center">
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
                            <div className="col-6 mt-1 text-center">
                                <div className="dropdown">
                                    <button className="btn btn-primary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <SwapVertIcon />
                                        Filter
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                                        <li><button className="dropdown-item" value={1} onClick={(e) => setWeeks(e.target.value)} >Last Week</button></li>
                                        <li><button className="dropdown-item" value={4} onClick={(e) => setWeeks(e.target.value)} >Last Month</button></li>
                                        <li><button className="dropdown-item" value={24} onClick={(e) => setWeeks(e.target.value)} >Last 6 Months</button></li>
                                        <li><button className="dropdown-item" value={0} onClick={(e) => setWeeks(e.target.value)} >All Time</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 text-center">
                            <div className="col-6">
                                <h5>Title</h5>
                            </div>
                            <div className="col-6">
                                <h5>Tag</h5>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col-6">
                                <h5>Contact</h5>
                            </div>
                            <div className="col-6">
                                <h5>Date</h5>
                            </div>
                        </div>
                        <div className="container mx-1 bg-info-subtle rounded-3 overflow-auto" style={{maxHeight:"20rem"}}>
                            <br />
                            {sortedLogItems.map((activity, index) => (
                                <LogActivity key={`${activity.id}-${index}`} activity={activity} contacts={contacts} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Log;
