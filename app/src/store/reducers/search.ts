import { StoreState } from "../../";
import { SET_SEARCH_DATA } from "../constants"
import { SetSearchData } from "../actions";

function search(state: StoreState['search'] = {text: '', data:[]}, action: SetSearchData): StoreState['search'] {
  switch (action.type) {
    case SET_SEARCH_DATA: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default search