import re

# Patron para obtener los datos de los servidores de la etiqueta script
SERVERS_SCRIPT_PATTERN = re.compile(r"var videos = {.+};")

# Patron para obtener los datos de los episodios de la etiqueta script
EPISODE_SCRIPT_PATTERN = re.compile(r"var episodes = \[.*\];")

# Patron para obtener la lista de episodios
EPISODE_LIST_PATTERN = re.compile(r'\[[0-9,.]+\]')

# Patron para obtener el texto de relacion
RELATION_TEXT_PATTERN = re.compile(r'\([A-Za-z,\- ]+\)')

# Patron para validar u obtener una url de un anime
ANIME_LINK_PATTERN = re.compile(r'/[0-9]+/[0-9a-zA-z\-]+')

# Patron para obtener los datos del anime en la etiqueta script
ANIME_SCRIPT_PATTERN = re.compile(r'var anime_info = \[[0-9"]+,.*\];')

# Patron para obtener el anime id
AID_PATTERN = re.compile(r'"[0-9]+"')

# Patron para obtenerl el slug del anime 
SLUG_PATTERN = re.compile(r'"[a-zA-Z0-9_-]+"')

# Patron para obtener la fecha del proximo episodio de animes en emision 
NEXT_EPISODE_DATE_PATTERN = re.compile(r'"[0-9-]+"')

# Patron para obtener el nombre de un anime (Patron general encerrado entre comillas)
NAME_PATTERN = re.compile(r'".*"')

# Patron para encontrar entidades html
HTML_ENTITIES_PATTERN = re.compile(r'&[#0-9a-zA-Z]+;')