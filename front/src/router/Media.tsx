import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getMovie, getTrailer } from "../lib/getMovie";
import { StarRating } from "../components/star_rating";

function TrailerModal(props: { trailerID: string, handleCloseModal: () => void }) {
  return (
    <dialog id="trailer_modal" className="modal" onClick={(e) => {
      const dialog = document.getElementById('trailer_modal');
      if (e.target === dialog) props.handleCloseModal();
    }}>
      <div className="modal-box relative w-11/12 max-w-4xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => props.handleCloseModal()}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Trailer</h3>
        <div className="py-4">
          <iframe
            width="854"
            height="480"
            src={`https://www.youtube.com/embed/${props.trailerID}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </div>
    </dialog>
  )
}

export function Media() {

  const { mediaName } = useParams();

  const [movieData, setMovieData] = useState<any>(null);
  const [trailerID, setTrailerID] = useState<string>('');

  const goBackSVG = (
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
  );

  const playButtonSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 100 100"
      fill="none"
    >
      <polygon points="40,30 70,50 40,70" fill="black" />
    </svg>
  );

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const fetchMovieDetails = async () => {
    const movie = await getMovie({ name: mediaName });
    setMovieData(movie);
  }

  const handleCloseModal = () => {
    setTrailerID("");
    const dialog = document.getElementById("trailer_modal") as HTMLDialogElement;
    if (dialog) dialog.close();
  };

  return (
    <div>
      {!movieData ?
        <div className="h-screen flex items-center justify-center">
          <span className="loading loading-dots loading-lg w-3/12" />
        </div>
        :
        <div className="m-4">
          <div className="flex items-center justify-center relative mb-4">
            <NavLink className="btn btn-circle btn-outline absolute left-0 ml-2" to="/">
              {goBackSVG}
            </NavLink>
            <h1
              className="text-6xl mt-2"
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
              <p>{movieData.release_date.split('-')[0]} - {movieData.genres.map((genre: any) => genre.name).join(", ")}</p>
              <StarRating note={movieData.vote_average} maxNote={10} nbStars={5} />
              <br />
              <p>{movieData.overview}</p>
              <br />
              <div className="flex">
                <button className="btn btn-primary">
                  {playButtonSVG}
                </button>
                <TrailerModal trailerID={trailerID} handleCloseModal={handleCloseModal} />
                <div>
                  <button
                    className="btn btn-neutral ml-2"
                    onClick={async () => {
                      (document.getElementById('trailer_modal') as HTMLDialogElement)?.showModal()
                      setTrailerID(await getTrailer({ name: mediaName }));
                    }}
                  >
                    Watch trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}