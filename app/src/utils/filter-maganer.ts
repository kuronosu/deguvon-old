import { anime } from "../store/types"

export type AnimeType = 'Todos' | 'Anime' | 'Película' | 'OVA' | 'Especial'
export type DataFiltered = {
  data: anime.AnimeModel[]
  index: number
}

export default class FilterMaganer {
  static animeTypeList: AnimeType[] = ['Todos', 'Anime', 'Película', 'OVA', 'Especial']

  static getText = (state: number): AnimeType => {
    return FilterMaganer.animeTypeList[state]
  }

  static next = (data: anime.AnimeModel[], state: number): DataFiltered => {
    if (state >= FilterMaganer.animeTypeList.length - 1) {
      return { data, index: 0 }
    }
    return { data: FilterMaganer.filter(data, state + 1), index: state + 1 }
  }

  static filter = (data: anime.AnimeModel[], filterType: number): anime.AnimeModel[] => {
    if (filterType === 0) {
      return data
    } else {
      return data.filter(anime => anime.typea.toUpperCase() == (FilterMaganer.getText(filterType).toUpperCase()))
    }
  }
}