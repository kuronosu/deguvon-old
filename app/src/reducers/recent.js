function recent(state = {}, action) {
  switch (action.type) {
    case 'SET_RECENT_DATA': {
      return {
        ...state,
        recent: {
          ...action.payload
        }
      }
    }
    case 'SET_DEVICE_DATA': {
      return {
        ...state,
        device: {
          ...action.payload
        }
      }
    }
    default:
      return state
  }
}

export default recent