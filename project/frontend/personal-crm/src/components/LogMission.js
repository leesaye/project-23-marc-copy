import { LinearProgress } from '@mui/material';

function LogMission({missionItem}) {
    return (
        <div>
        <div className="container bg-light rounded-3">
            <div className="row pt-2">
                <div className="col-6">
                    <p>{missionItem.mission_text}</p>
                </div>
                <div className="col-6">
                    {missionItem.completed && <h5 className="text-success">complete ✔</h5>}
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-9">
                    <LinearProgress 
                        variant="determinate" 
                        value={(missionItem.progress / missionItem.total_required)*100} 
                        sx={{ height: 25, borderRadius: 5 }}>
                    </LinearProgress>
                </div>
                <div className="col-3">
                    <p>{missionItem.progress}/{missionItem.total_required}</p>
                </div>
            </div>
        </div>
        <br />
        </div>
    )
}

export default LogMission