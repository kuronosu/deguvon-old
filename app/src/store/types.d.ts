
import { NavigationState } from 'react-navigation'
import { ScaledSize } from 'react-native'

export namespace recent {
  export type recentEpisode = {
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
  export type last = {
    id: string | null | undefined
  }
  export type recentStore = {
    list: recentEpisode[]
    last: last
  }
}

export namespace anime {
  export type AnimeModel = {
    aid: string
    url: string
    slug: string
    name: string
    image: string
    typea: string
    synopsis: string
    genres: string[]
    listAnmRel: {
      url: string
      rel: string
      aid: string
      name: string
    }[]
    episodeList: {
      number: number
      url: string
      image: string
    }[]
  }
}

export namespace directory {
  export type directoryStore = {
    updated: boolean
    updating: boolean
    data: anime.AnimeModel[]
  }
  export type directory = {
    [aid: string]: anime.AnimeModel
  }
}

type search = {
  text: string
  data: anime.AnimeModel[]
}

export namespace app {
  export type device = {
    screenMode: boolean
    screenSize: ScaledSize
  }
  export type config = any // Para luego

  export type data = {
    device?: device
    config?: config
  }
}

export namespace servers {
  export type langKeys = 'LAT' | 'SUB'
  export type serverInfo = {
    server: string
    title: string
    allow_mobile: boolean
    code: string
    url?: string
  }
  export type videos = {
    LAT?: serverInfo[]
    SUB?: serverInfo[]
    available_servers: string[]
  }
}

export interface StoreState {
  directory: directory.directoryStore
  recent: recent.recentStore
  search?: search
  anime?: anime.AnimeModel | {}
  app?: app.data
  nav?: NavigationState
}