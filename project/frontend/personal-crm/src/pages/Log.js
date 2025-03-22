import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Log() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortValue, setSortValue] = useState("Newest");

    return (
        <Layout>
            <div className="container bg-primary-subtle rounded p-3 min-vh-100">
                <div className="row">
                    <div className="col-5">
                        <h1>My activity log</h1>
                    </div>
                    <div className="col-5 mt-3">
                        <h3>Last login: </h3>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-5 mt-1">
                        <Paper elevation={0} component="form" className="p-1 w-75">
                            <SearchIcon />
                            <InputBase className="w-75" placeholder="Search log" inputProps={{ 'aria-label': 'search log' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </Paper>
                    </div>
                    <div className="col-2 mt-1">
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
            </div>
        </Layout>
    );
}

export default Log;