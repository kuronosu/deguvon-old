import { getServers } from '.'
import { HOST, ROUTE } from "./constants"
import { servers } from '../store/types'

type serverType = {
  [lang: string]: servers.serverInfo[]
}

/** Funcion para filtrar los servidores disponibles 
*  @param {Object} serversData Objecto que contiene la informacion de los servidores - devuelta por el servidor
*  @param {'sub' | 'lat' | 'all'} [lang] Idioma(s) en el que se obtendra el video
*  @returns {Object}
*/
export const getAvailableServers = (serversData: servers.videos, lang: servers.langKeys | 'ALL' = 'ALL') => {
  let avServers: serverType = {}
  let serversNames = new Set<string>()
  // lang = ['SUB', 'LAT', 'ALL'].includes(lang.toUpperCase()) ? lang.toUpperCase() : 'ALL'
  if (lang == 'ALL') {
    for (const key in serversData) {
      if (serversData.hasOwnProperty(key) && key != 'available_servers') {
        avServers[key] = []
        let langServerList: servers.serverInfo[] | undefined
        if (key == 'LAT') {
          langServerList = serversData.LAT
        } else if (key == 'SUB') {
          langServerList = serversData.SUB
        }
        (langServerList ? langServerList : []).forEach((s: servers.serverInfo) => {
          if (serversData.available_servers.includes(s.server.toLowerCase())) {
            avServers[key].push(s)
            serversNames.add(s.server.toLowerCase())
          }
        })
      }
    }
  } else if (serversData.hasOwnProperty(lang)) {
    avServers[lang] = []
    let serverList: servers.serverInfo[] | undefined
    if (lang == 'LAT') {
      serverList = serversData.LAT
    } else if (lang == 'SUB') {
      serverList = serversData.SUB
    }
    (serverList ? serverList : []).forEach((s: servers.serverInfo) => {
      if (serversData.available_servers.includes(s.server.toLowerCase())) {
        avServers[lang].push(s)
        serversNames.add(s.server.toLowerCase())
      }
    })
  }
  const data: servers.videos = {
    ...avServers,
    available_servers: Array.from(serversNames.values())
  }
  return data
}

/** Funcion para obtener el video del servidor natsuki 
*  @param {Number} eid ID del episodio
*  @param {Object} [servers] Objecto que contiene la informacion de los servidores - devuelta por el servidor
*  @param {'sub' | 'lat' | 'all'} [lang] Idioma(s) en el que se obtendra el video
*/
export const getNatsukiVideo = async (eid: number, servers?: servers.videos | serverType, lang?: 'sub' | 'lat') => {
  servers = servers ? servers : await getServers(eid)
  const requestInit = { method: 'POST', body: JSON.stringify(servers) }
  const request = await fetch(`${HOST}${ROUTE}/episode/${eid}/natsuki${lang ? `/${lang}` : ''}`, requestInit)
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
