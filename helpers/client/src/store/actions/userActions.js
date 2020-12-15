import {
    SIGN_IN,
    SIGN_OUT,
    CREATE_HISTORY,
    SPENT_TIME
} from './types/types';

export const signIn = data => {
    return {
        type: SIGN_IN,
        payload: data,
    };  
};

export const createHistory = data => {
    return {
        type: CREATE_HISTORY,
        payload: data,
    };
};

export const createTimeSpent = data => {
    return {
        type: SPENT_TIME,
        payload: data,
    };
};

export const signOut = () => {
    return {
        type: SIGN_OUT
    }
}