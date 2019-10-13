import { StoreState } from "../../"
import { SET_RECENT_DATA, CLEAR_LAST } from "../constants"
import { RecentAction } from "../actions"

function recent(state: StoreState['recent'] = {list: [], last: null}, action: RecentAction): StoreState['recent'] {
  switch (action.type) {
    case SET_RECENT_DATA: {
      return {
        ...state,
        list: action.payload,
        last: action.payload[0].animeflv_url
      }
    }
    case CLEAR_LAST: {
      return {
        ...state,
        last: null
      }
    }
    default:
      return state
  }
}

export default recent