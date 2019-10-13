import { StoreState } from "../../"
import { SET_DEVICE_DATA, SET_CONFIG } from "../constants"
import { AppDataAction } from "../actions"

function app(state: StoreState['app'] = {}, action: AppDataAction): StoreState['app'] {
  switch (action.type) {
    case SET_DEVICE_DATA: {
      return {
        ...state,
        device: {
          ...state.device,
          ...action.payload
        }
      }
    }
    case SET_CONFIG: {
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload
        }
      }
    }
    default:
      return state
  }
}

export default app