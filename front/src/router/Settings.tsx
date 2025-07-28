import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from 'uuid';
import { fetchSettings } from "../lib/fetchData";
// import { getEndpoint } from "../lib/getEndpoint";
import { mfetch } from "../lib/mfetch";
import { toast } from "sonner";

type Source = {
  path: string;
  id: string;
}
/*
const pingEndpoint = async (_endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`${getEndpoint()}/ping`, {
      method: 'GET'
    });
    return response.status === 200;
  } catch (e) {
    return false;
  }
};

const isPasswordCorrect = async (password: string): Promise<boolean> => {
  try {
    return await fetch(`${getEndpoint()}/check_passwd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ passwd: password })
    })
      .then(res => res.json())
      .then(data => data.message === "Authorized");
  } catch (e) {
    return false;
  }
}
*/
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

function Sources(props: { sources: Source[], setSources: (sources: Source[]) => void, isReadOnly: boolean }) {

  useEffect(() => {
    if (props.sources.length === 0) {
      props.setSources([{ path: "", id: uuidv4() }]);
    }
  }, [props.sources]);

  const addSource = async (path: string) => {

    const paths = props.sources.map(s => s.path);
    const newPaths = Array.from(new Set(paths));

    props.setSources(newPaths.map((path: string) => ({ path, id: uuidv4() })));

    const res = await mfetch('/paths/update', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ paths: newPaths })
    });

    if (!res.ok) {
      props.setSources(props.sources.filter(s => s.path !== path));
      toast.error("Invalid path");
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
                    readOnly={props.isReadOnly}
                  />
                  {!props.isReadOnly && <button
                    className="btn btn-square btn-error ml-2"
                    onClick={() => {
                      props.setSources(props.sources.filter(s => s.id !== source.id));
                      mfetch('/paths/remove', {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ path: source.path })
                      });
                    }}
                  >
                    🗑️
                  </button>}
                </li>
              ))}
            </ul>
            {!props.isReadOnly && <button
              className="btn btn-square btn-primary w-full"
              onClick={() => props.setSources([...props.sources, { path: "", id: uuidv4() }])}
            >
              +
            </button>}
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

/*
function Endpoint(props: { setEndpointStatus: (status: boolean) => void, setIsReadOnly: (status: boolean) => void }) {
  const [port, setPort] = useState('2425');
  const [address, setAddress] = useState('localhost');
  const [password, setPassword] = useState(localStorage.getItem('password') || '');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [endpoint, setEndpoint] = useState<{ address: string, port: string }>({ port, address });

  const endpointType = address === 'localhost' ? 'local' : 'distant';

  useEffect(() => {
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
    (async () => {
      setNeedsPassword(await mfetch('/check_passwd', {
        method: 'POST',
        body: JSON.stringify({ passwd: '' }),
      }).then(res => !res.ok));
    })();
  }, [endpoint]);

  const handleEndpointStatus = async () => {
    const endpointStatus = (await pingEndpoint(getEndpoint())) && (await isPasswordCorrect(password));
    if (!endpointStatus) {
      toast.error("Failed to reach endpoint");
    }
    props.setEndpointStatus(endpointStatus);
    props.setIsReadOnly((await mfetch('/is_readonly')).ok);
  }

  useEffect(() => {
    if (endpoint.address !== 'localhost' || endpoint.port !== '2425') {
      localStorage.setItem('endpoint_address', JSON.stringify(endpoint));
    } else {
      localStorage.removeItem('endpoint_address');
    }
    handleEndpointStatus();
  }, [endpoint]);

  const handleButtonClick = (type: 'local' | 'distant') => {
    if (type === 'local') {
      const newAddress = 'localhost';
      setAddress(newAddress);
      setEndpoint(current => ({ ...current, address: newAddress }));
    } else {
      const newAddress = '';
      setAddress(newAddress);
      setEndpoint(current => ({ ...current, address: newAddress }));
    }
  }

  return (
    <div className="my-6">
      <div className="flex justify-center">
        <div>
          <h2 className="text-4xl mb-2 flex justify-center">Endpoint</h2>

          <div className="flex justify-center w-full p-2 bg-base-300 rounded-2xl">
            <button
              className={`btn mr-2 ${endpointType === 'local' ? 'btn-primary' : ''}`}
              onClick={() => handleButtonClick('local')}
            >
              Local
            </button>
            <button
              className={`btn ${endpointType === 'distant' ? 'btn-primary' : ''}`}
              onClick={() => handleButtonClick('distant')}
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
        <div className="w-24">
          <TextEdit
            type="number"
            placeholder="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            saveCallback={(value) => setEndpoint(current => ({ address: current.address, port: value }))}
          />
        </div>
      </div>
      {needsPassword && <div className="mt-2 w-52 mx-auto">
        <TextEdit
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          saveCallback={(password) => {
            localStorage.setItem('password', password);
            handleEndpointStatus();
          }}
        />
      </div>}
    </div>
  );
}
*/

export function Settings() {

  const { data } = useQuery<Source[]>('settings', fetchSettings);
  const [endpointStatus, _setEndpointStatus] = useState(true);
  const [isReadOnly, _setIsReadOnly] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    setSources(data || []);
  }, [data]);

  return (
    <div>
      <h1 className="text-6xl m-6 flex justify-center" style={{ fontFamily: "Helvetica-rounded-bold" }}>Settings</h1>
      <div>
        {endpointStatus && <Sources sources={sources} setSources={setSources} isReadOnly={isReadOnly} />}
        <Themes />
      </div>
    </div>
  );
}
