import React from "react";

const WeatherInfo = ({ header, data, unit }) => {
    let emoji = null;
    switch (header) {
        case 'FEELS LIKE':
            emoji = "🤔";
            break;
        case 'TEMP MIN':
            emoji = "🌡👇"
            break;
        case 'TEMP MAX':
            emoji = "🌡☝️";
            break;
        case 'PRESSURE':
            emoji = "🎚️"
            break;
        case 'HUMIDITY':
            emoji = "💦"
            break;
        case 'DEW POINT':
            emoji = "💧"
            break;
        case 'UVI':
            emoji = "😎"
            break;
        case 'CLOUDS':
            emoji = "☁️"
            break;
        case 'VISIBILITY':
            emoji = "🌫️"
            break;
        case 'WIND SPEED':
            emoji = "🎐"
            break;
        case 'WIND DEGREE':
            emoji = "📐"
            break;
        case 'WIND GUST':
            emoji = "💨"
            break;
        case 'TEMP DAY':
            emoji = "🌡🌄"
            break;
        case 'TEMP NIGHT':
            emoji = "🌡🌃"
            break;
        case 'TEMP MORN.':
            emoji = "🌡🌅"
            break;
        case 'TEMP EVE.':
            emoji = "🌡🌤️"
            break;
        case 'FEELS LIKE DAY':
            emoji = "🤔🌄"
            break;
        case 'FEELS LIKE NIGHT':
            emoji = "🤔🌃"
            break;
        case 'FEELS LIKE MORN.':
            emoji = "🤔🌅"
            break;
        case 'FEELS LIKE EVE.':
            emoji = "🤔🌤️"
            break;
        case 'SNOW VOLUME' || 'SNOW VOLUME (1Hr)':
            emoji = "🌨️"
            break;
        case 'RAIN VOLUME' || 'RAIN VOLUME (1Hr)':
            emoji = "🌧️"
            break;
        default:
            break;
    }
    return (
        <div className="weather-info-div">
            <p>{emoji}</p>
            <p className="info-p">{header}</p>
            <h1 className="info-h1">{data}</h1>
            {unit === "deg" ?
                <p className="info-p">&#8451;</p> :
                <p className="info-p">{unit}</p>
            }
        </div>
    );
};

export default WeatherInfo;