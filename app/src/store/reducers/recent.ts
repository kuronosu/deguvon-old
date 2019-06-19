import { SET_RECENT_DATA, CLEAR_LAST } from "../constants"
import { StoreState } from "../types"
import { RecentAction } from "../actions"

function recent(state: StoreState['recent'] = {list: [], last:{id: null}}, action: RecentAction): StoreState['recent'] {
  switch (action.type) {
    case SET_RECENT_DATA: {
      return {
        ...state,
        list: action.payload,
        last: action.payload[0]
      }
    }
    case CLEAR_LAST: {
      return {
        ...state,
        last: { id: null }
      }
    }
    default:
      return state
  }
}

export default recent