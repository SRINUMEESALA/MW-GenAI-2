import { UPDATE_API_CALL_COUNT } from "./types";

const initialState = {
  apiCallsCount: 0,
  disableChat: false,
  timer: 60,
};

const reducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case UPDATE_API_CALL_COUNT:
      console.log("before update===============================", {
        ...state,
        apiCallsCount: payload.apiCallsCount,
        disableChat: payload.disableChat,
        timer: payload.timer,
      });
      return {
        ...state,
        apiCallsCount: payload.apiCallsCount,
        disableChat: false,
        timer: 60,
      };
    default:
      return state;
  }
};
export default reducer;
