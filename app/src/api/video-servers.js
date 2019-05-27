import { getServers } from '.'
import { HOST, ROUTE } from "./constants"

/** Funcion para filtrar los servidores disponibles 
*  @param {Object} servers Objecto que contiene la informacion de los servidores - devuelta por el servidor
*  @param {'sub' | 'lat' | 'all'} [lang] Idioma(s) en el que se obtendra el video
*  @returns {Object}
*/
export const getAvailableServers = (servers, lang='all') => {
  let avServers = {}
  lang = ['SUB', 'LAT', 'ALL'].includes(lang.toUpperCase())? lang.toUpperCase(): 'ALL'
  if (lang == 'ALL'){
    for (const key in servers) {
      if (servers.hasOwnProperty(key)) {
        avServers[key] = []
        const langServerList = servers[key]
        langServerList.forEach(s => {
          if (s['server'] && servers.available_servers && servers.available_servers.includes(s['server'].toLowerCase())){
            avServers[key].push(s)
          }
        })
      }
    }
  } else if (servers.hasOwnProperty(lang)){
    avServers[lang] = []
    servers[lang].forEach(s => {
      if (s['server'] && servers.available_servers && servers.available_servers.includes(s['server'].toLowerCase())){
        avServers[lang].push(s)
      }
    })
  }
  return avServers
}

/** Funcion para obtener el video del servidor natsuki 
*  @param {Number} eid ID del episodio
*  @param {Object} [servers] Objecto que contiene la informacion de los servidores - devuelta por el servidor
*  @param {'sub' | 'lat' | 'all'} [lang] Idioma(s) en el que se obtendra el video
*/
export const getNatsukiVideo = async (eid, servers, lang) => {
  servers = servers? servers: await getServers(eid)
  const requestInit = {method:'POST', body: JSON.stringify(servers)}
  const request = await fetch(`${HOST}${ROUTE}/episode/${eid}/natsuki${lang? `/${lang}`: ''}`, requestInit)
  const natsuki_server = request.ok ? await request.json(): []
  return natsuki_server
}

// Ejemplo de uso
// let d
// (async () => {
//   const server = await getServers(2948)
//   const availableServers = getAvailableServers(server, 'lat')
//   d = await getNatsukiVideo(2948, availableServers)
// })()
