import * as functions from "firebase-functions/v2";
import {Request, Response} from "express";
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

/**
 * Utility function to create HTTP trigger functions with
 * different access levels. Public endpoints are not protected
 * and can be accessed by anyone. Protected endpoints
 * require a valid API key while private endpoints require
 * both a valid API key and a valid IP address.
 * @param {string} accessLevel - The access level of the function.
 * @param {any} handler
 * - The handler function for the function.
 * @param {boolean} hasBatchOperation
 * - Whether the function has a batch operation.
 * @return {functions.https.onRequest}
 */
export function createHttpTrigger(
  accessLevel: "public" | "protected" | "private" = "protected",
  handler: (request: functions.https.Request, response: Response)
        => void | Promise<void>,
  hasBatchOperation = false) {
  return functions.https.onRequest(
    hasBatchOperation ?
      {timeoutSeconds: 3600} :
      {timeoutSeconds: 300},
    async (req, res) => {
      try {
        if (accessLevel === "protected" || accessLevel === "private") {
          await validateIpAddress(req, res);
        }
        if (accessLevel === "private") {
          await validateApiKey(req, res);
        }
        handler(req, res);
      } catch (error) {
        console.error(`Error in ${accessLevel} function:`, error);
        res.status(500).send(
          "Terminated on error, see logs for details.");
      }
    });
}

const secretManagerClient = new SecretManagerServiceClient();

/**
 * Given a firebase cloud function request, it will check the
 * request IP
 * address and determine if it is allowed.
 * @param {Request} request - The request object.
 * @param {Response} res - The response object.
 */
const validateIpAddress = async (request: Request, res: Response) => {
  const clientIp = request.headers["x-forwarded-for"] ||
                request.connection.remoteAddress || "";
  const [version] = await secretManagerClient.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}` +
        "/secrets/IP_WHITELIST/versions/latest",
  });
  const allowedIPs = version.payload?.data?.toString().
    split(",").map((ip: string) => ip.trim());
  if (!allowedIPs?.some((allowedIp: string) =>
    (clientIp as string).startsWith(allowedIp.split("/")[0]))) {
    res.status(403).json(
      {error: "Access denied: IP not allowed"});
    return;
  }
};

/**
 * Given a firebase cloud function request, it will check the provided
 * API key and determine if it is valid by fetching the API key from
 * GCP Secret Manager.`
 * @param {Request} request - The request object.
 * @param {Response} res - The response object.
 */
const validateApiKey = async (request: Request, res: Response) => {
  const authHeader = request.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  const [version] = await secretManagerClient.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}`+
        "/secrets/EXTERNAL_API_TOKEN/versions/latest",
  });
  const externalAPIToken = version.payload?.data?.toString();
  if (token !== externalAPIToken) {
    res.status(401).json({error: "Unauthorized API key"});
    return;
  }
};
