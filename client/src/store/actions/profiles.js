import axios from 'axios';
import * as actionTypes from './actionsTypes';

export const fetchProfiles = () => {
    return dispatch => {
        axios.get('/api/profile/all').then(res => {
            dispatch({ type: actionTypes.FETCH_PROFILES, payload: res.data })
        });
    }
}

export const fetchSingleProfile = profile => {
    return dispatch => {
        axios.get(`/api/profile/handle/${profile}`).then(res => {
            dispatch({ type: actionTypes.FETCH_SINGLE_PROFILE, payload: res.data })
        });
    }
}
export const resetSingleProfile = () => {
    return { type: actionTypes.RESET_SINGLE_PROFILE }

}