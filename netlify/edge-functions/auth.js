export default async function handler(req, context) {
  const authorization = req.headers.get("authorization");

  if (authorization) {
    const [scheme, encoded] = authorization.split(" ");

    if (scheme === "Basic") {
      const decoded = atob(encoded);
      const [username, password] = decoded.split(":");

      const validUser = Deno.env.get("AUTH_USER");
      const validPass = Deno.env.get("AUTH_PASS");

      if (username === validUser && password === validPass) {
        return context.next();
      }
    }
  }

  return new Response("401 Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected"',
    },
  });
}

export const config = {
  path: "/*",
};
