import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Autocomplete } from "@mui/material";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import CustomTable from "./customTable";
import { setPopupState } from "../actions";

const Hospital = () => {
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteBank, setDeleteBank] = useState({ open: false, bname: '', bid: 0 });
    const [hospitalDetails, sethospitalDetails] = useState({
        hname: '',
        phone: '',
        email: '',
        country: '',
        state: '',
        city: '',
        locality: '',
        bloodBanks: []
    });

    const [hospitalFilters, sethospitalFilters] = useState({
        hname: '',
        phone: '',
        email: '',
        country: '',
        state: '',
        city: '',
        locality: '',

    });
    const [allHospitals, setAllHospitals] = useState([])
    const [allBanks, setAllBanks] = useState([]);

    useEffect(() => {
        getAllHospitals(hospitalFilters);
    }, [hospitalFilters]);

    const getAllHospitals = (hospitalFilters, callback) => {
        axios.post('http://localhost:8080/api/hospital/getHospitals', { filters: hospitalFilters })
            .then((res) => {
                setAllHospitals(res?.data?.message || []);
                callback && callback();
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const hUpdate = (index) => {
        setEditMode(true);
        sethospitalDetails({ ...hospitalDetails, ...allHospitals[index] });
        setOpen(true);
    }
    console.log({ hospitalDetails })
    const hEditClick = (index) => {
        axios.get(`http://localhost:8080/api/hospital/getHospitalBanks/${allHospitals[index]?.hid}`)
            .then((res) => {
                // hUpdate(index)
                setEditMode(true);
                sethospitalDetails({ ...allHospitals[index], bloodBanks: res?.data?.message });
                setOpen(true);
                hCreateClick();
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const columns = [
        {
            name: 'Name',
            type: 'text',
            dName: 'hname',
        },
        {
            name: 'Phone',
            type: 'text',
            dName: 'phone',
        },
        {
            name: 'Email',
            type: 'text',
            dName: 'email',
        },
        {
            name: 'Country',
            type: 'text',
            dName: 'country',
        },
        {
            name: 'State',
            type: 'text',
            dName: 'state',
        },
        {
            name: 'City',
            type: 'text',
            dName: 'city',
        },
        {
            name: 'Locality',
            type: 'text',
            dName: 'locality',
        },
        {
            name: 'Actions',
            type: 'custom',
            dName: 'blood_bank_id',
            render: (index, data) => {
                return <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <IconButton onClick={() => { setDeleteBank({ open: true, bname: allHospitals[index]?.hname, bid: allHospitals[index]?.blood_bank_id }) }}>
                        <FontAwesomeIcon icon={faTrash} className="actionIcons danger" />
                    </IconButton>
                    <IconButton onClick={() => { hEditClick(index) }}>
                        <FontAwesomeIcon icon={faPenToSquare} className="actionIcons safe" />
                    </IconButton>
                </div>
            }