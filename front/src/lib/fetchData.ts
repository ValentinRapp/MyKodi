import { Media } from "../router/Home";
import { getMovie } from "./getMovie";
import { v4 as uuidv4 } from 'uuid';
import { mfetch } from "./mfetch";

export const fetchHome = async () => {
  const data = await mfetch('/medias').then(res => res.json());

  let details = await Promise.all(data.medias.map(async (media: Partial<Media>) => {
    return await getMovie(media);
  }));

  const favorites = await mfetch('/favorites')
    .then(res => res.json())
    .then(data => data.favorites);
  
  return data.medias.map((media: Partial<Media>) => {
    favorites.includes(media.name) ? details[data.medias.indexOf(media)].genres.push({ name: "Favorited" }) : null;
    return {
      name: media.name,
      source: media.source,
      id: uuidv4(),
      details: details[data.medias.indexOf(media)]
    }
  });
}

export const fetchSettings = () =>
  mfetch('/paths')
    .then(res => res.json())
    .then(data => data.paths.map((path: string) => ({ path, id: uuidv4() })));


export const fetchMovie = async (filename: string) => {
  const title = (await getMovie({ name: filename })).original_title;
  return { title };
}

export const getMediaInfo = async (filename: string) => {
  const movieDetails = await getMovie({ name: filename });
  const favorite = await mfetch('/favorites')
    .then(res => res.json())
    .then(data => data.favorites.includes(filename));
  const isOwned = await mfetch('/medias')
    .then(res => res.json())
    .then(data => data.medias.some((media: any) => media.name === filename));
  return { ...movieDetails, favorite, isOwned };
}