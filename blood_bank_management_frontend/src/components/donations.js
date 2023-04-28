import React , { useEffect, useState }from "react";
import { useDispatch } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Autocomplete, Stack, Grid } from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { setPopupState } from "../actions";
import CustomTable from "./customTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const Donation = () => {
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteDonor, setDeleteDonor] = useState({ open: false, bname: '', bid: 0 });
    const [donationDetails, setdonationDetails] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        blood_type: '',
        phone: '',
        email: '',
        dob: null,
        created_at: new Date(),
        country: '',
        state: '',
        city: '',
        locality: '',
        hospital: null,
        bank: null,
        quantity_ml: null,
        blood_bag: null

    });
    const [donation, setDonation] = useState({
        quantity_ml: 0,
        bank: null
    });
    const today = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

    const [donorFilters, setdonorFilters] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        blood_type: '',
        phone: '',
        email: '',
        dob: '',
        created_at: new Date(),
        country: '',
        state: '',
        city: '',
        locality: '',

    });
    const [allDonors, setAllDonors] = useState([])
    const [allBanks, setAllBanks] = useState([])
    const [allHospitals, setAllHospitals] = useState([])
    const [allBankDonors, setAllBankDonors] = useState([])

    useEffect(() => {
        getAllDonors(donorFilters);
    }, [donorFilters]);

    const getAllDonors = (donorFilters, callback) => {
        axios.post('http://localhost:8080/api/bloodBag/getBloodBags', { filters: donorFilters })
            .then((res) => {
                setAllDonors(res?.data?.message || []);
                callback && callback();
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }
    const hUpdate = (index) => {
        setEditMode(true);
        setdonationDetails(allDonors[index] || donationDetails);
        setOpen(true);
    }

    return (
        <>
        </>
    );
};

export default Donation;