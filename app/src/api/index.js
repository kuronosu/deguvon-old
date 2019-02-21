import SettingsManager from "../utils/settings-manager";

class Api {
  async getBaseApi(){
    return 'http://deguvon.kuronosu.space/api/v1'
  }
  async getRecent() {
    let base = await this.getBaseApi() + '/recent'
    const query = await fetch(base)
    const recent = await query.json()
    return recent
  }
  async getAnimeDetails(aid) {
    let base = await this.getBaseApi() + `/anime/${aid}`
    const query = await fetch(base)
    const recent = await query.json()
    return recent
  }
}

export default new Api();
