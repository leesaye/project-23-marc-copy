import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import Home from '../pages/Home';
import Contacts from '../pages/Contacts'
import AddContact from '../pages/AddContact'
import ContactId from '../pages/ContactId';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import Register from '../pages/Register';

import { AuthProvider } from '../contexts/useAuth'; 

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
            </Routes>
        </Fragment>
    );
}

export default Main;