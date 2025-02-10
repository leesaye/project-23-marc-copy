import React from 'react';

function Contact({contact}) {
    return (
        <div>
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
            </div>
        </div>
    );
}

export default Contact;
