function directory(state = {}, action) {
  switch (action.type) {
    case 'SET_DIRECTORY_DATA': {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default directory