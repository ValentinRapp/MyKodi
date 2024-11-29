import { useNavigate } from "react-router-dom";
import { getMovie } from "../lib/getMovie";
import { queryClient } from "../main";
import { useQuery } from "react-query";
import { fetchHome } from "../lib/fetchData";
import { useEffect, useState } from "react";
import { GenresDropdown } from "../components/genres_dropdown";

export type Media = {
  name: string;
  source: string;
  id: string;
  details: any;
}

export function Home() {

  const { data, isLoading, isError } = useQuery<Media[]>('home', fetchHome);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    let tempGenres = Array.from(new Set(data?.map(media => media.details.genres.map((genre: any) => genre.name)).flat()))
    setGenres(tempGenres);
    setSelectedGenres(tempGenres);
  }, [data]);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-lg w-3/12" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl text-red-500">An error occurred</p>
      </div>
    )
  }

  const prefetchMediaDetails = (mediaName: string) => {
    queryClient.prefetchQuery(`media-${mediaName}`, () => getMovie({ name: mediaName }));
  }

  return (
    <div>
      <h1 className="text-6xl m-6 flex justify-center" style={{ fontFamily: "Helvetica-rounded-bold" }}>Home</h1>
      <div className="flex justify-center">
        <GenresDropdown
          genres={genres}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </div>
      <div className="flex flex-wrap justify-center">
        {data
          ?.filter(media => selectedGenres.some(genre => media.details.genres.map((genre: any) => genre.name).includes(genre)))
          .map(media => (
            <div
              key={media.id}
              className="card"
              onMouseOver={() => prefetchMediaDetails(media.name)}
              onClick={() => navigate(`/media/${media.name}`)}
            >
              <div className="m-4 transition-transform duration-300 transform hover:scale-110">
                <img
                  src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${media.details.poster_path}`}
                  alt={`${media.details.original_title} poster`}
                  className="rounded-lg"
                  width={200}
                />
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}