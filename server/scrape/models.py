

class EpisodeScrape:
    def __init__(self, number, episode_url, cover):
        self.number = number
        self.episode_url = episode_url
        self.cover = cover

    def __str__(self):
        return str(self.number)

    def to_dict(self):
        return {
            'number': self.number,
            'episode_url': self.episode_url,
            'cover': self.cover
        }


class AnimeReltionScrape:
    def __init__(self, anime, animeflv_url, relation):
        self.anime = anime
        self.animeflv_url = animeflv_url
        self.relation = relation

    def to_dict(self):
        return {
            'anime': self.anime,
            'animeflv_url': self.animeflv_url,
            'relation': self.relation
        }

    def __str__(self):
        return f'{self.anime}:{self.relation}'


class AnimeScrape:
    def __init__(self, aid, name, slug, animeflv_url, state, typea,
                 cover, synopsis, banner, score, genres, relations, episodes):
        self.aid = aid
        self.name = name
        self.slug = slug
        self.animeflv_url = animeflv_url
        self.state = state
        self.typea = typea
        self.cover = cover
        self.synopsis = synopsis
        self.banner = banner
        self.score = score
        self.genres = genres
        self.relations = relations
        self.episodes = episodes

    def __str__(self):
        return f'{self.aid}: {self.name}'

    def to_dict(self):
        return {
            'aid': self.aid,
            'name': self.name,
            'slug': self.slug,
            'animeflv_url': self.animeflv_url,
            'cover': self.cover,
            'synopsis': self.synopsis,
            'banner': self.banner,
            'score': self.score,
        }
