import { useEffect, useState } from "react"
import { Media } from "./Home"
import { queryClient } from "../main";
import { getMovies } from "../lib/getMovie";
import { useNavigate } from "react-router-dom";
import { getMediaInfo } from "../lib/fetchData";

export function Browse() {

  const [query, setQuery] = useState<string>(localStorage.getItem('browe_query') || '');
  const [data, setData] = useState<Media[]>([]);
  const [failedPosters, setFailedPosters] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  const prefetchMediaDetails = (mediaName: string) => {
    queryClient.prefetchQuery(`media-${mediaName}`, () => getMediaInfo(mediaName));
  }

  useEffect(() => {
    (async () => {
      localStorage.setItem('browe_query', query);
      setData(await getMovies(query));
      setFailedPosters(new Set());
    })();
  }, [query]);

  return (
    <div>
      <h1 className="text-6xl m-6 flex justify-center" style={{ fontFamily: "Helvetica-rounded-bold" }}>Browse</h1>
      <div className="flex justify-center">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <div className="flex flex-wrap justify-center">
        {data
          .filter(media => !failedPosters.has(media.id))
          .map(media => (
            <div
              key={media.id}
              className="card"
              onMouseOver={() => prefetchMediaDetails(media.name)}
              onClick={() => navigate(`/media/${media.details.id}`)}
            >
              <div className="m-4 transition-transform duration-300 transform hover:scale-110">
                <img
                  src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${media.details.poster_path}`}
                  alt={`${media.details.original_title} poster`}
                  className="rounded-lg"
                  width={183}
                  onError={() => setFailedPosters(prev => new Set(prev).add(media.id))}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}