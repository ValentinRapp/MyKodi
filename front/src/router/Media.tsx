import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
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
        <div className="m-4">
          <div className="flex items-center justify-center relative mb-4">
            <NavLink className="btn btn-circle btn-outline absolute left-0 ml-2" to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                width="24" height="24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"
                />
              </svg>
            </NavLink>
            <h1
              className="text-6xl"
              style={{ fontFamily: "Helvetica-rounded-bold" }}
            >
              {movieData.original_title}
            </h1>
          </div>
          <div className="flex grid grid-cols-2">
            <div className="flex justify-center align-center">
              <img
                src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movieData.poster_path}`}
                alt={`${movieData.original_title} poster`}
                className="rounded-lg"
                width={500}
              />
            </div>
            <div className="m-6 text-2xl">
              <p>{movieData.release_date.split('-')[0]} - {movieData.vote_average}/10 - {movieData.genres.map((genre: any) => genre.name).join(", ")}</p>
              <br />
              <p>{movieData.overview}</p>
              <br />
              <button className="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <polygon points="40,30 70,50 40,70" fill="black" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}