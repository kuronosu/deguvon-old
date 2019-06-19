import { SET_ANIME_DATA } from "../constants"
import { StoreState, recent } from "../types"
import { SetAnimeData } from "../actions"

function anime(state: StoreState["anime"] = {}, action: SetAnimeData): StoreState["anime"] | recent.recentEpisode ['anime'] {
  switch (action.type) {
    case SET_ANIME_DATA: {
      return {
        ...state,
        ...action.payload
      }
    }
  }
  return state
}

export default anime