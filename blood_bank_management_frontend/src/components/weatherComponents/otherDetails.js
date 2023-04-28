import React from "react";


//var elements = [{ name: speed, data: 1000, unit: "" }]
const OtherDetails = ({ header, elements }) => {
    const windStyle = {
        color: "var(--text-primary)",
        fontSize: "2rem",
        fontFamily: "Cabin",
        fontWeight: "400"
    };

    const generateEmoji = (name) => {
        switch (name) {
            case 'SPEED':
                return "🎐";
                break;
            case 'GUST':
                return "💨";
                break;
            case 'DEGREE':
                return "📐";
                break;
            case 'SEA LVL':
                return "🌊";
                break;
            case 'GROUND LVL':
                return "⛱️";
                break;
            case 'CLOUDINESS':
                return "☁️";
                break;
            case 'SUNRISE':
                return "🌅";
                break;
            case 'SUNSET':
                return "🌇";
                break;
            default:
                return null;
                break;
        }
    }
    return (
        <div className="OD-div">
            <h1 style={windStyle}>{header}</h1>
            <div className="OD-info">
                <h1 style={{ fontSize: '4rem' }} className="info-h1">{elements?.value}</h1>
                <p className="info-p">{elements?.desc}</p>
                {/* {elements.map((elem, index) =>
                    <div key={index} className="ODI-div">
                        <p>{generateEmoji(elem.name)}</p>
                        <h1 className="info-h1">{elem.data} {elem.unit}</h1>
                        <p className="info-p">{elem.name}</p>
                        {elem.unit === "deg" ?
                            <h1 className="info-h1">{elem.data} &deg;</h1> :
                            <h1 className="info-h1">{elem.data} {elem.unit}</h1>
                        }
                    </div>)
                } */}
            </div>
        </div>
    );
};

export default OtherDetails;

