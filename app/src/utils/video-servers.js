import { getServers } from "../api";

export const getAvailableServers = (servers, lang) => {
  let avServers = {}
  lang = lang ? lang: 'all'
  lang = lang.toUpperCase()
  if (lang == 'ALL'){
    for (const key in servers) {
      if (servers.hasOwnProperty(key)) {
        avServers[key] = []
        const langServerList = servers[key]
        langServerList.forEach(s => {
          if (s['server'] && servers.available_servers.includes(s['server'].toLowerCase())){
            avServers[key].push(s)
          }
        })
      }
    }
  } else if (servers.hasOwnProperty(lang.toUpperCase())){
    avServers[lang.toUpperCase()] = []
    servers[lang.toUpperCase()].forEach(s => {
      if (s['server'] && servers.available_servers.includes(s['server'].toLowerCase())){
        avServers[lang.toUpperCase()].push(s)
      }
    })
  }
  return avServers
}


export const getNatsukiVideo = async (eid, servers, lang) => {
  /* Parameters 
  *  eid: number
  *  lang?: 'sub' | 'lat' | 'all'
  *  servers?: default servers data
  */
  servers = servers? servers: await getServers(eid)
  const requestInit = {method:'POST', body: JSON.stringify(servers)}
  const request = await fetch(`https://kuronosu.dev/api/v1/episode/${eid}/natsuki${lang? `/${lang}`: ''}`, requestInit)
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
