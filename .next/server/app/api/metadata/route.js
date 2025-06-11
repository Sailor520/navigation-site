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
exports.id = "app/api/metadata/route";
exports.ids = ["app/api/metadata/route"];
exports.modules = {

/***/ "(rsc)/./app/api/metadata/route.ts":
/*!***********************************!*\
  !*** ./app/api/metadata/route.ts ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var cheerio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! cheerio */ \"cheerio\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([cheerio__WEBPACK_IMPORTED_MODULE_1__]);\ncheerio__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nasync function GET(request) {\n    const searchParams = request.nextUrl.searchParams;\n    const url = searchParams.get(\"url\");\n    if (!url) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"URL is required\"\n        }, {\n            status: 400\n        });\n    }\n    try {\n        const response = await fetch(url, {\n            next: {\n                revalidate: 60 * 60\n            }\n        });\n        const html = await response.text();\n        const $ = cheerio__WEBPACK_IMPORTED_MODULE_1__.load(html);\n        // 提取标题\n        const title = $(\"title\").text() || $('meta[property=\"og:title\"]').attr(\"content\") || null;\n        // 提取描述\n        const description = $('meta[name=\"description\"]').attr(\"content\") || $('meta[property=\"og:description\"]').attr(\"content\") || null;\n        // 提取logo\n        let logo = $('link[rel=\"apple-touch-icon\"]').attr(\"href\") || $('link[rel=\"icon\"]').attr(\"href\") || $('link[rel=\"shortcut icon\"]').attr(\"href\") || null;\n        // 如果logo是相对路径，转换为绝对路径\n        if (logo && !logo.startsWith(\"http\")) {\n            const urlObj = new URL(url);\n            logo = logo.startsWith(\"/\") ? `${urlObj.protocol}//${urlObj.host}${logo}` : `${urlObj.protocol}//${urlObj.host}/${logo}`;\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            title,\n            description,\n            logo\n        });\n    } catch (error) {\n        console.error(\"提取元数据失败:\", error);\n        // 返回一个明确的错误响应，确保JSON格式正确\n        const errorResponse = {\n            title: null,\n            description: \"无描述\",\n            logo: null,\n            error: error instanceof Error ? error.message : '未知错误'\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(errorResponse, {\n            status: 200,\n            headers: {\n                'Content-Type': 'application/json'\n            }\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21ldGFkYXRhL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUE0RDtBQUMxQjtBQUUzQixlQUFlRSxJQUFJQyxPQUFvQjtJQUM1QyxNQUFNQyxlQUFlRCxRQUFRRSxPQUFPLENBQUNELFlBQVk7SUFDakQsTUFBTUUsTUFBTUYsYUFBYUcsR0FBRyxDQUFDO0lBRTdCLElBQUksQ0FBQ0QsS0FBSztRQUNSLE9BQU9OLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFrQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUN2RTtJQUVBLElBQUk7UUFDRixNQUFNQyxXQUFXLE1BQU1DLE1BQU1OLEtBQUs7WUFBRU8sTUFBTTtnQkFBRUMsWUFBWSxLQUFLO1lBQUc7UUFBRTtRQUNsRSxNQUFNQyxPQUFPLE1BQU1KLFNBQVNLLElBQUk7UUFDaEMsTUFBTUMsSUFBSWhCLHlDQUFZLENBQUNjO1FBRXZCLE9BQU87UUFDUCxNQUFNSSxRQUFRRixFQUFFLFNBQVNELElBQUksTUFBTUMsRUFBRSw2QkFBNkJHLElBQUksQ0FBQyxjQUFjO1FBRXJGLE9BQU87UUFDUCxNQUFNQyxjQUNKSixFQUFFLDRCQUE0QkcsSUFBSSxDQUFDLGNBQWNILEVBQUUsbUNBQW1DRyxJQUFJLENBQUMsY0FBYztRQUUzRyxTQUFTO1FBQ1QsSUFBSUUsT0FDRkwsRUFBRSxnQ0FBZ0NHLElBQUksQ0FBQyxXQUN2Q0gsRUFBRSxvQkFBb0JHLElBQUksQ0FBQyxXQUMzQkgsRUFBRSw2QkFBNkJHLElBQUksQ0FBQyxXQUNwQztRQUVGLHNCQUFzQjtRQUN0QixJQUFJRSxRQUFRLENBQUNBLEtBQUtDLFVBQVUsQ0FBQyxTQUFTO1lBQ3BDLE1BQU1DLFNBQVMsSUFBSUMsSUFBSW5CO1lBQ3ZCZ0IsT0FBT0EsS0FBS0MsVUFBVSxDQUFDLE9BQ25CLEdBQUdDLE9BQU9FLFFBQVEsQ0FBQyxFQUFFLEVBQUVGLE9BQU9HLElBQUksR0FBR0wsTUFBTSxHQUMzQyxHQUFHRSxPQUFPRSxRQUFRLENBQUMsRUFBRSxFQUFFRixPQUFPRyxJQUFJLENBQUMsQ0FBQyxFQUFFTCxNQUFNO1FBQ2xEO1FBRUEsT0FBT3RCLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRVc7WUFBT0U7WUFBYUM7UUFBSztJQUN0RCxFQUFFLE9BQU9iLE9BQU87UUFDZG1CLFFBQVFuQixLQUFLLENBQUMsWUFBWUE7UUFFMUIseUJBQXlCO1FBQ3pCLE1BQU1vQixnQkFBZ0I7WUFDcEJWLE9BQU87WUFDUEUsYUFBYTtZQUNiQyxNQUFNO1lBQ05iLE9BQU9BLGlCQUFpQnFCLFFBQVFyQixNQUFNc0IsT0FBTyxHQUFHO1FBQ2xEO1FBRUEsT0FBTy9CLHFEQUFZQSxDQUFDUSxJQUFJLENBQUNxQixlQUFlO1lBQ3RDbkIsUUFBUTtZQUNSc0IsU0FBUztnQkFDUCxnQkFBZ0I7WUFDbEI7UUFDRjtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zaWF1dW4vRGVza3RvcC9uYXZpZ2F0aW9uLXNpdGUvYXBwL2FwaS9tZXRhZGF0YS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0eXBlIE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuaW1wb3J0ICogYXMgY2hlZXJpbyBmcm9tIFwiY2hlZXJpb1wiXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3Qgc2VhcmNoUGFyYW1zID0gcmVxdWVzdC5uZXh0VXJsLnNlYXJjaFBhcmFtc1xuICBjb25zdCB1cmwgPSBzZWFyY2hQYXJhbXMuZ2V0KFwidXJsXCIpXG5cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVUkwgaXMgcmVxdWlyZWRcIiB9LCB7IHN0YXR1czogNDAwIH0pXG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG5leHQ6IHsgcmV2YWxpZGF0ZTogNjAgKiA2MCB9IH0pXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKVxuICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoaHRtbClcblxuICAgIC8vIOaPkOWPluagh+mimFxuICAgIGNvbnN0IHRpdGxlID0gJChcInRpdGxlXCIpLnRleHQoKSB8fCAkKCdtZXRhW3Byb3BlcnR5PVwib2c6dGl0bGVcIl0nKS5hdHRyKFwiY29udGVudFwiKSB8fCBudWxsXG5cbiAgICAvLyDmj5Dlj5bmj4/ov7BcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9XG4gICAgICAkKCdtZXRhW25hbWU9XCJkZXNjcmlwdGlvblwiXScpLmF0dHIoXCJjb250ZW50XCIpIHx8ICQoJ21ldGFbcHJvcGVydHk9XCJvZzpkZXNjcmlwdGlvblwiXScpLmF0dHIoXCJjb250ZW50XCIpIHx8IG51bGxcblxuICAgIC8vIOaPkOWPlmxvZ29cbiAgICBsZXQgbG9nbyA9XG4gICAgICAkKCdsaW5rW3JlbD1cImFwcGxlLXRvdWNoLWljb25cIl0nKS5hdHRyKFwiaHJlZlwiKSB8fFxuICAgICAgJCgnbGlua1tyZWw9XCJpY29uXCJdJykuYXR0cihcImhyZWZcIikgfHxcbiAgICAgICQoJ2xpbmtbcmVsPVwic2hvcnRjdXQgaWNvblwiXScpLmF0dHIoXCJocmVmXCIpIHx8XG4gICAgICBudWxsXG5cbiAgICAvLyDlpoLmnpxsb2dv5piv55u45a+56Lev5b6E77yM6L2s5o2i5Li657ud5a+56Lev5b6EXG4gICAgaWYgKGxvZ28gJiYgIWxvZ28uc3RhcnRzV2l0aChcImh0dHBcIikpIHtcbiAgICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwodXJsKVxuICAgICAgbG9nbyA9IGxvZ28uc3RhcnRzV2l0aChcIi9cIilcbiAgICAgICAgPyBgJHt1cmxPYmoucHJvdG9jb2x9Ly8ke3VybE9iai5ob3N0fSR7bG9nb31gXG4gICAgICAgIDogYCR7dXJsT2JqLnByb3RvY29sfS8vJHt1cmxPYmouaG9zdH0vJHtsb2dvfWBcbiAgICB9XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB0aXRsZSwgZGVzY3JpcHRpb24sIGxvZ28gfSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwi5o+Q5Y+W5YWD5pWw5o2u5aSx6LSlOlwiLCBlcnJvcilcbiAgICBcbiAgICAvLyDov5Tlm57kuIDkuKrmmI7noa7nmoTplJnor6/lk43lupTvvIznoa7kv51KU09O5qC85byP5q2j56GuXG4gICAgY29uc3QgZXJyb3JSZXNwb25zZSA9IHtcbiAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgZGVzY3JpcHRpb246IFwi5peg5o+P6L+wXCIsXG4gICAgICBsb2dvOiBudWxsLFxuICAgICAgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ+acquefpemUmeivrydcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGVycm9yUmVzcG9uc2UsIHsgXG4gICAgICBzdGF0dXM6IDIwMCxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiY2hlZXJpbyIsIkdFVCIsInJlcXVlc3QiLCJzZWFyY2hQYXJhbXMiLCJuZXh0VXJsIiwidXJsIiwiZ2V0IiwianNvbiIsImVycm9yIiwic3RhdHVzIiwicmVzcG9uc2UiLCJmZXRjaCIsIm5leHQiLCJyZXZhbGlkYXRlIiwiaHRtbCIsInRleHQiLCIkIiwibG9hZCIsInRpdGxlIiwiYXR0ciIsImRlc2NyaXB0aW9uIiwibG9nbyIsInN0YXJ0c1dpdGgiLCJ1cmxPYmoiLCJVUkwiLCJwcm90b2NvbCIsImhvc3QiLCJjb25zb2xlIiwiZXJyb3JSZXNwb25zZSIsIkVycm9yIiwibWVzc2FnZSIsImhlYWRlcnMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/metadata/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmetadata%2Froute&page=%2Fapi%2Fmetadata%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmetadata%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmetadata%2Froute&page=%2Fapi%2Fmetadata%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmetadata%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_siauun_Desktop_navigation_site_app_api_metadata_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/metadata/route.ts */ \"(rsc)/./app/api/metadata/route.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_Users_siauun_Desktop_navigation_site_app_api_metadata_route_ts__WEBPACK_IMPORTED_MODULE_3__]);\n_Users_siauun_Desktop_navigation_site_app_api_metadata_route_ts__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/metadata/route\",\n        pathname: \"/api/metadata\",\n        filename: \"route\",\n        bundlePath: \"app/api/metadata/route\"\n    },\n    resolvedPagePath: \"/Users/siauun/Desktop/navigation-site/app/api/metadata/route.ts\",\n    nextConfigOutput,\n    userland: _Users_siauun_Desktop_navigation_site_app_api_metadata_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtZXRhZGF0YSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbWV0YWRhdGElMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZtZXRhZGF0YSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnNpYXV1biUyRkRlc2t0b3AlMkZuYXZpZ2F0aW9uLXNpdGUlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGc2lhdXVuJTJGRGVza3RvcCUyRm5hdmlnYXRpb24tc2l0ZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDZTtBQUM1RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYscUMiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL3NpYXV1bi9EZXNrdG9wL25hdmlnYXRpb24tc2l0ZS9hcHAvYXBpL21ldGFkYXRhL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9tZXRhZGF0YS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL21ldGFkYXRhXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9tZXRhZGF0YS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9zaWF1dW4vRGVza3RvcC9uYXZpZ2F0aW9uLXNpdGUvYXBwL2FwaS9tZXRhZGF0YS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmetadata%2Froute&page=%2Fapi%2Fmetadata%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmetadata%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "cheerio":
/*!**************************!*\
  !*** external "cheerio" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = import("cheerio");;

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendors"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmetadata%2Froute&page=%2Fapi%2Fmetadata%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmetadata%2Froute.ts&appDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsiauun%2FDesktop%2Fnavigation-site&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();