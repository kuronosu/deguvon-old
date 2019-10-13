import { ServerInfo } from '../index'
import { getEpisodeData } from '.'
import { HOST, ROUTE } from "./constants"

type serverType = {
  [lang: string]: ServerInfo[]
}


/** Funcion para obtener el video del servidor natsuki 
*  @param {Number} eid ID del episodio
*  @param {Object} [servers] Objecto que contiene la informacion de los servidores - devuelta por el servidor
*  @param {'sub' | 'lat' | 'all'} [lang] Idioma(s) en el que se obtendra el video
*/
export const getNatsukiVideo = async (anime_id: string, episode: number, lang?: 'sub' | 'lat') => {
  const request = await fetch(
    `${HOST}${ROUTE}/animes/${anime_id}/episodes/${episode}/natsuki/${lang ? lang : ''}`)
  if (!request.ok) {
    throw Error("Error al obtener el video")
  }
  const natsuki_server = await request.json()
  return natsuki_server
}

// Ejemplo de uso
// let d
// (async () => {
//   const server = await getServers(2948)
//   const availableServers = getAvailableServers(server, 'lat')
//   d = await getNatsukiVideo(2948, availableServers)
// })()
