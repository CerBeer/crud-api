import { IncomingMessage, ServerResponse } from "http";
import { env } from "./env";
import { setRes, resErrors, getUUIDFromURL, getBody } from "./api/utils";
import getUsers from "./api/getUsers";
import addUser from "./api/addUser";
import updateUser from "./api/updateUser";
import deleteUser from "./api/deleteUser";
import initDB from "./api/initDB";

export async function routeRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const processPort = process.env.WORKER_PORT;
  if (processPort) console.log(`Request processing on port ${processPort}`);
  const { method, url } = req;
  if (!url || !url.startsWith(env.ENDPOINT)) {
    setRes(res, resErrors.ENF());
    return;
  }
  if (url.length > env.ENDPOINT.length && !url.startsWith(`${env.ENDPOINT}/`)) {
    setRes(res, resErrors.ENF());
    return;
  }
  const uuid = getUUIDFromURL(url!);
  const body = await getBody(req);

  switch (method) {
    case "GET":
      setRes(res, await getUsers(uuid));
      break;
    case "POST":
      setRes(res, await addUser(body));
      break;
    case "PUT":
      setRes(res, await updateUser(uuid, body));
      break;
    case "DELETE":
      setRes(res, await deleteUser(uuid));
      break;
    case "PATCH":
      setRes(res, await initDB(body));
      break;
    default:
      setRes(res, resErrors.MNA());
  }
}
