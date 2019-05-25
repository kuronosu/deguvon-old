import * as constants from './constants'
import { anime, recent, directory, search, app } from './types';

export interface SetAnimeData {
  type: constants.SET_ANIME_DATA
  payload: anime.AnimeModel
}

export interface SetDirectoryData {
  type: constants.SET_DIRECTORY_DATA
  payload: directory.directoryStore
}

export interface SetRecentData {
  type: constants.SET_RECENT_DATA
  payload: recent.recentEpisode[]
}

export interface ClearLastRecent {
  type: constants.CLEAR_LAST
}

export interface SetSearchData {
  type: constants.SET_SEARCH_DATA
  payload: search
}

export interface SetDeviceData {
  type: constants.SET_DEVICE_DATA
  payload: app.device
}

export interface SetConfigData {
  type: constants.SET_CONFIG
  payload: app.config
}

export type AppDataAction = SetDeviceData | SetConfigData

export type RecentAction = SetRecentData | ClearLastRecent

// export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm; // Example

export function setAnimeData(anime: anime.AnimeModel): SetAnimeData {
  return {
    type: constants.SET_ANIME_DATA,
    payload: anime
  }
}

export function setDirectoryData(directory: directory.directoryStore): SetDirectoryData {
  return {
    type: constants.SET_DIRECTORY_DATA,
    payload: directory
  }
}

export function setRecentData(recent: recent.recentEpisode[]): SetRecentData {
  return {
    type: constants.SET_RECENT_DATA,
    payload: recent
  }
}

export function resetLastRecent(): ClearLastRecent {
  return { type: constants.CLEAR_LAST }
}

export function setSearchData(text: string, data: anime.AnimeModel[]): SetSearchData {
  return {
    type: constants.SET_SEARCH_DATA,
    payload: {
      data,
      text
    }
  }
}

export function setDeviceData(data: app.device): SetDeviceData {
  return {
    type: constants.SET_DEVICE_DATA,
    payload: data
  }
}

export function setConfigData(data: app.config): SetConfigData {
  return {
    type: constants.SET_CONFIG,
    payload: data
  }
}
