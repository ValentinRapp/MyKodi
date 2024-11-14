import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovie } from "../lib/getMovie";

export function Media() {

  const { mediaName } = useParams();

  const [movieData, setMovieData] = useState<any>(null);

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    const movie = await getMovie({ name: mediaName });
    setMovieData(movie);
  }

  return (
    <div>
      {!movieData ?
        <div className="h-screen flex items-center justify-center">
          <span className="loading loading-dots loading-lg w-3/12">sexe</span>
        </div>
        :
        <div>
          <h1 className="text-6xl m-6 flex justify-center" style={{ fontFamily: "Helvetica-rounded-bold" }}>{movieData.original_title}</h1>
          <div className="flex justify-center">
            <img
              src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movieData.poster_path}`}
              alt={`${movieData.original_title} poster`}
              className="rounded-lg"
              width={200}
            />
          </div>
          <div className="flex justify-center">
            <p className="text-center">{movieData.overview}</p>
          </div>
        </div>
      }
    </div>
  )
}