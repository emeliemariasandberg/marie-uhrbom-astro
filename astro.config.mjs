import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// Backs the admin tool (public/admin/index.html) with the local filesystem
// instead of the GitHub API when running `astro dev`, so editing content
// locally needs no GitHub token. Only registered for the dev server
// (apply: 'serve') — never bundled or run as part of `astro build`.
const ADMIN_API_PREFIX = '/__admin_local__';
// The admin tool only ever reads/writes page & settings JSON and public
// images/llms.txt — scope the local filesystem backend to exactly that,
// so this dev-only endpoint can't be used to read/write arbitrary project
// files (e.g. .env) from anything else that can reach localhost.
const ALLOWED_PREFIXES = ['src/content/', 'public/images/'];
const ALLOWED_FILES = new Set(['public/llms.txt']);
const TREE_ROOTS = ['src/content', 'public/images'];

function isAllowedPath(relPath) {
  return ALLOWED_FILES.has(relPath) || ALLOWED_PREFIXES.some(prefix => relPath.startsWith(prefix));
}

function adminLocalApi() {
  return {
    name: 'admin-local-api',
    apply: 'serve',
    configureServer(server) {
      const root = process.cwd();

      function safeResolve(relPath) {
        if (!isAllowedPath(relPath)) throw new Error('Path not allowed');
        const resolved = path.resolve(root, relPath);
        if (resolved !== root && !resolved.startsWith(root + path.sep)) {
          throw new Error('Path escapes project root');
        }
        return resolved;
      }

      function walkTree(dir, relDir, out) {
        for (const name of fs.readdirSync(dir)) {
          const abs = path.join(dir, name);
          const rel = relDir ? `${relDir}/${name}` : name;
          const stat = fs.statSync(abs);
          if (stat.isDirectory()) {
            out.push({ path: rel, type: 'tree', sha: 'local' });
            walkTree(abs, rel, out);
          } else {
            out.push({ path: rel, type: 'blob', sha: 'local', size: stat.size });
          }
        }
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith(ADMIN_API_PREFIX)) return next();

        const url = new URL(req.url, 'http://localhost');
        const sub = url.pathname.slice(ADMIN_API_PREFIX.length);

        const json = (status, data) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const readBody = async () => {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const raw = Buffer.concat(chunks).toString('utf8');
          return raw ? JSON.parse(raw) : {};
        };

        try {
          if (sub.startsWith('/contents/')) {
            const relPath = decodeURIComponent(sub.slice('/contents/'.length));
            if (!isAllowedPath(relPath)) return json(403, { message: 'Path not allowed' });
            const filePath = safeResolve(relPath);

            if (req.method === 'GET') {
              if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
                return json(404, { message: 'Not Found' });
              }
              const buf = fs.readFileSync(filePath);
              return json(200, { content: buf.toString('base64'), encoding: 'base64', sha: 'local' });
            }

            if (req.method === 'PUT') {
              const body = await readBody();
              const buf = Buffer.from(body.content || '', 'base64');
              fs.mkdirSync(path.dirname(filePath), { recursive: true });
              fs.writeFileSync(filePath, buf);
              return json(200, { content: { sha: 'local-' + Date.now() } });
            }

            if (req.method === 'DELETE') {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
              return json(200, { commit: { sha: 'local-' + Date.now() } });
            }

            return json(405, { message: 'Method not allowed' });
          }

          if (sub.startsWith('/git/trees/')) {
            const entries = [];
            for (const treeRoot of TREE_ROOTS) {
              const abs = path.join(root, treeRoot);
              if (fs.existsSync(abs)) walkTree(abs, treeRoot, entries);
            }
            if (fs.existsSync(path.join(root, 'public/llms.txt'))) {
              entries.push({ path: 'public/llms.txt', type: 'blob', sha: 'local', size: fs.statSync(path.join(root, 'public/llms.txt')).size });
            }
            return json(200, { tree: entries });
          }

          return next();
        } catch (err) {
          return json(500, { message: err.message });
        }
      });
    },
  };
}

export default defineConfig({
  site: 'https://marieuhrbom.se',
  base: process.env.BASE_PATH || undefined,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), adminLocalApi()],
  },
});
