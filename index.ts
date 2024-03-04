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
  else if (url.pathname == "/main.js") return new Response(Bun.file("main.js"));
  else if (url.pathname == "/index.css")
    return new Response(Bun.file("index.css"));
  else if (url.pathname == "/time.js") return new Response(Bun.file("time.js"));
  else if (url.pathname == "/three.module.min.js")
    return new Response(
      Bun.file("node_modules/three/build/three.module.min.js"),
    );
  else if (url.pathname == "/tween.esm.js")
    return new Response(
      Bun.file("node_modules/@tweenjs/tween.js/dist/tween.esm.js"),
    );
  else if (url.pathname == "/img/1section_img.png")
    return new Response(
      Bun.file("img/1section_img.png", { type: "image/png" }),
    );
  else if (url.pathname == "/img/btn/order_btn.png")
    return new Response(
      Bun.file("img/btn/order_btn.png", { type: "image/png" }),
    );
  else if (url.pathname == "/animation.js")
    return new Response(Bun.file("animation.js"));
  else if (url.pathname == "/img/placeholder_1.png")
    return new Response(
      Bun.file("img/placeholder_1.png", { type: "image/png" }),
    );
  else if (request.method == "POST" && url.pathname == "/log-scroll") {
    const formData = await request.formData();
    const message = formData.get("message");
    console.log("Message: ", message);
    return new Response("OK", { status: 200 });
  } else if (request.method == "POST" && url.pathname == "/submit-url") {
    const formData = await request.formData();
    const userInput = formData.get("userInput");
    console.log("User input: ", userInput);
    const responseMessage = `<p>You entered: <strong>${userInput}</strong></p>`;
    return new Response(responseMessage, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } else console.log(url.pathname);
  return new Response("Not found", { status: 404 });
}
