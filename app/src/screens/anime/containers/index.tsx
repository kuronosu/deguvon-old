import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
} from 'react-native'
import { DispatchProp } from 'react-redux'
import DetailCard from '../components/detail-card'
import { NavigationInjectedProps } from 'react-navigation'
import { getAnimeDetails } from '../../../api'
import DropDownHolder from '../../../utils/dropdownholder'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'
import { anime, StoreState } from '../../../store/types'

type State = {
  loadded: boolean
  anime?: anime.AnimeModel
  relations: anime.relation[]
}

type Props = {
  anime: anime.AnimeModel
}

class AnimeDetail extends Component<Props & DispatchProp & NavigationInjectedProps, State> {

  state: State = {
    loadded: false,
    relations: [],
  }

  fetchData = (aid: string) => {
    getAnimeDetails(parseInt(aid))
      .then(data => {
        this.setState({ anime: data.anime, relations: Object.values(data.relations), loadded: true })
        this.props.dispatch({
          type: 'SET_ANIME_DATA',
          payload: data.anime
        })
      }).catch(e => {
        this.setState({ loadded: false })
        DropDownHolder.alert('error', "Error", e.message)
      })
  }

  getData = () => {
    const executeFetch = this.props.navigation.getParam('executeFetch', false)
    if (executeFetch) {
      this.fetchData(this.props.anime.aid)
    } else {
      this.setState({ anime: this.props.anime, relations: this.props.anime.listAnmRel, loadded: true })
    }
  }

  componentDidMount() {
    this.getData()
  }

  render() {
    if (this.state.loadded && this.state.anime) {
      return (
        <GeneralLayout>
          <ScrollView>
            <DetailCard
              title={this.state.anime.name}
              priority
            />
            <View>
              {
                this.state.anime.genres.map(g => (
                  <Text key={`genre_${g}_${this.state.anime? this.state.anime.aid: ''}`}>{g}</Text>
                ))
              }
            </View>
            <Text>{this.state.anime.synopsis}</Text>
            <Text>{this.state.anime.typea}</Text>
          </ScrollView>
        </GeneralLayout>
      )
    }
    return <GeneralLayout><Text>Cargando</Text></GeneralLayout>
  }
}

const AnimeScreen = withHandlePressBack((state: StoreState) => ({ anime: state.anime }))(AnimeDetail)
export default AnimeScreen