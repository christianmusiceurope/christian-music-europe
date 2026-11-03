import {article} from './documents/article'
import {artist} from './documents/artist'
import {campaign} from './documents/campaign'
import {chart} from './documents/chart'
import {country} from './documents/country'
import {event} from './documents/event'
import {festival} from './documents/festival'
import {genre} from './documents/genre'
import {playlist} from './documents/playlist'
import {release} from './documents/release'
import {song} from './documents/song'
import {venue} from './documents/venue'
import {channelContent} from './objects/channelContent'
import {chartEntry} from './objects/chartEntry'
import {countryAssociation} from './objects/countryAssociation'
import {editorialVerification} from './objects/editorialVerification'
import {externalIdentifiers} from './objects/externalIdentifiers'
import {mediaRights} from './objects/mediaRights'
import {musicCharacteristics} from './objects/musicCharacteristics'
import {portableText} from './objects/portableText'
import {seoMetadata} from './objects/seoMetadata'
import {sourceReference} from './objects/sourceReference'
import {spotifyEmbed} from './objects/spotifyEmbed'
import {streamingLinks} from './objects/streamingLinks'
import {youtubeEmbed} from './objects/youtubeEmbed'

export const schemaTypes = [
  seoMetadata,
  sourceReference,
  streamingLinks,
  countryAssociation,
  musicCharacteristics,
  mediaRights,
  channelContent,
  editorialVerification,
  spotifyEmbed,
  youtubeEmbed,
  portableText,
  externalIdentifiers,
  chartEntry,
  country,
  artist,
  genre,
  release,
  song,
  event,
  festival,
  venue,
  article,
  playlist,
  chart,
  campaign,
]
