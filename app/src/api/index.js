import { store } from '../store';

class Api {
  getBaseApi(){
    const { host, route} = store.getState().config.api
    return `http://${host}${route}`
  }
  async getRecent() {
    let base = `${this.getBaseApi()}/recent`
    const query = await fetch(base)
    const recent = await query.json()
    return recent
  }
  async getAnimeDetails(aid) {
    let base = `${this.getBaseApi()}/anime/${aid}`
    const query = await fetch(base)
    const recent = await query.json()
    return recent
  }
}

export default new Api();
