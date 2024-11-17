import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from 'uuid';
import { fetchSettings } from "../lib/fetchData";

type Source = {
  path: string;
  id: string;
}

function TextEdit(props: {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  saveCallback: (value: string) => void
}) {
  return (
    <input
      type="text"
      placeholder="Write Path"
      value={props.value}
      onChange={e => props.onChange(e)}
      onBlur={() => props.saveCallback(props.value)}
      onKeyDown={e => {
        if (e.key === "Enter") {
          props.saveCallback(props.value);
        }
      }}
      className="input input-bordered w-full max-w-xs"
    />
  )
}

export function Settings() {

  const { data, isError } = useQuery<Source[]>('settings', fetchSettings);

  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    setSources(data || []);
  }, [data]);

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl text-red-500">An error occurred</p>
      </div>
    )
  }

  const addSource = async (path: string) => {

    const paths = sources.map(s => s.path);
    const newPaths = Array.from(new Set(paths));
    
    setSources(newPaths.map((path: string) => ({ path, id: uuidv4() })));

    const res = await fetch(`${import.meta.env.VITE_SERVER_URL as string}/paths/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ paths: newPaths })
    });

    if (!res.ok) {
      setSources(sources.filter(s => s.path !== path));
      alert("Invalid path");
    }
  }

  return (
    <div>
      <h1 className="text-6xl m-6 flex justify-center" style={{ fontFamily: "Helvetica-rounded-bold" }}>Settings</h1>
      <div>
        <h2 className="text-4xl mb-2" >Sources</h2>
        <ul>
          {sources.map(source => (
            <li key={source.id} className="flex mb-2">
              <TextEdit
                value={source.path}
                onChange={e => setSources(sources.map(s => s.id === source.id ? { ...s, path: e.target.value } : s))}
                saveCallback={addSource}
              />
              <button
                className="btn btn-square btn-error ml-2"
                onClick={() => {
                  setSources(sources.filter(s => s.id !== source.id));
                  fetch(`${import.meta.env.VITE_SERVER_URL as string}/paths/remove`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ path: source.path })
                  });
                }}
              >
                🗑️
              </button>
            </li>
          ))}
          <button
            className="btn btn-square btn-primary w-full"
            onClick={() => setSources([...sources, { path: "", id: uuidv4() }])}
          >
            +
          </button>
        </ul>
      </div>
    </div>
  );
}