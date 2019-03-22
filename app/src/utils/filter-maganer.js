export default class FilterMaganer {
  static animeTypeList = ['Todos', 'Anime', 'Película', 'OVA', 'Especial']

  static getText = (state) => {
    return FilterMaganer.animeTypeList[state]
  }

  static next = (data, state) => {
    if (state >= FilterMaganer.animeTypeList.length - 1) {
      return {data, index: 0}
    }
    return {data: FilterMaganer.filter(data, state + 1), index: state + 1}
  }

  static filter = (data, filterType) => {
    if (filterType === 0) {
      return data
    } else {
      return data.filter(anime => anime.typea.toUpperCase() == (FilterMaganer.getText(filterType).toUpperCase()))
    }
  }
}