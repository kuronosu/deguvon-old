function search(state = {}, action) {
  switch (action.type) {
    case 'SET_SEARCH_DATA': {
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