export const HOST = 'https://kuronosu.dev'
export const ROUTE = '/api/v1'

export async function getRecent() {
  const base = `${HOST}${ROUTE}/recent`
  const query = await fetch(base)
  const recent = await query.json()
  return recent
}

export async function getAnimeDetails(aid) {
  let base = `${HOST}${ROUTE}/anime/${aid}`
  const query = await fetch(base)
  const anime = await query.json()
  return anime
}

export async function getDirectory() {
  let base = `${HOST}${ROUTE}/directory`
  const query = await fetch(base)
  const directory = await query.json()
  return directory
}

export const getServers = async eid => {
  const servers = await fetch(`${HOST}${ROUTE}/episode/${eid}/videos`)
  if (!servers.ok){
    return servers
  }
  return await servers.json()
}

export default Api = {
  HOST,
  ROUTE,
  getRecent,
  getAnimeDetails,
  getDirectory,
  getServers
}