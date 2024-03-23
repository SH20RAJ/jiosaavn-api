import { HTTPException } from 'hono/http-exception'
import type { z } from 'zod'
import type { IUseCase } from '#common/types'
import type { SearchArtistAPIResponseModel, SearchArtistModel } from '#modules/search/models'
import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { createArtistMapPayload } from '#modules/artists/helpers'

export interface SearchArtistsArgs {
  query: string
  page: number
  limit: number
}

export class SearchArtistsUseCase implements IUseCase<SearchArtistsArgs, z.infer<typeof SearchArtistModel>> {
  constructor() {}

  async execute({ query, limit, page }: SearchArtistsArgs): Promise<z.infer<typeof SearchArtistModel>> {
    const response = await useFetch<z.infer<typeof SearchArtistAPIResponseModel>>(Endpoints.search.artists, {
      q: query,
      p: page,
      n: limit
    })

    if (!response) throw new HTTPException(404, { message: 'artist not found' })

    return {
      total: response.total,
      start: response.start,
      results: response.results?.map(createArtistMapPayload).slice(0, limit) || []
    }
  }
}
