function general(state = {}, action) {
  switch (action.type) {
    case 'SET_DEVICE_DATA': {
      return {
        ...state,
        device: {
          ...state.device,
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

export default general