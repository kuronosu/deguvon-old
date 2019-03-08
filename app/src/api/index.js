import { store } from '../store';

class Api {
  getBaseApi(){
    const { host, route} = store.getState().app.config.api
    return `https://${host}${route}`
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
    const anime = await query.json()
    return anime
  }

  async getDirectory() {
    let base = `${this.getBaseApi()}/directory`
    const query = await fetch(base)
    const directory = await query.json()
    return directory
  }
}

export default new Api();
