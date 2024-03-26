import { generatePattern } from "./patternGenerator";
import qs from 'qs';


const server = Bun.serve({
  hostname: "192.168.0.181",
  port: 3333,
  fetch: Handler,
});

console.log(`Bun running on ${server.hostname}:${server.port}`);

async function Handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname == "" || url.pathname == "/")
    return new Response(Bun.file("index.html"));
  else if (url.pathname == "/main.js") return serveFile("main.js");
  else if (url.pathname == "/index.css") return serveFile("index.css");
  else if (url.pathname == "/time.js") return serveFile("time.js");
  else if (url.pathname == "/three.module.min.js")
    return serveFile("node_modules/three/build/three.module.min.js");
  else if (url.pathname == "/tween.esm.js")
    return serveFile("node_modules/@tweenjs/tween.js/dist/tween.esm.js");
  else if (url.pathname.startsWith("/img/")) {
    return serveFile(url.pathname.substring(1));
  } else if (request.method == "POST" && url.pathname == "/generate") {
    const requestBody = await request.text();
    const parsedBody = qs.parse(requestBody);
    console.log(parsedBody)
    const pattern = await generatePattern(
      parsedBody.shape,
      parsedBody.color,
      parsedBody.pattern
    );
    return new Response(`<img src="${pattern}" alt="Pattern preview">`, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else console.log(url.pathname);
  return new Response("Not found", { status: 404 });
}

function serveFile(filePath: string): Response {
  const file = Bun.file(filePath);
  const contentType = getContentType(filePath);
  return new Response(file, { headers: { "Content-Type": contentType } });
}

function getContentType(filePath: string): string {
  const extension = filePath.split(".").pop();
  switch (extension) {
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
