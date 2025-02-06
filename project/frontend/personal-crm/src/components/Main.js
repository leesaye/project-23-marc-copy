import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
import Home from '../pages/Home';

function Main() {
    return (
        <Fragment>
            <Routes>
                {/* Add routes to each different pages with their link path here */}
                <Route path='/' element={<Home />} />
            </Routes>
        </Fragment>
    );
}

export default Main;