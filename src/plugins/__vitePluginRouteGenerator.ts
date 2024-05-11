// // import type { PluginOption } from "vite";
// // // import serializeJavascript from "serialize-javascript";
// // import type { RouteRecordRaw } from "vue-router";
// // import {
// //   ComponentModule,
// //   ComponentModules,
// //   GenerateRoutesConfig,
// //   RouteConfig,
// //   RouteConfigModule,
// //   RouteConfigModules,
// // } from "./types";
// import { PluginOption } from "vite";
// import { flatTree, mergeObject } from "@/utils/object";
// import fs from "fs";
// import { RouteRecordRaw } from "vue-router";
// import { arrayMapBy } from "@/utils/array";

// type IncludeFormat = string | RegExp;
// interface RoutesGeneratorConfig {
//   component?: {
//     src?: string;
//     include?: IncludeFormat[];
//   };
//   configFile: {
//     src?: string;
//     include?: IncludeFormat[];
//   };
// }

// const ROUTES_GENERATOR_CONFIG_DEFAULT = {
//   component: {
//     src: "src/views",
//     include: [/\.vue$/] as IncludeFormat[],
//   },
//   configFile: {
//     src: "src/views",
//     include: [/\.[t|j]s$/] as IncludeFormat[],
//   },
// } satisfies RecursiveRequired<RoutesGeneratorConfig>;
// type RecursiveDirent = fs.Dirent & { children?: RecursiveDirent[] };

// class RouteModule {
//   name: string;
//   children?: RouteModule[];
//   path: string;
//   rootSrc: string;
//   isDir: boolean;
//   constructor(obj: RecursiveDirent, rootSrc: string) {
//     this.name = obj.name;
//     this.path = obj.path;
//     this.children = [];
//     this.rootSrc = rootSrc;
//     this.isDir = obj.isDirectory();
//   }

//   get fullPath() {
//     return `${this.path}/${this.name}`;
//   }

//   get routePath() {
//     // console.log("this.fullPath, this.rootSrc, this.ext :>> ", this.fullPath, this.rootSrc, this.ext);
//     return (
//       this.fullPath
//         // ../views/[PageNotFound].vue -> /[PageNotFound].vue
//         // /[PageNotFound].vue -> /[PageNotFound]
//         .replace(new RegExp(`${this.rootSrc}|.${this.ext}$`, "g"), "")
//         // /[PageNotFound] -> /:PageNotFound
//         .replace(/\[(.*?)\]/g, ":$1/")
//         // /:PageNotFound -> /:pageNotFound
//         .replace(/(?<=\/:?)(.)/g, (_, t) => `${t.toLowerCase()}`) || "/"
//     );
//   }

//   get routeNameLst() {
//     return this.routePath.split("/").filter(Boolean);
//   }

//   static getRouteName(lst: string[]) {
//     return lst.join("-") || "index";
//   }

//   get routeName() {
//     return RouteModule.getRouteName(this.routeNameLst);
//   }

//   get isFirstLayer() {
//     return this.routeNameLst.length <= 1;
//   }

//   get ext() {
//     return this.name.includes(".") ? this.name.split(".").pop() : undefined;
//   }

//   get asyncComponent() {
//     return () => import(this.fullPath);
//   }
// }

// function readdirRecursive<T extends { children?: T[] } = RecursiveDirent>(
//   src: string,
//   include: IncludeFormat[],
//   handler = (dirent: RecursiveDirent, rootSrc: string) => dirent as unknown as T,
// ) {
//   const transformedInclude = include.map((i) => (typeof i === "string" ? new RegExp(i) : i));
//   const isFileMatch = (name: string) =>
//     transformedInclude.some((f) => {
//       f.lastIndex = 0;
//       return f.test(name);
//     });

