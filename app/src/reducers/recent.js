function recent(state = {}, action) {
  switch (action.type) {
    case 'SET_RECENT_DATA': {
      return {
        ...state,
        recentList: action.payload.recentList
      }
    }
    default:
      return state
  }
}

export default recent