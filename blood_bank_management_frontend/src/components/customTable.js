import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPopupState } from "../actions";
import { Autocomplete, Button, IconButton, MenuItem, Select, TextField } from "@mui/material";
import moment from "moment";

const CustomTable = ({ title, btnText, hClick, columns, data, applyFilters }) => {
    const hChange = (e) => {
        const { name, value } = e.target;
        console.log({ name });
        console.log({ value });
        console.log({ e })
        applyFilters && applyFilters(name, value)
    }

    const dropdownChange = (e, value,name) => {
        applyFilters && applyFilters(name, value)
    }
    return (
        <div className="tableStyles">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 className="info-h1">{title}</h1>
                <Button style={{ marginRight: '2rem' }} onClick={hClick} variant="contained">{btnText}</Button>
            </div>
            <div className="table-container">
                <table style={{ borderSpacing: '0' }}>
                    <thead>
                        <tr>
                            {columns?.map((col) => <th>{col?.name}</th>)}
                        </tr>
                        <tr>
                            {columns?.map((col) => {
                                if (col?.type == "text") {
                                    return <td>
                                        <TextField size="small" id="outlined-basic" onChange={hChange} name={col?.dName || ''} label={col?.name} variant="outlined" />
                                    </td>
                                } else if (col?.type == "dropdown") {
                                    return <td>
                                        <Autocomplete
                                            size="small"
                                            disablePortal
                                            id="combo-box-demo"
                                            onChange={(e, value) => { dropdownChange(e, value, col?.dName || '') }}
                                            name={col?.dName || ''}
                                            options={col?.options || []}
                                            renderInput={(params) => <TextField size="small" {...params} label={col?.name} />}
                                        />
                                    </td>
                                } else {
                                    return <td><></></td>
                                }
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((row, i) =>
                            <tr>
                                {columns?.map((elem) => {
                                    if (elem?.type == "custom") {
                                        return <td>{elem?.render(i, row[elem?.dName])}</td>
                                    }else if(elem?.isDate){
                                        return <td>{moment(row[elem?.dName]).format('Do MMMM YYYY')}</td>
                                    } else {
                                        return <td>{row[elem?.dName]}</td>
                                    }
                                })}
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default CustomTable;   