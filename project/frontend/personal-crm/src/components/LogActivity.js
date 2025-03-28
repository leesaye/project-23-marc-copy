function LogActivity({activity, contacts}) {
    return (
        <div>
            <div className="container bg-light rounded-3">
                <div className="row bg-light pt-2 rounded-3">
                    <div className="col-4">
                        <p>{activity.title}</p>
                    </div>
                    <div className="col-3">
                        <p>{activity.tag}</p>
                    </div>
                    <div className="col-3">
                        <p>{contacts[activity.contact] || ""}</p>
                    </div>
                    <div className="col-2">
                        <p>{activity.end ? activity.end.split('T')[0] : activity.date}</p>
                    </div>
                </div>
            </div>
            <br />
        </div>
    )
}

export default LogActivity;