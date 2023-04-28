const progressReducer=(state=0,{type,payload})=>{
    switch (type) {
        case 'SET_PROGRESS':
            return payload;
        default:
            return state;
    };
};

export default progressReducer;