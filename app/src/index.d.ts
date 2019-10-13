import { NavigationState } from 'react-navigation'
import { ScaledSize } from 'react-native'

export type RecentEpisode = {
  number: number
  animeflv_url: string
  anime: {
    name: string
    cover: string
    aid: string
  }
}

export type RecentStore = {
  list: RecentEpisode[]
  last?: string | null
}
export type StateModel = {
  id: number
  name: string
}
export type TypeModel = {
  id: number
  name: string
}
export type GenreModel = {
  id: number
  name: string
}
export type RelationModel = {
  ra_name: string
  animeflv_url: string
  relation: string
}

export type EpisodeModel = {
  number: number
  animeflv_url: string
  cover: string
}

export type AnimeModel = {
  aid: string
  name: string
  slug: string
  animeflv_url: string
  cover: string
  synopsis: string
  banner: string
  score: number
  state: StateModel
  typea: TypeModel
  genres: GenreModel[]
  relations: RelationModel[]
  episodes: EpisodeModel[]
}

export type DirectoryStore = {
  updated: boolean
  updating: boolean
  data: AnimeModel[]
}

export type DirectoryModel = {
  [aid: string]: AnimeModel
}

export type SearchState = {
  text: string
  data: AnimeModel[]
}

type SearchProps = {
  searchText: string
  data: AnimeModel[]
  mode: boolean
  screenWidth: number
  directoryData: AnimeModel[]
}

// -----------------------------------------------------

export type AppDevice = {
  screenMode: boolean
  screenSize: ScaledSize
}

export type AppConfig = any // Para luego

export type AppData = {
  device?: AppDevice
  config?: AppConfig
}

// -----------------------------------------------------

export type LangKeys = 'LAT' | 'SUB'

export type ServerInfo = {
  server: string
  title: string
  allow_mobile?: boolean
  code?: string
  url?: string
}

export type EpisodeData = {
  servers: {
    LAT?: ServerInfo[]
    SUB?: ServerInfo[]
  }
  anime_aid: number
  number: number,
  animeflv_url: string,
  cover: string
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
