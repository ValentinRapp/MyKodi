import { useQuery } from "react-query";
import { NavLink, useParams } from "react-router-dom";
import { fetchMovie } from "../lib/fetchData";

export function Player() {
  const { mediaName } = useParams();
  const { data, isLoading, isError } = useQuery(`play-${mediaName}`, () => fetchMovie(mediaName as string));

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
        <NavLink className="btn btn-circle btn-outline absolute left-0 ml-2" to={`/media/${mediaName}`}>
          {goBackSVG}
        </NavLink>
        <h1
          className="text-6xl mt-2"
          style={{ fontFamily: "Helvetica-rounded-bold" }}
        >
          {data?.title}
        </h1>
      </div>
      <div className="flex justify-center">
        <video src={data?.link as string} controls width="80%" />
      </div>
    </div>
  )
}