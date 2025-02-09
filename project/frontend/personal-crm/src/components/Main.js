import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import Home from '../pages/Home';
import Contacts from '../pages/Contacts'
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import Register from '../pages/Register';

import { AuthProvider } from '../contexts/useAuth'; 

function Main() {
    return (
        <Fragment>
            <AuthProvider>
                <Routes>
                    {/* Add routes to each different pages with their link path here */}
                    <Route path ='/login' element={<Login />} />
                    <Route path ='/register' element={<Register />} />
                    <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>} />
                    <Route path='/contacts/' element={<PrivateRoute><Contacts/></PrivateRoute>} />
                </Routes>
            </AuthProvider>
        </Fragment>
    );
}

export default Main;