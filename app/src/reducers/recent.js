function recent(state = {}, action) {
  switch (action.type) {
    case 'SET_RECENT_DATA': {
      return {
        ...state,
        recentList: action.payload.recentList,
        last: action.payload.recentList[0]
      }
    }
    case 'RESET_LAST': {
      return {
        ...state,
        last: {id: null}
      }
    }
    default:
      return state
  }
}

export default recent