import { AsyncStorage } from "react-native"

class Storage{
  async retrieveData(key, defaultValue=null){
    const value = await AsyncStorage.getItem(key);
    try {
      if (value !== null) {
        return JSON.parse(value)
      }
    } catch (error) {
    }
    AsyncStorage.setItem('SETTINGS', JSON.stringify(defaultValue));
    return defaultValue
  }
  async storeData(key, data){
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
    }
  }
}
export default new Storage();