import { supabase } from './supabase.js';

const TABLE = 'movie_searches'

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const poster_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

    const { data: existing, error } = await supabase
      .from(TABLE)
      .select('id, count')
      .eq('search_term', searchTerm)
      .maybeSingle()

    if (error) throw error

    if (existing) {
      await supabase
        .from(TABLE)
        .update({
          count: existing.count + 1,
        })
        .eq('id', existing.id)
    } else {
      await supabase.from(TABLE).insert({
        search_term: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url,
      })
    }
  } catch (e) {
    console.error('updateSearchCount:', e)
  }
}

export const getTrendingMovies = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('count', { ascending: false })
    .limit(10)

  if (error) {
    console.error('getTrendingMovies:', error)
    return []
  }
  return data
}
