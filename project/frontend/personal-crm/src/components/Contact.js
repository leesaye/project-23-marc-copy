import React from 'react';

function Contact({contact}) {
    return (
        <div className="d-flex flex-column">
            <div className="row" key={contact.id}>
                <hr />
                <div className="col-4">
                    <p>{contact.name}</p>
                </div>
                <div className="col-2">
                    <p>{contact.job}</p>
                </div>
                <div className="col-3">
                    <p>{contact.relationship_rating}</p>
                </div>
                <div className="col-2">
                    <p>{contact.relationship}</p>
                </div>
                <div className="col-1">
                    <a className="link-primary link-underline-opacity-0" href="/contacts/">Edit</a>
                </div>
            </div>
        </div>
    );
}

export default Contact;
