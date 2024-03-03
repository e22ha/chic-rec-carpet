const server = Bun.serve({
  hostname: "localhost",
  port: 3333,
  fetch: Handler,
});

console.log(`Bun running on ${server.hostname}:${server.port}`);

async function Handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname == "" || url.pathname == "/")
    return new Response(Bun.file("index.html"));
  else if (url.pathname == "/main.js") return new Response(Bun.file("main.js"));
  else if (url.pathname == "/time.js") return new Response(Bun.file("time.js"));
  else if (url.pathname == "/three.module.min.js")
    return new Response(
      Bun.file("node_modules/three/build/three.module.min.js"),
    );
  else if (url.pathname == "/tween.esm.js")
    return new Response(
      Bun.file("node_modules/@tweenjs/tween.js/dist/tween.esm.js"),
    );
  else console.log(url.pathname);
  return new Response("Not found", { status: 404 });
}
