/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/deployment-info/route";
exports.ids = ["app/api/deployment-info/route"];
exports.modules = {

/***/ "(rsc)/./app/api/deployment-info/route.ts":
/*!******************************************!*\
  !*** ./app/api/deployment-info/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function GET() {\n    try {\n        // 获取 Vercel 环境变量中的部署信息\n        const deploymentInfo = {\n            deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,\n            deployedAt: process.env.VERCEL_DEPLOYMENT_CREATED_AT || null,\n            gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,\n            gitBranch: process.env.VERCEL_GIT_COMMIT_REF || null,\n            gitRepo: process.env.VERCEL_GIT_REPO_SLUG || null,\n            gitOwner: process.env.VERCEL_GIT_REPO_OWNER || null,\n            environment: process.env.VERCEL_ENV || \"development\" || 0,\n            region: process.env.VERCEL_REGION || null,\n            url: process.env.VERCEL_URL || null\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(deploymentInfo);\n    } catch (error) {\n        console.error(\"获取部署信息失败:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"获取部署信息失败\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2RlcGxveW1lbnQtaW5mby9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUEwQztBQUVuQyxlQUFlQztJQUNwQixJQUFJO1FBQ0YsdUJBQXVCO1FBQ3ZCLE1BQU1DLGlCQUFpQjtZQUNyQkMsY0FBY0MsUUFBUUMsR0FBRyxDQUFDQyxvQkFBb0IsSUFBSTtZQUNsREMsWUFBWUgsUUFBUUMsR0FBRyxDQUFDRyw0QkFBNEIsSUFBSTtZQUN4REMsY0FBY0wsUUFBUUMsR0FBRyxDQUFDSyxxQkFBcUIsSUFBSTtZQUNuREMsV0FBV1AsUUFBUUMsR0FBRyxDQUFDTyxxQkFBcUIsSUFBSTtZQUNoREMsU0FBU1QsUUFBUUMsR0FBRyxDQUFDUyxvQkFBb0IsSUFBSTtZQUM3Q0MsVUFBVVgsUUFBUUMsR0FBRyxDQUFDVyxxQkFBcUIsSUFBSTtZQUMvQ0MsYUFBYWIsUUFBUUMsR0FBRyxDQUFDYSxVQUFVLHFCQUE0QixDQUFhO1lBQzVFQyxRQUFRZixRQUFRQyxHQUFHLENBQUNlLGFBQWEsSUFBSTtZQUNyQ0MsS0FBS2pCLFFBQVFDLEdBQUcsQ0FBQ2lCLFVBQVUsSUFBSTtRQUNqQztRQUVBLE9BQU90QixxREFBWUEsQ0FBQ3VCLElBQUksQ0FBQ3JCO0lBQzNCLEVBQUUsT0FBT3NCLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLGFBQWFBO1FBQzNCLE9BQU94QixxREFBWUEsQ0FBQ3VCLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQVcsR0FBRztZQUFFRSxRQUFRO1FBQUk7SUFDaEU7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL3NpYXV1bi9EZXNrdG9wL25hdmlnYXRpb24tc2l0ZS9hcHAvYXBpL2RlcGxveW1lbnQtaW5mby9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICB0cnkge1xuICAgIC8vIOiOt+WPliBWZXJjZWwg546v5aKD5Y+Y6YeP5Lit55qE6YOo572y5L+h5oGvXG4gICAgY29uc3QgZGVwbG95bWVudEluZm8gPSB7XG4gICAgICBkZXBsb3ltZW50SWQ6IHByb2Nlc3MuZW52LlZFUkNFTF9ERVBMT1lNRU5UX0lEIHx8IG51bGwsXG4gICAgICBkZXBsb3llZEF0OiBwcm9jZXNzLmVudi5WRVJDRUxfREVQTE9ZTUVOVF9DUkVBVEVEX0FUIHx8IG51bGwsXG4gICAgICBnaXRDb21taXRTaGE6IHByb2Nlc3MuZW52LlZFUkNFTF9HSVRfQ09NTUlUX1NIQSB8fCBudWxsLFxuICAgICAgZ2l0QnJhbmNoOiBwcm9jZXNzLmVudi5WRVJDRUxfR0lUX0NPTU1JVF9SRUYgfHwgbnVsbCxcbiAgICAgIGdpdFJlcG86IHByb2Nlc3MuZW52LlZFUkNFTF9HSVRfUkVQT19TTFVHIHx8IG51bGwsXG4gICAgICBnaXRPd25lcjogcHJvY2Vzcy5lbnYuVkVSQ0VMX0dJVF9SRVBPX09XTkVSIHx8IG51bGwsXG4gICAgICBlbnZpcm9ubWVudDogcHJvY2Vzcy5lbnYuVkVSQ0VMX0VOViB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCBcImRldmVsb3BtZW50XCIsXG4gICAgICByZWdpb246IHByb2Nlc3MuZW52LlZFUkNFTF9SRUdJT04gfHwgbnVsbCxcbiAgICAgIHVybDogcHJvY2Vzcy5lbnYuVkVSQ0VMX1VSTCB8fCBudWxsLFxuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihkZXBsb3ltZW50SW5mbylcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwi6I635Y+W6YOo572y5L+h5oGv5aSx6LSlOlwiLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCLojrflj5bpg6jnvbLkv6Hmga/lpLHotKVcIiB9LCB7IHN0YXR1czogNTAwIH0pXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJHRVQiLCJkZXBsb3ltZW50SW5mbyIsImRlcGxveW1lbnRJZCIsInByb2Nlc3MiLCJlbnYiLCJWRVJDRUxfREVQTE9ZTUVOVF9JRCIsImRlcGxveWVkQXQiLCJWRVJDRUxfREVQTE9ZTUVOVF9DUkVBVEVEX0FUIiwiZ2l0Q29tbWl0U2hhIiwiVkVSQ0VMX0dJVF9DT01NSVRfU0hBIiwiZ2l0QnJhbmNoIiwiVkVSQ0VMX0dJVF9DT01NSVRfUkVGIiwiZ2l0UmVwbyIsIlZFUkNFTF9HSVRfUkVQT19TTFVHIiwiZ2l0T3duZXIiLCJWRVJDRUxfR0lUX1JFUE9fT1dORVIiLCJlbnZpcm9ubWVudCIsIlZFUkNFTF9FTlYiLCJyZWdpb24iLCJWRVJDRUxfUkVHSU9OIiwidXJsIiwiVkVSQ0VMX1VSTCIsImpzb24iLCJlcnJvciIsImNvbnNvbGUiLCJzdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/deployment-info/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeployment-info%2Froute&page=%2Fapi%2Fdeployment-info%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeployment-info%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeployment-info%2Froute&page=%2Fapi%2Fdeployment-info%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeployment-info%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_siauun_Desktop_navigation_site_app_api_deployment_info_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/deployment-info/route.ts */ \"(rsc)/./app/api/deployment-info/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/deployment-info/route\",\n        pathname: \"/api/deployment-info\",\n        filename: \"route\",\n        bundlePath: \"app/api/deployment-info/route\"\n    },\n    resolvedPagePath: \"/Users/siauun/Desktop/navigation-site/app/api/deployment-info/route.ts\",\n    nextConfigOutput,\n    userland: _Users_siauun_Desktop_navigation_site_app_api_deployment_info_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkZXBsb3ltZW50LWluZm8lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmRlcGxveW1lbnQtaW5mbyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmRlcGxveW1lbnQtaW5mbyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnNpYXV1biUyRkRlc2t0b3AlMkZuYXZpZ2F0aW9uLXNpdGUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGc2lhdXVuJTJGRGVza3RvcCUyRm5hdmlnYXRpb24tc2l0ZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDc0I7QUFDbkc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9zaWF1dW4vRGVza3RvcC9uYXZpZ2F0aW9uLXNpdGUvYXBwL2FwaS9kZXBsb3ltZW50LWluZm8vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2RlcGxveW1lbnQtaW5mby9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2RlcGxveW1lbnQtaW5mb1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZGVwbG95bWVudC1pbmZvL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL3NpYXV1bi9EZXNrdG9wL25hdmlnYXRpb24tc2l0ZS9hcHAvYXBpL2RlcGxveW1lbnQtaW5mby9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeployment-info%2Froute&page=%2Fapi%2Fdeployment-info%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeployment-info%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendors"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeployment-info%2Froute&page=%2Fapi%2Fdeployment-info%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeployment-info%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();