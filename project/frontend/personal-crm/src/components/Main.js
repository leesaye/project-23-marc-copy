import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import Home from '../pages/Home';
import Contacts from '../pages/Contacts'
import AddContact from '../pages/AddContact'

function Main() {
    return (
        <Fragment>
            <Routes>
                {/* Add routes to each different pages with their link path here */}
                <Route path='/' element={<Home />} />
                <Route path='/contacts/' element={<Contacts />} />
                <Route path='/contacts/add/' element={<AddContact />} />
            </Routes>
        </Fragment>
    );
}

export default Main;