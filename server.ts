import { serve } from "bun";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PORT = process.env.PORT || 3000;

const mimeTypes: { [key: string]: string } = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function getMimeType(filePath: string): string {
  const ext = filePath.substring(filePath.lastIndexOf('.'));
  return mimeTypes[ext] || 'application/octet-stream';
}

function serveStatic(pathname: string): Response | null {
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = join(process.cwd(), filePath);

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath);
    const mimeType = getMimeType(filePath);

    return new Response(content, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

const server = serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);

    console.log(`${request.method} ${url.pathname}`);

    const staticResponse = serveStatic(url.pathname);
    if (staticResponse) {
      return staticResponse;
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`🚀 Keyboard Checker server running on http://localhost:${PORT}`);
console.log(`📱 Open your browser and start testing your keyboard!`);