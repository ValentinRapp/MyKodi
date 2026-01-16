import { v4 as uuidv4 } from 'uuid';
import { isNumber } from './isNumber';

type Media = {
    name: string;
    source: string;
    id: string;
    details: any;
}

export const getMovie = async (media: Partial<Media>): Promise<any> => {
    const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${media.name?.split('.')[0]}`);
    let movieID: number;

    try {
        movieID = (await searchRes.json()).results[0].id;
    } catch (e) {
        movieID = parseInt(media.name?.split('.')[0] || '808');
    }

    if (isNumber(media.name?.split('.')[0] || "hello")) {
        movieID = parseInt(media.name?.split('.')[0] || '808');
    }

    if (isNaN(movieID)) {
        movieID = 808;
    }

    const movieData = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`).then(res => res.json());

    return movieData;
}

export const getTrailer = async (media: Partial<Media>): Promise<string> => {
    const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${media.name?.split('.')[0]}`);
    let movieID: number;

    try {
        movieID = (await searchRes.json()).results[0].id;
    } catch (e) {
        return '';
    }

    const trailerData = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${import.meta.env.VITE_TMDB_API_KEY}`).then(res => res.json());

    return trailerData.results[0].key;
}

export const getMovies = async (query: string): Promise<Media[]> => {
    const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${query}`);
    const searchResults = (await searchRes.json()).results;

    const IDs = searchResults.map((result: any) => result.id);

    const moviesDetails = await Promise.all(IDs.map(async (id: number) =>
        await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`).then(res => res.json())
    ));

    return moviesDetails.map((movie: any) => {
        return {
            name: movie.title as string,
            source: "",
            id: uuidv4(),
            details: movie
        }
    });
}