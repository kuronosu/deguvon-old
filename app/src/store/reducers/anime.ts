import { StoreState, RecentEpisode } from "../.."
import { SET_ANIME_DATA } from "../constants"
import { SetAnimeData } from "../actions"

function anime(state: StoreState["anime"] = {}, action: SetAnimeData): StoreState["anime"] | RecentEpisode ['anime'] {
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