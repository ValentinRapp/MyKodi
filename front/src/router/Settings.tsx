import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

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

  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    const paths = await fetch("http://localhost:3000/paths").then(res => res.json());
    setSources(paths.paths.map((path: string) => ({ path, id: uuidv4() })));
  }

  const addSource = async (path: string) => {

    const paths = sources.map(s => s.path);
    const newPaths = Array.from(new Set(paths));
    
    setSources(newPaths.map((path: string) => ({ path, id: uuidv4() })));

    if (paths.length !== newPaths.length) {
      return;
    }

    const res = await fetch("http://localhost:3000/paths/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ path })
    });

    if (!res.ok) {
      setSources(sources.filter(s => s.path !== path));
      alert("Invalid path");
    }
  }

  return (
    <div>
      <h1 className="text-6xl m-6" >Settings</h1>
      <div>
        <h2 className="text-4xl" >Sources</h2>
        <ul>
          {sources.map(source => (
            <li key={source.id} className="flex my-2">
              <TextEdit
                value={source.path}
                onChange={e => setSources(sources.map(s => s.id === source.id ? { ...s, path: e.target.value } : s))}
                saveCallback={addSource}
              />
              <button
                className="btn btn-square btn-error ml-2"
                onClick={() => {
                  setSources(sources.filter(s => s.id !== source.id));
                  fetch(`http://localhost:3000/paths/remove`, {
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