import React from 'react';
import { LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

function Contact({contact}) {
    const isSmallScreen = useMediaQuery({ query: '(max-width: 1224px)' });

    return (
        <div className="d-flex flex-column">
            {!isSmallScreen ? ( /*For desktop screen size*/
                <div className="row" key={contact.id}>
                    <hr />
                    <div className="col-4">
                        <p>{contact.name}</p>
                    </div>
                    <div className="col-2">
                        <p>{contact.job}</p>
                    </div>
                    <div className="col-3">
                        <LinearProgress className="w-75"
                            variant="determinate"
                            value={contact.relationship_rating}
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                    </div>
                    <div className="col-2">
                        <p>{contact.relationship}</p>
                    </div>
                    <div className="col-1">
                        <Link className="link-primary link-underline-opacity-0" to={`/contacts/${contact.id}/`}>Edit</Link>
                    </div>
                </div>
            ) : ( /*For laptop/phone screen (not smallest size)*/
                <div className="row" key={contact.id}>
                    <hr />
                    <div className="col-4">
                        <p>{contact.name}</p>
                    </div>
                    <div className="col-5">
                        <LinearProgress className="w-75"
                            variant="determinate"
                            value={contact.relationship_rating}
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                    </div>
                    <div className="col-3">
                        <Link className="link-primary link-underline-opacity-0" to={`/contacts/${contact.id}/`}>Edit</Link>
                    </div>
                </div>
            )}
        </div> 
    );
}

export default Contact;
