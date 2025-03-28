import { useMediaQuery } from 'react-responsive';

function LogActivity({activity, contacts}) {
    const isSmallScreen = useMediaQuery({ query: '(max-width: 1224px)' });

    return (
        <div>
            {!isSmallScreen ? ( /*For desktop screen size*/
            <div className="container bg-light rounded-3 pt-2">
                <div className="row">
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
            ) : ( /*For laptop/phone screen*/
            <div className="container bg-light rounded-3 pt-2">
                <div className="row">
                    <div className="col-6">
                        <p>{activity.title}</p>
                    </div>
                    <div className="col-6">
                        <p>{activity.tag}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <p>{contacts[activity.contact] || ""}</p>
                    </div>
                    <div className="col-6">
                        <p>{activity.end ? activity.end.split('T')[0] : activity.date}</p>
                    </div>
                </div>
            </div>
            )}
            <br />
        </div>
    )
}

export default LogActivity;