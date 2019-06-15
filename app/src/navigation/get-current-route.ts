import { store } from "../store"

const getCurrentRoute = () => {
  const findCurrentRoute = (navState: any): string => {
    if (navState.index !== undefined) {
      return findCurrentRoute(navState.routes[navState.index])
    }
    return navState.routeName
  }
  const nav = store.getState().nav
  return nav ? findCurrentRoute(nav): ''
}

export default getCurrentRoute