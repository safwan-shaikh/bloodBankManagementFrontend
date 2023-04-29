
import React, { useState } from "react";
import OtherDetails from "./weatherComponents/otherDetails";
import LoadingBar from 'react-top-loading-bar'

const Dashboard = () => {
    const [progress, setProgress] = useState(0);
    return (
        <div className="weather-details-cont">
            <div className="other-details-cont">
                <OtherDetails header="DONORS" elements={{ value: 100, desc: 'Total Donors' }} />
                <OtherDetails header="DONATIONS" elements={{ value: 100, desc: 'Total Donations' }} />
                <OtherDetails header="BLOOD BANKS" elements={{ value: 100, desc: 'Total Banks Onboarded' }} />
                <OtherDetails header="HOSPITALS" elements={{ value: 100, desc: 'Total Hospitals Onboarded' }} />
                <OtherDetails header="PATIENTS" elements={{ value: 100, desc: 'Total Patients Reached' }} />
            </div>
            <LoadingBar
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => setProgress(0)} />
            <div className="weather-div">

            </div>
        </div>
    );
}

export default Dashboard;