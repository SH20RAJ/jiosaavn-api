import type { AlbumAPIResponseModel, AlbumModel } from '#modules/albums/models'
import type { z } from 'zod'
import { createSongPayload } from '#modules/songs/helpers'
import { createImageLinks } from '#common/helpers'
import { createArtistMapPayload } from '#modules/artists/helpers'

export const createAlbumPayload = (album: z.infer<typeof AlbumAPIResponseModel>): z.infer<typeof AlbumModel> => ({
  id: album.id,
  name: album.title,
  description: album.header_desc,
  type: album.type,
  year: Number(album.year || 0),
  playCount: Number(album.play_count),
  language: album.language,
  explicitContent: album.explicit_content === '1',
  url: album.perma_url,
  songCount: Number(album.more_info?.song_count || 0),
  artists: {
    primary: album.more_info?.artistMap?.primary_artists?.map(createArtistMapPayload),
    featured: album.more_info?.artistMap?.featured_artists?.map(createArtistMapPayload),
    all: album.more_info?.artistMap?.artists?.map(createArtistMapPayload)
  },
  image: createImageLinks(album.image),
  ...(album.list && { songs: album.list.map((song) => createSongPayload(song)) })
})
