import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
} from 'react-native'
import { DispatchProp } from 'react-redux'

import { getAnimeDetails } from '../../../api'
import DetailCard from '../components/detail-card'
import { setAnimeData } from '../../../store/actions'
import { StoreState, AnimeModel } from '../../..'
import DropDownHolder from '../../../utils/dropdownholder'
import { NavigationInjectedProps } from 'react-navigation'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'

type State = {
  loadded: boolean
  anime?: AnimeModel
}

type Props = {
  anime: AnimeModel
}

class AnimeDetail extends Component<Props & DispatchProp & NavigationInjectedProps, State> {

  state: State = {
    loadded: false
  }

  fetchData = (aid: string) => {
    getAnimeDetails(aid)
      .then(data => {
        this.props.dispatch(setAnimeData(data))
        this.setState({ anime: data, loadded: true })
      }).catch(e => {
        this.setState({ loadded: false })
        DropDownHolder.alert('error', "Error", e.message)
      })
  }

  getData = () => {
    const executeFetch: boolean = this.props.navigation.getParam('executeFetch', false)
    if (executeFetch) {
      this.fetchData(this.props.anime.aid)
    } else {
      this.setState({ anime: this.props.anime, loadded: true })
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
                  <Text key={`genre_${g.name}_${this.state.anime? this.state.anime.aid: ''}`}>{g.name}</Text>
                ))
              }
            </View>
            <Text>{this.state.anime.synopsis}</Text>
            <Text>{this.state.anime.typea.name}</Text>
          </ScrollView>
        </GeneralLayout>
      )
    }
    return <GeneralLayout><Text>Cargando</Text></GeneralLayout>
  }
}

const AnimeScreen = withHandlePressBack<Props & NavigationInjectedProps>((state: StoreState) => ({ anime: state.anime }))(AnimeDetail)
export default AnimeScreen