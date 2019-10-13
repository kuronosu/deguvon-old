import { HOST, ROUTE } from "./constants"
import { RecentEpisode, AnimeModel, DirectoryObject, EpisodeData } from "../index"

export async function getRecent(): Promise<RecentEpisode[]> {
  const base = `${HOST}${ROUTE}/recents`
  const query = await fetch(base)
  const recent: RecentEpisode[] = await query.json()
  return recent
}

export async function getAnimeDetails(aid: string): Promise<AnimeModel> {
  const base = `${HOST}${ROUTE}/animes/${aid}`
  const query = await fetch(base)
  const anime: AnimeModel = await query.json()
  return anime
}

export async function getDirectory(): Promise<DirectoryObject> {
  const base = `${HOST}${ROUTE}/directory/`
  const query = await fetch(base)
  const directory: DirectoryObject = await query.json()
  return directory
}

export async function getEpisodeData(anime_id: string ,episode: number): Promise<EpisodeData> {
  const servers = await fetch(`${HOST}${ROUTE}/animes/${anime_id}/episodes/${episode}/`)
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
  getServers: getEpisodeData
}