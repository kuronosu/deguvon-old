import { StoreState } from "../../"
import { SET_DIRECTORY_DATA } from "../constants"
import { SetDirectoryData } from "../actions"

function directory(state: StoreState['directory'] = { updated: false, updating: false, data: [] }, action: SetDirectoryData): StoreState['directory'] {
  switch (action.type) {
    case SET_DIRECTORY_DATA: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default directory