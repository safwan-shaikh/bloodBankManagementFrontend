
export const setProgress = (progress) => {
    return {
        type: 'SET_PROGRESS',
        payload: progress,
    };
};

export const setPopupState = (popupState) => {
    return {
        type: 'SET_POPUPSTATE',
        payload: popupState,
    }
}

