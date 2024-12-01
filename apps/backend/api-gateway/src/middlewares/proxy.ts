import ROUTE_PATHS from "@/route-defs";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import express, { Response } from "express";
// import { logRequest } from "@/utils/logger";
import { ClientRequest, IncomingMessage } from "http";
// import { gatewayLogger } from "@/server";
interface ProxyConfigs {
  [context: string]: Options<IncomingMessage, Response>;
}

const proxyConfigs: ProxyConfigs = {
  [ROUTE_PATHS.AUTH_SERVICE.path]: {
    target: ROUTE_PATHS.AUTH_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.AUTH_SERVICE.path}${path}`;
    },
    on: {
      proxyReq: (
        _proxyReq: ClientRequest,
        _req: IncomingMessage,
        _res: Response
      ) => {},
      proxyRes: (proxyRes, _req, res) => {
        const cookies = proxyRes.headers["set-cookie"];
        if (cookies) {
          res.setHeader("set-cookie", cookies);
        }
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        // res.setHeader(
        //   "Access-Control-Allow-Methods",
        //   corsOptions.methods.join(", ")
        // );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
    // on: {
    //   proxyReq: (
    //     proxyReq: ClientRequest,
    //     _req: IncomingMessage,
    //     _res: Response
    //   ) => {
    //     //@ts-ignore
    //     logRequest(gatewayLogger, proxyReq, {
    //       protocol: proxyReq.protocol,
    //       host: proxyReq.getHeader("host"),
    //       path: proxyReq.path,
    //     });
    //   },
    //   proxyRes: (_proxyRes, _req, _res) => {},
    // },
  },
  [ROUTE_PATHS.PRODUCT_SERVICE.path]: {
    target: ROUTE_PATHS.PRODUCT_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.PRODUCT_SERVICE.path}${path}`;
    },
  },
};

export default function applyProxy(app: express.Application) {
  Object.keys(proxyConfigs).forEach((keyContext: string) => {
    //Apply proxy middleware
    // console.log(keyContext);
    // console.log(proxyConfigs[keyContext]);
    app.use(keyContext, createProxyMiddleware(proxyConfigs[keyContext]));
  });
}