//   const _execute = (curSrc: string) => {
//     const files = [] as T[];
//     for (const file of fs.readdirSync(curSrc, { withFileTypes: true }) as RecursiveDirent[]) {
//       if (file.isDirectory()) {
//         const newFile = handler(file, src);
//         newFile.children = _execute(`${curSrc}/${file.name}`);
//         if (newFile.children.length) {
//           files.push(newFile);
//         }
//       } else if (isFileMatch(file.name)) {
//         files.push(handler(file, src));
//       }
//     }
//     return files;
//   };

//   return _execute(src);
// }

// const routes: RouteRecordRaw[] = [];

// async function vitePluginRoutesGenerator(config = ROUTES_GENERATOR_CONFIG_DEFAULT): PluginOption {
//   const componentConfig = mergeObject(
//     config.component,
//     ROUTES_GENERATOR_CONFIG_DEFAULT.component,
//   ) as (typeof ROUTES_GENERATOR_CONFIG_DEFAULT)["component"];
//   const configFileConfig = mergeObject(
//     config.configFile,
//     ROUTES_GENERATOR_CONFIG_DEFAULT.configFile,
//   ) as (typeof ROUTES_GENERATOR_CONFIG_DEFAULT)["configFile"];

//   const components = readdirRecursive(
//     componentConfig.src,
//     componentConfig.include,
//     (dirent, rootSrc) => new RouteModule(dirent, rootSrc),
//   );
//   const configFiles = readdirRecursive(
//     configFileConfig.src,
//     configFileConfig.include,
//     (dirent, rootSrc) => new RouteModule(dirent, rootSrc),
//   );

//   // const configFileModules = toRouteModules(configFiles);

//   await generateRoutes(components, configFiles);
//   console.log("routes :>> ", routes);
//   return {
//     name: "routes-generator",
//   };
// }

// async function generateRoutes(components: RouteModule[], configFiles: RouteModule[]) {
//   const configFileModules = toRouteModules(configFiles);
//   const handledComponents = flatTree(components)
//     // .filter((i) => !i.isDir)
//     .sort((a, b) => a.routePath.localeCompare(b.routePath));

//   const routeTreeMap: Record<string, RouteRecordRaw> = {};
//   for (const module of handledComponents) {
//     let routeConfig = {} as RouteConfig;
//     const configModule = configFileModules[module.routePath];
//     if (configModule) {
//       try {
//         routeConfig = (await import(`./` + `${configModule.fullPath}`)).default;
//       } catch (e) {
//         // console.error("error :>> ", e);
//       }
//     }
//     const routeName = module.routeName;
//     // console.log("🚀 ~ generateRoutes ~ routeName:", module.routePath, routeName, module.isFirstLayer);
//     routeTreeMap[routeName] = Object.assign(
//       {
//         path: module.routePath + (routeConfig.validation || ""),
//         name: routeName,
//         children: routeTreeMap[routeName]?.children || [],
//       },
//       routeConfig,
//       {
//         component: module.asyncComponent,
//       },
//     );

//     const curRoute = routeTreeMap[routeName];
//     if (module.isFirstLayer) {
//       routes.push(curRoute);
//     } else {
//       const parentRouteName = RouteModule.getRouteName(module.routeNameLst.slice(0, -1));
//       // console.log("parentRouteName :>> ", parentRouteName);

//       const parentRoute = routeTreeMap[parentRouteName];
//       // console.log("🚀 ~ generateRoutes ~ parentRoute:", parentRoute);
//       if (parentRoute) {
//         parentRoute.children?.push(curRoute);

//         if (routeName.endsWith("index")) {
//           parentRoute.redirect = { name: routeName };
//         }
//       } else {
//         routes.push(curRoute);
//       }
//     }
//   }
// }

// function toRouteModules(modules: RouteModule[]) {
//   return arrayMapBy(flatTree(modules), "routePath");
// }

// // function printArr(arr: any[]) {
// //   for (const item of arr) {
// //     console.log({ ...item, children: `${item.children?.length || 0} items` });
// //     if ("children" in item) {
// //       printArr(item.children);
// //     }
// //   }
// // }

// export default vitePluginRoutesGenerator;

// export const getRoutes = () => routes;
