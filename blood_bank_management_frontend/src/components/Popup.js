import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPopupState } from "../actions";

const Popup = () => {
    const dispatch = useDispatch();
    const popup = useSelector(state => state.popupState);
    const [popupStyle, setPopupStyle] = useState({ display: 'none' })
    useEffect(() => {
        if (popup.status == 'hide') {
            setPopupStyle({ display: 'none' })
        } else if (popup?.status == 'show') {
            setPopupStyle({ display: 'inline-flex', animation: 'popupAnim 600ms ease forwards' });
            if (popup.type === 'success') {
                setTimeout(() => {
                    dispatch(setPopupState({ status: 'close', message: popup?.message, type: 'success' }));
                }, 3000);
            }
        } else if (popup.status == 'close') {
            setPopupStyle({ display: 'inline-flex', animation: 'closeAnim 800ms ease forwards' });
            setTimeout(() => {
                dispatch(setPopupState({ status: 'hide', message: popup?.message, type: 'error' }));
            }, 850);
        }

    }, [popup]);
    return (
        <div className={popup?.type === 'success' ? "popUp popup-success" : "popUp popup-error"} style={{ ...popupStyle, zIndex: '2147483657' }}>
            <p style={{ color: '#31344b', fontSize: "1rem", letterSpacing: "0", marginRight: "2rem" }} className="info-p">{popup.message}</p>
            <div className="popUp-btn" style={{ opacity: popup?.status === 'show' ? 1 : 0 }} onClick={() => { dispatch(setPopupState({ status: 'close', message: popup?.message })); }}>
                <span>&times;</span>
                <div></div>
            </div>
        </div>
    );
}

export default Popup;   