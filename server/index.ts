import Fastify from 'fastify'
import { readdir } from "node:fs/promises";
import fs from 'fs';
import cors from '@fastify/cors';

let PORT = parseInt(process.argv.slice(2)[0]);
let PASSWORD = process.argv.slice(2)[1] || '';
let READONLY = process.argv.slice(2)[2] === 'readonly' || false;

if (isNaN(PORT)) {
    PORT = 2425;
}

if (PASSWORD === 'readonly') {
    PASSWORD = '';
    READONLY = true;
}

const fastify = Fastify({});

await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST']
});

fastify.addHook('onRequest', async (req, rep) => {    
    if (['/ping', '/check_passwd', '/is_readonly', '/'].includes(req.url) || req.url.startsWith('/medias/') || PASSWORD === '') {
        return;
    } else if (READONLY && req.method !== 'GET') {
        return rep.code(403).send(JSON.stringify({ message: "Unauthorized" }));
    }
    
    const { authorization } = req.headers;

    if (!authorization ||
        ((authorization.split(' ').filter((element, index) => index).join(' ') || '') !== PASSWORD)) {
        return rep.code(403).send(JSON.stringify({ message: "Unauthorized" }))
    }
});

fastify.post<{ Body: { passwd: string | undefined } }>('/check_passwd', (req, rep) => {
    const { passwd } = req.body;

    if (PASSWORD === '') {
        return { message: "Authorized" };   
    } else if (passwd !== PASSWORD) {
        return rep.code(403).send(JSON.stringify({ message: "Unauthorized" }))
    }
    return { message: "Authorized" };
});

fastify.get('/ping', (req, rep) => {
    return { message: 'pong' };
});

fastify.get('/is_readonly', (req, rep) => {
    if (READONLY) {
        return rep.code(200).send(JSON.stringify({ message: "Readonly" }));
    } else {
        return rep.code(403).send(JSON.stringify({ message: "Readwrite" }));
    }
});

fastify.get('/paths', async (req, rep): Promise<Paths> => {
    const paths = Bun.file("save.json");
    return { paths: (await paths.json()).paths };
});

fastify.post('/paths/add', async (req, rep): Promise<Paths | { error: string }> => {
    const { path } = req.body as { path: string };

    try {
        await readdir(path);
    } catch (err) {
        rep.code(400);
        return { error: "Invalid path" };
    }

    const pathsFile = Bun.file("save.json");
    let paths: string[] = (await pathsFile.json() as Paths).paths;
    paths = Array.from(new Set([...paths, path]));
    Bun.write("save.json", JSON.stringify({ paths, favorites: (await pathsFile.json()).favorites }));
    return { paths };
});

fastify.post('/paths/update', async (req, rep): Promise<Paths | { error: string }> => {
    const { paths } = req.body as { paths: string[] };

    for (const path of paths) {
        try {
            await readdir(path);
        } catch (err) {
            rep.code(400);
            return { error: "Invalid path" };
        }
    }

    Bun.write("save.json", JSON.stringify({ paths, favorites: (await Bun.file("save.json").json()).favorites }));
    return { paths };
});

fastify.post('/paths/remove', async (req, rep): Promise<Paths> => {
    const { path } = req.body as { path: string };
    const pathsFile = Bun.file("save.json");
    let paths: string[] = (await pathsFile.json() as Paths).paths;
    paths = paths.filter(p => p !== path);
    Bun.write("save.json", JSON.stringify({ paths, favorites: (await pathsFile.json()).favorites }));
    return { paths };
});

fastify.get('/favorites', async (req, rep): Promise<{ favorites: string[] }> => {
    const save = Bun.file("save.json");
    return { favorites: (await save.json()).favorites || [] };
});

fastify.post('/favorites/add', async (req, rep) => {
    const save = Bun.file("save.json");
    const { name } = req.body as { name: string };
    let favorites: string[] = (await save.json()).favorites || [];
    favorites = Array.from(new Set([...favorites, name]));
    Bun.write("save.json", JSON.stringify({ paths: (await save.json()).paths, favorites }));
});

fastify.post('/favorites/remove', async (req, rep) => {
    const save = Bun.file("save.json");
    const { name } = req.body as { name: string };
    let favorites: string[] = (await save.json()).favorites || [];
    favorites = favorites.filter(f => f !== name);
    Bun.write("save.json", JSON.stringify({ paths: (await save.json()).paths, favorites }));
});

fastify.get('/medias', async (req, rep): Promise<{ medias: Media[] } | null> => {
    const paths: string[] = (await Bun.file("save.json").json() as Paths).paths;
    let medias: Media[] = [];

    for (const path of paths) {
        try {
            const files = await readdir(path);

            files.forEach(file => {
                medias.push({ name: file, source: path });
            });
        } catch (err) {
            console.log(err);
        };

    };

    return { medias };
});

fastify.get('/medias/:name', async (req, rep) => {
    const { name } = req.params as { name: string };

    const sources: string[] = (await Bun.file("save.json").json() as Paths).paths;

    const paths = sources.map(source => `${source}/${name}`)

    const validPaths = [];
    for (const path of paths) {
        if (await Bun.file(path).exists()) {
            validPaths.push(path);
        }
    }

    if (!validPaths.length) {
        rep.code(404);
        return { error: "File not found" };
    }

    const path = validPaths[0];

    try {
        const fileSize = Bun.file(path).size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] 
              ? parseInt(parts[1], 10)
              : fileSize - 1;
      
            const chunkSize = end - start + 1;
            
            rep.status(206)
              .header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
              .header('Accept-Ranges', 'bytes')
              .header('Content-Length', chunkSize)
              .header('Content-Type', 'video/mp4');
      
            return fs.createReadStream(path, { start, end });
        } else {
            rep.header('Content-Length', fileSize)
            .header('Content-Type', 'video/mp4');
       
            return fs.createReadStream(path);
        }
    } catch (err) {
        rep.code(404);
        return { error: "video not found" };
    }
});

fastify.get('/', async (req, rep) => {
    return { hello: 'world' };
});

try {
    console.log(`Server is running on port ${PORT}`);
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
