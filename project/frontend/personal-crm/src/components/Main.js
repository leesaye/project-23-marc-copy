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
import Log from '../pages/Log';
import CSVUpload from '../pages/CSVUpload';
import Settings from '../pages/Settings';

import InteractiveFeed from '../pages/InteractiveFeed';
import AIContextProvider from '../contexts/AIContext';

function Main() {
    return (
        <Fragment>
            <Routes>
                <Route path ='/login' element={<Login />} />
                <Route path ='/register' element={<Register />} />
                <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>} />
                <Route path='/contacts/' element={<PrivateRoute><Contacts/></PrivateRoute>} />
                <Route path='/contacts/add/' element={<PrivateRoute><AddContact/></PrivateRoute>} />
                <Route path='/contacts/:contact_id/' element={<PrivateRoute><ContactId/></PrivateRoute>} />
                <Route path='/contacts/importcsv/' element={<PrivateRoute><CSVUpload/></PrivateRoute>} />
                <Route path='/calendars/' element={<PrivateRoute><CalendarPage/></PrivateRoute>} />
                <Route path='/feed/' element={<PrivateRoute><AIContextProvider><InteractiveFeed/></AIContextProvider></PrivateRoute>} />
                <Route path='/log/' element={<PrivateRoute><Log/></PrivateRoute>} />
                <Route path='/settings/' element={<PrivateRoute><Settings/></PrivateRoute>} />
            </Routes>
        </Fragment>
    );
}

export default Main;