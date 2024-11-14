import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { getMovie } from "../lib/getMovie";

type Media = {
  name: string;
  source: string;
  id: string;
  details: any;
}

export function Home() {

  const [medias, setMedias] = useState<Media[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    const data = await fetch(`${import.meta.env.VITE_SERVER_URL as string}/medias`).then(res => res.json());
    const details = await Promise.all(data.medias.map(async (media: Partial<Media>) => {
      return await getMovie(media);
    }
    ));
    setMedias(
      data.medias.map((media: Partial<Media>) => ({
        name: media.name,
        source: media.source,
        id: uuidv4(),
        details: details[data.medias.indexOf(media)]
      })
      )
    );
  }

  return (
    <div>
      <h1 className="text-6xl m-6 flex justify-center" style={{ fontFamily: "Helvetica-rounded-bold" }}>Home</h1>
      <div className="flex flex-wrap justify-center">
        {medias.map(media => (
          <div
            key={media.id}
            className="card"
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