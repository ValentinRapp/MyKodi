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
        return null;
    }

    const movieData = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`).then(res => res.json());

    return movieData;
}