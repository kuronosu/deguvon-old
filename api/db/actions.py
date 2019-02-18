from peewee import DoesNotExist
import time
from scraping.main import AnimeScraping, EpisodeScraping, AnimeReltionScraping
from scraping.main import AnimeFactory as fla
from db.settings import DATABASE 
from .models import Genre, Anime, AnimeGenre, AnimeRelation, Episode, State


class DataBase:

    @staticmethod
    def create_tables():
        if not Genre.table_exists():
            Genre.create_table()
        if not Anime.table_exists():
            Anime.create_table()
        if not AnimeGenre.table_exists():
            AnimeGenre.create_table()
        if not AnimeRelation.table_exists():
            AnimeRelation.create_table()
        if not Episode.table_exists():
            Episode.create_table()
        if not State.table_exists():
            State.create_table()

    @staticmethod
    def create_anime_record(anime):
        
        if anime is None:
            return
        if not isinstance(anime, AnimeScraping):
            raise TypeError("anime must be a AnimeScraping")
        
        print("Creating record of: {}".format(anime.url))
        datos = anime.to_db()
        datos['state'], created = State.get_or_create(state=anime.state)
        anime_record = Anime.create(**datos)
        anime_record.save()
        for i in anime.genres:
            genre, created = Genre.get_or_create(genre=i)
            AnimeGenre.create(anime=anime_record, genre=genre).save()

        for i in anime.animeRel_to_db():
            i['anime'] = anime_record
            AnimeRelation.create(**i).save()
        for i in anime.episode_list_to_db():
            i['anime'] = anime_record
            Episode.create(**i).save()
    
    @staticmethod
    def update_anime(anime, animesp=None):
    
        if not isinstance(anime, Anime):
            raise TypeError("anime must be a Anime")
        if not (isinstance(animesp, AnimeScraping) or animesp is None):
            raise TypeError("anime must be a AnimeScraping or not send this parameter")

        anime_data = fla.get_anime(anime.url) if animesp is None else animesp
        print("Updating: {}".format(anime_data.url))

        if anime.aid != anime_data.aid:
            anime.aid = anime_data.aid
        if anime.slug != anime_data.slug:
            anime.slug = anime_data.slug
        if anime.state.state != anime_data.state:
            anime.state, created = State.get_or_create(state=anime_data.state)
        if anime.url != anime_data.url:
            anime.url = anime_data.url
        if anime.name != anime_data.name:
            anime.name = anime_data.name
        if anime.typea != anime_data.typea:
            anime.typea = anime_data.typea
        if anime.image != anime_data.image:
            anime.image = anime_data.image
        if anime.synopsis != anime_data.synopsis:
            anime.synopsis = anime_data.synopsis

        anime.save()

        def update_genres(anime, anime_data):
            AnimeGenre.delete().where(AnimeGenre.anime == anime).execute()
            for i in anime_data.genres:
                genre, created = Genre.get_or_create(genre=i)
                AnimeGenre.create(anime=anime, genre=genre).save()
        query = (AnimeGenre
            .select()
            .where(AnimeGenre.anime == anime)
        )
        if len(query) != len(anime_data.genres):
            update_genres(anime, anime_data)
        else:
            for i in range(len(query)):
                if query[i].genre.genre != anime_data.genres[i]:
                    update_genres(anime, anime_data)
                    break

        def update_relations(anime, anime_data):
            AnimeRelation.delete().where(AnimeRelation.anime == anime).execute()
            for i in anime_data.animeRel_to_db():
                i['anime'] = anime
                AnimeRelation.create(**i).save()

        query = (AnimeRelation
            .select()
            .where(AnimeRelation.anime == anime)
        )
        if len(query) != len(anime_data.listAnmRel):
            update_relations(anime, anime_data)
        else:
            for i in range(len(query)):
                if (
                    query[i].rel != anime_data.listAnmRel[i].rel or
                    query[i].url != anime_data.listAnmRel[i].url
                    ):
                    update_relations(anime, anime_data)
                    break


        def update_episodes(anime, anime_data):
            Episode.delete().where(Episode.anime == anime).execute()
            for i in anime_data.episode_list_to_db():
                i['anime'] = anime
                Episode.create(**i).save()

        query = (Episode
            .select()
            .where(Episode.anime == anime)
        )
        if len(query) != len(anime_data.episode_list):
            update_episodes(anime, anime_data)
        else:
            for i in range(len(query)):
                if (
                    query[i].name != anime_data.episode_list[i].name or
                    query[i].url != anime_data.episode_list[i].url or
                    query[i].image != anime_data.episode_list[i].image
                    ):
                    update_episodes(anime, anime_data)
                    break
        
    @staticmethod
    def update_animes_in_emision():
        query = (Anime
            .select()
            .join(State)
            .where(State.state == 'En emision')
        )
        print("Hay {} animes en emision".format(len(query)))
        with DATABASE.atomic():
            for i in query:
                DataBase.update_anime(i)

    @staticmethod
    def update_database():
        links = fla.get_all_animes()
        with open('animes.txt', 'w') as text_file:
            with DATABASE.atomic():
                for i in links:
                    animesp = fla.get_anime(i)
                    text_file.write(i+"\n")
                    try:
                        animedb = Anime.get(aid=animesp.aid)
                        DataBase.update_anime(animedb, animesp)
                    except:
                        DataBase.create_anime_record(animesp)
    
    @staticmethod
    def search(name):
        aList = (Anime.select()
            .where(Anime.name.contains(name))
        )
        animes = []
        for i in aList:
            gList = (AnimeGenre.select()
                .join(Anime)
                .where(AnimeGenre.anime == i)
            )
            genres = [j.genre.genre for j in gList]
            rList = (AnimeRelation.select()
                .join(Anime)
                .where(AnimeRelation.anime == i)
            )
            listAnmRel = [AnimeReltionScraping(j.url, j.rel) for j in rList]
            eList = (Episode.select()
                .join(Anime)
                .where(Episode.anime == i)
            )
            episode_list = [EpisodeScraping(j.name, j.url, j.image) for j in eList ]
            
            anime = AnimeScraping(
                    i.aid,
                    i.url,
                    i.slug,
                    i.name,
                    i.image,
                    i.typea,
                    i.state.state,
                    i.synopsis,
                    genres,
                    episode_list,
                    listAnmRel
                )
            animes.append(anime)
        return animes
    
    @staticmethod
    def get_name_by_url(url):
        return (Anime.select()
            .where(Anime.url == url)
            .get()
        ).name

    @staticmethod
    def get_by_aid(aid):
        return DataBase.get_by_url(
            Anime.select()
            .where(Anime.aid == aid)
            .get().url
        )

    @staticmethod
    def get_by_url(url):
        anime = (Anime.select()
            .where(Anime.url == url)
            .get()
        )
        gList = (AnimeGenre.select()
            .join(Anime)
            .where(AnimeGenre.anime == anime)
        )
        genres = [j.genre.genre for j in gList]

        rList = (AnimeRelation.select()
            .join(Anime)
            .where(AnimeRelation.anime == anime)
        )
        listAnmRel = [AnimeReltionScraping(j.url, j.rel) for j in rList]

        eList = (Episode.select()
            .join(Anime)
            .where(Episode.anime == anime)
            .order_by(Episode.url)
        )
        episode_list = [EpisodeScraping(j.name, j.url, j.image) for j in eList ]
        
        return AnimeScraping(
            anime.aid,
            anime.url,
            anime.slug,
            anime.name,
            anime.image,
            anime.typea,
            anime.state.state,
            anime.synopsis,
            genres,
            episode_list,
            listAnmRel
        )

    @staticmethod
    def create_recent(recent):
        r = recent
        recent = None
        try:
            recent = Episode.get(Episode.url == r['url'])
        except DoesNotExist:
            try:
                ep = fla.get_episode_data(r['url'])
                ep = Episode.create(**{
                    'name': ep.name,
                    'url': ep.url,
                    'image': ep.image,
                    'anime': Anime.get(Anime.url == fla.get_animeUrl_by_ep(r['url']))
                }).save()
                recent = Episode.get(Episode.url == r['url'])
            except DoesNotExist:
                DataBase.create_anime_record(fla.get_anime(fla.get_animeUrl_by_ep(r['url'])))
                recent = Episode.get(Episode.url == r['url'])
            except Exception as e:
                print(e, r['url'], "277")
        except Exception as e:
                print(e, r['url'], "279")
        finally:
            if recent == None:
                print(r['url'])
            return recent

    @staticmethod
    def update_recents(recents=None):
        recents_l = []
        if not recents: recents = fla.check_recents()

        with DATABASE.atomic():
            for r in recents:
                dr = DataBase.create_recent(r)
                recent = vars(EpisodeScraping(dr.name, dr.url, dr.image))
                aditional_data = {
                    'anime': {
                        'url': dr.anime.url,
                        'name': dr.anime.name,
                        'image': dr.anime.image,
                        'aid': dr.anime.aid
                    },
                    'id':  dr.url.split('/')[2]
                }
                recent.update(aditional_data)
                recents_l.append(recent)
        return recents_l
