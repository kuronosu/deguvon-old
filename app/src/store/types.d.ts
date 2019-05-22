
import { NavigationState } from 'react-navigation'

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
  export type recentStore = {
    recentList: recentEpisode[]
    last: {
      id?: string
    }
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
  export type directoryStore= {
    updated: boolean
    updating: boolean
    data: anime.AnimeModel[]
  } 
}

type search = { text: string }

export interface ApplicationState {
  directory: directory.directoryStore
  recent: recent.recentStore
  search: search
  anime: anime.AnimeModel
  nav: NavigationState
  app: any
}