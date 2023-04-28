import React, { useEffect, useState } from "react";
import Lottie from "lottie-web";
import poor from '../../../src/static/poor.json'
import veryPoor from '../../../src/static/veryPoor.json';
import moderate from '../../../src/static/moderate.json';
import good from '../../../src/static/good.json';
import fair from '../../../src/static/fair.json';
import sendingMessage from '../../../src/static/sendingMessage.json';
import firebaseConfig from "../../Firebase";
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import icons from "../../Asset/SVG/svgIcons";


const ContactInfo = () => {
    useEffect(() => {
        Lottie.loadAnimation({
            container: document.querySelector("#E1"),
            animationData: good,
        });
        Lottie.loadAnimation({
            container: document.querySelector("#E2"),
            animationData: fair,
        });
        Lottie.loadAnimation({
            container: document.querySelector("#E3"),
            animationData: moderate,
        });
        Lottie.loadAnimation({
            container: document.querySelector("#E4"),
            animationData: poor,
        });
        Lottie.loadAnimation({
            container: document.querySelector("#E5"),
            animationData: veryPoor,
        });
        Lottie.loadAnimation({
            container: document.querySelector("#sending"),
            animationData: sendingMessage,
        });
        getRatingDetails();
    }, []);

    const [ratings, setRatings] = useState({});
    const [showRatings, setShowRatings] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [messageError, setMessageError] = useState('');

    useEffect(() => {
        if (Object.keys(ratings).length > 0 && (showRatings || localStorage.getItem("Rated"))) {
            displayRatings();
        }
    }, [showRatings, ratings]);

    const getRatingDetails = async () => {
        try {
            initializeApp(firebaseConfig);
            const db = getFirestore()
            const ratingsData = await getDoc(doc(db, 'Rating', 'ratingDetails'));
            setRatings(ratingsData.data());
        } catch (error) {
            console.log(error);
        }
    };

    const setRatingDetails = async (rName, rating, count) => {
        try {
            initializeApp(firebaseConfig);
            const db = getFirestore();
            let updateRatingObj = {}
            updateRatingObj[rName] = rating;
            await updateDoc(doc(db, 'Rating', 'ratingDetails'), updateRatingObj);
            await updateDoc(doc(db, 'Rating', 'ratingDetails'), { count: count });
        } catch (error) {
            console.log(error);
        }
    }

    const txtAreaStyle = {
        marginTop: "0.3rem",
        width: "25rem",
        maxWidth: "75%",
        resize: "none",
        borderRadius: "0.5rem",
        height: "5rem",
        textAlign: "initial"
    }

    const emoteContainer = {
        display: "flex",
        flexDirection: "column",
        width: "14rem",
        maxWidth: "20%",
        cursor: "pointer",
        position: "relative",
    }

    const labelStyle = {
        fontSize: "1rem",
        width: "23rem",
        maxWidth: "68%",
        textAlign: "initial",
        marginTop: "1rem",
        padding: "0.4rem",
        backgroundColor: "var(--secondary)"
    }

    const percentText = {
        position: "absolute",
        margin: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "2.5vmax",
        color: 'cornflowerblue',
        display: 'none',
    }

    const handleClick = (ratingName) => {
        if (ratingName in ratings && !localStorage.getItem("Rated")) {
            ratings[ratingName] += 1;
            ratings.count += 1;
            localStorage.setItem("Rated", 'true');
            localStorage.setItem("ratedFor", ratingName);
            localStorage.setItem(ratingName, ratings[ratingName]);
            setRatingDetails(ratingName, ratings[ratingName], ratings.count);
            setRatings(ratings);
            setShowRatings(true);
        }

    }

    const displayRatings = () => {
        const rNames = ['--', 'excellent', 'good', 'average', 'poor', 'bad'];
        const ratedFor = localStorage.getItem("ratedFor")
        for (var i = 1; i < 6; i++) {
            const emotes = document.querySelector(`#E${i}`);
            emotes.classList.remove("rateEmote");
            emotes.classList.add("emote-dark");

            const rateText = document.querySelector(`#R${i}`);
            rateText.style.display = 'block';
            if (ratedFor == rNames[i]) {
                rateText.style.color = 'orangered';
            }
            if (ratings && "count" in ratings) {
                let percent = ratings?.[rNames[i]] && ratings.count != 0 ? ((ratings[rNames[i]] / ratings.count) * 100).toFixed(1) + "%" : "0%";
                rateText.innerHTML = percent;
            }
        }
    }

    const validateForm = () => {
        if (name.trim() == '' || email.trim() == '' || message.trim() == '' || nameError != '' || emailError != '' || messageError != '') {
            return true
        }
    }

    const validateNSetName = (value) => {
        setName(value);
        if (value.trim() == '') {
            setNameError('Name cannot be Empty');
        } else if (value.length > 30) {
            setNameError("Name cannot be of more than 30 characters");
        } else {
            setNameError('')
        }
    }

    const validateNSetEmail = (value) => {
        let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]{1,}[.][a-zA-Z]{2,}$/;
        setEmail(value);
        if (value.trim() == '') {
            setEmailError('Email cannot be Empty');
        } else if (!regexEmail.test(value)) {
            setEmailError("Please enter valid email address");
        } else {
            setEmailError('');
        }
    }


    const validateNSetMessage = (value) => {
        setMessage(value);
        if (value.trim() == '') {
            setMessageError('Message cannot be Empty');
        } else if (value.length > 500) {
            setMessageError('Message cannot be more than 500 characters');
        } else {
            setMessageError('');
        }
    }

    const sendMessage = async () => {
        try {
            document.querySelector("#sending").style.display = 'block';
            document.querySelector("#form").style.display = 'none';
            initializeApp(firebaseConfig);
            const db = getFirestore();
            await addDoc(collection(db, 'Message'), { name: name, email: email, message: message });
            document.querySelector("#sending").style.display = 'none';
            document.querySelector('#thanks').style.display = 'block';
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const nameRef = document.querySelector('#nameError');
        const emailRef = document.querySelector('#emailError');
        const messageRef = document.querySelector('#messageError');
        if (nameError != '') {
            nameRef.style.display = 'block';
        } else {
            nameRef.style.display = 'nono';
        }

        if (emailError != '') {
            emailRef.style.display = 'block';
        } else {
            emailRef.style.display = 'nono';
        }

        if (messageError != '') {
            messageRef.style.display = 'block';
        } else {
            messageRef.style.display = 'nono';
        }
    }, [nameError, emailError, messageError])

    return (
        <>
            <div className="OD-div">
                <h2 className="info-h1 contactTitle">RATE THIS WEBSITE ⭐</h2>
                <div className="other-details-cont">
                    <div id="EC1" style={emoteContainer} onClick={() => { handleClick("excellent") }}>
                        <div id="E1" className="emote lottieAnim rateEmote" />
                        <h3 id="R1" className="info-h1" style={percentText}>93%</h3>
                        <p style={{ fontSize: "1.8vmax", fontWeight: "100" }} className="info-p">Excellent</p>
                    </div>
                    <div id="EC2" style={emoteContainer} onClick={() => { handleClick("good") }}>
                        <div id="E2" className="emote lottieAnim rateEmote" />
                        <h3 id="R2" className="info-h1" style={percentText}>93%</h3>
                        <p style={{ fontSize: "1.8vmax", fontWeight: "100" }} className="info-p">Good</p>
                    </div>
                    <div id="EC3" style={emoteContainer} onClick={() => { handleClick("average") }}>
                        <div id="E3" className="emote lottieAnim rateEmote" />
                        <h3 id="R3" className="info-h1" style={percentText}>93%</h3>
                        <p style={{ fontSize: "1.8vmax", fontWeight: "100" }} className="info-p">Average</p>
                    </div>
                    <div id="EC4" style={emoteContainer} onClick={() => { handleClick("poor") }}>
                        <div id="E4" className="emote lottieAnim rateEmote" />
                        <h3 id="R4" className="info-h1" style={percentText}>93%</h3>
                        <p style={{ fontSize: "1.8vmax", fontWeight: "100" }} className="info-p">Poor</p>
                    </div>
                    <div id="EC5" style={emoteContainer} onClick={() => { handleClick("bad") }}>
                        <div id="E5" className="emote lottieAnim rateEmote" />
                        <h3 id="R5" className="info-h1" style={percentText}>93%</h3>
                        <p style={{ fontSize: "1.8vmax", fontWeight: "100" }} className="info-p">Bad</p>
                    </div>
                </div>
            </div>

            <div style={{ width: "72.5rem", maxWidth: "96%" }} className="OD-div">
                <h2 className="info-h1 contactTitle">SOCIAL 🌐</h2>
                <div className="other-details-cont" style={{ justifyContent: 'space-evenly' }}>
                    <a target="_blank" href="https://www.linkedin.com/in/harshal-gosawi-1382b6238" className="socialIcons" id="linkedin">{icons.linkedin}</a>
                    <a target="_blank" href="https://www.instagram.com/harshal2k/" className="socialIcons" id="instagram">{icons.instagram}</a>
                    <a target="_blank" href="https://youtube.com/c/HGOriginals" className="socialIcons" id="youtube">{icons.youtube}</a>
                    <a target="_blank" href="https://twitter.com/harshal2k?t=bORAy91hBS26XRTeiAOGGw&s=09" className="socialIcons" id="twitter">{icons.twitter}</a>
                    <a target="_blank" href="https://www.facebook.com/harshal.gosawi.16  " className="socialIcons" id="facebook">{icons.facebook}</a>
                </div>
            </div>

            <div style={{ width: "72.5rem", maxWidth: "96%" }} className="OD-div">
                <div id="sending" style={{ width: "40%", display: 'none' }} />
                <h1 id="thanks" className="info-h1" style={{ fontSize: "4vmax", display: "none" }}>Thank's for your feedback😃<span className="feedbackTitle02">WE WILL GET BACK TO YOU SOON</span></h1>
                <div id="form" style={{ display: 'contents' }}>
                    <h2 className="info-h1 contactFormTitle">Let's get in touch 🤝 </h2>
                    <label style={labelStyle} className="info-p">NAME *</label>
                    <input value={name} style={{ marginTop: "0.3rem", width: "25rem", maxWidth: "75%", textAlign: "initial" }} className="searchDiv-Input" placeholder="Name *" onChange={(e) => validateNSetName(e.target.value)} />
                    <p id="nameError" className="info-p" style={{ color: 'red', display: 'none', marginTop: "0.5rem" }}>{nameError}</p>
                    <label style={labelStyle} className="info-p">E-MAIL *</label>
                    <input value={email} style={{ marginTop: "0.3rem", width: "25rem", maxWidth: "75%", textAlign: "initial" }} className="searchDiv-Input" placeholder="E-mail *" onChange={(e) => validateNSetEmail(e.target.value)} />
                    <p id="emailError" className="info-p" style={{ color: 'red', display: 'none', marginTop: "0.5rem" }}>{emailError}</p>
                    <label style={labelStyle} className="info-p">MESSAGE *</label>
                    <textarea value={message} style={txtAreaStyle} placeholder="Message" className="searchDiv-Input txtArea" onChange={(e) => validateNSetMessage(e.target.value)} />
                    <p id="messageError" className="info-p" style={{ color: 'red', display: 'none', marginTop: "0.5rem" }}>{messageError}</p>
                    <button style={{ fontSize: "1.2rem", marginTop: "1rem", transition: "all 200ms ease", borderRadius: "0.5rem" }} className="searchDiv-button" onClick={() => { sendMessage() }} disabled={validateForm()}>SEND</button>
                </div>
            </div>
        </>
    );
};

export default ContactInfo;