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

        }
    ]

    const handleClose = () => {
        setOpen(!open);
    }

    const hChange = (e) => {
        const { name, value } = e.target
        sethospitalDetails({
            ...hospitalDetails,
            [name]: value,
        })
    }

    const applyFilters = (name, value) => {
        sethospitalFilters({
            ...hospitalFilters,
            [name]: value
        })
    }

    const validations = () => {
        for (let i = 0; i < Object?.keys(hospitalDetails)?.length; i++) {
            let key = Object.keys(hospitalDetails)[i];
            if (hospitalDetails[key]?.length <= 0) {
                console.log({ key });
                return true;
            }
        }

        if (hospitalDetails?.phone?.length < 10) {
            return true;
        }

        const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');

        if (!emailRegex?.test(hospitalDetails?.email)) {
            return true;
        }
        return false;
    }

    const hCreate = () => {
        setProgress(65);
        axios.post('http://localhost:8080/api/hospital/createHospital', hospitalDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllHospitals(hospitalFilters, () => { setOpen(!open) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hUpdateBank = () => {
        setProgress(65);
        axios.patch(`http://localhost:8080/api/hospital/updateHospital/${hospitalDetails?.hid}`, hospitalDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllHospitals(hospitalFilters, () => { setOpen(!open); setEditMode(false) })
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
                getAllHospitals(hospitalFilters, () => { setDeleteBank({ open: false, bname: '', bid: 0 }) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hCreateClick = () => {
        axios.post('http://localhost:8080/api/bloodBank/getBanks',)
            .then((res) => {
                setAllBanks(res?.data?.message || []);
                setOpen(!open)
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const dropdownChange = (e, value, name, inBank) => {
        // if (inBank) {
        //     setDonation({
        //         ...donation,
        //         [name]: value,
        //     })
        // } else {
        //     setdonorDetails({
        //         ...donorDetails,
        //         [name]: value,
        //     })
        // }
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
                    data={allHospitals}
                    applyFilters={applyFilters}
                    hClick={hCreateClick} />
            </div>
            <Dialog
                open={open}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{editMode ? 'Update' : 'Create'} Blood Bank</DialogTitle>
                <DialogContent dividers={true}>
                    <TextField className="formInputs" id="outlined-basic" value={hospitalDetails?.hname} name="hname" onChange={hChange} label="Name" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" disabled={editMode} value={hospitalDetails?.phone} name="phone" onChange={hChange} label="Phone" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={hospitalDetails?.email} name="email" onChange={hChange} label="Email" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={hospitalDetails?.country} name="country" onChange={hChange} label="Country" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={hospitalDetails?.state} name="state" onChange={hChange} label="State" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={hospitalDetails?.city} name="city" onChange={hChange} label="city" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={hospitalDetails?.locality} name="locality" onChange={hChange} label="locality" variant="outlined" />
                    <Autocomplete
                        multiple
                        filterSelectedOptions
                        value={hospitalDetails?.bloodBanks || []}
                        options={allBanks?.map((bank) => { return { id: bank?.blood_bank_id, label: bank?.b_name } })}
                        //options={[{ id: 1, label: 'hg' }, { id: 2, label: 'cg' }]}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, value) => { sethospitalDetails({ ...hospitalDetails, bloodBanks: value || [] }) }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Blood Banks"
                                placeholder="Blood Banks"
                                variant="outlined"
                            />
                        )}
                    />
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

export default Hospital;