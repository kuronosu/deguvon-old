import { AnimeModel } from "../"

export type AnimeType = { id: number, name: string }

const ALL: AnimeType = { id: 0, name: 'Todos' }
const ANIME: AnimeType = { id: 1, name: 'Anime' }
const MOVIE: AnimeType = { id: 2, name: 'Película' }
const OVA: AnimeType = { id: 3, name: 'OVA' }
const SPECIAL: AnimeType = { id: 4, name: 'Especial' }

export type DataFiltered = {
  data: AnimeModel[]
  index: number
}

export default class FilterMaganer {
  static animeTypeList: AnimeType[] = [ALL, ANIME, MOVIE, OVA, SPECIAL]
  state: number
  data: AnimeModel[]

  constructor(data: AnimeModel[]) {
    this.state = 0
    this.data = data
  }

  static getText(state: number): string {
    return FilterMaganer.animeTypeList[state].name
  }

  getText(): string {
    return FilterMaganer.getText(this.state)
  }

  next(): DataFiltered {
    if (this.state >= FilterMaganer.animeTypeList.length - 1) {
      this.state = 0
      return { data: this.data, index: 0 }
    }
    this.state += 1
    return { data: FilterMaganer.filter(this.data, this.state), index: this.state }
  }

  static filter = (data: AnimeModel[], filterType: number): AnimeModel[] => {
    if (filterType === 0) {
      return data
    } else {
      return data.filter(anime => anime.typea.id == FilterMaganer.animeTypeList[filterType].id)
    }
  }
}