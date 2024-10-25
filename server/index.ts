import Fastify from 'fastify'
import { readdir } from "node:fs/promises";
import cors from '@fastify/cors';

const fastify = Fastify({});

await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST']
});

fastify.get('/paths', async (req, rep): Promise<Paths> => {
    const paths = Bun.file("paths.json");
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

    const pathsFile = Bun.file("paths.json");
    let paths: string[] = (await pathsFile.json() as Paths).paths;
    paths = Array.from(new Set([...paths, path]));
    Bun.write("paths.json", JSON.stringify({ paths }));
    return { paths };
});

fastify.post('/paths/remove', async (req, rep): Promise<Paths> => {
    const { path } = req.body as { path: string };
    const pathsFile = Bun.file("paths.json");
    let paths: string[] = (await pathsFile.json() as Paths).paths;
    paths = paths.filter(p => p !== path);
    Bun.write("paths.json", JSON.stringify({ paths }));
    return { paths };
});


fastify.get('/medias', async (req, rep): Promise<{ medias: Media[] } | null> => {
    const paths: string[] = (await Bun.file("paths.json").json() as Paths).paths;
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
    
    const sources: string[] = (await Bun.file("paths.json").json() as Paths).paths;
    
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
    console.log('Server is running at http://localhost:3000/');
    await fastify.listen({ port: 3000 });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}