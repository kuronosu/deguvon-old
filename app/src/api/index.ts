import { HOST, ROUTE } from "./constants"
import { recent, anime, directory, servers } from "../store/types"

export async function getRecent(): Promise<recent.recentEpisode[]> {
  const base = `${HOST}${ROUTE}/recent`
  const query = await fetch(base)
  const recent: recent.recentEpisode[] = await query.json()
  return recent
}

export async function getAnimeDetails(aid: number): Promise<anime.AnimeModel> {
  const base = `${HOST}${ROUTE}/anime/${aid}`
  const query = await fetch(base)
  const anime: anime.AnimeModel = await query.json()
  return anime
}

export async function getDirectory(): Promise<directory.directory> {
  const base = `${HOST}${ROUTE}/directory`
  const query = await fetch(base)
  const directory: directory.directory = await query.json()
  return directory
}

export async function getServers(eid: number) : Promise<servers.videos> {
  const servers = await fetch(`${HOST}${ROUTE}/episode/${eid}/videos`)
  if (!servers.ok) {
    throw Error("Error al obtener informacion de servidores")
  }
  return await servers.json()
}

export default {
  HOST,
  ROUTE,
  getRecent,
  getAnimeDetails,
  getDirectory,
  getServers
}