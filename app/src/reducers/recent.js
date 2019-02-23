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
    case 'SET_CONFIG': {
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload
        }
      }
    }
    default:
      return state
  }
}

export default recent