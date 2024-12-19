import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getTrailer } from "../lib/getMovie";
import { StarRating } from "../components/star_rating";
import { useQuery } from "react-query";
import { queryClient } from "../main";
import { fetchMovie, getMediaInfo } from "../lib/fetchData";
import { getEndpoint } from "../lib/getEndpoint";
import { mfetch } from "../lib/mfetch";

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
  const { data, isLoading, isError } = useQuery(`media-${mediaName}`, () => getMediaInfo(mediaName as string));
  const [trailerID, setTrailerID] = useState<string>('');
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    try {
      setFavorited(data.favorite);
    } catch (e) {}
  }, [data]);

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

  const size = 30;

  const fullStar = (
    <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5245 3.46353C11.6741 3.00287 12.3259 3.00287 12.4755 3.46353L14.1329 8.56434C14.1998 8.77035 14.3918 8.90983 14.6084 8.90983H19.9717C20.4561 8.90983 20.6575 9.52964 20.2656 9.81434L15.9266 12.9668C15.7514 13.0941 15.678 13.3198 15.745 13.5258L17.4023 18.6266C17.552 19.0873 17.0248 19.4704 16.6329 19.1857L12.2939 16.0332C12.1186 15.9059 11.8814 15.9059 11.7061 16.0332L7.3671 19.1857C6.97524 19.4704 6.448 19.0873 6.59768 18.6266L8.25503 13.5258C8.32197 13.3198 8.24864 13.0941 8.07339 12.9668L3.73438 9.81434C3.34253 9.52964 3.54392 8.90983 4.02828 8.90983H9.39159C9.6082 8.90983 9.80018 8.77035 9.86712 8.56434L11.5245 3.46353Z" fill="#ffff00" />
    </svg>
  );

  const emptyStar = (
    <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" fill="none" stroke="#ffff00" stroke-width="0.6" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5245 3.46353C11.6741 3.00287 12.3259 3.00287 12.4755 3.46353L14.1329 8.56434C14.1998 8.77035 14.3918 8.90983 14.6084 8.90983H19.9717C20.4561 8.90983 20.6575 9.52964 20.2656 9.81434L15.9266 12.9668C15.7514 13.0941 15.678 13.3198 15.745 13.5258L17.4023 18.6266C17.552 19.0873 17.0248 19.4704 16.6329 19.1857L12.2939 16.0332C12.1186 15.9059 11.8814 15.9059 11.7061 16.0332L7.3671 19.1857C6.97524 19.4704 6.448 19.0873 6.59768 18.6266L8.25503 13.5258C8.32197 13.3198 8.24864 13.0941 8.07339 12.9668L3.73438 9.81434C3.34253 9.52964 3.54392 8.90983 4.02828 8.90983H9.39159C9.6082 8.90983 9.80018 8.77035 9.86712 8.56434L11.5245 3.46353Z" />
    </svg>
  );

  const handleCloseModal = () => {
    setTrailerID("");
    const dialog = document.getElementById("trailer_modal") as HTMLDialogElement;
    if (dialog) dialog.close();
  };

  const handleFavoriting = () => {
    setFavorited(curr => !curr);
    let action = favorited ? 'remove' : 'add';
    mfetch(`/favorites/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: mediaName })
    });
    }

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

  return (
    <div className="m-4">
      <div className="flex items-center justify-center relative mb-4">
        <NavLink className="btn btn-circle btn-outline absolute left-0 ml-2" to="/">
          {goBackSVG}
        </NavLink>
        <h1
          className="text-6xl mt-2"
          style={{ fontFamily: "Helvetica-rounded-bold" }}
        >
          {data.original_title}
        </h1>
      </div>
      <div className="flex grid grid-cols-2">
        <div className="flex justify-center align-center">
          <img
            src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${data.poster_path}`}
            alt={`${data.original_title} poster`}
            className="rounded-lg"
            width={500}
          />
        </div>
        <div className="m-6 text-2xl">
          <p>{data.release_date.split('-')[0]} - {data.genres.map((genre: any) => genre.name).join(", ")}</p>
          <StarRating note={data.vote_average} maxNote={10} nbStars={5} />
          <br />
          <p>{data.overview}</p>
          <br />
          <div className="flex">
            <NavLink
              to={`/media/${mediaName}/play`}
              className="btn btn-primary"
              onMouseOver={() => queryClient.prefetchQuery(`play-${mediaName}`, () => fetchMovie(mediaName as string))}
            >
              {playButtonSVG}
            </NavLink>
            <button
              className="btn btn-neutral ml-2"
              onClick={handleFavoriting}
            >
              {favorited ? fullStar : emptyStar}
            </button>
            <TrailerModal trailerID={trailerID} handleCloseModal={handleCloseModal} />
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
  )
}