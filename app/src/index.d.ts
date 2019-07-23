import { NavigationState } from 'react-navigation'
import { ScaledSize } from 'react-native'

export type RecentEpisode = {
  id: string
  number: number
  url: string
  anime: {
    url: string
    name: string
    image: string
    aid: string
  }
}

export type LastRecent = {
  id: string | null | undefined
}

export type RecentStore = {
  list: RecentEpisode[]
  last: LastRecent
}

export type AnimeModel = {
  aid: string
  url: string
  slug: string
  name: string
  image: string
  typea: string
  synopsis: string
  genres: string[]
  listAnmRel: RelationModel[]
  episodeList: EpisodeModel[]
}

export type RelationModel = {
  url: string
  rel: string
  name?: string
  aid?: string
  image?: string
}

export type EpisodeModel = {
  number: number
  url: string
  image: string
}

export type RelationObject = {
  [animeUrl: string]: RelationModel
}

export type AnimeRequest = {
  anime: AnimeModel
  relations: RelationObject
}

export type DirectoryStore = {
  updated: boolean
  updating: boolean
  data: AnimeModel[]
}

export type DirectoryObject = {
  [aid: string]: AnimeModel
}

export type SearchState = {
  text: string
  data: AnimeModel[]
}

export type AppDevice = {
  screenMode: boolean
  screenSize: ScaledSize
}

export type AppConfig = any // Para luego

export type AppData = {
  device?: AppDevice
  config?: AppConfig
}

export type LangKeys = 'LAT' | 'SUB'

export type ServerInfo = {
  server: string
  title: string
  allow_mobile: boolean
  code: string
  url?: string
}

export type Videos = {
  LAT?: ServerInfo[]
  SUB?: ServerInfo[]
  available_servers: string[]
}

export type StoreState = {
  directory: DirectoryStore
  recent: RecentStore
  search?: SearchState
  anime?: AnimeModel | {}
  app?: AppData
  nav?: NavigationState
}

export type TabBarIconProps = {
  tintColor: string | null
  focused: boolean
  horizontal: boolean
}

type SearchProps = {
  searchText: string
  data: AnimeModel[]
  mode: boolean
  screenWidth: number
  directoryData: AnimeModel[]
}