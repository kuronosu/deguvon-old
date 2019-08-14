

class EpisodeScrape:
    def __init__(self, number, animeflv_url, cover):
        self.number = number
        self.animeflv_url = animeflv_url
        self.cover = cover

    def __str__(self):
        return str(self.number)

    def to_dict(self):
        return {
            'number': self.number,
            'animeflv_url': self.animeflv_url,
            'cover': self.cover
        }


class AnimeReltionScrape:
    def __init__(self, ra_name, animeflv_url, relation):
        self.ra_name = ra_name
        self.animeflv_url = animeflv_url
        self.relation = relation

    def to_dict(self):
        return {
            'ra_name': self.ra_name,
            'animeflv_url': self.animeflv_url,
            'relation': self.relation
        }

    def __str__(self):
        return f'{self.ra_name}:{self.relation}'


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

    @classmethod
    def load_from_dict(cls, _dict):
        if not type(_dict) is dict:
            return None
        try:
            return cls(aid=_dict['aid'], name=_dict['name'], slug=_dict['slug'], animeflv_url=_dict['animeflv_url'],
                        state=_dict['state']['name'], typea=_dict['typea']['name'], cover=_dict['cover'], synopsis=_dict['synopsis'],
                        banner=_dict['banner'], score=_dict['score'], genres=[g['name'] for g in _dict['genres']],
                        relations=[AnimeReltionScrape(**r) for r in _dict['relations']], episodes=[EpisodeScrape(**e) for e in _dict['episodes']])
        except:
            pass
