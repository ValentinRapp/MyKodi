import Fastify from 'fastify'
import { readdir } from "node:fs/promises";
import cors from '@fastify/cors';

let PORT = parseInt(process.argv.slice(2)[0]);
let PASSWORD = process.argv.slice(2)[1] || '';

if (isNaN(PORT)) {
    PORT = 2425;
}

const fastify = Fastify({});

await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST']
});

fastify.addHook('onRequest', async (req, rep) => {
    if (['/ping', '/check_passwd'].includes(req.url)) {
        return;
    }

    const { authorization } = req.headers;

    if (!authorization ||
        ((authorization.split(' ').filter((element, index) => index).join(' ') || '') !== PASSWORD)) {
        return rep.code(403).send(JSON.stringify({ message: "Unauthorized" }))
    }
});

fastify.post<{ Body: { passwd: string | undefined } }>('/check_passwd', (req, rep) => {
    const { passwd } = req.body;

    if (passwd === undefined || passwd !== PASSWORD) {
        return rep.code(403).send(JSON.stringify({ message: "Unauthorized" }))
    }
    return { message: "Authorized" };
});

fastify.get('/ping', (req, rep) => {
    return { message: 'pong' };
});

fastify.get('/paths', async (req, rep): Promise<Paths> => {
    const paths = Bun.file("save.json");
    return paths.json();
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
        const file = await Bun.file(path).arrayBuffer();
        rep.header('Content-Type', 'application/octet-stream');
        rep.header('Content-Disposition', `attachment; filename="${name}"`);
        return Buffer.from(file);
    } catch (err) {
        rep.code(404);
        return { error: "File not found" };
    }
});

fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
});

try {
    console.log(`Server is running on port ${PORT}`);
    await fastify.listen({ port: PORT });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}