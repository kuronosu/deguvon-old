function anime(state = {}, action) {
  switch (action.type) {
    case 'SET_ANIME_DATA': {
      return {
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default anime