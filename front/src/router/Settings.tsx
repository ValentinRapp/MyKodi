import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from 'uuid';
import { fetchSettings } from "../lib/fetchData";
import { getEndpoint } from "../lib/getEndpoint";

type Source = {
  path: string;
  id: string;
}

const pingEndpoint = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`${endpoint}/ping`, {
      method: 'GET'
    });
    return response.status === 200;
  } catch (e) {
    return false;
  }
};

function TextEdit(props: {
  type?: string;
  readOnly?: boolean
  placeholder: string
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  saveCallback: (value: string) => void,
}) {
  return (
    <input
      disabled={props.readOnly}
      type={!props.type ? "text" : props.type}
      placeholder={props.placeholder}
      value={props.value}
      onChange={e => props.onChange(e)}
      onBlur={() => props.saveCallback(props.value)}
      onKeyDown={e => {
        if (e.key === "Enter") {
          props.saveCallback(props.value);
        }
      }}
      className={`input input-bordered w-full max-w-xs`}
    />
  )
}

function ThemeButton(props: { theme: string, onClick: (theme: string) => void }) {
  return (
    <div
      className="border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border outline outline-2 outline-offset-2 outline-transparent"
      data-act-class="!outline-base-content"
      data-set-theme={props.theme}
      onClick={() => props.onClick(props.theme)}
    >
      <div
        className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
        data-theme={props.theme}
      >
        <div className="grid grid-cols-5 grid-rows-3">
          <div className="bg-base-200 col-start-1 row-span-2 row-start-1" />{" "}
          <div className="bg-base-300 col-start-1 row-start-3" />{" "}
          <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
            <div className="font-bold">{props.theme}</div>{" "}
            <div className="flex flex-wrap gap-1">
              <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                <div className="text-primary-content text-sm font-bold">A</div>
              </div>{" "}
              <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                <div className="text-secondary-content text-sm font-bold">A</div>
              </div>{" "}
              <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                <div className="text-accent-content text-sm font-bold">A</div>
              </div>{" "}
              <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                <div className="text-neutral-content text-sm font-bold">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sources(props: { sources: Source[], setSources: (sources: Source[]) => void }) {

  useEffect(() => {
    if (props.sources.length === 0) {
      props.setSources([{ path: "", id: uuidv4() }]);
    }
  }, [props.sources]);

  const addSource = async (path: string) => {

    const paths = props.sources.map(s => s.path);
    const newPaths = Array.from(new Set(paths));

    props.setSources(newPaths.map((path: string) => ({ path, id: uuidv4() })));

    const res = await fetch(`${getEndpoint()}/paths/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ paths: newPaths })
    });

    if (!res.ok) {
      props.setSources(props.sources.filter(s => s.path !== path));
      alert("Invalid path");
    }
  }

  return (
    <div className="flex justify-center">
      <div>
        <h2 className="text-4xl mb-2 flex justify-center" >Sources</h2>
        <div className="flex">
          <div>
            <ul>
              {props.sources.map(source => (
                <li key={source.id} className="flex mb-2">
                  <TextEdit
                    placeholder="Write Path"
                    value={source.path}
                    onChange={e => props.setSources(props.sources.map(s => s.id === source.id ? { ...s, path: e.target.value } : s))}
                    saveCallback={addSource}
                  />
                  <button
                    className="btn btn-square btn-error ml-2"
                    onClick={() => {
                      props.setSources(props.sources.filter(s => s.id !== source.id));
                      fetch(`${getEndpoint()}/paths/remove`, {
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
            </ul>
            <button
              className="btn btn-square btn-primary w-full"
              onClick={() => props.setSources([...props.sources, { path: "", id: uuidv4() }])}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Themes() {

  const themes = useRef([
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ]);

  const setTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div>
      <div className="flex justify-center my-6">
        <div>
          <h2 className="text-4xl mb-2 flex justify-center" >Theme</h2>
          <div className=" rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {themes.current.map(theme => (
              <ThemeButton key={theme} theme={theme} onClick={(theme) => setTheme(theme)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Endpoint(props: { endpointStatus: boolean, setEndpointStatus: (status: boolean) => void }) {

  const [endpointType, setEndpointType] = useState<string>('');
  const [port, setPort] = useState('2425');
  const [address, setAddress] = useState('localhost');
  const [endpoint, setEndpoint] = useState<{ address: string, port: string }>({ port, address });

  useEffect(() => {
    setEndpointType(localStorage.getItem('endpoint') || 'local');

    const tempEndpoint = localStorage.getItem('endpoint_address');
    if (tempEndpoint) {
      try {
        const parsedEndpoint = JSON.parse(tempEndpoint);
        setEndpoint(parsedEndpoint);
        setPort(parsedEndpoint.port);
        setAddress(parsedEndpoint.address);
      } catch (error) {
        console.error("Error parsing endpoint:", error);
        localStorage.setItem('endpoint_address', JSON.stringify({ port, address }));
      }
    }
  }, []);

  useEffect(() => {
    if (endpoint.address !== 'localhost' || endpoint.port !== '2425') {
      localStorage.setItem('endpoint_address', JSON.stringify(endpoint));
    } else {
      localStorage.removeItem('endpoint_address');
    }
    const handleEndpointStatus = async () => props.setEndpointStatus(await pingEndpoint(getEndpoint()));
    handleEndpointStatus();
  }, [endpoint]);

  const handleEndpointType = (type: string) => {
    setEndpointType(type);
    localStorage.setItem('endpoint', type);
    if (type === 'local') {
      setAddress('localhost');
      setEndpoint(current => ({ address: 'localhost', port: current.port }));
    }
  }

  return (
    <div className="my-6">
      <div className="flex justify-center">
        <div>
          <h2 className="text-4xl mb-2 flex justify-center" >Endpoint</h2>

          <div className="flex justify-center w-full p-2 bg-base-300 rounded-2xl">
            <button
              className={"btn mr-2" + (endpointType === 'local' ? " btn-primary" : "")}
              onClick={() => handleEndpointType('local')}
            >
              Local
            </button>
            <button
              onClick={() => handleEndpointType('distant')}
              className={"btn" + (endpointType === 'distant' ? " btn-primary" : "")}
            >
              Distant
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <div className="w-28 mr-2">
          <TextEdit
            placeholder="Address"
            readOnly={endpointType === 'local'}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            saveCallback={(value) => setEndpoint(current => ({ address: value, port: current.port }))}
          />
        </div>
        <div className="w-20">
          <TextEdit
            type="number"
            placeholder="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            saveCallback={(value) => setEndpoint(current => ({ address: current.address, port: value }))}
          />
        </div>
      </div>
      {!props.endpointStatus && <p className="flex justify-center text-red-500 mt-1">Failed to reach endpoint</p>}
    </div>
  )
}

export function Settings() {

  const { data } = useQuery<Source[]>('settings', fetchSettings);
  const [endpointStatus, setEndpointStatus] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    setSources(data || []);
  }, [data]);

  return (
    <div>
      <h1 className="text-6xl m-6 flex justify-center" style={{ fontFamily: "Helvetica-rounded-bold" }}>Settings</h1>
      <div>
        <Endpoint endpointStatus={endpointStatus} setEndpointStatus={setEndpointStatus} />
        {endpointStatus && <Sources sources={sources} setSources={setSources} />}
        <Themes />
      </div>
    </div>
  );
}