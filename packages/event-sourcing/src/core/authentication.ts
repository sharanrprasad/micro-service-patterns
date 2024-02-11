import * as express from "express";

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes: string[] = [],
): Promise<{ id: string; name: string; scopes: string[] }> {
  if (request.headers["authorization"] && securityName === "jwt") {
    return Promise.resolve({
      id: "some-user",
      name: "Ironman",
      scopes: scopes,
    });
  }
  throw new Error("UnAuthorized");
}
