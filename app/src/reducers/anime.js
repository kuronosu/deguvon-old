function recent(state = {}, action) {
  switch (action.type) {
    case 'SET_ANIME_DATA': {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default recent