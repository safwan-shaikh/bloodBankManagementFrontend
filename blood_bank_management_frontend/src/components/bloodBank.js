import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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

    return (
        <>
        </>
    );
};

export default BloodBank;