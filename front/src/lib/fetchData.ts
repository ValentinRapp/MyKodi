import { Media } from "../router/Home";
import { getMovie } from "./getMovie";
import { v4 as uuidv4 } from 'uuid';

export const fetchHome = async () => {
    const data = await fetch(`${import.meta.env.VITE_SERVER_URL as string}/medias`).then(res => res.json());
    const details = await Promise.all(data.medias.map(async (media: Partial<Media>) => {
      return await getMovie(media);
    }
    ));
    return data.medias.map((media: Partial<Media>) => ({
      name: media.name,
      source: media.source,
      id: uuidv4(),
      details: details[data.medias.indexOf(media)]
    }));
}

export const fetchSettings = () => 
    fetch(`${import.meta.env.VITE_SERVER_URL as string}/paths`)
      .then(res => res.json())
      .then(data => data.paths.map((path: string) => ({ path, id: uuidv4() })));