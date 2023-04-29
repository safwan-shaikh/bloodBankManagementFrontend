import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton } from "@mui/material";
import CustomTable from "./customTable";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { setPopupState } from "../actions";


const BloodBank = () => {

    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteBank, setDeleteBank] = useState({ open: false, bname: '', bid: 0 });
    const [bankDetails, setBankDetails] = useState({
        b_name: '',
        phone: '',
        email: '',
        country: '',
        state: '',
        city: '',
        locality: '',

    });


    const [bankFilters, setBankFilters] = useState({
        b_name: '',
        phone: '',
        email: '',
        country: '',
        state: '',
        city: '',
        locality: '',

    });
    const [allBanks, setAllBanks] = useState([])

    useEffect(() => {
        getAllBanks(bankFilters);
    }, [bankFilters]);

    const getAllBanks = (bankFilters, callback) => {
        axios.post('http://localhost:8080/api/bloodBank/getBanks', { filters: bankFilters })
            .then((res) => {
                setAllBanks(res?.data?.message || []);
                callback && callback();
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const hChange = (e) => {
        const { name, value } = e.target
        setBankDetails({
            ...bankDetails,
            [name]: value,
        })
    }

    const applyFilters = (name, value) => {
        setBankFilters({
            ...bankFilters,
            [name]: value
        })
    }

    const validations = () => {
        for (let i = 0; i < Object?.keys(bankDetails)?.length; i++) {
            let key = Object.keys(bankDetails)[i];
            if (bankDetails[key]?.length <= 0) {
                return true;
            }
        }

        if (bankDetails?.phone?.length < 10) {
            return true;
        }

        const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');

        if (!emailRegex?.test(bankDetails?.email)) {
            return true;
        }
        return false;
    }

    const hCreate = () => {
        setProgress(65);
        axios.post('http://localhost:8080/api/bloodBank/createBank', bankDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllBanks(bankFilters, () => { setOpen(!open) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hUpdateBank = () => {
        setProgress(65);
        axios.patch(`http://localhost:8080/api/bloodBank/updateBank/${bankDetails?.blood_bank_id}`, bankDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllBanks(bankFilters, () => { setOpen(!open); setEditMode(false) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hDelete = () => {
        setProgress(65);
        axios.delete(`http://localhost:8080/api/bloodBank/deleteBank/${deleteBank?.bid}`)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllBanks(bankFilters, () => { setDeleteBank({ open: false, bname: '', bid: 0 }) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }
    return (
        <>
            <div className="pollutionContainer">
                <LoadingBar
                    color='#f11946'
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)} />
                <CustomTable
                    columns={columns}
                    title={"Blood Banks"}
                    btnText={"Create Blood Bank"}
                    data={allBanks}
                    applyFilters={applyFilters}
                    hClick={() => { setOpen(!open) }} />
            </div>
            <Dialog
                open={open}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{editMode ? 'Update' : 'Create'} Blood Bank</DialogTitle>
                <DialogContent dividers={true}>
                    <TextField className="formInputs" id="outlined-basic" value={bankDetails?.b_name} name="b_name" onChange={hChange} label="Name" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" disabled={editMode} value={bankDetails?.phone} name="phone" onChange={hChange} label="Phone" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={bankDetails?.email} name="email" onChange={hChange} label="Email" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={bankDetails?.country} name="country" onChange={hChange} label="Country" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={bankDetails?.state} name="state" onChange={hChange} label="State" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={bankDetails?.city} name="city" onChange={hChange} label="city" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={bankDetails?.locality} name="locality" onChange={hChange} label="locality" variant="outlined" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={validations()} onClick={() => { editMode ? hUpdateBank() : hCreate() }}>{editMode ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteBank?.open}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Delete Blood Bank</DialogTitle>
                <DialogContent dividers={false}>
                    <DialogContentText>
                        Are you sure you want to delete the blood bank <span style={{ color: 'white', backgroundColor: '#e3970c', padding: '0 0.3rem', borderRadius: '0.5rem' }}>{deleteBank?.bname}</span> ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => { setDeleteBank({ open: false, bname: '' }) }}>Cancel</Button>
                    <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={hDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BloodBank;