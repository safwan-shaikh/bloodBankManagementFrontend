import React , { useEffect, useState }from "react";
import { useDispatch } from "react-redux";

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
    return (
        <>
        </>
    );
};

export default Donation;