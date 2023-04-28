const popupReducer = (state = { status: 'hide', message: '', type: 'error' }, {
    type,
    payload
}) => {
    switch (type) {
        case 'SET_POPUPSTATE':
            return payload;
        default:
            return state;
    }
};

export default popupReducer;