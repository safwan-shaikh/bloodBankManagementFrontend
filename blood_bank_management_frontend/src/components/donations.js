import React, { useEffect, useState } from "react";
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

    const columns = [
        {
            name: 'Donated By',
            type: 'text',
            dName: 'first_name',
        },
        {
            name: 'Blood Type',
            type: 'dropdown',
            dName: 'blood_type',
            options: ['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-']
        },
        {
            name: 'Donor Date Of Birth',
            dName: 'dob',
            isDate: true,
        },
        {
            name: 'Quantity (ml)',
            type: 'text',
            dName: 'quantity_ml',
        },
        {
            name: 'Remaining (ml)',
            type: 'text',
            dName: 'remaining_ml',
        },
        {
            name: 'Blood Bank',
            type: 'text',
            dName: 'b_name',
        },
        {
            name: 'Donation Date',
            type: 'donation_date',
            isDate: true,
        },
        {
            name: 'Expiry Date',
            type: 'expiry_date',
            isDate: true,
        }
    ]

    const handleClose = () => {
        setOpen(!open);
    }

    const hChange = (e) => {
        const { name, value } = e.target
        setdonationDetails({
            ...donationDetails,
            [name]: value,
        })
    }
    const dropdownChange = (e, value, name, inBank) => {
        if (inBank) {
            setDonation({
                ...donation,
                [name]: value,
            })
        } else {
            setdonationDetails({
                ...donationDetails,
                [name]: value,
            })
        }
    }

    const applyFilters = (name, value) => {
        setdonorFilters({
            ...donorFilters,
            [name]: value
        })
    }

    const validations = () => {
        // for (let i = 0; i < Object?.keys(donationDetails)?.length; i++) {
        //     let key = Object.keys(donationDetails)[i];
        //     if (donationDetails[key]?.length <= 0) {
        //         return true;
        //     }
        // }

        // if (donationDetails?.phone?.length < 10) {
        //     return true;
        // }

        // const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');

        // if (!emailRegex?.test(donationDetails?.email)) {
        //     return true;
        // }

        // if (donationDetails?.quantity_ml <= 0 || donationDetails?.bank == null) {
        //     return true;
        // }

        return false;
    }

    const hCreate = () => {
        setProgress(65);
        axios.patch(`http://localhost:8080/api/bloodBag/updateBloodBag/${donationDetails?.blood_bag?.id}`, donationDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllDonors(donorFilters, () => { setOpen(!open) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hUpdateBank = () => {
        setProgress(65);
        axios.patch(`http://localhost:8080/api/donor/updateDonor/${donationDetails?.donor_id}`, donationDetails)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllDonors(donorFilters, () => { setOpen(!open); setEditMode(false) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }

    const hDelete = () => {
        setProgress(65);
        axios.delete(`http://localhost:8080/api/bloodBank/deleteDonor/${deleteDonor?.bid}`)
            .then(res => {
                setProgress(80);
                dispatch(setPopupState({ status: 'show', message: typeof res?.data?.message == 'string' ? res?.data?.message : 'Success', type: 'success' }));
                setProgress(100);
                getAllDonors(donorFilters, () => { setDeleteDonor({ open: false, bname: '', bid: 0 }) })
            })
            .catch(({ response }) => {
                setProgress(100);
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
                console.log(response);
            });
    }


    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <TextField
            className="formInputs"
            variant="outlined"
            label="Date Of Birth"
            placeholder="Select date"
            value={value}
            inputRef={ref}
            onClick={onClick}
        />
    ));

    const hCreateClick = () => {
        axios.post('http://localhost:8080/api/hospital/getHospitals', { filters: {} })
            .then((res) => {
                setAllHospitals(res?.data?.message || []);
                setOpen(!open)
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const hHospitalChange = (value) => {
        setdonationDetails({ ...donationDetails, hospital: value })
        axios.get(`http://localhost:8080/api/hospital/getHospitalBanks/${value?.id}`, { filters: {} })
            .then((res) => {
                setAllBanks(res?.data?.message || []);
            })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
            });
    }

    const hQuantityChange = (e) => {
        setdonationDetails({ ...donationDetails, quantity_ml: e?.target?.value });
        axios.post(`http://localhost:8080/api/bloodBank/getBanksDonors/${donationDetails?.bank?.id}`,
            {
                quantity_ml: e?.target?.value,
                blood_type: donationDetails?.blood_type
            }
        ).then((res) => {
            setAllBankDonors(res?.data?.message || []);
        })
            .catch(({ response }) => {
                dispatch(setPopupState({ status: 'show', message: response?.data?.message || 'Something Went Wrong!', type: 'response' }));
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
                    title={"Donations"}
                    btnText={"Add Patient"}
                    data={allDonors}
                    applyFilters={applyFilters}
                    hClick={hCreateClick} />
            </div>
            <Dialog
                open={open}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">{editMode ? 'Update' : 'Create'} Donor</DialogTitle>
                <DialogContent dividers={true} style={{ alignItems: 'center' }}>
                    <TextField className="formInputs" id="outlined-basic" value={donationDetails?.first_name} name="first_name" onChange={hChange} label="First Name" variant="outlined" />
                    <TextField className="formInputs" id="outlined-basic" value={donationDetails?.last_name} name="last_name" onChange={hChange} label="Last Name" variant="outlined" />
                    <div style={{ width: '91%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Autocomplete style={{ width: 'inherit' }} variant="outlined" disabled={editMode} disablePortal value={donationDetails?.gender} onChange={(e, value) => { dropdownChange(e, value, "gender") }} name={"gender"} options={['Male', 'Female']}
                            renderInput={(params) => <TextField variant="outlined" className="formInputs" {...params} label="Gender" />}
                        />
                        <Autocomplete style={{ width: 'inherit', marginLeft: '1rem' }} disabled={editMode} variant="outlined" disablePortal value={donationDetails?.blood_type} onChange={(e, value) => { dropdownChange(e, value, "blood_type") }} name={"blood_type"} options={['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-']}
                            renderInput={(params) => <TextField variant="outlined" className="formInputs" {...params} label="Blood Type" />}
                        />
                    </div>
                    <DatePicker
                        selected={donationDetails?.dob ? new Date(donationDetails?.dob) : null}
                        onChange={(date) => setdonationDetails({ ...donationDetails, dob: date })}
                        maxDate={fiveYearsAgo}
                        customInput={<CustomInput />}
                    />
                    <Autocomplete style={{ width: '91%' }} disabled={editMode} variant="outlined" disablePortal value={donationDetails?.hospital} onChange={(e, value) => { hHospitalChange(value) }} name={"hospital"} options={allHospitals?.map((hospital) => { return { id: hospital?.hid, label: hospital?.hname } })}
                        renderInput={(params) => <TextField variant="outlined" className="formInputs" {...params} label="Hospital" />}
                    />
                    <Autocomplete style={{ width: '91%' }} disabled={!donationDetails?.hospital} variant="outlined" disablePortal value={donationDetails?.bank} onChange={(e, value) => { setdonationDetails({ ...donationDetails, bank: value }) }} name={"bank"} options={allBanks}
                        renderInput={(params) => <TextField variant="outlined" className="formInputs" {...params} label="Blood Type" />}
                    />
                    <TextField className="formInputs" id="outlined-basic" disabled={!donationDetails?.bank} value={donationDetails?.quantity_ml} name="quantity_ml" onChange={(e) => { hQuantityChange(e) }} label="Blood Quantity (ml)" variant="outlined" />
                    <Autocomplete style={{ width: '91%' }} disabled={!donationDetails?.bank} variant="outlined" disablePortal value={donationDetails?.blood_bag} onChange={(e, value) => { setdonationDetails({ ...donationDetails, blood_bag: value }) }} name={"bag"} options={allBankDonors}
                        renderInput={(params) => <TextField variant="outlined" className="formInputs" {...params} label="Select Doner" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={validations()} onClick={() => { hCreate() }}>{editMode ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteDonor?.open}
                scroll={"paper"}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description">
                <DialogTitle id="scroll-dialog-title">Delete Blood Bank</DialogTitle>
                <DialogContent dividers={false}>
                    <DialogContentText>
                        Are you sure you want to delete the Donor <span style={{ color: 'white', backgroundColor: '#e3970c', padding: '0 0.3rem', borderRadius: '0.5rem' }}>{deleteDonor?.bname}</span> ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => { setDeleteDonor({ open: false, bname: '' }) }}>Cancel</Button>
                    <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={hDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Donation;
