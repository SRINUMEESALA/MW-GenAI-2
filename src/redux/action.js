import { UPDATE_API_CALL_COUNT } from "./types";

export const UpdateApiCallsCount = (payload) => ({
  type: UPDATE_API_CALL_COUNT,
  payload,
});
