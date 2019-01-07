import * as actionTypes from '../actions/actionsTypes';

const initialState = {
    posts: []
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_POSTS:
            return state;

        default: return state;
    }
}


export default reducer;