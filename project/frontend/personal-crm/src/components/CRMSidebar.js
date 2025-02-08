import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import ContactsIcon from '@mui/icons-material/Contacts';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

function CRMSidebar() {
    return (
        <Sidebar>
            <Menu>
                <MenuItem className="mt-3">
                    <h2> Personal CRM </h2>
                </MenuItem>
                <hr className="mx-3" style={{borderWidth: "3px"}} />
                <MenuItem component={<Link to="/" />} icon={<HomeIcon />}> Home </MenuItem>
                <MenuItem component={<Link to="/contacts/" />} icon={<ContactsIcon />}> Contacts </MenuItem>
                <MenuItem component={<Link to="/notifications/" />} icon={<NotificationsActiveIcon />}> Notifications </MenuItem>
                <MenuItem component={<Link to="/calendars/" />} icon={<CalendarMonthIcon />}> Calendar </MenuItem>
                <MenuItem component={<Link to="/feed/" />} icon={<RocketLaunchIcon />}> Feed </MenuItem>
                <hr className="mx-3" style={{borderWidth: "3px"}} />
                <MenuItem component={<Link to="/profile/" />} icon={<PersonIcon />}> Profile </MenuItem>
                <MenuItem component={<Link to="/settings/" />} icon={<SettingsIcon />}> Settings </MenuItem>

            </Menu>
        </Sidebar>
    );
}

export default CRMSidebar;