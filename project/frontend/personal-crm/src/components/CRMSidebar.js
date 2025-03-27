import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import ContactsIcon from '@mui/icons-material/Contacts';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useNavigate } from "react-router-dom";

import { logout } from "../endpoints/api";

function CRMSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 1224px)' });
    const nav = useNavigate();

    const handleCollapseToggle = () => {
        setCollapsed(!collapsed);
    }

    const handleLogout = async () => {
        const success = await logout();
        if (success){
            nav('/login')
        }
    }

    return (
        <div>
            {!isSmallScreen ? (/*For desktop screen size*/
                <Sidebar collapsed={collapsed}>
                    <Menu>
                        <MenuItem
                            className="mt-2"
                            onClick={handleCollapseToggle}
                            icon={
                            <IconButton>
                                <MenuIcon />
                            </IconButton>
                            }
                        >
                            {!collapsed && <h4 className="mt-1">Personal CRM</h4>}
                        </MenuItem>
                        <hr className="mx-3" style={{borderWidth: "3px"}} />
                        <MenuItem component={<Link />} to="/" icon={<HomeIcon />}> Home </MenuItem>
                        <MenuItem component={<Link />} to="/contacts/" icon={<ContactsIcon />}> Contacts </MenuItem>
                        <MenuItem component={<Link />} to="/calendars/" icon={<CalendarMonthIcon />}> Calendar </MenuItem>
                        <MenuItem component={<Link />} to="/feed/" icon={<RocketLaunchIcon />}> Feed </MenuItem>
                        <MenuItem component={<Link />} to="/log/" icon={<HistoryIcon />}> Log </MenuItem>
                        <hr className="mx-3" style={{borderWidth: "3px"}} />
                        <MenuItem component={<Link />} to="/settings/" icon={<SettingsIcon />}> Settings </MenuItem>
                        <MenuItem
                            onClick={()=>handleLogout()}
                            icon={
                            <IconButton>
                                <LogoutIcon />
                            </IconButton>
                            }
                        > Logout </MenuItem>
                    </Menu>
                </Sidebar>
            ) : ( /*For laptop/phone screen (not smallest size)*/
                <Sidebar collapsed={true}>
                    <Menu>
                        <MenuItem
                            className="mt-2"
                            onClick={handleCollapseToggle}
                            icon={
                            <IconButton>
                                <MenuIcon />
                            </IconButton>
                            }
                        >
                        </MenuItem>
                        <hr className="mx-3" style={{borderWidth: "3px"}} />
                        <MenuItem component={<Link />} to="/" icon={<HomeIcon />}> Home </MenuItem>
                        <MenuItem component={<Link />} to="/contacts/" icon={<ContactsIcon />}> Contacts </MenuItem>
                        <MenuItem component={<Link />} to="/calendars/" icon={<CalendarMonthIcon />}> Calendar </MenuItem>
                        <MenuItem component={<Link />} to="/feed/" icon={<RocketLaunchIcon />}> Feed </MenuItem>
                        <MenuItem component={<Link />} to="/log/" icon={<HistoryIcon />}> Log </MenuItem>
                        <hr className="mx-3" style={{borderWidth: "3px"}} />
                        <MenuItem component={<Link />} to="/settings/" icon={<SettingsIcon />}> Settings </MenuItem>
                        <MenuItem
                            onClick={()=>handleLogout()}
                            icon={
                            <IconButton>
                                <LogoutIcon />
                            </IconButton>
                            }
                        ></MenuItem>
                    </Menu>
                </Sidebar>
            )}
        </div>
    );
}

export default CRMSidebar;