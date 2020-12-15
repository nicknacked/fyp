import axios from 'axios';
import config from '../../config';
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return {...state, user: action.payload};
    case 'SIGN_OUT': 
      return {...state, user: initialState };
    case 'CREATE_HISTORY':
      axios.post(`${config.prod}/api/history/create`, { user_id: action.payload.user_id, page_name: action.payload.page_name, class_id: action.payload.class_id })
        .then().catch();
      return {...state };
    case 'SPENT_TIME':
      axios.post(`${config.prod}/api/history/time/create`, { user_id: action.payload.user_id, page_name: action.payload.page_name, 
          class_id: action.payload.class_id, time_spent: action.payload.time_spent })
        .then().catch();
      return {...state };
    default:
      return state;
  }
}