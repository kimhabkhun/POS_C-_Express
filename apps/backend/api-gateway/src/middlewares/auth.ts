import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import configs from "@/config";

import ROUTE_PATHS, { RouteConfig } from "@/route-defs";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

declare global {
  namespace Express {
    interface Request {
      currentUser: {
        username: string;
        role: string[] | undefined;
      };
      routeConfig: RouteConfig;
      methodConfig: {
        authRequired: boolean;
        roles?: string[];
      };
    }
  }
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: configs.awsCognitoUserPoolId,
  tokenUse: "access",
  clientId: configs.awsCognitoClientId,
});

const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { methodConfig } = req;

    if (methodConfig.authRequired) {
      console.log("need authicated");
      const token = req.cookies?.["access_token"];
      if (!token) {
        throw new Error("Please login to continue");
      }

      const payload = await verifier.verify(token);

      if (!payload) {
        throw new Error("Please login to continue");
      }

      let role: string[] = [];
      const userPayload = await jwtDecode(req.cookies?.["id_token"]);

      // @ts-ignore
      if (userPayload["cognito:username"].includes("google")) {
        // @ts-ignore
        if (!userPayload["custom:role"]) {
          const { data } = await axios.get(
            `${configs.userServiceUrl}/v1/users/me`,
            {
              headers: {
                Cookie: `username=${userPayload.sub}`,
              },
            }
          );
          role.push(data.data.role);
        } else {
          // @ts-ignore
          role.push(userPayload["custom:role"]);
        }
      } else {
        role = payload["cognito:groups"] || [];
      }

      req.currentUser = {
        username: payload.username,
        role,
      };
    }
    console.log("req.currentUser", req.currentUser);

    next();
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

// TODO: implement the authorizeRole function
// Step 1: Check if the user is authenticated
// Step 2: Check if the user has the required role
// Step 3: If the user is authenticated and has the required role, call next()
// Step 4: If the user is not authenticated, return a 401 Unauthorized status

const authorizeRole = (req: Request, _res: Response, next: NextFunction) => {
  const { methodConfig, currentUser } = req;

  // Check if the route requires specific roles
  if (methodConfig.roles) {
    // If the user is not authenticated or does not have any of the required roles, throw an error
    if (
      !currentUser ||
      !Array.isArray(currentUser.role) ||
      !currentUser.role.some((role) => methodConfig.roles!.includes(role))
    ) {
      return next(new Error());
    }
  }

  next();
};

const findRouteConfig = (
  path: string,
  routeConfigs: RouteConfig
): RouteConfig | null => {
  const trimmedPath = path.replace(/\/+$/, ""); // Remove trailing slash, if any

  const requestSegments = trimmedPath.split("/").filter(Boolean); // Split and remove empty segments
  const routeSegments = routeConfigs.path.split("/").filter(Boolean);

  if (routeSegments.length > requestSegments.length) {
    return null;
  }

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const requestSegment = requestSegments[i];

    if (routeSegment.startsWith(":")) {
      continue;
    }

    if (routeSegment !== requestSegment) {
      return null;
    }
  }

  if (!routeConfigs.nestedRoutes) {
    return routeConfigs;
  }

  const remainingPath = `/${requestSegments
    .slice(routeSegments.length)
    .join("/")}`;

  // STEP 6: Check if any nested routes match the remaining path
  for (const nestedRouteConfig of routeConfigs.nestedRoutes) {
    const nestedResult = findRouteConfig(remainingPath, nestedRouteConfig);
    if (nestedResult) {
      return nestedResult;
    }
  }

  return routeConfigs;
};

const routeConfigMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { path, method } = req;

  console.log("path:::", path, " method1111111111:::", method);

  // Step 1
  let routeConfig = null;
  for (const key in ROUTE_PATHS) {
    routeConfig = findRouteConfig(path, ROUTE_PATHS[key]);
    // console.log("routeConfig", routeConfig);
    if (routeConfig) break;
  }
  console.log("routeConfig", routeConfig);
  if (!routeConfig) {
    return next(new Error("Route not found"));
  }
  // Step 2
  const methodConfig = routeConfig.methods?.[method];
  console.log(methodConfig);
  if (!methodConfig) {
    return next(new Error("Method not allowed"));
  }

  console.log("routeConfig", routeConfig);

  // Attach the route configuration and method config to the request object
  req.routeConfig = routeConfig;
  req.methodConfig = methodConfig;
  console.log("method", methodConfig);

  next();
};

export { authenticateToken, authorizeRole, routeConfigMiddleware };
