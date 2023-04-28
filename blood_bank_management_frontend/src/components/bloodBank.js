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

    return (
        <>
        </>
    );
};

export default BloodBank;