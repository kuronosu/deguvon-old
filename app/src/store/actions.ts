import * as constants from './constants'
import { AnimeModel, RecentEpisode, SearchState, AppDevice, AppConfig } from '../';

export type directoryPayload = {
  updated?: boolean
  updating?: boolean
  data?: AnimeModel[]
}

export interface SetAnimeData {
  type: constants.SET_ANIME_DATA
  payload: AnimeModel | RecentEpisode['anime']
}

export interface SetDirectoryData {
  type: constants.SET_DIRECTORY_DATA
  payload: directoryPayload
}

export interface SetRecentData {
  type: constants.SET_RECENT_DATA
  payload: RecentEpisode[]
}

export interface ClearLastRecent {
  type: constants.CLEAR_LAST
}

export interface SetSearchData {
  type: constants.SET_SEARCH_DATA
  payload: SearchState
}

export interface SetDeviceData {
  type: constants.SET_DEVICE_DATA
  payload: AppDevice
}

export interface SetConfigData {
  type: constants.SET_CONFIG
  payload: AppConfig
}

export type AppDataAction = SetDeviceData | SetConfigData

export type RecentAction = SetRecentData | ClearLastRecent

// export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm; // Example

export function setAnimeData(anime: AnimeModel | RecentEpisode['anime']): SetAnimeData {
  return {
    type: constants.SET_ANIME_DATA,
    payload: anime
  }
}

export function setDirectoryData(directory: directoryPayload): SetDirectoryData {
  return {
    type: constants.SET_DIRECTORY_DATA,
    payload: directory
  }
}

export function setRecentData(recent: RecentEpisode[]): SetRecentData {
  return {
    type: constants.SET_RECENT_DATA,
    payload: recent
  }
}

export function resetLastRecent(): ClearLastRecent {
  return { type: constants.CLEAR_LAST }
}

export function setSearchData(text: string, data: AnimeModel[]): SetSearchData {
  return {
    type: constants.SET_SEARCH_DATA,
    payload: {
      data,
      text
    }
  }
}

export function setDeviceData(data: AppDevice): SetDeviceData {
  return {
    type: constants.SET_DEVICE_DATA,
    payload: data
  }
}

export function setConfigData(data: AppConfig): SetConfigData {
  return {
    type: constants.SET_CONFIG,
    payload: data
  }
}
