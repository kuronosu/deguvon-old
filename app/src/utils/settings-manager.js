import { AsyncStorage } from "react-native";
import Storage from "./storage";

const DEFAULTS = {
  API_SERVER: 'http://192.168.0.36:3000'
}

const VALID_TYPES = {
  API_SERVER: ['string']
}

class SettingsManager{
  async verifyExistingSettings(){
    const exist = await Storage.retrieveData('SETTINGS', null)
    if (exist){return true}
    Storage.storeData('SETTINGS', {})
    return false
  }
  async setSetting(setting, value){
    const exits = await this.verifyExistingSettings()
    let settings = await Storage.retrieveData('SETTINGS')
    settings[setting] = value
    Storage.storeData('SETTINGS', settings[setting])
  }
  async getSetting(setting){
    const exits = await this.verifyExistingSettings()
    let settings = await Storage.retrieveData('SETTINGS')
    if (VALID_TYPES[setting].includes(typeof settings[setting]) ){
      return settings[setting]
    }
    this.setSetting(setting, DEFAULTS['API_SERVER'])
    return DEFAULTS['API_SERVER']
  }
  async getOrCreateBaseSettings(){
    let exits = await this.verifyExistingConfiguration()
    if (!exits){
      this.setSetting('API_SERVER', 'http://192.168.0.36:3000')
    }
  }
}
export default new SettingsManager();
