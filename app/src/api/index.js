import SettingsManager from "../utils/settings-manager";

class Api {
  async getBaseApi(){
    return await SettingsManager.getSetting('API_SERVER') + '/api'
  }
  async getRecent() {
    let base = await this.getBaseApi()
    const query = await fetch(base)
    const recent = await query.json()
    return recent
  }
}

export default new Api();
