import * as actionTypes from '../actions/actionsTypes';

const initialState = {
    profiles: [],
    currentProfile: {}
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_PROFILES:
            return {
                ...state,
                profiles: action.payload
            };
        case actionTypes.FETCH_SINGLE_PROFILE:
            return {
                ...state,
                currentProfile: action.payload
            };
        case actionTypes.RESET_SINGLE_PROFILE:
            return {
                ...state,
                currentProfile: {}
            };

        default: return state;
    }
}


export default reducer;