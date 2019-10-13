import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Image,
} from 'react-native'
import { DispatchProp } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { Chip, Text, Subheading, List, Paragraph, Card, Divider, Caption, IconButton } from 'react-native-paper'

import { getAnimeDetails } from '../../../api'
import { setAnimeData } from '../../../store/actions'
import { StoreState, AnimeModel } from '../../..'
import DropDownHolder from '../../../utils/dropdownholder'
import GeneralLayout from '../../../utils/components/general-layout'
import withHandlePressBack from '../../../navigation/handle-press-back'
import { HOST } from '../../../api/constants'

type State = {
  loadded: boolean
  anime?: AnimeModel
}

type Props = {
  anime: AnimeModel,
  mode: boolean
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
    let tmp_genres = this.state.anime? this.state.anime.genres: []
    tmp_genres.sort((a, b) => a.name.length - b.name.length)
    if (this.state.loadded && this.state.anime) {
      return (
        <GeneralLayout>
          <ScrollView style={{ margin: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 10 }}>
              <Image
                source={{ uri: `${HOST}${this.state.anime.cover}` }}
                style={{ width: this.props.mode ? '36%' : '19.65%', height: this.props.mode ? 180 : 210, resizeMode: 'contain' }}
              />
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', paddingBottom: 10, justifyContent: 'space-between' }}>
                  <View>
                    <Subheading >{`${this.state.anime.typea.name}: ${this.state.anime.state.name}`}</Subheading >
                    <Caption>{`Calificación: ${this.state.anime.score}`}</Caption>
                  </View>
                  <IconButton
                    icon='more-vert'
                    size={30}
                  />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {
                    tmp_genres.map(g => (
                      <Chip
                        style={{ marginBottom: 5, marginHorizontal: 2.5 }}
                        key={`genre_${g.id}`}
                        textStyle={{ fontSize: 13 }}
                      >
                        {g.name}
                      </Chip>
                    ))
                  }
                </View>
              </View>
            </View>
            <Card>
              <Card.Title title={this.state.anime.name} />
              <Divider />
              <Paragraph style={{ margin: 7 }}>{this.state.anime.synopsis}</Paragraph>
            </Card>
            <List.Section title="Animes Relacionados">
              {
                this.state.anime.relations.length == 0 ?
                  <List.Item
                    style={{ paddingVertical: 0, marginVertical: 0 }}
                    title='No tiene anime relacionados'
                  /> :
                  this.state.anime.relations.map(r => (
                    <List.Item
                      style={{ paddingVertical: 0, marginVertical: 0 }}
                      title={r.ra_name}
                      description={r.relation}
                      key={r.animeflv_url}
                    />
                  ))
              }
            </List.Section>
          </ScrollView>
        </GeneralLayout>
      )
    }
    return (
      <GeneralLayout style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando</Text>
      </GeneralLayout>
    )
  }
}

const AnimeScreen = withHandlePressBack<Props & NavigationInjectedProps>((state: StoreState) => ({ anime: state.anime, mode: state.app && state.app.device ? state.app.device.screenMode : true }))(AnimeDetail)
export default AnimeScreen