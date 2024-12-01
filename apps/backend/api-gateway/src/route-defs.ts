import configs from "@/config";

export interface RouteConfig {
  path: string;
  target?: string;
  methods?: {
    [method: string]: {
      authRequired: boolean;
      roles?: string[];
    };
  };
  nestedRoutes?: RouteConfig[];
}

export interface RoutesConfig {
  [route: string]: RouteConfig;
}

const ROUTE_PATHS: RoutesConfig = {
  AUTH_SERVICE: {
    path: "/v1/auth",
    target: configs.authServiceUrl,
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/login",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/verify",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/signup",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/signout",
        methods: {
          POST: {
            authRequired: true,
            roles: ["user", "conpany"],
          },
        },
      },
    ],
  },
  USER_SERVICE: {
    path: "/v1/users",
    target: configs.userServiceUrl,
    methods: {
      GET: {
        authRequired: true,
        roles: ["user", "company"],
      },
      POST: {
        authRequired: true,
        roles: ["user", "company"],
      },
    },
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/me",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
        nestedRoutes: [
          {
            path: "/photo",
            methods: {
              PUT: {
                authRequired: true,
                roles: ["user", "admin"],
              },
            },
          },
          {
            path: "/favorites",
            methods: {
              GET: {
                authRequired: true,
                roles: ["user", "company"],
              },
              POST: {
                authRequired: true,
                roles: ["user", "company"],
              },
            },
            nestedRoutes: [
              {
                path: "/:id",
                methods: {
                  DELETE: {
                    authRequired: true,
                    roles: ["user", "company"],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        path: "/uploadFile",
        methods: {
          POST: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
      },
      {
        path: "/profile-detail",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
          PUT: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
      },
      {
        path: "/cv",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
          POST: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
        nestedRoutes: [
          {
            path: "/:cvId",
            methods: {
              DELETE: {
                authRequired: true,
                roles: ["user", "admin"],
              },
            },
          },
        ],
      },
      {
        path: "/cvstyle",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
      },
      {
        path: "/customCv",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
          PUT: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
      },
    ],
  },
};

export default ROUTE_PATHS;
