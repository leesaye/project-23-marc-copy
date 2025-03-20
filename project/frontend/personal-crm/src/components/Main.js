import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import Home from '../pages/Home';
import Contacts from '../pages/Contacts'
import AddContact from '../pages/AddContact'
import ContactId from '../pages/ContactId';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import Register from '../pages/Register';
import CalendarPage from '../pages/Calendar';
import Feed from '../pages/Feed';
import Log from '../pages/Log';
import CSVUpload from '../pages/CSVUpload';

function Main() {
    return (
        <Fragment>
            <Routes>
                {/* Add routes to each different pages with their link path here */}
                <Route path ='/login' element={<Login />} />
                <Route path ='/register' element={<Register />} />
                <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>} />
                <Route path='/contacts/' element={<PrivateRoute><Contacts/></PrivateRoute>} />
                <Route path='/contacts/add/' element={<PrivateRoute><AddContact/></PrivateRoute>} />
                <Route path='/contacts/:contact_id/' element={<PrivateRoute><ContactId/></PrivateRoute>} />
                <Route path='/contacts/importcsv/' element={<PrivateRoute><CSVUpload/></PrivateRoute>} />
                <Route path='/calendars/' element={<PrivateRoute><CalendarPage/></PrivateRoute>} />
                <Route path='/feed/' element={<PrivateRoute><Feed/></PrivateRoute>} />
                <Route path='/log/' element={<PrivateRoute><Log/></PrivateRoute>} />
            </Routes>
        </Fragment>
    );
}

export default Main;