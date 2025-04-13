/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/handler.ts":
/*!************************!*\
  !*** ./src/handler.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.asyncHandler = void 0;
var asyncHandler = function (fn) { return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
}; };
exports.asyncHandler = asyncHandler;


/***/ }),

/***/ "./src/lib/dbutils.ts":
/*!****************************!*\
  !*** ./src/lib/dbutils.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getGlobalCollectionByName = exports.getCollectionByName = exports.getGlobalCollection = exports.getCollection = void 0;
var mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
var getCollection = function (realm, collection, schema) {
    var db = mongoose_1.default.connection.useDb("echo_".concat(realm));
    return db.model(collection, schema);
};
exports.getCollection = getCollection;
var getGlobalCollection = function (collection, schema) {
    var db = mongoose_1.default.connection.useDb("echo");
    return db.model(collection, schema);
};
exports.getGlobalCollection = getGlobalCollection;
var defaultSchema = new mongoose_1.default.Schema({}, { strict: false });
var getCollectionByName = function (realm, collectionName) {
    var db = mongoose_1.default.connection.useDb("echo_".concat(realm));
    return db.model(collectionName, defaultSchema, collectionName);
};
exports.getCollectionByName = getCollectionByName;
var getGlobalCollectionByName = function (collectionName) {
    var db = mongoose_1.default.connection.useDb("echo");
    return db.model(collectionName, defaultSchema, collectionName);
};
exports.getGlobalCollectionByName = getGlobalCollectionByName;


/***/ }),

/***/ "./src/lib/validation.ts":
/*!*******************************!*\
  !*** ./src/lib/validation.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateMandatoryFields = void 0;
var validateMandatoryFields = function (res, data, mandatoryFields) {
    var missingFields = [];
    mandatoryFields.forEach(function (fieldName) {
        if (!data.hasOwnProperty(fieldName)) {
            missingFields.push(fieldName);
        }
    });
    if (missingFields.length === 0) {
        return true;
    }
    res.status(400);
    res.send({
        error: { missingFields: missingFields },
    });
    res.end();
    return false;
};
exports.validateMandatoryFields = validateMandatoryFields;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
if (true) {
    module.hot.accept();
    module.hot.dispose(function () { return server.stop(); });
}
var ApolloServer = (__webpack_require__(/*! apollo-server-express */ "apollo-server-express").ApolloServer);
var middlewares_1 = __webpack_require__(/*! ./middlewares */ "./src/middlewares.ts");
var mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
var startup_1 = __webpack_require__(/*! ./startup */ "./src/startup.ts");
var express = __webpack_require__(/*! express */ "express");
var cors = __webpack_require__(/*! cors */ "cors");
var ApiRoute = __webpack_require__(/*! ./route */ "./src/route.ts");
var gqlScalarSchema = __webpack_require__(/*! ./modules/gql-scalar */ "./src/modules/gql-scalar/index.js");
var assetSchema = __webpack_require__(/*! ./modules/asset */ "./src/modules/asset/index.js");
var sessionSchema = __webpack_require__(/*! ./modules/session */ "./src/modules/session/index.ts");
var userSchema = __webpack_require__(/*! ./modules/user */ "./src/modules/user/index.ts");
var databaseUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose_1.default.connect(databaseUri, {});
mongoose_1.default.pluralize(undefined);
var app = express();
var server = new ApolloServer({
    typeDefs: [
        gqlScalarSchema.typeDefs,
        assetSchema.typeDefs,
        sessionSchema.typeDefs,
        userSchema.typeDefs,
    ],
    resolvers: [
        gqlScalarSchema.resolvers,
        assetSchema.resolvers,
        sessionSchema.resolvers,
        userSchema.resolvers,
    ],
    context: function (_a) {
        var req = _a.req, res = _a.res;
        var authString = req.headers.authorization || "";
        var authParts = authString.split(" ");
        var token = "";
        var user = null;
        var asset = "";
        if (authParts.length === 2) {
            token = authParts[1];
            asset = authParts[0];
            user = (0, middlewares_1.authorize)(token);
        }
        return { user: user, token: token, asset: asset };
    },
    introspection: true,
    playground: true,
});
server.start().then(function () { return server.applyMiddleware({ app: app }); });
app.use(cors());
app.get("/hello", function (_, res) {
    res.send("basic connection to server works. database connection is not validated");
    res.end();
});
app.use(express.json({ limit: 5000000 }));
app.use(express.urlencoded({
    extended: true,
}));
app.use("/api", ApiRoute);
app.use(function (_, res) {
    res.status(404);
    res.send("Not found");
    res.end();
});
app.use(function (err, req, res, next) {
    console.error('Error:', err);
    res.status(500).send(err.stack);
});
app.listen({ port: process.env.PORT || 4000 }, function () {
    return console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(process.env.PORT || 4000).concat(server.graphqlPath));
});
(0, startup_1.initializeSequences)();


/***/ }),

/***/ "./src/middlewares.ts":
/*!****************************!*\
  !*** ./src/middlewares.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authorizeApi = exports.authorizeApiOneauth = exports.authorize = void 0;
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
var helper_1 = __webpack_require__(/*! ./modules/auth/helper */ "./src/modules/auth/helper.ts");
var authorize = function (token) {
    var appRoot = process.cwd();
    var publicKey = fs_1.default.readFileSync(appRoot + "/public.pem");
    try {
        if (token) {
            return jsonwebtoken_1.default.verify(token, publicKey);
        }
        return null;
    }
    catch (err) {
        return null;
    }
};
exports.authorize = authorize;
var authorizeApiOneauth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                token = req.headers["authorization"];
                if (!token) {
                    return [2, res.sendStatus(401)];
                }
                return [4, (0, helper_1.decodeToken)(token)];
            case 1:
                data = _a.sent();
                if (!data.outcome) {
                    return [2, res.sendStatus(401)];
                }
                req.user = data.claims;
                next();
                return [3, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [2, res.sendStatus(401)];
            case 3: return [2];
        }
    });
}); };
exports.authorizeApiOneauth = authorizeApiOneauth;
var authorizeApi = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, data, err_2;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                token = req.headers["authorization"];
                if (!token) {
                    return [2, res.sendStatus(401)];
                }
                return [4, (0, helper_1.decodeToken)(token)];
            case 1:
                data = _d.sent();
                if (!data.outcome ||
                    (req.params.space && (!((_a = data.claims) === null || _a === void 0 ? void 0 : _a.permissions) || !((_c = (_b = data.claims) === null || _b === void 0 ? void 0 : _b.permissions['COMPANY_ADMIN']) === null || _c === void 0 ? void 0 : _c.includes(req.params.space))))) {
                    return [2, res.sendStatus(401)];
                }
                req.user = data.claims;
                next();
                return [3, 3];
            case 2:
                err_2 = _d.sent();
                console.log(err_2);
                return [2, res.sendStatus(401)];
            case 3: return [2];
        }
    });
}); };
exports.authorizeApi = authorizeApi;


/***/ }),

/***/ "./src/modules/auth/helper.ts":
/*!************************************!*\
  !*** ./src/modules/auth/helper.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeAppToken = exports.encodeAppToken = exports.getHash = exports.decodeSession = exports.decodeToken = exports.deleteSessionByRefreshToken = exports.deleteSession = exports.validateSession = exports.getAccessToken = exports.createSession = void 0;
var bcrypt_1 = __importDefault(__webpack_require__(/*! bcrypt */ "bcrypt"));
var uuid_1 = __webpack_require__(/*! uuid */ "uuid");
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
var date_fns_1 = __webpack_require__(/*! date-fns */ "date-fns");
var model_1 = __webpack_require__(/*! ../session/model */ "./src/modules/session/model.ts");
var dbutils_1 = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
var selfRealm = 100;
var appUrl = process.env.APP_URL || "http://localhost:3010";
var createSession = function (realm, user) { return __awaiter(void 0, void 0, void 0, function () {
    var session_id, model, claims, appRoot, privateKey, refresh_token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                session_id = (0, uuid_1.v4)();
                model = (0, dbutils_1.getCollection)(String(realm), model_1.sessionCollection, model_1.sessionSchema);
                claims = {
                    user_id: user.id,
                    given_name: user.given_name,
                    family_name: user.family_name,
                    name: user.name,
                    nickname: user.nickname,
                    email: user.email,
                    type: user.type,
                };
                appRoot = process.cwd();
                privateKey = fs_1.default.readFileSync(appRoot + "/private.pem");
                refresh_token = jsonwebtoken_1.default.sign({
                    realm: realm,
                    id: session_id,
                }, { key: privateKey, passphrase: "no1knowsme" }, {
                    algorithm: "RS256",
                    expiresIn: "8h",
                });
                return [4, model.create({
                        session_id: session_id,
                        refresh_token: refresh_token,
                        user_id: user.id,
                        claims: claims,
                        iat: new Date(),
                        eat: (0, date_fns_1.add)(new Date(), { hours: 8 }),
                    })];
            case 1:
                _a.sent();
                return [2, { session_id: session_id, refresh_token: refresh_token }];
        }
    });
}); };
exports.createSession = createSession;
var getAccessToken = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, claims, appRoot, privateKey, model, session, refreshTokenDuration, access_token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, (0, exports.decodeToken)(refreshToken)];
            case 1:
                decoded = _a.sent();
                if (!decoded.outcome ||
                    !decoded.claims ||
                    !decoded.claims.realm ||
                    !decoded.claims.id) {
                    return [2, null];
                }
                claims = decoded.claims;
                appRoot = process.cwd();
                privateKey = fs_1.default.readFileSync(appRoot + "/private.pem");
                model = (0, dbutils_1.getCollection)(claims.realm, model_1.sessionCollection, model_1.sessionSchema);
                return [4, model.findOne({ session_id: claims.id })];
            case 2:
                session = _a.sent();
                if ((0, date_fns_1.differenceInSeconds)(session.eat, new Date()) < 60) {
                    return [2, null];
                }
                refreshTokenDuration = (0, date_fns_1.differenceInSeconds)(session.eat, new Date()) > 60 * 60 * 2
                    ? 60 * 60 * 2
                    : (0, date_fns_1.differenceInSeconds)(session.eat, new Date());
                access_token = jsonwebtoken_1.default.sign(session.claims, { key: privateKey, passphrase: "no1knowsme" }, {
                    algorithm: "RS256",
                    expiresIn: "".concat(refreshTokenDuration, "s"),
                });
                return [2, access_token];
        }
    });
}); };
exports.getAccessToken = getAccessToken;
var validateSession = function (realm, sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var model, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getCollection)(String(realm), model_1.sessionCollection, model_1.sessionSchema);
                return [4, model.findOne({ sessionId: sessionId })];
            case 1:
                session = _a.sent();
                return [2, session];
        }
    });
}); };
exports.validateSession = validateSession;
var deleteSession = function (realm, session_id) { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getCollection)(String(realm), model_1.sessionCollection, model_1.sessionSchema);
                return [4, model.deleteOne({ session_id: session_id })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.deleteSession = deleteSession;
var deleteSessionByRefreshToken = function (realm, refresh_token) { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getCollection)(String(realm), model_1.sessionCollection, model_1.sessionSchema);
                return [4, model.deleteOne({ refresh_token: refresh_token })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.deleteSessionByRefreshToken = deleteSessionByRefreshToken;
var decodeToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var appRoot, publicKey, res, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appRoot = process.cwd();
                publicKey = fs_1.default.readFileSync(appRoot + "/public.pem");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, jsonwebtoken_1.default.verify(token, publicKey)];
            case 2:
                res = _a.sent();
                return [2, { outcome: true, token: token, claims: res }];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2, { outcome: false, err: err_1 }];
            case 4: return [2];
        }
    });
}); };
exports.decodeToken = decodeToken;
var decodeSession = function (realmId, sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, (0, exports.validateSession)(realmId, sessionId)];
            case 1:
                session = _a.sent();
                if (!session) {
                    return [2, session];
                }
                return [2, (0, exports.decodeToken)(session.token)];
        }
    });
}); };
exports.decodeSession = decodeSession;
var getHash = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var salt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, bcrypt_1.default.genSalt(10)];
            case 1:
                salt = _a.sent();
                return [4, bcrypt_1.default.hash(password, salt)];
            case 2: return [2, _a.sent()];
        }
    });
}); };
exports.getHash = getHash;
var encodeAppToken = function (claims) {
    var appRoot = process.cwd();
    var privateKey = fs_1.default.readFileSync(appRoot + "/local_private.pem");
    var token = jsonwebtoken_1.default.sign(claims, { key: privateKey, passphrase: "fevicryl" }, {
        algorithm: "RS256",
        expiresIn: "100h",
    });
    return token;
};
exports.encodeAppToken = encodeAppToken;
var decodeAppToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var appRoot, publicKey, res, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                appRoot = process.cwd();
                publicKey = fs_1.default.readFileSync(appRoot + "/local_public.pem");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, jsonwebtoken_1.default.verify(token, publicKey)];
            case 2:
                res = _a.sent();
                return [2, { outcome: true, token: token, claims: res }];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                return [2, { outcome: false, err: err_2 }];
            case 4: return [2];
        }
    });
}); };
exports.decodeAppToken = decodeAppToken;


/***/ }),

/***/ "./src/modules/auth/route.ts":
/*!***********************************!*\
  !*** ./src/modules/auth/route.ts ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var handler_1 = __webpack_require__(/*! ../../handler */ "./src/handler.ts");
var middlewares_1 = __webpack_require__(/*! ../../middlewares */ "./src/middlewares.ts");
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/auth/service.ts");
var selfRealm = 100;
module.exports = function (router) {
    router.post("/auth/authorize", (0, handler_1.asyncHandler)(service_1.signin));
    router.post("/auth/token", (0, handler_1.asyncHandler)(service_1.issueToken));
    router.get("/auth/token/decode", middlewares_1.authorizeApi, (0, handler_1.asyncHandler)(service_1.decodeToken));
    router.post("/auth/logout", (0, handler_1.asyncHandler)(service_1.logout));
    router.get("/auth/oa/session/:id", function (req, res, next) {
        return (0, handler_1.asyncHandler)((0, service_1.validateSession)(selfRealm, req, res, next));
    });
    router.delete("/auth/oa/session/:id", function (req, res, next) {
        return (0, handler_1.asyncHandler)((0, service_1.deleteSession)(selfRealm, req, res, next));
    });
    router.get("/auth/oa/session/:id/decode", function (req, res, next) {
        return (0, handler_1.asyncHandler)((0, service_1.decodeSession)(selfRealm, req, res, next));
    });
    router.get("/auth/realm/:realm/session/:id", function (req, res, next) {
        return (0, handler_1.asyncHandler)((0, service_1.validateSession)(req.params.realm, req, res, next));
    });
    router.get("/auth/realm/:realm/session/:id/decode", function (req, res, next) {
        return (0, handler_1.asyncHandler)((0, service_1.decodeSession)(req.params.realm, req, res, next));
    });
    router.delete("/auth/realm/:realm/session/:id", function (req, res, next) {
        return (0, handler_1.asyncHandler)((0, service_1.deleteSession)(req.params.realm, req, res, next));
    });
};


/***/ }),

/***/ "./src/modules/auth/service.ts":
/*!*************************************!*\
  !*** ./src/modules/auth/service.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeSession = exports.decodeToken = exports.deleteSession = exports.validateSession = exports.logout = exports.issueToken = exports.signin = void 0;
var bcrypt_1 = __importDefault(__webpack_require__(/*! bcrypt */ "bcrypt"));
var validation_1 = __webpack_require__(/*! ../../lib/validation */ "./src/lib/validation.ts");
var model_1 = __webpack_require__(/*! ../user/model */ "./src/modules/user/model.ts");
var Helper = __importStar(__webpack_require__(/*! ./helper */ "./src/modules/auth/helper.ts"));
var dbutils_1 = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
var selfRealm = 100;
var signin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, model, user, outcome, _a, session_id, refresh_token, access_token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                payload = req.body;
                if (!(0, validation_1.validateMandatoryFields)(res, payload, [
                    "email",
                    "password",
                    "realm",
                    "response_type",
                ])) {
                    return [2];
                }
                model = (0, dbutils_1.getCollection)(payload.realm, model_1.userCollection, model_1.userSchema);
                return [4, model.findOne({
                        email: payload.email,
                        type: "oneauth",
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    res.status(404);
                    res.send({ error: { message: "User with this user name does not exist" } });
                    res.end();
                    return [2];
                }
                if (!user.email_verified) {
                    res.status(403);
                    res.send({ error: { message: "Email of user not verified" } });
                    res.end();
                    return [2];
                }
                return [4, bcrypt_1.default.compare(payload.password, user.hash)];
            case 2:
                outcome = _b.sent();
                if (!outcome) {
                    res.status(401);
                    res.send({ error: { message: "Incorrect password" } });
                    res.end();
                    return [2];
                }
                return [4, Helper.createSession(payload.realm, user)];
            case 3:
                _a = _b.sent(), session_id = _a.session_id, refresh_token = _a.refresh_token;
                if (payload.response_type === "code") {
                    res.status(200);
                    res.send({ session_id: session_id });
                    res.end();
                    return [2];
                }
                res.status(200);
                return [4, Helper.getAccessToken(refresh_token)];
            case 4:
                access_token = _b.sent();
                res.send({ token_type: "Bearer", access_token: access_token, refresh_token: refresh_token });
                res.end();
                return [2];
        }
    });
}); };
exports.signin = signin;
var issueToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, access_token, token, outcome;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = req.body;
                if (!(0, validation_1.validateMandatoryFields)(res, payload, [
                    "grant_type",
                    "realm",
                    "refresh_token",
                ])) {
                    return [2];
                }
                if (!(payload.grant_type === "refresh_token")) return [3, 2];
                return [4, Helper.getAccessToken(payload.refresh_token)];
            case 1:
                access_token = _a.sent();
                if (!access_token) {
                    res.status(400);
                    res.send({ error: { message: "Refresh token invalid or expired" } });
                    res.end();
                    return [2];
                }
                res.status(200);
                res.send({ token_type: "Bearer", access_token: access_token });
                res.end();
                return [2];
            case 2:
                token = req.params.token;
                return [4, Helper.decodeToken(token)];
            case 3:
                outcome = _a.sent();
                res.status(200);
                res.send(outcome);
                res.end();
                return [2];
        }
    });
}); };
exports.issueToken = issueToken;
var logout = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, outcome;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = req.body;
                if (!(0, validation_1.validateMandatoryFields)(res, payload, ["realm", "refresh_token"])) {
                    return [2];
                }
                return [4, Helper.deleteSessionByRefreshToken(payload.realm, payload.refresh_token)];
            case 1:
                outcome = _a.sent();
                if (outcome.deletedCount === 0) {
                    res.status(404);
                    res.send({ error: { message: "Invalid session" } });
                    res.end();
                    return [2];
                }
                res.status(200);
                res.send({ refresh_token: payload.refresh_token });
                res.end();
                return [2];
        }
    });
}); };
exports.logout = logout;
var validateSession = function (realmId, req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var session, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, Helper.validateSession(realmId, req.params.id)];
            case 1:
                session = _a.sent();
                if (!session) {
                    res.status(404);
                    res.send("Session not found");
                    res.end();
                    return [2];
                }
                res.status(200);
                res.send({ sessionId: req.params.id, token: session.token });
                res.end();
                return [3, 3];
            case 2:
                err_1 = _a.sent();
                next(err_1);
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.validateSession = validateSession;
var deleteSession = function (realmId, req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var outcome;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Helper.deleteSession(selfRealm, req.params.id)];
            case 1:
                outcome = _a.sent();
                if (outcome.deletedCount === 0) {
                    res.status(404);
                    res.send("Session not found");
                    res.end();
                    return [2];
                }
                res.status(200);
                res.send({ sessionId: req.params.id });
                res.end();
                return [2];
        }
    });
}); };
exports.deleteSession = deleteSession;
var decodeToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200);
        res.send(__assign({}, req.user));
        res.end();
        return [2];
    });
}); };
exports.decodeToken = decodeToken;
var decodeSession = function (realmId, req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var outcome, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, Helper.decodeSession(selfRealm, req.params.id)];
            case 1:
                outcome = _a.sent();
                if (!outcome) {
                    res.status(404);
                    res.send("Session not found");
                    res.end();
                    return [2];
                }
                res.status(200);
                res.send(outcome);
                res.end();
                return [3, 3];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
exports.decodeSession = decodeSession;


/***/ }),

/***/ "./src/modules/company/helper.ts":
/*!***************************************!*\
  !*** ./src/modules/company/helper.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCompanyByIdList = exports.getCompanyByReference = exports.getCompany = exports.updateCompany = void 0;
var axios = __webpack_require__(/*! axios */ "axios");
var ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
var model_1 = __webpack_require__(/*! ./model */ "./src/modules/company/model.ts");
var dbutils_1 = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
var service_1 = __webpack_require__(/*! ../sequence/service */ "./src/modules/sequence/service.ts");
var updateCompany = function (data, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var model, response_1, response, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.companyCollection, model_1.companySchema);
                if (!data._id) return [3, 2];
                return [4, model.findByIdAndUpdate(data._id, __assign({}, data), { new: true, upsert: true })];
            case 1:
                response_1 = _e.sent();
                return [2, response_1];
            case 2:
                _b = (_a = model).create;
                _c = [__assign({}, data)];
                _d = {};
                return [4, (0, service_1.nextval)("companyId")];
            case 3: return [4, _b.apply(_a, [__assign.apply(void 0, _c.concat([(_d.reference = _e.sent(), _d)]))])];
            case 4:
                response = _e.sent();
                return [4, (0, service_1.create_sequence)("fragmentId", null, 1, response.reference)];
            case 5:
                _e.sent();
                return [2, response];
        }
    });
}); };
exports.updateCompany = updateCompany;
var getCompany = function () { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.companyCollection, model_1.companySchema);
                return [4, model.find()];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getCompany = getCompany;
var getCompanyByReference = function (reference) { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.companyCollection, model_1.companySchema);
                return [4, model.findOne({ reference: reference })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getCompanyByReference = getCompanyByReference;
var getCompanyByIdList = function (idList) { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.companyCollection, model_1.companySchema);
                return [4, model.find({ _id: { $in: idList } })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getCompanyByIdList = getCompanyByIdList;


/***/ }),

/***/ "./src/modules/company/model.ts":
/*!**************************************!*\
  !*** ./src/modules/company/model.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.companyCollection = exports.companySchema = void 0;
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var Schema = mongoose.Schema;
var companySchema = new Schema({
    name: { type: String },
    description: { type: String },
    reference: { type: Number },
    currency: { type: String },
    numberFormat: { type: String },
}, { timestamps: true });
exports.companySchema = companySchema;
var companyCollection = "company";
exports.companyCollection = companyCollection;


/***/ }),

/***/ "./src/modules/company/route.ts":
/*!**************************************!*\
  !*** ./src/modules/company/route.ts ***!
  \**************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var middlewares_1 = __webpack_require__(/*! ../../middlewares */ "./src/middlewares.ts");
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/company/service.ts");
var selfRealm = 100;
module.exports = function (router) {
    router.put("/company", middlewares_1.authorizeApi, service_1.updateCompany);
    router.get("/company", middlewares_1.authorizeApi, service_1.getCompany);
};


/***/ }),

/***/ "./src/modules/company/service.ts":
/*!****************************************!*\
  !*** ./src/modules/company/service.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCompanyByReference = exports.getCompany = exports.updateCompany = void 0;
var Helper = __importStar(__webpack_require__(/*! ./helper */ "./src/modules/company/helper.ts"));
var userInviteService = __importStar(__webpack_require__(/*! ../user/invite/service */ "./src/modules/user/invite/service.ts"));
var PermissionHelper = __importStar(__webpack_require__(/*! ../permission/helper */ "./src/modules/permission/helper.ts"));
var selfRealm = 100;
var updateCompany = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, company;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.user_id;
                return [4, Helper.updateCompany(req.body, userId)];
            case 1:
                company = _a.sent();
                userInviteService.registerUserInvite(company._doc.reference, company._doc._id, userId, req.user.email);
                return [4, PermissionHelper.addRole(req.user.email, company._doc.reference)];
            case 2:
                _a.sent();
                res.status(200);
                res.send(company);
                res.end();
                return [2];
        }
    });
}); };
exports.updateCompany = updateCompany;
var getCompany = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, companyList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.user_id;
                return [4, Helper.getCompany()];
            case 1:
                companyList = _a.sent();
                res.status(200);
                res.send(companyList);
                res.end();
                return [2];
        }
    });
}); };
exports.getCompany = getCompany;
var getCompanyByReference = function (reference) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Helper.getCompanyByReference(reference)];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getCompanyByReference = getCompanyByReference;


/***/ }),

/***/ "./src/modules/hello/helper.ts":
/*!*************************************!*\
  !*** ./src/modules/hello/helper.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.train_similarity_model = void 0;
var axios = __webpack_require__(/*! axios */ "axios");
var ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
var AI_API = process.env.AI_API || "http://localhost:5003/api";
var train_similarity_model = function (space) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, { "status": "success" }];
    });
}); };
exports.train_similarity_model = train_similarity_model;


/***/ }),

/***/ "./src/modules/hello/route.ts":
/*!************************************!*\
  !*** ./src/modules/hello/route.ts ***!
  \************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var handler_1 = __webpack_require__(/*! ../../handler */ "./src/handler.ts");
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/hello/service.ts");
module.exports = function (router) {
    router.get("/admin", function (_, res) {
        res.send("basic connection to server works. database connection is not validated");
        res.end();
    });
    router.get("/admin/:space/train", (0, handler_1.asyncHandler)(service_1.train_similarity_model));
};


/***/ }),

/***/ "./src/modules/hello/service.ts":
/*!**************************************!*\
  !*** ./src/modules/hello/service.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.train_similarity_model = void 0;
var Helper = __importStar(__webpack_require__(/*! ./helper */ "./src/modules/hello/helper.ts"));
var selfRealm = 100;
var train_similarity_model = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var note;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Helper.train_similarity_model(req.params.space)];
            case 1:
                note = _a.sent();
                res.status(200);
                res.send(note);
                res.end();
                return [2];
        }
    });
}); };
exports.train_similarity_model = train_similarity_model;


/***/ }),

/***/ "./src/modules/permission/helper.ts":
/*!******************************************!*\
  !*** ./src/modules/permission/helper.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addRole = void 0;
var axios = __webpack_require__(/*! axios */ "axios");
var ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
var ONEAUTH_API_KEY = process.env.ONEAUTH_API_KEY || "1d9524a6-30df-4b3c-9402-503f4011896c";
var addRole = function (email, companyId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, axios.post("".concat(ONEAUTH_API, "/212/admin/permission"), {
                        action: "ADD",
                        userEmail: email,
                        roleName: "COMPANY_ADMIN",
                        scope: companyId
                    }, {
                        headers: {
                            authorization: ONEAUTH_API_KEY,
                        },
                    })];
            case 2:
                response = _a.sent();
                return [3, 4];
            case 3:
                err_1 = _a.sent();
                return [2, {}];
            case 4:
                if (response.status === 200) {
                    return [2, response.data || null];
                }
                return [2, null];
        }
    });
}); };
exports.addRole = addRole;


/***/ }),

/***/ "./src/modules/sequence/service.ts":
/*!*****************************************!*\
  !*** ./src/modules/sequence/service.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetval = exports.nextval = exports.create_sequence = void 0;
var _a = __webpack_require__(/*! ./model */ "./src/modules/sequence/model.js"), sequenceCollection = _a.sequenceCollection, sequenceSchema = _a.sequenceSchema;
var _b = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts"), getGlobalCollection = _b.getGlobalCollection, getCollection = _b.getCollection;
var create_sequence = function (field, context, factor, space) { return __awaiter(void 0, void 0, void 0, function () {
    var model, existing_sequence;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (space) {
                    model = getCollection(space, sequenceCollection, sequenceSchema);
                }
                else {
                    model = getGlobalCollection(sequenceCollection, sequenceSchema);
                }
                return [4, model.findOne({ field: field, context: context })];
            case 1:
                existing_sequence = _a.sent();
                if (existing_sequence) {
                    return [2, existing_sequence];
                }
                return [4, model.findOneAndUpdate({ field: field, context: context }, { field: field, context: context, factor: factor, nextval: 1 }, { upsert: true, new: true })];
            case 2: return [2, _a.sent()];
        }
    });
}); };
exports.create_sequence = create_sequence;
var nextval = function (field, context, space) { return __awaiter(void 0, void 0, void 0, function () {
    var model, sequence;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (space) {
                    model = getCollection(space, sequenceCollection, sequenceSchema);
                }
                else {
                    model = getGlobalCollection(sequenceCollection, sequenceSchema);
                }
                return [4, model.findOne({ field: field, context: context })];
            case 1:
                sequence = _a.sent();
                if (!!sequence) return [3, 4];
                return [4, (0, exports.create_sequence)(field, context || null, 1, space)];
            case 2:
                _a.sent();
                return [4, model.findOne({ field: field, context: context })];
            case 3:
                sequence = _a.sent();
                _a.label = 4;
            case 4: return [4, model.findOneAndUpdate({ field: field, context: context }, { nextval: sequence.nextval + sequence.factor }, { upsert: true, new: true })];
            case 5:
                _a.sent();
                return [2, sequence.nextval];
        }
    });
}); };
exports.nextval = nextval;
var resetval = function (value, field, context, space) { return __awaiter(void 0, void 0, void 0, function () {
    var model, sequence;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (space) {
                    model = getCollection(space, sequenceCollection, sequenceSchema);
                }
                else {
                    model = getGlobalCollection(sequenceCollection, sequenceSchema);
                }
                return [4, model.findOne({ field: field, context: context })];
            case 1:
                sequence = _a.sent();
                if (!!sequence) return [3, 4];
                return [4, (0, exports.create_sequence)(field, context || null, 1, space)];
            case 2:
                _a.sent();
                return [4, model.findOne({ field: field, context: context })];
            case 3:
                sequence = _a.sent();
                _a.label = 4;
            case 4: return [4, model.findOneAndUpdate({ field: field, context: context }, { nextval: value }, { upsert: true, new: true })];
            case 5:
                _a.sent();
                return [2];
        }
    });
}); };
exports.resetval = resetval;


/***/ }),

/***/ "./src/modules/session/index.ts":
/*!**************************************!*\
  !*** ./src/modules/session/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvers = exports.typeDefs = void 0;
var jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
var apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
var model_1 = __webpack_require__(/*! ./model */ "./src/modules/session/model.ts");
var model_2 = __webpack_require__(/*! ../user/model */ "./src/modules/user/model.ts");
var getCollection = (__webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts").getCollection);
var axios = __webpack_require__(/*! axios */ "axios");
var ONEAUTH_API = process.env.ONEAUTH_API || "http://127.0.0.1:8020";
var typeDefs = (0, apollo_server_express_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  extend type Query {\n    session(id: ID!, space: String): UserSession\n  }\n\n  type Session {\n    id: ID!\n    sessionId: String!\n    token: String!\n  }\n\n  type UserSession {\n    id: ID!\n    firstName: String\n    lastName: String\n    email: String\n    token: String\n  }\n"], ["\n  extend type Query {\n    session(id: ID!, space: String): UserSession\n  }\n\n  type Session {\n    id: ID!\n    sessionId: String!\n    token: String!\n  }\n\n  type UserSession {\n    id: ID!\n    firstName: String\n    lastName: String\n    email: String\n    token: String\n  }\n"])));
exports.typeDefs = typeDefs;
var oaSession = function (space, id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, user, model, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4, axios.get("".concat(ONEAUTH_API, "/auth/space/").concat(space, "/session/").concat(id))];
            case 1:
                response = _a.sent();
                if (!(response.status === 200)) return [3, 3];
                user = jsonwebtoken_1.default.verify(response.data.token, "jwtsecret");
                model = getCollection(space, model_2.userCollection, model_2.userSchema);
                return [4, model.findByIdAndUpdate(user.userId, __assign(__assign({}, user), { resolver: "oneauth_space" }), { new: true, upsert: true })];
            case 2:
                data = _a.sent();
                if (data) {
                    return [2, {
                            id: data._id,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            token: response.data.token,
                        }];
                }
                else {
                    return [2, null];
                }
                return [3, 4];
            case 3: return [2, null];
            case 4: return [3, 6];
            case 5:
                error_1 = _a.sent();
                return [2, null];
            case 6: return [2];
        }
    });
}); };
var emailOrExternSession = function (space, sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var model, session, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = getCollection(space, model_1.sessionCollection, model_1.sessionSchema);
                return [4, model.findOne({ sessionId: sessionId })];
            case 1:
                session = _a.sent();
                if (!session) {
                    return [2, null];
                }
                return [4, jsonwebtoken_1.default.verify(session.token, "jwtsecret")];
            case 2:
                data = _a.sent();
                if (!data) {
                    return [2, null];
                }
                return [2, {
                        id: data.userId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        token: session.token,
                    }];
        }
    });
}); };
var resolvers = {
    Query: {
        session: function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
            var id = _b.id, space = _b.space;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, oaSession(space, id)];
                    case 1: return [2, _c.sent()];
                }
            });
        }); },
    },
};
exports.resolvers = resolvers;
var templateObject_1;


/***/ }),

/***/ "./src/modules/session/model.ts":
/*!**************************************!*\
  !*** ./src/modules/session/model.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sessionCollection = exports.sessionSchema = void 0;
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var Schema = mongoose.Schema;
var sessionSchema = new Schema({
    sessionId: { type: String },
    token: { type: String },
    type: { type: String },
}, { timestamps: true });
exports.sessionSchema = sessionSchema;
var sessionCollection = "session";
exports.sessionCollection = sessionCollection;


/***/ }),

/***/ "./src/modules/universal/filterBuilder.ts":
/*!************************************************!*\
  !*** ./src/modules/universal/filterBuilder.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildQueryFromAdvancedFilters = exports.buildQueryFromFilters = void 0;
var buildQueryFromFilters = function (queryParams, spec) {
    var mongoQuery = {};
    for (var field in queryParams) {
        var filterValue = queryParams[field];
        var fieldSpec = spec[field];
        if (!fieldSpec)
            continue;
        switch (fieldSpec.filter) {
            case "like":
                mongoQuery[field] = { $regex: new RegExp(filterValue, "i") };
                break;
            case "in":
                mongoQuery[field] = { $in: Array.isArray(filterValue) ? filterValue : [filterValue] };
                break;
            case "gt":
                mongoQuery[field] = { $gt: filterValue };
                break;
            case "lt":
                mongoQuery[field] = { $lt: filterValue };
                break;
            case "gte":
                mongoQuery[field] = { $gte: filterValue };
                break;
            case "lte":
                mongoQuery[field] = { $lte: filterValue };
                break;
            case "exact":
            default:
                mongoQuery[field] = filterValue;
                break;
        }
    }
    return mongoQuery;
};
exports.buildQueryFromFilters = buildQueryFromFilters;
var buildQueryFromAdvancedFilters = function (filters, spec) {
    var mongoQuery = {};
    for (var field in filters) {
        var value = filters[field];
        var fieldSpec = spec[field];
        if (!fieldSpec)
            continue;
        if (typeof value === "object" && !Array.isArray(value)) {
            var operators = {
                eq: "$eq",
                ne: "$ne",
                gt: "$gt",
                gte: "$gte",
                lt: "$lt",
                lte: "$lte",
                in: "$in",
                nin: "$nin",
                regex: "$regex"
            };
            var mongoOps = {};
            for (var op in value) {
                if (operators[op]) {
                    mongoOps[operators[op]] = value[op];
                }
            }
            mongoQuery[field] = mongoOps;
        }
        else {
            mongoQuery[field] = value;
        }
    }
    return mongoQuery;
};
exports.buildQueryFromAdvancedFilters = buildQueryFromAdvancedFilters;


/***/ }),

/***/ "./src/modules/universal/route.ts":
/*!****************************************!*\
  !*** ./src/modules/universal/route.ts ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/universal/service.ts");
var middlewares_1 = __webpack_require__(/*! ../../middlewares */ "./src/middlewares.ts");
var router = express_1.default.Router();
module.exports = function (router) {
    router
        .route("/resources/:space/:domain")
        .get(middlewares_1.authorizeApi, service_1.getAll)
        .post(middlewares_1.authorizeApi, service_1.createOne);
    router
        .route("/resources/:space/:domain/:reference")
        .get(middlewares_1.authorizeApi, service_1.getByReference)
        .put(middlewares_1.authorizeApi, service_1.updateOne)
        .patch(middlewares_1.authorizeApi, service_1.patchOne)
        .delete(middlewares_1.authorizeApi, service_1.deleteOne);
    router.post("/resources/:space/:domain/search", middlewares_1.authorizeApi, service_1.search);
    router.get("/inference/resources", service_1.inferTypes);
};


/***/ }),

/***/ "./src/modules/universal/schemaValidator.ts":
/*!**************************************************!*\
  !*** ./src/modules/universal/schemaValidator.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isOperationAllowed = exports.fillMissingFields = exports.validateAndShapePayload = exports.loadChildren = exports.loadSpec = void 0;
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var domains_1 = __webpack_require__(/*! ../../specs/domains */ "./src/specs/domains/index.ts");
var loadSpec = function (domain) {
    var spec = domains_1.specsMap[domain];
    if (!spec) {
        throw new Error("No schema spec found for domain '".concat(domain, "'"));
    }
    return spec;
};
exports.loadSpec = loadSpec;
var loadChildren = function (domain) {
    return domains_1.childrenMap[domain] || [];
};
exports.loadChildren = loadChildren;
var validateAndShapePayload = function (payload, spec, path, options) {
    var _a, _b;
    if (path === void 0) { path = ""; }
    if (options === void 0) { options = {}; }
    var errors = [];
    var shapedData = {};
    var allowPartial = (_a = options.allowPartial) !== null && _a !== void 0 ? _a : false;
    for (var key in spec) {
        var fieldSpec = spec[key];
        var fullPath = path ? "".concat(path, ".").concat(key) : key;
        var value = payload === null || payload === void 0 ? void 0 : payload[key];
        var isValuePresent = value !== undefined && value !== null;
        if (!allowPartial && fieldSpec.required && !isValuePresent) {
            errors.push("".concat(fullPath, " is required"));
            continue;
        }
        if (!isValuePresent) {
            if (!allowPartial) {
                shapedData[key] = getDefaultForType(fieldSpec.type);
            }
            continue;
        }
        if (fieldSpec.type === "object") {
            if (typeof value !== "object" || Array.isArray(value)) {
                errors.push("".concat(fullPath, " should be an object"));
                continue;
            }
            var nested = (0, exports.validateAndShapePayload)(value, fieldSpec.schema || {}, fullPath, options);
            errors.push.apply(errors, nested.errors);
            shapedData[key] = nested.shapedData;
        }
        else if (fieldSpec.type === "array") {
            if (!Array.isArray(value)) {
                errors.push("".concat(fullPath, " should be an array"));
                continue;
            }
            shapedData[key] = [];
            for (var i = 0; i < value.length; i++) {
                var item = value[i];
                var itemPath = "".concat(fullPath, "[").concat(i, "]");
                if (((_b = fieldSpec.schema) === null || _b === void 0 ? void 0 : _b.type) === "object") {
                    var nested = (0, exports.validateAndShapePayload)(item, fieldSpec.schema.schema || {}, itemPath, options);
                    errors.push.apply(errors, nested.errors);
                    shapedData[key].push(nested.shapedData);
                }
                else {
                    if (typeof item !== fieldSpec.schema.type) {
                        errors.push("".concat(itemPath, " should be of type ").concat(fieldSpec.schema.type));
                    }
                    else {
                        shapedData[key].push(item);
                    }
                }
            }
        }
        else {
            if (typeof value !== fieldSpec.type) {
                errors.push("".concat(fullPath, " should be of type ").concat(fieldSpec.type));
                continue;
            }
            shapedData[key] = value;
        }
    }
    return { valid: errors.length === 0, errors: errors, shapedData: shapedData };
};
exports.validateAndShapePayload = validateAndShapePayload;
var getDefaultForType = function (type) {
    switch (type) {
        case "string": return undefined;
        case "number": return undefined;
        case "boolean": return undefined;
        case "array": return [];
        case "object": return {};
        default: return undefined;
    }
};
var fillMissingFields = function (doc, spec) {
    var shaped = { reference: doc.reference, createdBy: doc.createdBy, createdAt: doc.createdAt, updatedBy: doc.updatedBy, updatedAt: doc.updatedAt };
    for (var field in spec) {
        if (doc.hasOwnProperty(field)) {
            shaped[field] = doc[field];
        }
        else {
            shaped[field] = spec[field].type === "array" ? [] : null;
        }
    }
    return shaped;
};
exports.fillMissingFields = fillMissingFields;
var isOperationAllowed = function (domain, operation) {
    var filePath = path_1.default.join(__dirname, "./specs/domains/", "".concat(domain, ".exclude.json"));
    if (!fs_1.default.existsSync(filePath)) {
        return true;
    }
    var excludedOps = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    return !excludedOps.includes("*") && !excludedOps.includes(operation);
};
exports.isOperationAllowed = isOperationAllowed;


/***/ }),

/***/ "./src/modules/universal/service.ts":
/*!******************************************!*\
  !*** ./src/modules/universal/service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inferTypes = exports.deleteOne = exports.patchOne = exports.updateOne = exports.createOne = exports.getByReference = exports.search = exports.getAll = void 0;
var nanoid_1 = __webpack_require__(/*! nanoid */ "nanoid");
var schemaValidator_1 = __webpack_require__(/*! ./schemaValidator */ "./src/modules/universal/schemaValidator.ts");
var dbutils_1 = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
var filterBuilder_1 = __webpack_require__(/*! ./filterBuilder */ "./src/modules/universal/filterBuilder.ts");
var typeInference_1 = __webpack_require__(/*! ./typeInference */ "./src/modules/universal/typeInference.ts");
var alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var nanoid = (0, nanoid_1.customAlphabet)(alphanumericAlphabet, 8);
var checkParentReferences = function (shapedData_1, spec_1, space_1, res_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([shapedData_1, spec_1, space_1, res_1], args_1, true), void 0, function (shapedData, spec, space, res, path) {
        var _a, _b, _c, _d, fieldName, fieldSpec, value, fullPath, parentModel, found, ok, itemSchema, i, item, itemPath, ok, parentModel, found;
        if (path === void 0) { path = ""; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = spec;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _d = 0;
                    _e.label = 1;
                case 1:
                    if (!(_d < _b.length)) return [3, 12];
                    _c = _b[_d];
                    if (!(_c in _a)) return [3, 11];
                    fieldName = _c;
                    if (fieldName === "_meta")
                        return [3, 11];
                    fieldSpec = spec[fieldName];
                    value = shapedData === null || shapedData === void 0 ? void 0 : shapedData[fieldName];
                    fullPath = path ? "".concat(path, ".").concat(fieldName) : fieldName;
                    if (!(fieldSpec.type === "string" || fieldSpec.type === "number" || fieldSpec.type === "boolean")) return [3, 3];
                    if (!("parent" in fieldSpec && typeof value === "string" && fieldSpec.parent)) return [3, 3];
                    parentModel = (0, dbutils_1.getCollectionByName)(space, fieldSpec.parent);
                    return [4, parentModel.findOne({ reference: value })];
                case 2:
                    found = _e.sent();
                    if (!found) {
                        res.status(400).json({
                            error: "Invalid parent reference '".concat(value, "' for '").concat(fullPath, "' in domain '").concat(fieldSpec.parent, "'"),
                        });
                        return [2, false];
                    }
                    _e.label = 3;
                case 3:
                    if (!(fieldSpec.type === "object" && typeof value === "object" && !Array.isArray(value))) return [3, 5];
                    return [4, checkParentReferences(value, fieldSpec.schema, space, res, fullPath)];
                case 4:
                    ok = _e.sent();
                    if (!ok)
                        return [2, false];
                    _e.label = 5;
                case 5:
                    if (!(fieldSpec.type === "array" && Array.isArray(value))) return [3, 11];
                    itemSchema = fieldSpec.schema;
                    i = 0;
                    _e.label = 6;
                case 6:
                    if (!(i < value.length)) return [3, 11];
                    item = value[i];
                    itemPath = "".concat(fullPath, "[").concat(i, "]");
                    if (!(itemSchema.type === "object" && typeof item === "object")) return [3, 8];
                    return [4, checkParentReferences(item, itemSchema.schema, space, res, itemPath)];
                case 7:
                    ok = _e.sent();
                    if (!ok)
                        return [2, false];
                    _e.label = 8;
                case 8:
                    if (!((itemSchema.type === "string" || itemSchema.type === "number") &&
                        "parent" in itemSchema &&
                        typeof item === "string" && itemSchema.parent)) return [3, 10];
                    parentModel = (0, dbutils_1.getCollectionByName)(space, itemSchema.parent);
                    return [4, parentModel.findOne({ reference: item })];
                case 9:
                    found = _e.sent();
                    if (!found) {
                        res.status(400).json({
                            error: "Invalid parent reference '".concat(item, "' for '").concat(itemPath, "' in domain '").concat(itemSchema.parent, "'"),
                        });
                        return [2, false];
                    }
                    _e.label = 10;
                case 10:
                    i++;
                    return [3, 6];
                case 11:
                    _d++;
                    return [3, 1];
                case 12: return [2, true];
            }
        });
    });
};
var deleteChildRecords = function (reference, children, domain, space) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, children_1, childDomain, childModel, refField;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!children || !Array.isArray(children))
                    return [2];
                _i = 0, children_1 = children;
                _b.label = 1;
            case 1:
                if (!(_i < children_1.length)) return [3, 4];
                childDomain = children_1[_i];
                childModel = (0, dbutils_1.getCollectionByName)(space, childDomain);
                refField = "".concat(domain, "Reference");
                return [4, childModel.deleteMany((_a = {}, _a[refField] = reference, _a))];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3, 1];
            case 4: return [2];
        }
    });
}); };
var getAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, _b, _c, page, _d, limit, rawFilters, Model, spec_1, filters, docs, total, shaped, err_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "search")) {
                    return [2, res.status(404).json({ error: "Operation 'search' is not supported for this domain" })];
                }
                _b = req.query, _c = _b.page, page = _c === void 0 ? 1 : _c, _d = _b.limit, limit = _d === void 0 ? 10 : _d, rawFilters = __rest(_b, ["page", "limit"]);
                if (+page < 1 || +limit < 1) {
                    return [2, res.status(400).json({ error: "Page and limit must be >= 1." })];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 4, , 5]);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                spec_1 = (0, schemaValidator_1.loadSpec)(domain);
                filters = (0, filterBuilder_1.buildQueryFromFilters)(rawFilters, spec_1);
                return [4, Model.find(filters).skip((+page - 1) * +limit).limit(+limit)];
            case 2:
                docs = _e.sent();
                return [4, Model.countDocuments(filters)];
            case 3:
                total = _e.sent();
                shaped = docs.map(function (doc) { return (0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec_1); });
                res.json({
                    data: shaped,
                    total: total,
                    page: +page,
                    limit: +limit,
                    totalPages: Math.ceil(total / +limit)
                });
                return [3, 5];
            case 4:
                err_1 = _e.sent();
                res.status(500).json({ error: "Failed to fetch records", details: err_1.message });
                return [3, 5];
            case 5: return [2];
        }
    });
}); };
exports.getAll = getAll;
var search = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, _b, _c, filters, _d, pagination, _e, page, _f, limit, Model, spec_2, mongoQuery, docs, total, shaped, err_2;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                _b = req.body, _c = _b.filters, filters = _c === void 0 ? {} : _c, _d = _b.pagination, pagination = _d === void 0 ? {} : _d;
                _e = pagination.page, page = _e === void 0 ? 1 : _e, _f = pagination.limit, limit = _f === void 0 ? 10 : _f;
                if (+page < 1 || +limit < 1) {
                    return [2, res.status(400).json({ error: "Page and limit must be >= 1." })];
                }
                _g.label = 1;
            case 1:
                _g.trys.push([1, 4, , 5]);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                spec_2 = (0, schemaValidator_1.loadSpec)(domain);
                mongoQuery = (0, filterBuilder_1.buildQueryFromAdvancedFilters)(filters, spec_2);
                console.log(filters);
                return [4, Model.find(mongoQuery).skip((+page - 1) * +limit).limit(+limit)];
            case 2:
                docs = _g.sent();
                return [4, Model.countDocuments(mongoQuery)];
            case 3:
                total = _g.sent();
                shaped = docs.map(function (doc) { return (0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec_2); });
                res.json({
                    data: shaped,
                    total: total,
                    page: +page,
                    limit: +limit,
                    totalPages: Math.ceil(total / +limit)
                });
                return [3, 5];
            case 4:
                err_2 = _g.sent();
                res.status(500).json({ error: "Search failed", details: err_2.message });
                return [3, 5];
            case 5: return [2];
        }
    });
}); };
exports.search = search;
var getByReference = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, Model, spec, doc, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "get")) {
                    return [2, res.status(404).json({ error: "Operation 'get' is not supported for this domain" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                return [4, Model.findOne({ reference: reference })];
            case 2:
                doc = _b.sent();
                if (!doc)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                return [3, 4];
            case 3:
                err_3 = _b.sent();
                res.status(500).json({ error: "Error fetching document", details: err_3.message });
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.getByReference = getByReference;
var createOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, userId, spec, result, Model, timestamp, doc, err_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "create")) {
                    return [2, res.status(404).json({ error: "Operation 'create' is not supported for this domain" })];
                }
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.user_id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                result = (0, schemaValidator_1.validateAndShapePayload)(req.body, spec);
                if (!result.valid)
                    return [2, res.status(400).json({ error: "Validation failed", details: result.errors })];
                return [4, checkParentReferences(result.shapedData, spec, space, res)];
            case 2:
                if (!(_c.sent()))
                    return [2];
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                timestamp = new Date();
                doc = new Model(__assign(__assign({}, result.shapedData), { reference: nanoid(), createdAt: timestamp, updatedAt: timestamp, createdBy: userId, updatedBy: userId }));
                return [4, doc.save()];
            case 3:
                _c.sent();
                res.status(201).json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                return [3, 5];
            case 4:
                err_4 = _c.sent();
                res.status(500).json({ error: "Error creating document", details: err_4.message });
                return [3, 5];
            case 5: return [2];
        }
    });
}); };
exports.createOne = createOne;
var updateOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, userId, spec, result, Model, updateData, doc, err_5;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "update")) {
                    return [2, res.status(404).json({ error: "Operation 'update' is not supported for this domain" })];
                }
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.user_id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                result = (0, schemaValidator_1.validateAndShapePayload)(req.body, spec);
                if (!result.valid)
                    return [2, res.status(400).json({ error: "Validation failed", details: result.errors })];
                return [4, checkParentReferences(result.shapedData, spec, space, res)];
            case 2:
                if (!(_c.sent()))
                    return [2];
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                updateData = __assign(__assign({}, result.shapedData), { updatedAt: new Date(), updatedBy: userId });
                return [4, Model.findOneAndUpdate({ reference: reference }, updateData, { new: true })];
            case 3:
                doc = _c.sent();
                if (!doc)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                return [3, 5];
            case 4:
                err_5 = _c.sent();
                res.status(500).json({ error: "Error updating document", details: err_5.message });
                return [3, 5];
            case 5: return [2];
        }
    });
}); };
exports.updateOne = updateOne;
var patchOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, userId, spec, result, Model, patchData, doc, err_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "patch")) {
                    return [2, res.status(404).json({ error: "Operation 'patch' is not supported for this domain" })];
                }
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.user_id;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                result = (0, schemaValidator_1.validateAndShapePayload)(req.body, spec, "", { allowPartial: true });
                if (!result.valid) {
                    return [2, res.status(400).json({ error: "Validation failed", details: result.errors })];
                }
                return [4, checkParentReferences(result.shapedData, spec, space, res)];
            case 2:
                if (!(_c.sent()))
                    return [2];
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                patchData = __assign(__assign({}, result.shapedData), { updatedAt: new Date(), updatedBy: userId });
                return [4, Model.findOneAndUpdate({ reference: reference }, patchData, { new: true })];
            case 3:
                doc = _c.sent();
                if (!doc)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                return [3, 5];
            case 4:
                err_6 = _c.sent();
                res.status(500).json({ error: "Error patching document", details: err_6.message });
                return [3, 5];
            case 5: return [2];
        }
    });
}); };
exports.patchOne = patchOne;
var deleteOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, Model, spec, children, doc, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "delete")) {
                    return [2, res.status(404).json({ error: "Operation 'delete' is not supported for this domain" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                children = (0, schemaValidator_1.loadChildren)(domain);
                return [4, Model.findOne({ reference: reference })];
            case 2:
                doc = _b.sent();
                if (!doc)
                    return [2, res.status(404).json({ error: "Not found" })];
                return [4, deleteChildRecords(reference, children, domain, space)];
            case 3:
                _b.sent();
                return [4, Model.deleteOne({ reference: reference })];
            case 4:
                _b.sent();
                res.status(204).send();
                return [3, 6];
            case 5:
                err_7 = _b.sent();
                res.status(500).json({ error: "Error deleting document", details: err_7.message });
                return [3, 6];
            case 6: return [2];
        }
    });
}); };
exports.deleteOne = deleteOne;
var inferTypes = function (req, res) {
    var space = req.params.space;
    try {
        var types = (0, typeInference_1.generateTypes)(space);
        res.header("Content-Type", "text/typescript");
        res.send(types);
    }
    catch (err) {
        res.status(500).json({ error: "Error generating types", details: err.message });
    }
};
exports.inferTypes = inferTypes;


/***/ }),

/***/ "./src/modules/universal/typeInference.ts":
/*!************************************************!*\
  !*** ./src/modules/universal/typeInference.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateTypes = void 0;
var domains_1 = __webpack_require__(/*! ../../specs/domains */ "./src/specs/domains/index.ts");
var capitalize = function (str) { return str.charAt(0).toUpperCase() + str.slice(1); };
var toPascalCase = function (parts) {
    return parts.map(capitalize).join("");
};
var nestedInterfaces = [];
var inferTsType = function (field, domainName, pathParts) {
    if (pathParts === void 0) { pathParts = []; }
    switch (field.type) {
        case "string":
        case "number":
        case "boolean":
        case "any":
            return field.type;
        case "object":
            if (!field.schema)
                return "Record<string, any>";
            var interfaceName = toPascalCase(__spreadArray([domainName], pathParts, true));
            nestedInterfaces.push(generateNestedInterface(interfaceName, field.schema, domainName, pathParts));
            return interfaceName;
        case "array":
            var itemType = inferTsType(field.schema, domainName, pathParts);
            return "".concat(itemType, "[]");
        default:
            return "any";
    }
};
var generateNestedInterface = function (interfaceName, spec, domainName, pathParts) {
    if (pathParts === void 0) { pathParts = []; }
    var fields = "";
    for (var field in spec) {
        var fieldDef = spec[field];
        var tsType = inferTsType(fieldDef, domainName, __spreadArray(__spreadArray([], pathParts, true), [field], false));
        fields += "\n  ".concat(field).concat(fieldDef.required ? "" : "?", ": ").concat(tsType, ";");
    }
    return "export interface ".concat(interfaceName, " {").concat(fields, "\n}");
};
var generateTypes = function (space) {
    var types = [];
    Object.keys(domains_1.specsMap).forEach(function (specName) {
        var spec = domains_1.specsMap[specName];
        var domainInterfaceName = capitalize(specName);
        var mainInterface = generateNestedInterface(domainInterfaceName, spec, specName);
        types.push(mainInterface);
    });
    return __spreadArray(__spreadArray([], types, true), nestedInterfaces, true).join("\n\n");
};
exports.generateTypes = generateTypes;


/***/ }),

/***/ "./src/modules/user/helper.ts":
/*!************************************!*\
  !*** ./src/modules/user/helper.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserById = exports.getUserByEmail = exports.getUsers = exports.validateSession = exports.getNewAccessToken = exports.decodeAccessToken = void 0;
var axios = __webpack_require__(/*! axios */ "axios");
var ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
var model_1 = __webpack_require__(/*! ./model */ "./src/modules/user/model.ts");
var model_2 = __webpack_require__(/*! ../user/invite/model */ "./src/modules/user/invite/model.ts");
var Helper = __importStar(__webpack_require__(/*! ./helper */ "./src/modules/user/helper.ts"));
var dbutils_1 = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
var helper_1 = __webpack_require__(/*! ../auth/helper */ "./src/modules/auth/helper.ts");
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/user/service.ts");
var decodeAccessToken = function (space, accessToken) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedResponse, err_1, model, existingUserRecord, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decodedResponse = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, axios.get("".concat(ONEAUTH_API, "/auth/token/decode"), {
                        headers: {
                            authorization: accessToken,
                        },
                    })];
            case 2:
                decodedResponse = _a.sent();
                return [3, 4];
            case 3:
                err_1 = _a.sent();
                if (err_1.response.status === 401) {
                    return [2, "expired"];
                }
                return [2, "expired"];
            case 4:
                if (!(decodedResponse.status === 200)) return [3, 9];
                model = (0, dbutils_1.getGlobalCollection)(model_1.userCollection, model_1.userSchema);
                return [4, model.find({
                        email: decodedResponse.data.email,
                    })];
            case 5:
                existingUserRecord = _a.sent();
                return [4, model.findByIdAndUpdate(decodedResponse.data.user_id, __assign(__assign({}, decodedResponse.data), { resolver: "oneauth_space" }), { new: true, upsert: true })];
            case 6:
                data = _a.sent();
                if (!(existingUserRecord.length === 0)) return [3, 8];
                return [4, autoAcceptInvites(data)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [2, decodedResponse.data || null];
            case 9: return [2, null];
        }
    });
}); };
exports.decodeAccessToken = decodeAccessToken;
var autoAcceptInvites = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var model, pendingInviteList, i, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_2.userInviteCollection, model_2.userInviteSchema);
                return [4, model.find({ email: user.email })];
            case 1:
                pendingInviteList = _a.sent();
                console.log(pendingInviteList);
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < pendingInviteList.length)) return [3, 5];
                return [4, model.findByIdAndUpdate(pendingInviteList[i]._id, __assign(__assign({}, pendingInviteList[i]._doc), { userId: user._id, accepted: true }), { new: true, upsert: true })];
            case 3:
                res = _a.sent();
                console.log(__assign(__assign({}, pendingInviteList[i]), { userId: user._id, accepted: true }));
                _a.label = 4;
            case 4:
                i++;
                return [3, 2];
            case 5: return [2];
        }
    });
}); };
var getNewAccessToken = function (space, refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshTokenResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, axios.post("".concat(ONEAUTH_API, "/auth/token"), {
                    grant_type: "refresh_token",
                    realm: space,
                    refresh_token: refreshToken,
                })];
            case 1:
                refreshTokenResponse = _a.sent();
                if (refreshTokenResponse.status === 200) {
                    return [2, refreshTokenResponse.data];
                }
                return [2, null];
        }
    });
}); };
exports.getNewAccessToken = getNewAccessToken;
var validateSession = function (localAccessToken, refreshToken, appRealm) { return __awaiter(void 0, void 0, void 0, function () {
    var model, localTokenResponse, accessToken, localClaims, _a, _accessToken, _localClaims, accessTokenResponse, newAccessToken, newAccessTokenResponse;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.userCollection, model_1.userSchema);
                return [4, (0, helper_1.decodeAppToken)(localAccessToken)];
            case 1:
                localTokenResponse = _c.sent();
                accessToken = "";
                localClaims = {};
                if (!localTokenResponse.outcome) {
                    return [2, null];
                }
                _a = localTokenResponse.claims, _accessToken = _a.accessToken, _localClaims = __rest(_a, ["accessToken"]);
                accessToken = _accessToken;
                localClaims = {
                    space: _localClaims.space,
                    companyId: _localClaims.companyId,
                };
                return [4, Helper.decodeAccessToken(Number(appRealm), accessToken)];
            case 2:
                accessTokenResponse = _c.sent();
                if (accessTokenResponse !== "expired") {
                    return [2, {
                            accessToken: null,
                            claims: accessTokenResponse,
                            space: localClaims.space,
                        }];
                }
                return [4, Helper.getNewAccessToken(appRealm, refreshToken)];
            case 3:
                newAccessToken = _c.sent();
                if (!(newAccessToken === null || newAccessToken === void 0 ? void 0 : newAccessToken.access_token)) return [3, 6];
                return [4, Helper.decodeAccessToken(appRealm, newAccessToken.access_token)];
            case 4:
                newAccessTokenResponse = _c.sent();
                _b = {};
                return [4, (0, service_1.getLocalTokenImpl)(newAccessTokenResponse.user_id, newAccessToken.access_token)];
            case 5: return [2, (_b.accessToken = _c.sent(),
                    _b.claims = newAccessTokenResponse,
                    _b.space = localClaims.space,
                    _b)];
            case 6: return [2, null];
        }
    });
}); };
exports.validateSession = validateSession;
var getUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.userCollection, model_1.userSchema);
                return [4, model.find()];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getUsers = getUsers;
var getUserByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.userCollection, model_1.userSchema);
                return [4, model.findOne({ email: email.toLowerCase() })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getUserByEmail = getUserByEmail;
var getUserById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.userCollection, model_1.userSchema);
                return [4, model.findById(id)];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getUserById = getUserById;


/***/ }),

/***/ "./src/modules/user/index.ts":
/*!***********************************!*\
  !*** ./src/modules/user/index.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvers = exports.typeDefs = void 0;
var apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
var model_1 = __webpack_require__(/*! ./model */ "./src/modules/user/model.ts");
var Helper = __importStar(__webpack_require__(/*! ./helper */ "./src/modules/user/helper.ts"));
var getCollection = (__webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts").getCollection);
var typeDefs = (0, apollo_server_express_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Query {\n    user: [User]\n    authorizeUser(\n      accessToken: String\n      refreshToken: String\n      space: String\n    ): AuthorizeResponse\n  }\n\n  type Mutation {\n    createEmailAccount(payload: UserPayload): User!\n  }\n\n  input UserPayload {\n    firstName: String!\n    lastName: String!\n    email: String!\n  }\n\n  type User {\n    id: ID!\n    given_name: String\n    family_name: String\n    name: String\n    nickname: String\n    email: String\n    resolver: String\n  }\n\n  type AuthorizeResponse {\n    accessToken: String\n    claims: JSON\n  }\n"], ["\n  type Query {\n    user: [User]\n    authorizeUser(\n      accessToken: String\n      refreshToken: String\n      space: String\n    ): AuthorizeResponse\n  }\n\n  type Mutation {\n    createEmailAccount(payload: UserPayload): User!\n  }\n\n  input UserPayload {\n    firstName: String!\n    lastName: String!\n    email: String!\n  }\n\n  type User {\n    id: ID!\n    given_name: String\n    family_name: String\n    name: String\n    nickname: String\n    email: String\n    resolver: String\n  }\n\n  type AuthorizeResponse {\n    accessToken: String\n    claims: JSON\n  }\n"])));
exports.typeDefs = typeDefs;
var resolvers = {
    Query: {
        user: function (_1, _a, _b) { return __awaiter(void 0, [_1, _a, _b], void 0, function (_, _c, _d) {
            var model;
            var email = _c.email;
            var space = _d.space, user = _d.user;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!space || !user) {
                            return [2, new apollo_server_express_1.AuthenticationError("Not authorized to access this content")];
                        }
                        model = getCollection(space, model_1.userCollection, model_1.userSchema);
                        return [4, model.find()];
                    case 1: return [2, _e.sent()];
                }
            });
        }); },
        authorizeUser: function (_1, _a, __1) { return __awaiter(void 0, [_1, _a, __1], void 0, function (_, _b, __) {
            var model, accessTokenResponse, newAccessToken, newAccessTokenResponse;
            var accessToken = _b.accessToken, refreshToken = _b.refreshToken, space = _b.space;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        model = getCollection(space, model_1.userCollection, model_1.userSchema);
                        return [4, Helper.decodeAccessToken(Number(space), accessToken)];
                    case 1:
                        accessTokenResponse = _c.sent();
                        if (accessTokenResponse !== "expired") {
                            return [2, {
                                    accessToken: null,
                                    claims: accessTokenResponse,
                                }];
                        }
                        return [4, Helper.getNewAccessToken(space, refreshToken)];
                    case 2:
                        newAccessToken = _c.sent();
                        if (!(newAccessToken === null || newAccessToken === void 0 ? void 0 : newAccessToken.access_token)) return [3, 4];
                        return [4, Helper.decodeAccessToken(space, newAccessToken.access_token)];
                    case 3:
                        newAccessTokenResponse = _c.sent();
                        return [2, {
                                accessToken: newAccessToken.access_token,
                                claims: newAccessTokenResponse,
                            }];
                    case 4: return [2, null];
                }
            });
        }); },
    },
    Mutation: {
        createEmailAccount: function (_1, args_1, _a) { return __awaiter(void 0, [_1, args_1, _a], void 0, function (_, args, _b) {
            var model, response;
            var space = _b.space, user = _b.user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        model = getCollection(space, model_1.userCollection, model_1.userSchema);
                        return [4, model.findOneAndUpdate({ email: args.payload.email, resolver: "email" }, __assign(__assign({}, args.payload), { resolver: "email" }), { upsert: true, new: true, rawResult: true })];
                    case 1:
                        response = _c.sent();
                        return [2, response.value];
                }
            });
        }); },
    },
};
exports.resolvers = resolvers;
var templateObject_1;


/***/ }),

/***/ "./src/modules/user/invite/helper.ts":
/*!*******************************************!*\
  !*** ./src/modules/user/invite/helper.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserInviteByUserId = exports.registerUserInvite = exports.getUserInvite = exports.updateUserInvite = void 0;
var axios = __webpack_require__(/*! axios */ "axios");
var ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
var model_1 = __webpack_require__(/*! ./model */ "./src/modules/user/invite/model.ts");
var companyService = __importStar(__webpack_require__(/*! ../../company/service */ "./src/modules/company/service.ts"));
var userService = __importStar(__webpack_require__(/*! ../service */ "./src/modules/user/service.ts"));
var dbutils_1 = __webpack_require__(/*! ../../../lib/dbutils */ "./src/lib/dbutils.ts");
var updateUserInvite = function (space, data, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var company, model, user, payload, existingRecord;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, companyService.getCompanyByReference(space)];
            case 1:
                company = _a.sent();
                if (!company) {
                    return [2, null];
                }
                model = (0, dbutils_1.getGlobalCollection)(model_1.userInviteCollection, model_1.userInviteSchema);
                return [4, userService.getUserByEmail(data.email)];
            case 2:
                user = _a.sent();
                payload = __assign(__assign({}, data), { email: data.email.toLowerCase(), companyId: company._id, accepted: !!user, userId: user ? user._id : null });
                return [4, model.find({
                        email: payload.email.toLowerCase(),
                        companyId: company._id,
                    })];
            case 3:
                existingRecord = _a.sent();
                if ((existingRecord === null || existingRecord === void 0 ? void 0 : existingRecord.length) > 0) {
                    return [2, null];
                }
                return [4, model.create(payload)];
            case 4: return [2, _a.sent()];
        }
    });
}); };
exports.updateUserInvite = updateUserInvite;
var getUserInvite = function (space) { return __awaiter(void 0, void 0, void 0, function () {
    var company, model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, companyService.getCompanyByReference(space)];
            case 1:
                company = _a.sent();
                if (!company) {
                    return [2, []];
                }
                model = (0, dbutils_1.getGlobalCollection)(model_1.userInviteCollection, model_1.userInviteSchema);
                return [4, model.find({ companyId: company._id })];
            case 2: return [2, _a.sent()];
        }
    });
}); };
exports.getUserInvite = getUserInvite;
var registerUserInvite = function (space, companyId, userId, email) { return __awaiter(void 0, void 0, void 0, function () {
    var model, existingRecord;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.userInviteCollection, model_1.userInviteSchema);
                return [4, model.find({
                        email: email.toLowerCase(),
                        companyId: companyId,
                    })];
            case 1:
                existingRecord = _a.sent();
                if ((existingRecord === null || existingRecord === void 0 ? void 0 : existingRecord.length) > 0) {
                    return [2, null];
                }
                return [4, model.create({
                        companyId: companyId,
                        email: email.toLowerCase(),
                        userId: userId,
                        accepted: true,
                    })];
            case 2: return [2, _a.sent()];
        }
    });
}); };
exports.registerUserInvite = registerUserInvite;
var getUserInviteByUserId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var model;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = (0, dbutils_1.getGlobalCollection)(model_1.userInviteCollection, model_1.userInviteSchema);
                return [4, model.find({ userId: userId })];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getUserInviteByUserId = getUserInviteByUserId;


/***/ }),

/***/ "./src/modules/user/invite/model.ts":
/*!******************************************!*\
  !*** ./src/modules/user/invite/model.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.userInviteCollection = exports.userInviteSchema = void 0;
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var Schema = mongoose.Schema;
var userInviteSchema = new Schema({
    email: { type: String },
    userId: { type: String },
    companyId: { type: String },
    accepted: { type: Boolean },
}, { timestamps: true });
exports.userInviteSchema = userInviteSchema;
var userInviteCollection = "user.permission";
exports.userInviteCollection = userInviteCollection;


/***/ }),

/***/ "./src/modules/user/invite/route.ts":
/*!******************************************!*\
  !*** ./src/modules/user/invite/route.ts ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var middlewares_1 = __webpack_require__(/*! ../../../middlewares */ "./src/middlewares.ts");
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/user/invite/service.ts");
var selfRealm = 100;
module.exports = function (router) {
    router.post("/user/invite/:space", middlewares_1.authorizeApi, service_1.createUserInviteEndpoint);
    router.get("/user/invite/:space", middlewares_1.authorizeApi, service_1.getUserInvite);
};


/***/ }),

/***/ "./src/modules/user/invite/service.ts":
/*!********************************************!*\
  !*** ./src/modules/user/invite/service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserInvite = exports.registerUserInvite = exports.createUserInviteEndpoint = void 0;
var Helper = __importStar(__webpack_require__(/*! ./helper */ "./src/modules/user/invite/helper.ts"));
var selfRealm = 100;
var createUserInviteEndpoint = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userInvite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.user_id;
                return [4, Helper.updateUserInvite(req.params.space, req.body, userId)];
            case 1:
                userInvite = _a.sent();
                res.status(200);
                res.send(userInvite);
                res.end();
                return [2];
        }
    });
}); };
exports.createUserInviteEndpoint = createUserInviteEndpoint;
var registerUserInvite = function (space, companyId, userId, email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Helper.registerUserInvite(space, companyId, userId, email)];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.registerUserInvite = registerUserInvite;
var getUserInvite = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userInviteList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.user_id;
                return [4, Helper.getUserInvite(req.params.space)];
            case 1:
                userInviteList = _a.sent();
                res.status(200);
                res.send(userInviteList);
                res.end();
                return [2];
        }
    });
}); };
exports.getUserInvite = getUserInvite;


/***/ }),

/***/ "./src/modules/user/model.ts":
/*!***********************************!*\
  !*** ./src/modules/user/model.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.userCollection = exports.userSchema = void 0;
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    given_name: { type: String },
    family_name: { type: String },
    name: { type: String },
    nickname: { type: String },
    email: { type: String },
    resolver: { type: String },
}, { timestamps: true });
exports.userSchema = userSchema;
var userCollection = "user";
exports.userCollection = userCollection;


/***/ }),

/***/ "./src/modules/user/route.ts":
/*!***********************************!*\
  !*** ./src/modules/user/route.ts ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var handler_1 = __webpack_require__(/*! ../../handler */ "./src/handler.ts");
var middlewares_1 = __webpack_require__(/*! ../../middlewares */ "./src/middlewares.ts");
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/user/service.ts");
var selfRealm = 100;
module.exports = function (router) {
    router.post("/user/:realmId/authorize_user", (0, handler_1.asyncHandler)(service_1.validateSession));
    router.get("/user/:realmId", middlewares_1.authorizeApi, (0, handler_1.asyncHandler)(service_1.getUsers));
    router.get("/user/token/local", middlewares_1.authorizeApiOneauth, (0, handler_1.asyncHandler)(service_1.getLocalToken));
};


/***/ }),

/***/ "./src/modules/user/service.ts":
/*!*************************************!*\
  !*** ./src/modules/user/service.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserById = exports.getUserByEmail = exports.getLocalTokenImpl = exports.getLocalToken = exports.getUsers = exports.validateSession = void 0;
var Helper = __importStar(__webpack_require__(/*! ./helper */ "./src/modules/user/helper.ts"));
var userInviteHelper = __importStar(__webpack_require__(/*! ../user/invite/helper */ "./src/modules/user/invite/helper.ts"));
var companyHelper = __importStar(__webpack_require__(/*! ../company/helper */ "./src/modules/company/helper.ts"));
var helper_1 = __webpack_require__(/*! ../auth/helper */ "./src/modules/auth/helper.ts");
var selfRealm = 100;
var validateSession = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Helper.validateSession(req.body.accessToken, req.body.refreshToken, req.params.realmId)];
            case 1:
                session = _a.sent();
                if (!session) {
                    res.status(404);
                    res.send("Session not found");
                    res.end();
                    return [2];
                }
                res.status(200);
                res.send(session);
                res.end();
                return [2];
        }
    });
}); };
exports.validateSession = validateSession;
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.user_id;
                return [4, Helper.getUsers()];
            case 1:
                userList = _a.sent();
                res.status(200);
                res.send(userList);
                res.end();
                return [2];
        }
    });
}); };
exports.getUsers = getUsers;
var getLocalToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, appToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessToken = req.headers["authorization"];
                if (!accessToken) {
                    return [2, res.sendStatus(401)];
                }
                return [4, (0, exports.getLocalTokenImpl)(req.user.user_id, accessToken)];
            case 1:
                appToken = _a.sent();
                res.status(200);
                res.send({ token: appToken });
                res.end();
                return [2];
        }
    });
}); };
exports.getLocalToken = getLocalToken;
var getLocalTokenImpl = function (userId, accessToken) { return __awaiter(void 0, void 0, void 0, function () {
    var userInviteList, companyIdList, companyList, companyReferenceList, claims;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, userInviteHelper.getUserInviteByUserId(userId)];
            case 1:
                userInviteList = _a.sent();
                companyIdList = [];
                userInviteList.forEach(function (item) {
                    companyIdList.push(item.companyId);
                });
                return [4, companyHelper.getCompanyByIdList(companyIdList)];
            case 2:
                companyList = _a.sent();
                companyReferenceList = [];
                companyList.forEach(function (item) {
                    companyReferenceList.push(item.reference);
                });
                claims = {
                    accessToken: accessToken,
                    space: companyReferenceList,
                    companyId: companyIdList,
                };
                return [2, (0, helper_1.encodeAppToken)(claims)];
        }
    });
}); };
exports.getLocalTokenImpl = getLocalTokenImpl;
var getUserByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Helper.getUserByEmail(email)];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getUserByEmail = getUserByEmail;
var getUserById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Helper.getUserById(id)];
            case 1: return [2, _a.sent()];
        }
    });
}); };
exports.getUserById = getUserById;


/***/ }),

/***/ "./src/route.ts":
/*!**********************!*\
  !*** ./src/route.ts ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var express = __webpack_require__(/*! express */ "express");
var router = express.Router();
router.get("/", function (_, res) {
    res.send("v1.0.0");
    res.end();
});
__webpack_require__(/*! ./modules/hello/route */ "./src/modules/hello/route.ts")(router);
__webpack_require__(/*! ./modules/auth/route */ "./src/modules/auth/route.ts")(router);
__webpack_require__(/*! ./modules/user/route */ "./src/modules/user/route.ts")(router);
__webpack_require__(/*! ./modules/user/invite/route */ "./src/modules/user/invite/route.ts")(router);
__webpack_require__(/*! ./modules/company/route */ "./src/modules/company/route.ts")(router);
__webpack_require__(/*! ./modules/universal/route */ "./src/modules/universal/route.ts")(router);
module.exports = router;


/***/ }),

/***/ "./src/specs/domains/fragment.spec.ts":
/*!********************************************!*\
  !*** ./src/specs/domains/fragment.spec.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentChildren = exports.fragmentSpec = void 0;
exports.fragmentSpec = {
    "name": {
        "type": "string",
        "required": true
    },
    "latestContent": {
        "type": "string",
        "required": false
    },
    "storythreadReference": {
        "type": "string",
        "required": true,
        "parent": "storythread"
    },
    "labels": {
        "type": "array",
        "required": true,
        "schema": {
            "type": "object",
            "schema": {
                "label": {
                    "type": "string",
                    "parent": "storythread",
                    "required": true
                },
                "value": {
                    "type": "string"
                }
            }
        }
    },
    "test": {
        "type": "array",
        "required": true,
        "schema": {
            "type": "string",
            "parent": "storythread"
        }
    },
    "colors": {
        "type": "array",
        "required": false,
        "schema": {
            "type": "number"
        }
    }
};
exports.fragmentChildren = ["fragmentComment", "fragmentVersion"];


/***/ }),

/***/ "./src/specs/domains/fragmentComment.spec.ts":
/*!***************************************************!*\
  !*** ./src/specs/domains/fragmentComment.spec.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentCommentSpec = void 0;
exports.fragmentCommentSpec = {
    "fragmentId": {
        "type": "string",
        "required": true
    },
    "fragmentVersionId": {
        "type": "string",
        "required": true
    },
    "mode": {
        "type": "string",
        "required": true
    },
    "userPrompt": {
        "type": "string",
        "required": true
    },
    "content": {
        "type": "string",
        "required": false
    }
};


/***/ }),

/***/ "./src/specs/domains/fragmentVersion.spec.ts":
/*!***************************************************!*\
  !*** ./src/specs/domains/fragmentVersion.spec.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fragmentVersionSpec = void 0;
exports.fragmentVersionSpec = {
    "fragmentId": {
        "type": "string",
        "required": true
    },
    "content": {
        "type": "string",
        "required": true
    },
    "versionTag": {
        "type": "string",
        "required": false
    },
    "userNote": {
        "type": "string",
        "required": false
    }
};


/***/ }),

/***/ "./src/specs/domains/index.ts":
/*!************************************!*\
  !*** ./src/specs/domains/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.childrenMap = exports.specsMap = void 0;
var fragment_spec_1 = __webpack_require__(/*! ./fragment.spec */ "./src/specs/domains/fragment.spec.ts");
var fragmentComment_spec_1 = __webpack_require__(/*! ./fragmentComment.spec */ "./src/specs/domains/fragmentComment.spec.ts");
var fragmentVersion_spec_1 = __webpack_require__(/*! ./fragmentVersion.spec */ "./src/specs/domains/fragmentVersion.spec.ts");
var storythread_spec_1 = __webpack_require__(/*! ./storythread.spec */ "./src/specs/domains/storythread.spec.ts");
var user_spec_1 = __webpack_require__(/*! ./user.spec */ "./src/specs/domains/user.spec.ts");
exports.specsMap = {
    user: user_spec_1.userSpec,
    fragment: fragment_spec_1.fragmentSpec,
    fragmentComment: fragmentComment_spec_1.fragmentCommentSpec,
    fragmentVersion: fragmentVersion_spec_1.fragmentVersionSpec,
    storythread: storythread_spec_1.storythreadSpec
};
exports.childrenMap = {
    fragment: fragment_spec_1.fragmentChildren,
    storythread: storythread_spec_1.storythreadChildren
};


/***/ }),

/***/ "./src/specs/domains/storythread.spec.ts":
/*!***********************************************!*\
  !*** ./src/specs/domains/storythread.spec.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.storythreadChildren = exports.storythreadSpec = void 0;
exports.storythreadSpec = {
    "title": {
        "type": "string",
        "required": true
    },
    "description": {
        "type": "string",
        "required": false
    }
};
exports.storythreadChildren = ["fragment"];


/***/ }),

/***/ "./src/specs/domains/user.spec.ts":
/*!****************************************!*\
  !*** ./src/specs/domains/user.spec.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.userSpec = void 0;
exports.userSpec = {
    "name": {
        "type": "string",
        "required": true
    },
    "profile": {
        "type": "object",
        "required": true,
        "schema": {
            "age": {
                "type": "number"
            },
            "bio": {
                "type": "string"
            },
            "address": {
                "type": "object",
                "required": true,
                "schema": {
                    "city": {
                        "required": true,
                        "type": "string"
                    },
                    "zip": {
                        "type": "number"
                    }
                }
            }
        }
    },
    "tags": {
        "type": "array",
        "required": true,
        "schema": {
            "type": "object",
            "schema": {
                "label": {
                    "required": true,
                    "type": "string"
                },
                "value": {
                    "type": "string"
                }
            }
        }
    }
};


/***/ }),

/***/ "./src/startup.ts":
/*!************************!*\
  !*** ./src/startup.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initializeSequences = void 0;
var service_1 = __webpack_require__(/*! ./modules/sequence/service */ "./src/modules/sequence/service.ts");
var initializeSequences = function () {
    (0, service_1.create_sequence)("assetId", null, 1);
    (0, service_1.create_sequence)("companyId", null, 1);
};
exports.initializeSequences = initializeSequences;


/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!******************************************************!*\
  !*** ./node_modules/webpack/hot/log-apply-result.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!*****************************************!*\
  !*** ./node_modules/webpack/hot/log.js ***!
  \*****************************************/
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	}
	return stack;
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!***********************************************!*\
  !*** ./node_modules/webpack/hot/poll.js?1000 ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?1000";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/* globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.slice(1) || 0;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	/**
	 * @param {boolean=} fromUpdate true when called from update
	 */
	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),

/***/ "./src/lib/authutils.js":
/*!******************************!*\
  !*** ./src/lib/authutils.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { AuthenticationError } = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");

const isUnauthorized = (user) => {
  if (!user) {
    return new AuthenticationError("Not authorized to access this content");
  }
  return false;
};

module.exports = { isUnauthorized };


/***/ }),

/***/ "./src/modules/asset/index.js":
/*!************************************!*\
  !*** ./src/modules/asset/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { gql } = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const { assetCollection, assetSchema } = __webpack_require__(/*! ./model */ "./src/modules/asset/model.js");
const { getGlobalCollection } = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
const { isUnauthorized } = __webpack_require__(/*! ../../lib/authutils */ "./src/lib/authutils.js");
const { nextval } = __webpack_require__(/*! ../sequence/service */ "./src/modules/sequence/service.ts");

const typeDefs = gql`
  extend type Query {
    asset(assetId: String!): Asset
    assetById(id: ID!): Asset
    assets: [Asset]
  }

  extend type Mutation {
    updateAsset(payload: AssetPayload): Asset
    createAsset(payload: AssetPayload, addition: AssetAdditionPayload): Asset
  }

  input AssetPayload {
    id: String
    name: String
    section: JSON
    featuredTitle: String
    featuredSubtitle: String
    hero: JSON
    jwtPassword: String
    productionMode: Boolean
  }

  input AssetAdditionPayload {
    email: String
  }

  type Asset {
    id: ID!
    name: String
    section: JSON
    featuredTitle: String
    featuredSubtitle: String
    hero: JSON
    jwtPassword: String
    productionMode: Boolean
    assetId: String
  }
`;

const resolvers = {
  Query: {
    asset: async (_, { assetId }, { user }) => {
      // if (!user) {
      //   return new AuthenticationError('Not authorized to access this content');
      // }
      const model = getGlobalCollection(assetCollection, assetSchema);
      return await model.findOne({ assetId });
    },
    assets: async () => {
      // if (!user) {
      //   return new AuthenticationError('Not authorized to access this content');
      // }
      const model = getGlobalCollection(assetCollection, assetSchema);
      return await model.find();
    },
  },

  Mutation: {
    updateAsset: async (_, args, { user }) => {
      const model = getGlobalCollection(assetCollection, assetSchema);
      if (args.payload.id) {
        return await model.findByIdAndUpdate(args.payload.id, args.payload, {
          new: true,
        });
      } else if (args.payload.assetId) {
        return await model.findOneAndUpdate(
          { assetId: args.payload.assetId },
          args.payload,
          {
            new: true,
          }
        );
      } else {
        const data = new model({
          ...args.payload,
          assetId: `a${await nextval("assetId")}`,
        });
        return await data.save();
      }
    },
    createAsset: async (_, { payload, addition }, { user }) => {
      const model = getGlobalCollection(assetCollection, assetSchema);
      const data = new model({
        ...payload,
        assetId: `a${await nextval("assetId")}`,
      });
      console.log(
        `user account needs to be setup for ${addition.email} in ${payload.name}`
      );
      return await data.save();
    },
  },
};

module.exports = { typeDefs, resolvers };


/***/ }),

/***/ "./src/modules/asset/model.js":
/*!************************************!*\
  !*** ./src/modules/asset/model.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const Schema = mongoose.Schema;
const assetSchema = new Schema(
  {
    name: { type: String },
    section: { type: Array },
    featuredTitle: { type: String },
    featuredSubtitle: { type: String },
    jwtPassword: { type: String },
    productionMode: { type: Boolean, default: false },
    assetId: { type: String },
    hero: { type: Object },
  },
  { timestamps: true }
);

const assetCollection = "asset";

module.exports = { assetSchema, assetCollection };


/***/ }),

/***/ "./src/modules/gql-scalar/index.js":
/*!*****************************************!*\
  !*** ./src/modules/gql-scalar/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { gql, AuthenticationError } = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const GraphQLJSON = __webpack_require__(/*! graphql-type-json */ "graphql-type-json");

const typeDefs = gql`
  scalar JSON
`;

const resolvers = {
  JSON: GraphQLJSON,
};

module.exports = { typeDefs, resolvers };


/***/ }),

/***/ "./src/modules/sequence/model.js":
/*!***************************************!*\
  !*** ./src/modules/sequence/model.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mongoose = __webpack_require__(/*! mongoose */ "mongoose");

const Schema = mongoose.Schema;
const sequenceSchema = new Schema(
  {
    field: { type: String },
    context: { type: String },
    nextval: { type: Number },
    factor: { type: Number },
  },
  { timestamps: true }
);

const sequenceCollection = 'sequence';

module.exports = { sequenceSchema, sequenceCollection };


/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("apollo-server-express");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("axios");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),

/***/ "date-fns":
/*!***************************!*\
  !*** external "date-fns" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("date-fns");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),

/***/ "graphql-type-json":
/*!************************************!*\
  !*** external "graphql-type-json" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("graphql-type-json");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "nanoid":
/*!*************************!*\
  !*** external "nanoid" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("nanoid");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("9493bcfabc18f471e90a")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				// inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								}
/******/ 								return setStatus("ready").then(function () {
/******/ 									return updatedModules;
/******/ 								});
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result = newModuleFactory
/******/ 						? getAffectedModuleEffects(moduleId)
/******/ 						: {
/******/ 								type: "disposed",
/******/ 								moduleId: moduleId
/******/ 							};
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err1) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err1,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err1);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./node_modules/webpack/hot/poll.js?1000");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRSxJQUFJO1dBQ047V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBLEVBQUUsMkJBQTJCLGdEQUFnRDtXQUM3RTs7Ozs7VUUxZEE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbGliL2RidXRpbHMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbGliL3ZhbGlkYXRpb24udHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9taWRkbGV3YXJlcy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2F1dGgvaGVscGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvYXV0aC9yb3V0ZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2F1dGgvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2NvbXBhbnkvaGVscGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvY29tcGFueS9tb2RlbC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2NvbXBhbnkvcm91dGUudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9jb21wYW55L3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9oZWxsby9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9oZWxsby9yb3V0ZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2hlbGxvL3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9wZXJtaXNzaW9uL2hlbHBlci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3NlcXVlbmNlL3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9zZXNzaW9uL2luZGV4LnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvc2Vzc2lvbi9tb2RlbC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VuaXZlcnNhbC9maWx0ZXJCdWlsZGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdW5pdmVyc2FsL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdW5pdmVyc2FsL3NjaGVtYVZhbGlkYXRvci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VuaXZlcnNhbC9zZXJ2aWNlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdW5pdmVyc2FsL3R5cGVJbmZlcmVuY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2hlbHBlci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2ludml0ZS9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2ludml0ZS9tb2RlbC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvaW52aXRlL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdXNlci9pbnZpdGUvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdXNlci9zZXJ2aWNlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3NwZWNzL2RvbWFpbnMvZnJhZ21lbnQuc3BlYy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9zcGVjcy9kb21haW5zL2ZyYWdtZW50Q29tbWVudC5zcGVjLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3NwZWNzL2RvbWFpbnMvZnJhZ21lbnRWZXJzaW9uLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3BlY3MvZG9tYWlucy9pbmRleC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9zcGVjcy9kb21haW5zL3N0b3J5dGhyZWFkLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3BlY3MvZG9tYWlucy91c2VyLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3RhcnR1cC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9sb2ctYXBwbHktcmVzdWx0LmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy5qcyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9wb2xsLmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL2xpYi9hdXRodXRpbHMuanMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9hc3NldC9pbmRleC5qcyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2Fzc2V0L21vZGVsLmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvZ3FsLXNjYWxhci9pbmRleC5qcyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3NlcXVlbmNlL21vZGVsLmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJheGlvc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiYmNyeXB0XCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJkYXRlLWZuc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZ3JhcGhxbC10eXBlLWpzb25cIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImpzb253ZWJ0b2tlblwiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcIm5hbm9pZFwiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwidXVpZFwiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJmc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IHVwZGF0ZSBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0IHVwZGF0ZSBtYW5pZmVzdCBmaWxlbmFtZSIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvaG90IG1vZHVsZSByZXBsYWNlbWVudCIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvcmVxdWlyZSBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYXN5bmNIYW5kbGVyID0gdm9pZCAwO1xudmFyIGFzeW5jSGFuZGxlciA9IGZ1bmN0aW9uIChmbikgeyByZXR1cm4gZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmbihyZXEsIHJlcywgbmV4dCkpLmNhdGNoKG5leHQpO1xufTsgfTtcbmV4cG9ydHMuYXN5bmNIYW5kbGVyID0gYXN5bmNIYW5kbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEdsb2JhbENvbGxlY3Rpb25CeU5hbWUgPSBleHBvcnRzLmdldENvbGxlY3Rpb25CeU5hbWUgPSBleHBvcnRzLmdldEdsb2JhbENvbGxlY3Rpb24gPSBleHBvcnRzLmdldENvbGxlY3Rpb24gPSB2b2lkIDA7XG52YXIgbW9uZ29vc2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibW9uZ29vc2VcIikpO1xudmFyIGdldENvbGxlY3Rpb24gPSBmdW5jdGlvbiAocmVhbG0sIGNvbGxlY3Rpb24sIHNjaGVtYSkge1xuICAgIHZhciBkYiA9IG1vbmdvb3NlXzEuZGVmYXVsdC5jb25uZWN0aW9uLnVzZURiKFwiZWNob19cIi5jb25jYXQocmVhbG0pKTtcbiAgICByZXR1cm4gZGIubW9kZWwoY29sbGVjdGlvbiwgc2NoZW1hKTtcbn07XG5leHBvcnRzLmdldENvbGxlY3Rpb24gPSBnZXRDb2xsZWN0aW9uO1xudmFyIGdldEdsb2JhbENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc2NoZW1hKSB7XG4gICAgdmFyIGRiID0gbW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3Rpb24udXNlRGIoXCJlY2hvXCIpO1xuICAgIHJldHVybiBkYi5tb2RlbChjb2xsZWN0aW9uLCBzY2hlbWEpO1xufTtcbmV4cG9ydHMuZ2V0R2xvYmFsQ29sbGVjdGlvbiA9IGdldEdsb2JhbENvbGxlY3Rpb247XG52YXIgZGVmYXVsdFNjaGVtYSA9IG5ldyBtb25nb29zZV8xLmRlZmF1bHQuU2NoZW1hKHt9LCB7IHN0cmljdDogZmFsc2UgfSk7XG52YXIgZ2V0Q29sbGVjdGlvbkJ5TmFtZSA9IGZ1bmN0aW9uIChyZWFsbSwgY29sbGVjdGlvbk5hbWUpIHtcbiAgICB2YXIgZGIgPSBtb25nb29zZV8xLmRlZmF1bHQuY29ubmVjdGlvbi51c2VEYihcImVjaG9fXCIuY29uY2F0KHJlYWxtKSk7XG4gICAgcmV0dXJuIGRiLm1vZGVsKGNvbGxlY3Rpb25OYW1lLCBkZWZhdWx0U2NoZW1hLCBjb2xsZWN0aW9uTmFtZSk7XG59O1xuZXhwb3J0cy5nZXRDb2xsZWN0aW9uQnlOYW1lID0gZ2V0Q29sbGVjdGlvbkJ5TmFtZTtcbnZhciBnZXRHbG9iYWxDb2xsZWN0aW9uQnlOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gICAgdmFyIGRiID0gbW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3Rpb24udXNlRGIoXCJlY2hvXCIpO1xuICAgIHJldHVybiBkYi5tb2RlbChjb2xsZWN0aW9uTmFtZSwgZGVmYXVsdFNjaGVtYSwgY29sbGVjdGlvbk5hbWUpO1xufTtcbmV4cG9ydHMuZ2V0R2xvYmFsQ29sbGVjdGlvbkJ5TmFtZSA9IGdldEdsb2JhbENvbGxlY3Rpb25CeU5hbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMgPSB2b2lkIDA7XG52YXIgdmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMgPSBmdW5jdGlvbiAocmVzLCBkYXRhLCBtYW5kYXRvcnlGaWVsZHMpIHtcbiAgICB2YXIgbWlzc2luZ0ZpZWxkcyA9IFtdO1xuICAgIG1hbmRhdG9yeUZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZE5hbWUpIHtcbiAgICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KGZpZWxkTmFtZSkpIHtcbiAgICAgICAgICAgIG1pc3NpbmdGaWVsZHMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG1pc3NpbmdGaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXMuc3RhdHVzKDQwMCk7XG4gICAgcmVzLnNlbmQoe1xuICAgICAgICBlcnJvcjogeyBtaXNzaW5nRmllbGRzOiBtaXNzaW5nRmllbGRzIH0sXG4gICAgfSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5leHBvcnRzLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzID0gdmFsaWRhdGVNYW5kYXRvcnlGaWVsZHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmlmIChtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyLnN0b3AoKTsgfSk7XG59XG52YXIgQXBvbGxvU2VydmVyID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKS5BcG9sbG9TZXJ2ZXI7XG52YXIgbWlkZGxld2FyZXNfMSA9IHJlcXVpcmUoXCIuL21pZGRsZXdhcmVzXCIpO1xudmFyIG1vbmdvb3NlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIm1vbmdvb3NlXCIpKTtcbnZhciBzdGFydHVwXzEgPSByZXF1aXJlKFwiLi9zdGFydHVwXCIpO1xudmFyIGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcbnZhciBjb3JzID0gcmVxdWlyZShcImNvcnNcIik7XG52YXIgQXBpUm91dGUgPSByZXF1aXJlKFwiLi9yb3V0ZVwiKTtcbnZhciBncWxTY2FsYXJTY2hlbWEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL2dxbC1zY2FsYXJcIik7XG52YXIgYXNzZXRTY2hlbWEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL2Fzc2V0XCIpO1xudmFyIHNlc3Npb25TY2hlbWEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL3Nlc3Npb25cIik7XG52YXIgdXNlclNjaGVtYSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvdXNlclwiKTtcbnZhciBkYXRhYmFzZVVyaSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfVVJJIHx8IFwibW9uZ29kYjovLzEyNy4wLjAuMToyNzAxN1wiO1xubW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3QoZGF0YWJhc2VVcmksIHt9KTtcbm1vbmdvb3NlXzEuZGVmYXVsdC5wbHVyYWxpemUodW5kZWZpbmVkKTtcbnZhciBhcHAgPSBleHByZXNzKCk7XG52YXIgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG4gICAgdHlwZURlZnM6IFtcbiAgICAgICAgZ3FsU2NhbGFyU2NoZW1hLnR5cGVEZWZzLFxuICAgICAgICBhc3NldFNjaGVtYS50eXBlRGVmcyxcbiAgICAgICAgc2Vzc2lvblNjaGVtYS50eXBlRGVmcyxcbiAgICAgICAgdXNlclNjaGVtYS50eXBlRGVmcyxcbiAgICBdLFxuICAgIHJlc29sdmVyczogW1xuICAgICAgICBncWxTY2FsYXJTY2hlbWEucmVzb2x2ZXJzLFxuICAgICAgICBhc3NldFNjaGVtYS5yZXNvbHZlcnMsXG4gICAgICAgIHNlc3Npb25TY2hlbWEucmVzb2x2ZXJzLFxuICAgICAgICB1c2VyU2NoZW1hLnJlc29sdmVycyxcbiAgICBdLFxuICAgIGNvbnRleHQ6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgcmVxID0gX2EucmVxLCByZXMgPSBfYS5yZXM7XG4gICAgICAgIHZhciBhdXRoU3RyaW5nID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiB8fCBcIlwiO1xuICAgICAgICB2YXIgYXV0aFBhcnRzID0gYXV0aFN0cmluZy5zcGxpdChcIiBcIik7XG4gICAgICAgIHZhciB0b2tlbiA9IFwiXCI7XG4gICAgICAgIHZhciB1c2VyID0gbnVsbDtcbiAgICAgICAgdmFyIGFzc2V0ID0gXCJcIjtcbiAgICAgICAgaWYgKGF1dGhQYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRva2VuID0gYXV0aFBhcnRzWzFdO1xuICAgICAgICAgICAgYXNzZXQgPSBhdXRoUGFydHNbMF07XG4gICAgICAgICAgICB1c2VyID0gKDAsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplKSh0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdXNlcjogdXNlciwgdG9rZW46IHRva2VuLCBhc3NldDogYXNzZXQgfTtcbiAgICB9LFxuICAgIGludHJvc3BlY3Rpb246IHRydWUsXG4gICAgcGxheWdyb3VuZDogdHJ1ZSxcbn0pO1xuc2VydmVyLnN0YXJ0KCkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiBzZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHsgYXBwOiBhcHAgfSk7IH0pO1xuYXBwLnVzZShjb3JzKCkpO1xuYXBwLmdldChcIi9oZWxsb1wiLCBmdW5jdGlvbiAoXywgcmVzKSB7XG4gICAgcmVzLnNlbmQoXCJiYXNpYyBjb25uZWN0aW9uIHRvIHNlcnZlciB3b3Jrcy4gZGF0YWJhc2UgY29ubmVjdGlvbiBpcyBub3QgdmFsaWRhdGVkXCIpO1xuICAgIHJlcy5lbmQoKTtcbn0pO1xuYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogNTAwMDAwMCB9KSk7XG5hcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7XG4gICAgZXh0ZW5kZWQ6IHRydWUsXG59KSk7XG5hcHAudXNlKFwiL2FwaVwiLCBBcGlSb3V0ZSk7XG5hcHAudXNlKGZ1bmN0aW9uIChfLCByZXMpIHtcbiAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgcmVzLnNlbmQoXCJOb3QgZm91bmRcIik7XG4gICAgcmVzLmVuZCgpO1xufSk7XG5hcHAudXNlKGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnIuc3RhY2spO1xufSk7XG5hcHAubGlzdGVuKHsgcG9ydDogcHJvY2Vzcy5lbnYuUE9SVCB8fCA0MDAwIH0sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY29uc29sZS5sb2coXCJcXHVEODNEXFx1REU4MCBTZXJ2ZXIgcmVhZHkgYXQgaHR0cDovL2xvY2FsaG9zdDpcIi5jb25jYXQocHJvY2Vzcy5lbnYuUE9SVCB8fCA0MDAwKS5jb25jYXQoc2VydmVyLmdyYXBocWxQYXRoKSk7XG59KTtcbigwLCBzdGFydHVwXzEuaW5pdGlhbGl6ZVNlcXVlbmNlcykoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hdXRob3JpemVBcGkgPSBleHBvcnRzLmF1dGhvcml6ZUFwaU9uZWF1dGggPSBleHBvcnRzLmF1dGhvcml6ZSA9IHZvaWQgMDtcbnZhciBmc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7XG52YXIganNvbndlYnRva2VuXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImpzb253ZWJ0b2tlblwiKSk7XG52YXIgaGVscGVyXzEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL2F1dGgvaGVscGVyXCIpO1xudmFyIGF1dGhvcml6ZSA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHZhciBhcHBSb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB2YXIgcHVibGljS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvcHVibGljLnBlbVwiKTtcbiAgICB0cnkge1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBqc29ud2VidG9rZW5fMS5kZWZhdWx0LnZlcmlmeSh0b2tlbiwgcHVibGljS2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59O1xuZXhwb3J0cy5hdXRob3JpemUgPSBhdXRob3JpemU7XG52YXIgYXV0aG9yaXplQXBpT25lYXV0aCA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG9rZW4sIGRhdGEsIGVycl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSByZXEuaGVhZGVyc1tcImF1dGhvcml6YXRpb25cIl07XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zZW5kU3RhdHVzKDQwMSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBoZWxwZXJfMS5kZWNvZGVUb2tlbikodG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5vdXRjb21lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcS51c2VyID0gZGF0YS5jbGFpbXM7XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyXzEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5hdXRob3JpemVBcGlPbmVhdXRoID0gYXV0aG9yaXplQXBpT25lYXV0aDtcbnZhciBhdXRob3JpemVBcGkgPSBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRva2VuLCBkYXRhLCBlcnJfMjtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9kKSB7XG4gICAgICAgIHN3aXRjaCAoX2QubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfZC50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHRva2VuID0gcmVxLmhlYWRlcnNbXCJhdXRob3JpemF0aW9uXCJdO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc2VuZFN0YXR1cyg0MDEpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgaGVscGVyXzEuZGVjb2RlVG9rZW4pKHRva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZGF0YSA9IF9kLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEub3V0Y29tZSB8fFxuICAgICAgICAgICAgICAgICAgICAocmVxLnBhcmFtcy5zcGFjZSAmJiAoISgoX2EgPSBkYXRhLmNsYWltcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBlcm1pc3Npb25zKSB8fCAhKChfYyA9IChfYiA9IGRhdGEuY2xhaW1zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucGVybWlzc2lvbnNbJ0NPTVBBTllfQURNSU4nXSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmluY2x1ZGVzKHJlcS5wYXJhbXMuc3BhY2UpKSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcS51c2VyID0gZGF0YS5jbGFpbXM7XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyXzIgPSBfZC5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyXzIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5hdXRob3JpemVBcGkgPSBhdXRob3JpemVBcGk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVjb2RlQXBwVG9rZW4gPSBleHBvcnRzLmVuY29kZUFwcFRva2VuID0gZXhwb3J0cy5nZXRIYXNoID0gZXhwb3J0cy5kZWNvZGVTZXNzaW9uID0gZXhwb3J0cy5kZWNvZGVUb2tlbiA9IGV4cG9ydHMuZGVsZXRlU2Vzc2lvbkJ5UmVmcmVzaFRva2VuID0gZXhwb3J0cy5kZWxldGVTZXNzaW9uID0gZXhwb3J0cy52YWxpZGF0ZVNlc3Npb24gPSBleHBvcnRzLmdldEFjY2Vzc1Rva2VuID0gZXhwb3J0cy5jcmVhdGVTZXNzaW9uID0gdm9pZCAwO1xudmFyIGJjcnlwdF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJiY3J5cHRcIikpO1xudmFyIHV1aWRfMSA9IHJlcXVpcmUoXCJ1dWlkXCIpO1xudmFyIGZzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImZzXCIpKTtcbnZhciBqc29ud2VidG9rZW5fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwianNvbndlYnRva2VuXCIpKTtcbnZhciBkYXRlX2Zuc18xID0gcmVxdWlyZShcImRhdGUtZm5zXCIpO1xudmFyIG1vZGVsXzEgPSByZXF1aXJlKFwiLi4vc2Vzc2lvbi9tb2RlbFwiKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xudmFyIGFwcFVybCA9IHByb2Nlc3MuZW52LkFQUF9VUkwgfHwgXCJodHRwOi8vbG9jYWxob3N0OjMwMTBcIjtcbnZhciBjcmVhdGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtLCB1c2VyKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXNzaW9uX2lkLCBtb2RlbCwgY2xhaW1zLCBhcHBSb290LCBwcml2YXRlS2V5LCByZWZyZXNoX3Rva2VuO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHNlc3Npb25faWQgPSAoMCwgdXVpZF8xLnY0KSgpO1xuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uKShTdHJpbmcocmVhbG0pLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIGNsYWltcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fbmFtZTogdXNlci5naXZlbl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICBmYW1pbHlfbmFtZTogdXNlci5mYW1pbHlfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBuaWNrbmFtZTogdXNlci5uaWNrbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHVzZXIudHlwZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFwcFJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgICAgICAgICAgIHByaXZhdGVLZXkgPSBmc18xLmRlZmF1bHQucmVhZEZpbGVTeW5jKGFwcFJvb3QgKyBcIi9wcml2YXRlLnBlbVwiKTtcbiAgICAgICAgICAgICAgICByZWZyZXNoX3Rva2VuID0ganNvbndlYnRva2VuXzEuZGVmYXVsdC5zaWduKHtcbiAgICAgICAgICAgICAgICAgICAgcmVhbG06IHJlYWxtLFxuICAgICAgICAgICAgICAgICAgICBpZDogc2Vzc2lvbl9pZCxcbiAgICAgICAgICAgICAgICB9LCB7IGtleTogcHJpdmF0ZUtleSwgcGFzc3BocmFzZTogXCJubzFrbm93c21lXCIgfSwge1xuICAgICAgICAgICAgICAgICAgICBhbGdvcml0aG06IFwiUlMyNTZcIixcbiAgICAgICAgICAgICAgICAgICAgZXhwaXJlc0luOiBcIjhoXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbl9pZDogc2Vzc2lvbl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhaW1zOiBjbGFpbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBpYXQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXQ6ICgwLCBkYXRlX2Zuc18xLmFkZCkobmV3IERhdGUoKSwgeyBob3VyczogOCB9KSxcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHsgc2Vzc2lvbl9pZDogc2Vzc2lvbl9pZCwgcmVmcmVzaF90b2tlbjogcmVmcmVzaF90b2tlbiB9XTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmNyZWF0ZVNlc3Npb24gPSBjcmVhdGVTZXNzaW9uO1xudmFyIGdldEFjY2Vzc1Rva2VuID0gZnVuY3Rpb24gKHJlZnJlc2hUb2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVjb2RlZCwgY2xhaW1zLCBhcHBSb290LCBwcml2YXRlS2V5LCBtb2RlbCwgc2Vzc2lvbiwgcmVmcmVzaFRva2VuRHVyYXRpb24sIGFjY2Vzc190b2tlbjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5kZWNvZGVUb2tlbikocmVmcmVzaFRva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZGVjb2RlZCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRlY29kZWQub3V0Y29tZSB8fFxuICAgICAgICAgICAgICAgICAgICAhZGVjb2RlZC5jbGFpbXMgfHxcbiAgICAgICAgICAgICAgICAgICAgIWRlY29kZWQuY2xhaW1zLnJlYWxtIHx8XG4gICAgICAgICAgICAgICAgICAgICFkZWNvZGVkLmNsYWltcy5pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFpbXMgPSBkZWNvZGVkLmNsYWltcztcbiAgICAgICAgICAgICAgICBhcHBSb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgICAgICAgICAgICAgICBwcml2YXRlS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvcHJpdmF0ZS5wZW1cIik7XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKGNsYWltcy5yZWFsbSwgbW9kZWxfMS5zZXNzaW9uQ29sbGVjdGlvbiwgbW9kZWxfMS5zZXNzaW9uU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmUoeyBzZXNzaW9uX2lkOiBjbGFpbXMuaWQgfSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCgwLCBkYXRlX2Zuc18xLmRpZmZlcmVuY2VJblNlY29uZHMpKHNlc3Npb24uZWF0LCBuZXcgRGF0ZSgpKSA8IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlZnJlc2hUb2tlbkR1cmF0aW9uID0gKDAsIGRhdGVfZm5zXzEuZGlmZmVyZW5jZUluU2Vjb25kcykoc2Vzc2lvbi5lYXQsIG5ldyBEYXRlKCkpID4gNjAgKiA2MCAqIDJcbiAgICAgICAgICAgICAgICAgICAgPyA2MCAqIDYwICogMlxuICAgICAgICAgICAgICAgICAgICA6ICgwLCBkYXRlX2Zuc18xLmRpZmZlcmVuY2VJblNlY29uZHMpKHNlc3Npb24uZWF0LCBuZXcgRGF0ZSgpKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW4gPSBqc29ud2VidG9rZW5fMS5kZWZhdWx0LnNpZ24oc2Vzc2lvbi5jbGFpbXMsIHsga2V5OiBwcml2YXRlS2V5LCBwYXNzcGhyYXNlOiBcIm5vMWtub3dzbWVcIiB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGFsZ29yaXRobTogXCJSUzI1NlwiLFxuICAgICAgICAgICAgICAgICAgICBleHBpcmVzSW46IFwiXCIuY29uY2F0KHJlZnJlc2hUb2tlbkR1cmF0aW9uLCBcInNcIiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBhY2Nlc3NfdG9rZW5dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0QWNjZXNzVG9rZW4gPSBnZXRBY2Nlc3NUb2tlbjtcbnZhciB2YWxpZGF0ZVNlc3Npb24gPSBmdW5jdGlvbiAocmVhbG0sIHNlc3Npb25JZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIHNlc3Npb247XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKFN0cmluZyhyZWFsbSksIG1vZGVsXzEuc2Vzc2lvbkNvbGxlY3Rpb24sIG1vZGVsXzEuc2Vzc2lvblNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgc2Vzc2lvbklkOiBzZXNzaW9uSWQgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBzZXNzaW9uXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZhbGlkYXRlU2Vzc2lvbjtcbnZhciBkZWxldGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtLCBzZXNzaW9uX2lkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbikoU3RyaW5nKHJlYWxtKSwgbW9kZWxfMS5zZXNzaW9uQ29sbGVjdGlvbiwgbW9kZWxfMS5zZXNzaW9uU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmRlbGV0ZU9uZSh7IHNlc3Npb25faWQ6IHNlc3Npb25faWQgfSldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWxldGVTZXNzaW9uID0gZGVsZXRlU2Vzc2lvbjtcbnZhciBkZWxldGVTZXNzaW9uQnlSZWZyZXNoVG9rZW4gPSBmdW5jdGlvbiAocmVhbG0sIHJlZnJlc2hfdG9rZW4pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uKShTdHJpbmcocmVhbG0pLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZGVsZXRlT25lKHsgcmVmcmVzaF90b2tlbjogcmVmcmVzaF90b2tlbiB9KV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlbGV0ZVNlc3Npb25CeVJlZnJlc2hUb2tlbiA9IGRlbGV0ZVNlc3Npb25CeVJlZnJlc2hUb2tlbjtcbnZhciBkZWNvZGVUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXBwUm9vdCwgcHVibGljS2V5LCByZXMsIGVycl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGFwcFJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgICAgICAgICAgIHB1YmxpY0tleSA9IGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoYXBwUm9vdCArIFwiL3B1YmxpYy5wZW1cIik7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBqc29ud2VidG9rZW5fMS5kZWZhdWx0LnZlcmlmeSh0b2tlbiwgcHVibGljS2V5KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBvdXRjb21lOiB0cnVlLCB0b2tlbjogdG9rZW4sIGNsYWltczogcmVzIH1dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycl8xKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHsgb3V0Y29tZTogZmFsc2UsIGVycjogZXJyXzEgfV07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWNvZGVUb2tlbiA9IGRlY29kZVRva2VuO1xudmFyIGRlY29kZVNlc3Npb24gPSBmdW5jdGlvbiAocmVhbG1JZCwgc2Vzc2lvbklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXNzaW9uO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsICgwLCBleHBvcnRzLnZhbGlkYXRlU2Vzc2lvbikocmVhbG1JZCwgc2Vzc2lvbklkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBzZXNzaW9uXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCAoMCwgZXhwb3J0cy5kZWNvZGVUb2tlbikoc2Vzc2lvbi50b2tlbildO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlU2Vzc2lvbiA9IGRlY29kZVNlc3Npb247XG52YXIgZ2V0SGFzaCA9IGZ1bmN0aW9uIChwYXNzd29yZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2FsdDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBiY3J5cHRfMS5kZWZhdWx0LmdlblNhbHQoMTApXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzYWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgYmNyeXB0XzEuZGVmYXVsdC5oYXNoKHBhc3N3b3JkLCBzYWx0KV07XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldEhhc2ggPSBnZXRIYXNoO1xudmFyIGVuY29kZUFwcFRva2VuID0gZnVuY3Rpb24gKGNsYWltcykge1xuICAgIHZhciBhcHBSb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB2YXIgcHJpdmF0ZUtleSA9IGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoYXBwUm9vdCArIFwiL2xvY2FsX3ByaXZhdGUucGVtXCIpO1xuICAgIHZhciB0b2tlbiA9IGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQuc2lnbihjbGFpbXMsIHsga2V5OiBwcml2YXRlS2V5LCBwYXNzcGhyYXNlOiBcImZldmljcnlsXCIgfSwge1xuICAgICAgICBhbGdvcml0aG06IFwiUlMyNTZcIixcbiAgICAgICAgZXhwaXJlc0luOiBcIjEwMGhcIixcbiAgICB9KTtcbiAgICByZXR1cm4gdG9rZW47XG59O1xuZXhwb3J0cy5lbmNvZGVBcHBUb2tlbiA9IGVuY29kZUFwcFRva2VuO1xudmFyIGRlY29kZUFwcFRva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcHBSb290LCBwdWJsaWNLZXksIHJlcywgZXJyXzI7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgYXBwUm9vdCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgICAgICAgICAgcHVibGljS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvbG9jYWxfcHVibGljLnBlbVwiKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHRva2VuLCBwdWJsaWNLZXkpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7IG91dGNvbWU6IHRydWUsIHRva2VuOiB0b2tlbiwgY2xhaW1zOiByZXMgfV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyXzIgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyXzIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBvdXRjb21lOiBmYWxzZSwgZXJyOiBlcnJfMiB9XTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlY29kZUFwcFRva2VuID0gZGVjb2RlQXBwVG9rZW47XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBoYW5kbGVyXzEgPSByZXF1aXJlKFwiLi4vLi4vaGFuZGxlclwiKTtcbnZhciBtaWRkbGV3YXJlc18xID0gcmVxdWlyZShcIi4uLy4uL21pZGRsZXdhcmVzXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3NlcnZpY2VcIik7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgcm91dGVyLnBvc3QoXCIvYXV0aC9hdXRob3JpemVcIiwgKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKHNlcnZpY2VfMS5zaWduaW4pKTtcbiAgICByb3V0ZXIucG9zdChcIi9hdXRoL3Rva2VuXCIsICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEuaXNzdWVUb2tlbikpO1xuICAgIHJvdXRlci5nZXQoXCIvYXV0aC90b2tlbi9kZWNvZGVcIiwgbWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEuZGVjb2RlVG9rZW4pKTtcbiAgICByb3V0ZXIucG9zdChcIi9hdXRoL2xvZ291dFwiLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLmxvZ291dCkpO1xuICAgIHJvdXRlci5nZXQoXCIvYXV0aC9vYS9zZXNzaW9uLzppZFwiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmV0dXJuICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKSgoMCwgc2VydmljZV8xLnZhbGlkYXRlU2Vzc2lvbikoc2VsZlJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xuICAgIHJvdXRlci5kZWxldGUoXCIvYXV0aC9vYS9zZXNzaW9uLzppZFwiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmV0dXJuICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKSgoMCwgc2VydmljZV8xLmRlbGV0ZVNlc3Npb24pKHNlbGZSZWFsbSwgcmVxLCByZXMsIG5leHQpKTtcbiAgICB9KTtcbiAgICByb3V0ZXIuZ2V0KFwiL2F1dGgvb2Evc2Vzc2lvbi86aWQvZGVjb2RlXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICByZXR1cm4gKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKCgwLCBzZXJ2aWNlXzEuZGVjb2RlU2Vzc2lvbikoc2VsZlJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xuICAgIHJvdXRlci5nZXQoXCIvYXV0aC9yZWFsbS86cmVhbG0vc2Vzc2lvbi86aWRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHJldHVybiAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoKDAsIHNlcnZpY2VfMS52YWxpZGF0ZVNlc3Npb24pKHJlcS5wYXJhbXMucmVhbG0sIHJlcSwgcmVzLCBuZXh0KSk7XG4gICAgfSk7XG4gICAgcm91dGVyLmdldChcIi9hdXRoL3JlYWxtLzpyZWFsbS9zZXNzaW9uLzppZC9kZWNvZGVcIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHJldHVybiAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoKDAsIHNlcnZpY2VfMS5kZWNvZGVTZXNzaW9uKShyZXEucGFyYW1zLnJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xuICAgIHJvdXRlci5kZWxldGUoXCIvYXV0aC9yZWFsbS86cmVhbG0vc2Vzc2lvbi86aWRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHJldHVybiAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoKDAsIHNlcnZpY2VfMS5kZWxldGVTZXNzaW9uKShyZXEucGFyYW1zLnJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWNvZGVTZXNzaW9uID0gZXhwb3J0cy5kZWNvZGVUb2tlbiA9IGV4cG9ydHMuZGVsZXRlU2Vzc2lvbiA9IGV4cG9ydHMudmFsaWRhdGVTZXNzaW9uID0gZXhwb3J0cy5sb2dvdXQgPSBleHBvcnRzLmlzc3VlVG9rZW4gPSBleHBvcnRzLnNpZ25pbiA9IHZvaWQgMDtcbnZhciBiY3J5cHRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYmNyeXB0XCIpKTtcbnZhciB2YWxpZGF0aW9uXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL3ZhbGlkYXRpb25cIik7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuLi91c2VyL21vZGVsXCIpO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG52YXIgc2lnbmluID0gZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXlsb2FkLCBtb2RlbCwgdXNlciwgb3V0Y29tZSwgX2EsIHNlc3Npb25faWQsIHJlZnJlc2hfdG9rZW4sIGFjY2Vzc190b2tlbjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVxLmJvZHk7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgdmFsaWRhdGlvbl8xLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzKShyZXMsIHBheWxvYWQsIFtcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmVhbG1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZXNwb25zZV90eXBlXCIsXG4gICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKHBheWxvYWQucmVhbG0sIG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwYXlsb2FkLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvbmVhdXRoXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB1c2VyID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgZXJyb3I6IHsgbWVzc2FnZTogXCJVc2VyIHdpdGggdGhpcyB1c2VyIG5hbWUgZG9lcyBub3QgZXhpc3RcIiB9IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdXNlci5lbWFpbF92ZXJpZmllZCkge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMyk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgZXJyb3I6IHsgbWVzc2FnZTogXCJFbWFpbCBvZiB1c2VyIG5vdCB2ZXJpZmllZFwiIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBiY3J5cHRfMS5kZWZhdWx0LmNvbXBhcmUocGF5bG9hZC5wYXNzd29yZCwgdXNlci5oYXNoKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgb3V0Y29tZSA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIW91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDEpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZCh7IGVycm9yOiB7IG1lc3NhZ2U6IFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5jcmVhdGVTZXNzaW9uKHBheWxvYWQucmVhbG0sIHVzZXIpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBfYSA9IF9iLnNlbnQoKSwgc2Vzc2lvbl9pZCA9IF9hLnNlc3Npb25faWQsIHJlZnJlc2hfdG9rZW4gPSBfYS5yZWZyZXNoX3Rva2VuO1xuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkLnJlc3BvbnNlX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBzZXNzaW9uX2lkOiBzZXNzaW9uX2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5nZXRBY2Nlc3NUb2tlbihyZWZyZXNoX3Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgdG9rZW5fdHlwZTogXCJCZWFyZXJcIiwgYWNjZXNzX3Rva2VuOiBhY2Nlc3NfdG9rZW4sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hfdG9rZW4gfSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5zaWduaW4gPSBzaWduaW47XG52YXIgaXNzdWVUb2tlbiA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF5bG9hZCwgYWNjZXNzX3Rva2VuLCB0b2tlbiwgb3V0Y29tZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVxLmJvZHk7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgdmFsaWRhdGlvbl8xLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzKShyZXMsIHBheWxvYWQsIFtcbiAgICAgICAgICAgICAgICAgICAgXCJncmFudF90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmVhbG1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZWZyZXNoX3Rva2VuXCIsXG4gICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEocGF5bG9hZC5ncmFudF90eXBlID09PSBcInJlZnJlc2hfdG9rZW5cIikpIHJldHVybiBbMywgMl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0QWNjZXNzVG9rZW4ocGF5bG9hZC5yZWZyZXNoX3Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBlcnJvcjogeyBtZXNzYWdlOiBcIlJlZnJlc2ggdG9rZW4gaW52YWxpZCBvciBleHBpcmVkXCIgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyB0b2tlbl90eXBlOiBcIkJlYXJlclwiLCBhY2Nlc3NfdG9rZW46IGFjY2Vzc190b2tlbiB9KTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHJlcS5wYXJhbXMudG9rZW47XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBvdXRjb21lID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChvdXRjb21lKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmlzc3VlVG9rZW4gPSBpc3N1ZVRva2VuO1xudmFyIGxvZ291dCA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF5bG9hZCwgb3V0Y29tZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVxLmJvZHk7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgdmFsaWRhdGlvbl8xLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzKShyZXMsIHBheWxvYWQsIFtcInJlYWxtXCIsIFwicmVmcmVzaF90b2tlblwiXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVsZXRlU2Vzc2lvbkJ5UmVmcmVzaFRva2VuKHBheWxvYWQucmVhbG0sIHBheWxvYWQucmVmcmVzaF90b2tlbildO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIG91dGNvbWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKG91dGNvbWUuZGVsZXRlZENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBlcnJvcjogeyBtZXNzYWdlOiBcIkludmFsaWQgc2Vzc2lvblwiIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgcmVmcmVzaF90b2tlbjogcGF5bG9hZC5yZWZyZXNoX3Rva2VuIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMubG9nb3V0ID0gbG9nb3V0O1xudmFyIHZhbGlkYXRlU2Vzc2lvbiA9IGZ1bmN0aW9uIChyZWFsbUlkLCByZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2Vzc2lvbiwgZXJyXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci52YWxpZGF0ZVNlc3Npb24ocmVhbG1JZCwgcmVxLnBhcmFtcy5pZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJTZXNzaW9uIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBzZXNzaW9uSWQ6IHJlcS5wYXJhbXMuaWQsIHRva2VuOiBzZXNzaW9uLnRva2VuIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDNdO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyXzEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy52YWxpZGF0ZVNlc3Npb24gPSB2YWxpZGF0ZVNlc3Npb247XG52YXIgZGVsZXRlU2Vzc2lvbiA9IGZ1bmN0aW9uIChyZWFsbUlkLCByZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3V0Y29tZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBIZWxwZXIuZGVsZXRlU2Vzc2lvbihzZWxmUmVhbG0sIHJlcS5wYXJhbXMuaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBvdXRjb21lID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChvdXRjb21lLmRlbGV0ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKFwiU2Vzc2lvbiBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgc2Vzc2lvbklkOiByZXEucGFyYW1zLmlkIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVsZXRlU2Vzc2lvbiA9IGRlbGV0ZVNlc3Npb247XG52YXIgZGVjb2RlVG9rZW4gPSBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgIHJlcy5zZW5kKF9fYXNzaWduKHt9LCByZXEudXNlcikpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybiBbMl07XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlVG9rZW4gPSBkZWNvZGVUb2tlbjtcbnZhciBkZWNvZGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtSWQsIHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdXRjb21lLCBlcnJfMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmRlY29kZVNlc3Npb24oc2VsZlJlYWxtLCByZXEucGFyYW1zLmlkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgb3V0Y29tZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIW91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChcIlNlc3Npb24gbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChvdXRjb21lKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJfMiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycl8yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDNdO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlU2Vzc2lvbiA9IGRlY29kZVNlc3Npb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENvbXBhbnlCeUlkTGlzdCA9IGV4cG9ydHMuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZXhwb3J0cy5nZXRDb21wYW55ID0gZXhwb3J0cy51cGRhdGVDb21wYW55ID0gdm9pZCAwO1xudmFyIGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xudmFyIE9ORUFVVEhfQVBJID0gcHJvY2Vzcy5lbnYuT05FQVVUSF9BUEkgfHwgXCJodHRwOi8vbG9jYWxob3N0OjQwMTAvYXBpXCI7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi4vc2VxdWVuY2Uvc2VydmljZVwiKTtcbnZhciB1cGRhdGVDb21wYW55ID0gZnVuY3Rpb24gKGRhdGEsIHVzZXJJZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIHJlc3BvbnNlXzEsIHJlc3BvbnNlLCBfYSwgX2IsIF9jO1xuICAgIHZhciBfZDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9lKSB7XG4gICAgICAgIHN3aXRjaCAoX2UubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS5jb21wYW55Q29sbGVjdGlvbiwgbW9kZWxfMS5jb21wYW55U2NoZW1hKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEuX2lkKSByZXR1cm4gWzMsIDJdO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZEJ5SWRBbmRVcGRhdGUoZGF0YS5faWQsIF9fYXNzaWduKHt9LCBkYXRhKSwgeyBuZXc6IHRydWUsIHVwc2VydDogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VfMSA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlXzFdO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIF9iID0gKF9hID0gbW9kZWwpLmNyZWF0ZTtcbiAgICAgICAgICAgICAgICBfYyA9IFtfX2Fzc2lnbih7fSwgZGF0YSldO1xuICAgICAgICAgICAgICAgIF9kID0ge307XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgc2VydmljZV8xLm5leHR2YWwpKFwiY29tcGFueUlkXCIpXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFs0LCBfYi5hcHBseShfYSwgW19fYXNzaWduLmFwcGx5KHZvaWQgMCwgX2MuY29uY2F0KFsoX2QucmVmZXJlbmNlID0gX2Uuc2VudCgpLCBfZCldKSldKV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgc2VydmljZV8xLmNyZWF0ZV9zZXF1ZW5jZSkoXCJmcmFnbWVudElkXCIsIG51bGwsIDEsIHJlc3BvbnNlLnJlZmVyZW5jZSldO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnVwZGF0ZUNvbXBhbnkgPSB1cGRhdGVDb21wYW55O1xudmFyIGdldENvbXBhbnkgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS5jb21wYW55Q29sbGVjdGlvbiwgbW9kZWxfMS5jb21wYW55U2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldENvbXBhbnkgPSBnZXRDb21wYW55O1xudmFyIGdldENvbXBhbnlCeVJlZmVyZW5jZSA9IGZ1bmN0aW9uIChyZWZlcmVuY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLmNvbXBhbnlDb2xsZWN0aW9uLCBtb2RlbF8xLmNvbXBhbnlTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZ2V0Q29tcGFueUJ5UmVmZXJlbmNlO1xudmFyIGdldENvbXBhbnlCeUlkTGlzdCA9IGZ1bmN0aW9uIChpZExpc3QpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLmNvbXBhbnlDb2xsZWN0aW9uLCBtb2RlbF8xLmNvbXBhbnlTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7IF9pZDogeyAkaW46IGlkTGlzdCB9IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0Q29tcGFueUJ5SWRMaXN0ID0gZ2V0Q29tcGFueUJ5SWRMaXN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbXBhbnlDb2xsZWN0aW9uID0gZXhwb3J0cy5jb21wYW55U2NoZW1hID0gdm9pZCAwO1xudmFyIG1vbmdvb3NlID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpO1xudmFyIFNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYTtcbnZhciBjb21wYW55U2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gICAgbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBkZXNjcmlwdGlvbjogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICByZWZlcmVuY2U6IHsgdHlwZTogTnVtYmVyIH0sXG4gICAgY3VycmVuY3k6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgbnVtYmVyRm9ybWF0OiB7IHR5cGU6IFN0cmluZyB9LFxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xuZXhwb3J0cy5jb21wYW55U2NoZW1hID0gY29tcGFueVNjaGVtYTtcbnZhciBjb21wYW55Q29sbGVjdGlvbiA9IFwiY29tcGFueVwiO1xuZXhwb3J0cy5jb21wYW55Q29sbGVjdGlvbiA9IGNvbXBhbnlDb2xsZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbWlkZGxld2FyZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9taWRkbGV3YXJlc1wiKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHJvdXRlci5wdXQoXCIvY29tcGFueVwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLnVwZGF0ZUNvbXBhbnkpO1xuICAgIHJvdXRlci5nZXQoXCIvY29tcGFueVwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLmdldENvbXBhbnkpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENvbXBhbnlCeVJlZmVyZW5jZSA9IGV4cG9ydHMuZ2V0Q29tcGFueSA9IGV4cG9ydHMudXBkYXRlQ29tcGFueSA9IHZvaWQgMDtcbnZhciBIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vaGVscGVyXCIpKTtcbnZhciB1c2VySW52aXRlU2VydmljZSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vdXNlci9pbnZpdGUvc2VydmljZVwiKSk7XG52YXIgUGVybWlzc2lvbkhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vcGVybWlzc2lvbi9oZWxwZXJcIikpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciB1cGRhdGVDb21wYW55ID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySWQsIGNvbXBhbnk7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgdXNlcklkID0gcmVxLnVzZXIudXNlcl9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci51cGRhdGVDb21wYW55KHJlcS5ib2R5LCB1c2VySWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjb21wYW55ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGVTZXJ2aWNlLnJlZ2lzdGVyVXNlckludml0ZShjb21wYW55Ll9kb2MucmVmZXJlbmNlLCBjb21wYW55Ll9kb2MuX2lkLCB1c2VySWQsIHJlcS51c2VyLmVtYWlsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIFBlcm1pc3Npb25IZWxwZXIuYWRkUm9sZShyZXEudXNlci5lbWFpbCwgY29tcGFueS5fZG9jLnJlZmVyZW5jZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoY29tcGFueSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy51cGRhdGVDb21wYW55ID0gdXBkYXRlQ29tcGFueTtcbnZhciBnZXRDb21wYW55ID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySWQsIGNvbXBhbnlMaXN0O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IHJlcS51c2VyLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0Q29tcGFueSgpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjb21wYW55TGlzdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoY29tcGFueUxpc3QpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0Q29tcGFueSA9IGdldENvbXBhbnk7XG52YXIgZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlZmVyZW5jZSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBIZWxwZXIuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlKHJlZmVyZW5jZSldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRDb21wYW55QnlSZWZlcmVuY2UgPSBnZXRDb21wYW55QnlSZWZlcmVuY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudHJhaW5fc2ltaWxhcml0eV9tb2RlbCA9IHZvaWQgMDtcbnZhciBheGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbnZhciBPTkVBVVRIX0FQSSA9IHByb2Nlc3MuZW52Lk9ORUFVVEhfQVBJIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo0MDEwL2FwaVwiO1xudmFyIEFJX0FQSSA9IHByb2Nlc3MuZW52LkFJX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMy9hcGlcIjtcbnZhciB0cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gZnVuY3Rpb24gKHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIFsyLCB7IFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiIH1dO1xuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwgPSB0cmFpbl9zaW1pbGFyaXR5X21vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgaGFuZGxlcl8xID0gcmVxdWlyZShcIi4uLy4uL2hhbmRsZXJcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHJvdXRlci5nZXQoXCIvYWRtaW5cIiwgZnVuY3Rpb24gKF8sIHJlcykge1xuICAgICAgICByZXMuc2VuZChcImJhc2ljIGNvbm5lY3Rpb24gdG8gc2VydmVyIHdvcmtzLiBkYXRhYmFzZSBjb25uZWN0aW9uIGlzIG5vdCB2YWxpZGF0ZWRcIik7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICB9KTtcbiAgICByb3V0ZXIuZ2V0KFwiL2FkbWluLzpzcGFjZS90cmFpblwiLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwpKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gdm9pZCAwO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciB0cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBub3RlO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci50cmFpbl9zaW1pbGFyaXR5X21vZGVsKHJlcS5wYXJhbXMuc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBub3RlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChub3RlKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwgPSB0cmFpbl9zaW1pbGFyaXR5X21vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZFJvbGUgPSB2b2lkIDA7XG52YXIgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG52YXIgT05FQVVUSF9BUEkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAxMC9hcGlcIjtcbnZhciBPTkVBVVRIX0FQSV9LRVkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSV9LRVkgfHwgXCIxZDk1MjRhNi0zMGRmLTRiM2MtOTQwMi01MDNmNDAxMTg5NmNcIjtcbnZhciBhZGRSb2xlID0gZnVuY3Rpb24gKGVtYWlsLCBjb21wYW55SWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3BvbnNlLCBlcnJfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBheGlvcy5wb3N0KFwiXCIuY29uY2F0KE9ORUFVVEhfQVBJLCBcIi8yMTIvYWRtaW4vcGVybWlzc2lvblwiKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBcIkFERFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVOYW1lOiBcIkNPTVBBTllfQURNSU5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiBjb21wYW55SWRcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb246IE9ORUFVVEhfQVBJX0tFWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwge31dO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlLmRhdGEgfHwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5hZGRSb2xlID0gYWRkUm9sZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZXNldHZhbCA9IGV4cG9ydHMubmV4dHZhbCA9IGV4cG9ydHMuY3JlYXRlX3NlcXVlbmNlID0gdm9pZCAwO1xudmFyIF9hID0gcmVxdWlyZSgnLi9tb2RlbCcpLCBzZXF1ZW5jZUNvbGxlY3Rpb24gPSBfYS5zZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hID0gX2Euc2VxdWVuY2VTY2hlbWE7XG52YXIgX2IgPSByZXF1aXJlKCcuLi8uLi9saWIvZGJ1dGlscycpLCBnZXRHbG9iYWxDb2xsZWN0aW9uID0gX2IuZ2V0R2xvYmFsQ29sbGVjdGlvbiwgZ2V0Q29sbGVjdGlvbiA9IF9iLmdldENvbGxlY3Rpb247XG52YXIgY3JlYXRlX3NlcXVlbmNlID0gZnVuY3Rpb24gKGZpZWxkLCBjb250ZXh0LCBmYWN0b3IsIHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgZXhpc3Rpbmdfc2VxdWVuY2U7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZXhpc3Rpbmdfc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nX3NlcXVlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgZXhpc3Rpbmdfc2VxdWVuY2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQgfSwgeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQsIGZhY3RvcjogZmFjdG9yLCBuZXh0dmFsOiAxIH0sIHsgdXBzZXJ0OiB0cnVlLCBuZXc6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5jcmVhdGVfc2VxdWVuY2UgPSBjcmVhdGVfc2VxdWVuY2U7XG52YXIgbmV4dHZhbCA9IGZ1bmN0aW9uIChmaWVsZCwgY29udGV4dCwgc3BhY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsLCBzZXF1ZW5jZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBpZiAoc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBnZXRDb2xsZWN0aW9uKHNwYWNlLCBzZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0R2xvYmFsQ29sbGVjdGlvbihzZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgZmllbGQ6IGZpZWxkLCBjb250ZXh0OiBjb250ZXh0IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoISFzZXF1ZW5jZSkgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBleHBvcnRzLmNyZWF0ZV9zZXF1ZW5jZSkoZmllbGQsIGNvbnRleHQgfHwgbnVsbCwgMSwgc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgZmllbGQ6IGZpZWxkLCBjb250ZXh0OiBjb250ZXh0IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbNCwgbW9kZWwuZmluZE9uZUFuZFVwZGF0ZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9LCB7IG5leHR2YWw6IHNlcXVlbmNlLm5leHR2YWwgKyBzZXF1ZW5jZS5mYWN0b3IgfSwgeyB1cHNlcnQ6IHRydWUsIG5ldzogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgc2VxdWVuY2UubmV4dHZhbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5uZXh0dmFsID0gbmV4dHZhbDtcbnZhciByZXNldHZhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZmllbGQsIGNvbnRleHQsIHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgc2VxdWVuY2U7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCEhc2VxdWVuY2UpIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5jcmVhdGVfc2VxdWVuY2UpKGZpZWxkLCBjb250ZXh0IHx8IG51bGwsIDEsIHNwYWNlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSA0O1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQgfSwgeyBuZXh0dmFsOiB2YWx1ZSB9LCB7IHVwc2VydDogdHJ1ZSwgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnJlc2V0dmFsID0gcmVzZXR2YWw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX21ha2VUZW1wbGF0ZU9iamVjdCA9ICh0aGlzICYmIHRoaXMuX19tYWtlVGVtcGxhdGVPYmplY3QpIHx8IGZ1bmN0aW9uIChjb29rZWQsIHJhdykge1xuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XG4gICAgcmV0dXJuIGNvb2tlZDtcbn07XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZXNvbHZlcnMgPSBleHBvcnRzLnR5cGVEZWZzID0gdm9pZCAwO1xudmFyIGpzb253ZWJ0b2tlbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIikpO1xudmFyIGFwb2xsb19zZXJ2ZXJfZXhwcmVzc18xID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTtcbnZhciBtb2RlbF8xID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG52YXIgbW9kZWxfMiA9IHJlcXVpcmUoXCIuLi91c2VyL21vZGVsXCIpO1xudmFyIGdldENvbGxlY3Rpb24gPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIikuZ2V0Q29sbGVjdGlvbjtcbnZhciBheGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbnZhciBPTkVBVVRIX0FQSSA9IHByb2Nlc3MuZW52Lk9ORUFVVEhfQVBJIHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4MDIwXCI7XG52YXIgdHlwZURlZnMgPSAoMCwgYXBvbGxvX3NlcnZlcl9leHByZXNzXzEuZ3FsKSh0ZW1wbGF0ZU9iamVjdF8xIHx8ICh0ZW1wbGF0ZU9iamVjdF8xID0gX19tYWtlVGVtcGxhdGVPYmplY3QoW1wiXFxuICBleHRlbmQgdHlwZSBRdWVyeSB7XFxuICAgIHNlc3Npb24oaWQ6IElEISwgc3BhY2U6IFN0cmluZyk6IFVzZXJTZXNzaW9uXFxuICB9XFxuXFxuICB0eXBlIFNlc3Npb24ge1xcbiAgICBpZDogSUQhXFxuICAgIHNlc3Npb25JZDogU3RyaW5nIVxcbiAgICB0b2tlbjogU3RyaW5nIVxcbiAgfVxcblxcbiAgdHlwZSBVc2VyU2Vzc2lvbiB7XFxuICAgIGlkOiBJRCFcXG4gICAgZmlyc3ROYW1lOiBTdHJpbmdcXG4gICAgbGFzdE5hbWU6IFN0cmluZ1xcbiAgICBlbWFpbDogU3RyaW5nXFxuICAgIHRva2VuOiBTdHJpbmdcXG4gIH1cXG5cIl0sIFtcIlxcbiAgZXh0ZW5kIHR5cGUgUXVlcnkge1xcbiAgICBzZXNzaW9uKGlkOiBJRCEsIHNwYWNlOiBTdHJpbmcpOiBVc2VyU2Vzc2lvblxcbiAgfVxcblxcbiAgdHlwZSBTZXNzaW9uIHtcXG4gICAgaWQ6IElEIVxcbiAgICBzZXNzaW9uSWQ6IFN0cmluZyFcXG4gICAgdG9rZW46IFN0cmluZyFcXG4gIH1cXG5cXG4gIHR5cGUgVXNlclNlc3Npb24ge1xcbiAgICBpZDogSUQhXFxuICAgIGZpcnN0TmFtZTogU3RyaW5nXFxuICAgIGxhc3ROYW1lOiBTdHJpbmdcXG4gICAgZW1haWw6IFN0cmluZ1xcbiAgICB0b2tlbjogU3RyaW5nXFxuICB9XFxuXCJdKSkpO1xuZXhwb3J0cy50eXBlRGVmcyA9IHR5cGVEZWZzO1xudmFyIG9hU2Vzc2lvbiA9IGZ1bmN0aW9uIChzcGFjZSwgaWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3BvbnNlLCB1c2VyLCBtb2RlbCwgZGF0YSwgZXJyb3JfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDUsICwgNl0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgYXhpb3MuZ2V0KFwiXCIuY29uY2F0KE9ORUFVVEhfQVBJLCBcIi9hdXRoL3NwYWNlL1wiKS5jb25jYXQoc3BhY2UsIFwiL3Nlc3Npb24vXCIpLmNvbmNhdChpZCkpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIShyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkpIHJldHVybiBbMywgM107XG4gICAgICAgICAgICAgICAgdXNlciA9IGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHJlc3BvbnNlLmRhdGEudG9rZW4sIFwiand0c2VjcmV0XCIpO1xuICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgbW9kZWxfMi51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMi51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRCeUlkQW5kVXBkYXRlKHVzZXIudXNlcklkLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdXNlciksIHsgcmVzb2x2ZXI6IFwib25lYXV0aF9zcGFjZVwiIH0pLCB7IG5ldzogdHJ1ZSwgdXBzZXJ0OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IGRhdGEuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBkYXRhLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBkYXRhLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5kYXRhLnRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzMsIDZdO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG52YXIgZW1haWxPckV4dGVyblNlc3Npb24gPSBmdW5jdGlvbiAoc3BhY2UsIHNlc3Npb25JZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIHNlc3Npb24sIGRhdGE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSBnZXRDb2xsZWN0aW9uKHNwYWNlLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IHNlc3Npb25JZDogc2Vzc2lvbklkIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZXNzaW9uID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHNlc3Npb24udG9rZW4sIFwiand0c2VjcmV0XCIpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZGF0YS5maXJzdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZTogZGF0YS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBkYXRhLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IHNlc3Npb24udG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbnZhciByZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgc2Vzc2lvbjogZnVuY3Rpb24gKF8xLCBfYSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgW18xLCBfYV0sIHZvaWQgMCwgZnVuY3Rpb24gKF8sIF9iKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBfYi5pZCwgc3BhY2UgPSBfYi5zcGFjZTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBvYVNlc3Npb24oc3BhY2UsIGlkKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYy5zZW50KCldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSxcbiAgICB9LFxufTtcbmV4cG9ydHMucmVzb2x2ZXJzID0gcmVzb2x2ZXJzO1xudmFyIHRlbXBsYXRlT2JqZWN0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2Vzc2lvbkNvbGxlY3Rpb24gPSBleHBvcnRzLnNlc3Npb25TY2hlbWEgPSB2b2lkIDA7XG52YXIgbW9uZ29vc2UgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7XG52YXIgU2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hO1xudmFyIHNlc3Npb25TY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgICBzZXNzaW9uSWQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgdG9rZW46IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgdHlwZTogeyB0eXBlOiBTdHJpbmcgfSxcbn0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcbmV4cG9ydHMuc2Vzc2lvblNjaGVtYSA9IHNlc3Npb25TY2hlbWE7XG52YXIgc2Vzc2lvbkNvbGxlY3Rpb24gPSBcInNlc3Npb25cIjtcbmV4cG9ydHMuc2Vzc2lvbkNvbGxlY3Rpb24gPSBzZXNzaW9uQ29sbGVjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycyA9IGV4cG9ydHMuYnVpbGRRdWVyeUZyb21GaWx0ZXJzID0gdm9pZCAwO1xudmFyIGJ1aWxkUXVlcnlGcm9tRmlsdGVycyA9IGZ1bmN0aW9uIChxdWVyeVBhcmFtcywgc3BlYykge1xuICAgIHZhciBtb25nb1F1ZXJ5ID0ge307XG4gICAgZm9yICh2YXIgZmllbGQgaW4gcXVlcnlQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZpbHRlclZhbHVlID0gcXVlcnlQYXJhbXNbZmllbGRdO1xuICAgICAgICB2YXIgZmllbGRTcGVjID0gc3BlY1tmaWVsZF07XG4gICAgICAgIGlmICghZmllbGRTcGVjKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIHN3aXRjaCAoZmllbGRTcGVjLmZpbHRlcikge1xuICAgICAgICAgICAgY2FzZSBcImxpa2VcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJHJlZ2V4OiBuZXcgUmVnRXhwKGZpbHRlclZhbHVlLCBcImlcIikgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJpblwiOlxuICAgICAgICAgICAgICAgIG1vbmdvUXVlcnlbZmllbGRdID0geyAkaW46IEFycmF5LmlzQXJyYXkoZmlsdGVyVmFsdWUpID8gZmlsdGVyVmFsdWUgOiBbZmlsdGVyVmFsdWVdIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZ3RcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGd0OiBmaWx0ZXJWYWx1ZSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImx0XCI6XG4gICAgICAgICAgICAgICAgbW9uZ29RdWVyeVtmaWVsZF0gPSB7ICRsdDogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJndGVcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGd0ZTogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsdGVcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGx0ZTogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleGFjdFwiOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IGZpbHRlclZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb25nb1F1ZXJ5O1xufTtcbmV4cG9ydHMuYnVpbGRRdWVyeUZyb21GaWx0ZXJzID0gYnVpbGRRdWVyeUZyb21GaWx0ZXJzO1xudmFyIGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzID0gZnVuY3Rpb24gKGZpbHRlcnMsIHNwZWMpIHtcbiAgICB2YXIgbW9uZ29RdWVyeSA9IHt9O1xuICAgIGZvciAodmFyIGZpZWxkIGluIGZpbHRlcnMpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZmlsdGVyc1tmaWVsZF07XG4gICAgICAgIHZhciBmaWVsZFNwZWMgPSBzcGVjW2ZpZWxkXTtcbiAgICAgICAgaWYgKCFmaWVsZFNwZWMpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBvcGVyYXRvcnMgPSB7XG4gICAgICAgICAgICAgICAgZXE6IFwiJGVxXCIsXG4gICAgICAgICAgICAgICAgbmU6IFwiJG5lXCIsXG4gICAgICAgICAgICAgICAgZ3Q6IFwiJGd0XCIsXG4gICAgICAgICAgICAgICAgZ3RlOiBcIiRndGVcIixcbiAgICAgICAgICAgICAgICBsdDogXCIkbHRcIixcbiAgICAgICAgICAgICAgICBsdGU6IFwiJGx0ZVwiLFxuICAgICAgICAgICAgICAgIGluOiBcIiRpblwiLFxuICAgICAgICAgICAgICAgIG5pbjogXCIkbmluXCIsXG4gICAgICAgICAgICAgICAgcmVnZXg6IFwiJHJlZ2V4XCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgbW9uZ29PcHMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIG9wIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdG9yc1tvcF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9uZ29PcHNbb3BlcmF0b3JzW29wXV0gPSB2YWx1ZVtvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9uZ29RdWVyeVtmaWVsZF0gPSBtb25nb09wcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1vbmdvUXVlcnlbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vbmdvUXVlcnk7XG59O1xuZXhwb3J0cy5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycyA9IGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZXhwcmVzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzXCIpKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgcm91dGVyID0gZXhwcmVzc18xLmRlZmF1bHQuUm91dGVyKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICByb3V0ZXJcbiAgICAgICAgLnJvdXRlKFwiL3Jlc291cmNlcy86c3BhY2UvOmRvbWFpblwiKVxuICAgICAgICAuZ2V0KG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuZ2V0QWxsKVxuICAgICAgICAucG9zdChtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLmNyZWF0ZU9uZSk7XG4gICAgcm91dGVyXG4gICAgICAgIC5yb3V0ZShcIi9yZXNvdXJjZXMvOnNwYWNlLzpkb21haW4vOnJlZmVyZW5jZVwiKVxuICAgICAgICAuZ2V0KG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuZ2V0QnlSZWZlcmVuY2UpXG4gICAgICAgIC5wdXQobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS51cGRhdGVPbmUpXG4gICAgICAgIC5wYXRjaChtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLnBhdGNoT25lKVxuICAgICAgICAuZGVsZXRlKG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuZGVsZXRlT25lKTtcbiAgICByb3V0ZXIucG9zdChcIi9yZXNvdXJjZXMvOnNwYWNlLzpkb21haW4vc2VhcmNoXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuc2VhcmNoKTtcbiAgICByb3V0ZXIuZ2V0KFwiL2luZmVyZW5jZS9yZXNvdXJjZXNcIiwgc2VydmljZV8xLmluZmVyVHlwZXMpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc09wZXJhdGlvbkFsbG93ZWQgPSBleHBvcnRzLmZpbGxNaXNzaW5nRmllbGRzID0gZXhwb3J0cy52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCA9IGV4cG9ydHMubG9hZENoaWxkcmVuID0gZXhwb3J0cy5sb2FkU3BlYyA9IHZvaWQgMDtcbnZhciBmc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7XG52YXIgcGF0aF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJwYXRoXCIpKTtcbnZhciBkb21haW5zXzEgPSByZXF1aXJlKFwiLi4vLi4vc3BlY3MvZG9tYWluc1wiKTtcbnZhciBsb2FkU3BlYyA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICB2YXIgc3BlYyA9IGRvbWFpbnNfMS5zcGVjc01hcFtkb21haW5dO1xuICAgIGlmICghc3BlYykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzY2hlbWEgc3BlYyBmb3VuZCBmb3IgZG9tYWluICdcIi5jb25jYXQoZG9tYWluLCBcIidcIikpO1xuICAgIH1cbiAgICByZXR1cm4gc3BlYztcbn07XG5leHBvcnRzLmxvYWRTcGVjID0gbG9hZFNwZWM7XG52YXIgbG9hZENoaWxkcmVuID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgIHJldHVybiBkb21haW5zXzEuY2hpbGRyZW5NYXBbZG9tYWluXSB8fCBbXTtcbn07XG5leHBvcnRzLmxvYWRDaGlsZHJlbiA9IGxvYWRDaGlsZHJlbjtcbnZhciB2YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCA9IGZ1bmN0aW9uIChwYXlsb2FkLCBzcGVjLCBwYXRoLCBvcHRpb25zKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSBcIlwiOyB9XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICB2YXIgZXJyb3JzID0gW107XG4gICAgdmFyIHNoYXBlZERhdGEgPSB7fTtcbiAgICB2YXIgYWxsb3dQYXJ0aWFsID0gKF9hID0gb3B0aW9ucy5hbGxvd1BhcnRpYWwpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlO1xuICAgIGZvciAodmFyIGtleSBpbiBzcGVjKSB7XG4gICAgICAgIHZhciBmaWVsZFNwZWMgPSBzcGVjW2tleV07XG4gICAgICAgIHZhciBmdWxsUGF0aCA9IHBhdGggPyBcIlwiLmNvbmNhdChwYXRoLCBcIi5cIikuY29uY2F0KGtleSkgOiBrZXk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBheWxvYWQgPT09IG51bGwgfHwgcGF5bG9hZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGF5bG9hZFtrZXldO1xuICAgICAgICB2YXIgaXNWYWx1ZVByZXNlbnQgPSB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICAgICAgICBpZiAoIWFsbG93UGFydGlhbCAmJiBmaWVsZFNwZWMucmVxdWlyZWQgJiYgIWlzVmFsdWVQcmVzZW50KSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgaXMgcmVxdWlyZWRcIikpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1ZhbHVlUHJlc2VudCkge1xuICAgICAgICAgICAgaWYgKCFhbGxvd1BhcnRpYWwpIHtcbiAgICAgICAgICAgICAgICBzaGFwZWREYXRhW2tleV0gPSBnZXREZWZhdWx0Rm9yVHlwZShmaWVsZFNwZWMudHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGRTcGVjLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgc2hvdWxkIGJlIGFuIG9iamVjdFwiKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmVzdGVkID0gKDAsIGV4cG9ydHMudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQpKHZhbHVlLCBmaWVsZFNwZWMuc2NoZW1hIHx8IHt9LCBmdWxsUGF0aCwgb3B0aW9ucyk7XG4gICAgICAgICAgICBlcnJvcnMucHVzaC5hcHBseShlcnJvcnMsIG5lc3RlZC5lcnJvcnMpO1xuICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gbmVzdGVkLnNoYXBlZERhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmllbGRTcGVjLnR5cGUgPT09IFwiYXJyYXlcIikge1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBzaG91bGQgYmUgYW4gYXJyYXlcIikpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVBhdGggPSBcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCJbXCIpLmNvbmNhdChpLCBcIl1cIik7XG4gICAgICAgICAgICAgICAgaWYgKCgoX2IgPSBmaWVsZFNwZWMuc2NoZW1hKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudHlwZSkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5lc3RlZCA9ICgwLCBleHBvcnRzLnZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkKShpdGVtLCBmaWVsZFNwZWMuc2NoZW1hLnNjaGVtYSB8fCB7fSwgaXRlbVBhdGgsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaC5hcHBseShlcnJvcnMsIG5lc3RlZC5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZWREYXRhW2tleV0ucHVzaChuZXN0ZWQuc2hhcGVkRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gIT09IGZpZWxkU3BlYy5zY2hlbWEudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoaXRlbVBhdGgsIFwiIHNob3VsZCBiZSBvZiB0eXBlIFwiKS5jb25jYXQoZmllbGRTcGVjLnNjaGVtYS50eXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZWREYXRhW2tleV0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IGZpZWxkU3BlYy50eXBlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIHNob3VsZCBiZSBvZiB0eXBlIFwiKS5jb25jYXQoZmllbGRTcGVjLnR5cGUpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoYXBlZERhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiBlcnJvcnMubGVuZ3RoID09PSAwLCBlcnJvcnM6IGVycm9ycywgc2hhcGVkRGF0YTogc2hhcGVkRGF0YSB9O1xufTtcbmV4cG9ydHMudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQgPSB2YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZDtcbnZhciBnZXREZWZhdWx0Rm9yVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjYXNlIFwiYXJyYXlcIjogcmV0dXJuIFtdO1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6IHJldHVybiB7fTtcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59O1xudmFyIGZpbGxNaXNzaW5nRmllbGRzID0gZnVuY3Rpb24gKGRvYywgc3BlYykge1xuICAgIHZhciBzaGFwZWQgPSB7IHJlZmVyZW5jZTogZG9jLnJlZmVyZW5jZSwgY3JlYXRlZEJ5OiBkb2MuY3JlYXRlZEJ5LCBjcmVhdGVkQXQ6IGRvYy5jcmVhdGVkQXQsIHVwZGF0ZWRCeTogZG9jLnVwZGF0ZWRCeSwgdXBkYXRlZEF0OiBkb2MudXBkYXRlZEF0IH07XG4gICAgZm9yICh2YXIgZmllbGQgaW4gc3BlYykge1xuICAgICAgICBpZiAoZG9jLmhhc093blByb3BlcnR5KGZpZWxkKSkge1xuICAgICAgICAgICAgc2hhcGVkW2ZpZWxkXSA9IGRvY1tmaWVsZF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaGFwZWRbZmllbGRdID0gc3BlY1tmaWVsZF0udHlwZSA9PT0gXCJhcnJheVwiID8gW10gOiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzaGFwZWQ7XG59O1xuZXhwb3J0cy5maWxsTWlzc2luZ0ZpZWxkcyA9IGZpbGxNaXNzaW5nRmllbGRzO1xudmFyIGlzT3BlcmF0aW9uQWxsb3dlZCA9IGZ1bmN0aW9uIChkb21haW4sIG9wZXJhdGlvbikge1xuICAgIHZhciBmaWxlUGF0aCA9IHBhdGhfMS5kZWZhdWx0LmpvaW4oX19kaXJuYW1lLCBcIi4vc3BlY3MvZG9tYWlucy9cIiwgXCJcIi5jb25jYXQoZG9tYWluLCBcIi5leGNsdWRlLmpzb25cIikpO1xuICAgIGlmICghZnNfMS5kZWZhdWx0LmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgZXhjbHVkZWRPcHMgPSBKU09OLnBhcnNlKGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIFwidXRmLThcIikpO1xuICAgIHJldHVybiAhZXhjbHVkZWRPcHMuaW5jbHVkZXMoXCIqXCIpICYmICFleGNsdWRlZE9wcy5pbmNsdWRlcyhvcGVyYXRpb24pO1xufTtcbmV4cG9ydHMuaXNPcGVyYXRpb25BbGxvd2VkID0gaXNPcGVyYXRpb25BbGxvd2VkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbmZlclR5cGVzID0gZXhwb3J0cy5kZWxldGVPbmUgPSBleHBvcnRzLnBhdGNoT25lID0gZXhwb3J0cy51cGRhdGVPbmUgPSBleHBvcnRzLmNyZWF0ZU9uZSA9IGV4cG9ydHMuZ2V0QnlSZWZlcmVuY2UgPSBleHBvcnRzLnNlYXJjaCA9IGV4cG9ydHMuZ2V0QWxsID0gdm9pZCAwO1xudmFyIG5hbm9pZF8xID0gcmVxdWlyZShcIm5hbm9pZFwiKTtcbnZhciBzY2hlbWFWYWxpZGF0b3JfMSA9IHJlcXVpcmUoXCIuL3NjaGVtYVZhbGlkYXRvclwiKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgZmlsdGVyQnVpbGRlcl8xID0gcmVxdWlyZShcIi4vZmlsdGVyQnVpbGRlclwiKTtcbnZhciB0eXBlSW5mZXJlbmNlXzEgPSByZXF1aXJlKFwiLi90eXBlSW5mZXJlbmNlXCIpO1xudmFyIGFscGhhbnVtZXJpY0FscGhhYmV0ID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbnZhciBuYW5vaWQgPSAoMCwgbmFub2lkXzEuY3VzdG9tQWxwaGFiZXQpKGFscGhhbnVtZXJpY0FscGhhYmV0LCA4KTtcbnZhciBjaGVja1BhcmVudFJlZmVyZW5jZXMgPSBmdW5jdGlvbiAoc2hhcGVkRGF0YV8xLCBzcGVjXzEsIHNwYWNlXzEsIHJlc18xKSB7XG4gICAgdmFyIGFyZ3NfMSA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gNDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NfMVtfaSAtIDRdID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW3NoYXBlZERhdGFfMSwgc3BlY18xLCBzcGFjZV8xLCByZXNfMV0sIGFyZ3NfMSwgdHJ1ZSksIHZvaWQgMCwgZnVuY3Rpb24gKHNoYXBlZERhdGEsIHNwZWMsIHNwYWNlLCByZXMsIHBhdGgpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBmaWVsZE5hbWUsIGZpZWxkU3BlYywgdmFsdWUsIGZ1bGxQYXRoLCBwYXJlbnRNb2RlbCwgZm91bmQsIG9rLCBpdGVtU2NoZW1hLCBpLCBpdGVtLCBpdGVtUGF0aCwgb2ssIHBhcmVudE1vZGVsLCBmb3VuZDtcbiAgICAgICAgaWYgKHBhdGggPT09IHZvaWQgMCkgeyBwYXRoID0gXCJcIjsgfVxuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9lKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9lLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfYSA9IHNwZWM7XG4gICAgICAgICAgICAgICAgICAgIF9iID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAoX2MgaW4gX2EpXG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5wdXNoKF9jKTtcbiAgICAgICAgICAgICAgICAgICAgX2QgPSAwO1xuICAgICAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShfZCA8IF9iLmxlbmd0aCkpIHJldHVybiBbMywgMTJdO1xuICAgICAgICAgICAgICAgICAgICBfYyA9IF9iW19kXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2MgaW4gX2EpKSByZXR1cm4gWzMsIDExXTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lID0gX2M7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZE5hbWUgPT09IFwiX21ldGFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMywgMTFdO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZFNwZWMgPSBzcGVjW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2hhcGVkRGF0YSA9PT0gbnVsbCB8fCBzaGFwZWREYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzaGFwZWREYXRhW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGZ1bGxQYXRoID0gcGF0aCA/IFwiXCIuY29uY2F0KHBhdGgsIFwiLlwiKS5jb25jYXQoZmllbGROYW1lKSA6IGZpZWxkTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZmllbGRTcGVjLnR5cGUgPT09IFwic3RyaW5nXCIgfHwgZmllbGRTcGVjLnR5cGUgPT09IFwibnVtYmVyXCIgfHwgZmllbGRTcGVjLnR5cGUgPT09IFwiYm9vbGVhblwiKSkgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoXCJwYXJlbnRcIiBpbiBmaWVsZFNwZWMgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIGZpZWxkU3BlYy5wYXJlbnQpKSByZXR1cm4gWzMsIDNdO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGZpZWxkU3BlYy5wYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIHBhcmVudE1vZGVsLmZpbmRPbmUoeyByZWZlcmVuY2U6IHZhbHVlIH0pXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IFwiSW52YWxpZCBwYXJlbnQgcmVmZXJlbmNlICdcIi5jb25jYXQodmFsdWUsIFwiJyBmb3IgJ1wiKS5jb25jYXQoZnVsbFBhdGgsIFwiJyBpbiBkb21haW4gJ1wiKS5jb25jYXQoZmllbGRTcGVjLnBhcmVudCwgXCInXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDM7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShmaWVsZFNwZWMudHlwZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSkgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBjaGVja1BhcmVudFJlZmVyZW5jZXModmFsdWUsIGZpZWxkU3BlYy5zY2hlbWEsIHNwYWNlLCByZXMsIGZ1bGxQYXRoKV07XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICBvayA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvaylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgZmFsc2VdO1xuICAgICAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDU7XG4gICAgICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShmaWVsZFNwZWMudHlwZSA9PT0gXCJhcnJheVwiICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSkgcmV0dXJuIFszLCAxMV07XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1TY2hlbWEgPSBmaWVsZFNwZWMuc2NoZW1hO1xuICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgX2UubGFiZWwgPSA2O1xuICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoaSA8IHZhbHVlLmxlbmd0aCkpIHJldHVybiBbMywgMTFdO1xuICAgICAgICAgICAgICAgICAgICBpdGVtID0gdmFsdWVbaV07XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1QYXRoID0gXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiW1wiKS5jb25jYXQoaSwgXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShpdGVtU2NoZW1hLnR5cGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIpKSByZXR1cm4gWzMsIDhdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGNoZWNrUGFyZW50UmVmZXJlbmNlcyhpdGVtLCBpdGVtU2NoZW1hLnNjaGVtYSwgc3BhY2UsIHJlcywgaXRlbVBhdGgpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgIG9rID0gX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9rKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBmYWxzZV07XG4gICAgICAgICAgICAgICAgICAgIF9lLmxhYmVsID0gODtcbiAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKChpdGVtU2NoZW1hLnR5cGUgPT09IFwic3RyaW5nXCIgfHwgaXRlbVNjaGVtYS50eXBlID09PSBcIm51bWJlclwiKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJlbnRcIiBpbiBpdGVtU2NoZW1hICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIiAmJiBpdGVtU2NoZW1hLnBhcmVudCkpIHJldHVybiBbMywgMTBdO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGl0ZW1TY2hlbWEucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBwYXJlbnRNb2RlbC5maW5kT25lKHsgcmVmZXJlbmNlOiBpdGVtIH0pXTtcbiAgICAgICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IFwiSW52YWxpZCBwYXJlbnQgcmVmZXJlbmNlICdcIi5jb25jYXQoaXRlbSwgXCInIGZvciAnXCIpLmNvbmNhdChpdGVtUGF0aCwgXCInIGluIGRvbWFpbiAnXCIpLmNvbmNhdChpdGVtU2NoZW1hLnBhcmVudCwgXCInXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDEwO1xuICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgICAgICAgICBfZCsrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDFdO1xuICAgICAgICAgICAgICAgIGNhc2UgMTI6IHJldHVybiBbMiwgdHJ1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbnZhciBkZWxldGVDaGlsZFJlY29yZHMgPSBmdW5jdGlvbiAocmVmZXJlbmNlLCBjaGlsZHJlbiwgZG9tYWluLCBzcGFjZSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2ksIGNoaWxkcmVuXzEsIGNoaWxkRG9tYWluLCBjaGlsZE1vZGVsLCByZWZGaWVsZDtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZHJlbiB8fCAhQXJyYXkuaXNBcnJheShjaGlsZHJlbikpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgX2kgPSAwLCBjaGlsZHJlbl8xID0gY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgX2IubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGlmICghKF9pIDwgY2hpbGRyZW5fMS5sZW5ndGgpKSByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgICAgIGNoaWxkRG9tYWluID0gY2hpbGRyZW5fMVtfaV07XG4gICAgICAgICAgICAgICAgY2hpbGRNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGNoaWxkRG9tYWluKTtcbiAgICAgICAgICAgICAgICByZWZGaWVsZCA9IFwiXCIuY29uY2F0KGRvbWFpbiwgXCJSZWZlcmVuY2VcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBjaGlsZE1vZGVsLmRlbGV0ZU1hbnkoKF9hID0ge30sIF9hW3JlZkZpZWxkXSA9IHJlZmVyZW5jZSwgX2EpKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gMztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBfaSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgMV07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xudmFyIGdldEFsbCA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIF9iLCBfYywgcGFnZSwgX2QsIGxpbWl0LCByYXdGaWx0ZXJzLCBNb2RlbCwgc3BlY18xLCBmaWx0ZXJzLCBkb2NzLCB0b3RhbCwgc2hhcGVkLCBlcnJfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9lKSB7XG4gICAgICAgIHN3aXRjaCAoX2UubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbjtcbiAgICAgICAgICAgICAgICBpZiAoISgwLCBzY2hlbWFWYWxpZGF0b3JfMS5pc09wZXJhdGlvbkFsbG93ZWQpKGRvbWFpbiwgXCJzZWFyY2hcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk9wZXJhdGlvbiAnc2VhcmNoJyBpcyBub3Qgc3VwcG9ydGVkIGZvciB0aGlzIGRvbWFpblwiIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2IgPSByZXEucXVlcnksIF9jID0gX2IucGFnZSwgcGFnZSA9IF9jID09PSB2b2lkIDAgPyAxIDogX2MsIF9kID0gX2IubGltaXQsIGxpbWl0ID0gX2QgPT09IHZvaWQgMCA/IDEwIDogX2QsIHJhd0ZpbHRlcnMgPSBfX3Jlc3QoX2IsIFtcInBhZ2VcIiwgXCJsaW1pdFwiXSk7XG4gICAgICAgICAgICAgICAgaWYgKCtwYWdlIDwgMSB8fCArbGltaXQgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJQYWdlIGFuZCBsaW1pdCBtdXN0IGJlID49IDEuXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2UudHJ5cy5wdXNoKFsxLCA0LCAsIDVdKTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgc3BlY18xID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmxvYWRTcGVjKShkb21haW4pO1xuICAgICAgICAgICAgICAgIGZpbHRlcnMgPSAoMCwgZmlsdGVyQnVpbGRlcl8xLmJ1aWxkUXVlcnlGcm9tRmlsdGVycykocmF3RmlsdGVycywgc3BlY18xKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmZpbmQoZmlsdGVycykuc2tpcCgoK3BhZ2UgLSAxKSAqICtsaW1pdCkubGltaXQoK2xpbWl0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZG9jcyA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmNvdW50RG9jdW1lbnRzKGZpbHRlcnMpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0b3RhbCA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBzaGFwZWQgPSBkb2NzLm1hcChmdW5jdGlvbiAoZG9jKSB7IHJldHVybiAoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjXzEpOyB9KTtcbiAgICAgICAgICAgICAgICByZXMuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNoYXBlZCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiArcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQ6ICtsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsIC8gK2xpbWl0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgZXJyXzEgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggcmVjb3Jkc1wiLCBkZXRhaWxzOiBlcnJfMS5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRBbGwgPSBnZXRBbGw7XG52YXIgc2VhcmNoID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgX2IsIF9jLCBmaWx0ZXJzLCBfZCwgcGFnaW5hdGlvbiwgX2UsIHBhZ2UsIF9mLCBsaW1pdCwgTW9kZWwsIHNwZWNfMiwgbW9uZ29RdWVyeSwgZG9jcywgdG90YWwsIHNoYXBlZCwgZXJyXzI7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZykge1xuICAgICAgICBzd2l0Y2ggKF9nLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW47XG4gICAgICAgICAgICAgICAgX2IgPSByZXEuYm9keSwgX2MgPSBfYi5maWx0ZXJzLCBmaWx0ZXJzID0gX2MgPT09IHZvaWQgMCA/IHt9IDogX2MsIF9kID0gX2IucGFnaW5hdGlvbiwgcGFnaW5hdGlvbiA9IF9kID09PSB2b2lkIDAgPyB7fSA6IF9kO1xuICAgICAgICAgICAgICAgIF9lID0gcGFnaW5hdGlvbi5wYWdlLCBwYWdlID0gX2UgPT09IHZvaWQgMCA/IDEgOiBfZSwgX2YgPSBwYWdpbmF0aW9uLmxpbWl0LCBsaW1pdCA9IF9mID09PSB2b2lkIDAgPyAxMCA6IF9mO1xuICAgICAgICAgICAgICAgIGlmICgrcGFnZSA8IDEgfHwgK2xpbWl0IDwgMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiUGFnZSBhbmQgbGltaXQgbXVzdCBiZSA+PSAxLlwiIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2cubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9nLnRyeXMucHVzaChbMSwgNCwgLCA1XSk7XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHNwZWNfMiA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5sb2FkU3BlYykoZG9tYWluKTtcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5ID0gKDAsIGZpbHRlckJ1aWxkZXJfMS5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycykoZmlsdGVycywgc3BlY18yKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmaWx0ZXJzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmZpbmQobW9uZ29RdWVyeSkuc2tpcCgoK3BhZ2UgLSAxKSAqICtsaW1pdCkubGltaXQoK2xpbWl0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZG9jcyA9IF9nLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmNvdW50RG9jdW1lbnRzKG1vbmdvUXVlcnkpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0b3RhbCA9IF9nLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBzaGFwZWQgPSBkb2NzLm1hcChmdW5jdGlvbiAoZG9jKSB7IHJldHVybiAoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjXzIpOyB9KTtcbiAgICAgICAgICAgICAgICByZXMuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNoYXBlZCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiArcGFnZSxcbiAgICAgICAgICAgICAgICAgICAgbGltaXQ6ICtsaW1pdCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlczogTWF0aC5jZWlsKHRvdGFsIC8gK2xpbWl0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgZXJyXzIgPSBfZy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJTZWFyY2ggZmFpbGVkXCIsIGRldGFpbHM6IGVycl8yLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnNlYXJjaCA9IHNlYXJjaDtcbnZhciBnZXRCeVJlZmVyZW5jZSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIHJlZmVyZW5jZSwgTW9kZWwsIHNwZWMsIGRvYywgZXJyXzM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW4sIHJlZmVyZW5jZSA9IF9hLnJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICBpZiAoISgwLCBzY2hlbWFWYWxpZGF0b3JfMS5pc09wZXJhdGlvbkFsbG93ZWQpKGRvbWFpbiwgXCJnZXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk9wZXJhdGlvbiAnZ2V0JyBpcyBub3Qgc3VwcG9ydGVkIGZvciB0aGlzIGRvbWFpblwiIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2IubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHNwZWMgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEubG9hZFNwZWMpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kT25lKHsgcmVmZXJlbmNlOiByZWZlcmVuY2UgfSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGRvYyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk5vdCBmb3VuZFwiIH0pXTtcbiAgICAgICAgICAgICAgICByZXMuanNvbigoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJfMyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycm9yIGZldGNoaW5nIGRvY3VtZW50XCIsIGRldGFpbHM6IGVycl8zLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldEJ5UmVmZXJlbmNlID0gZ2V0QnlSZWZlcmVuY2U7XG52YXIgY3JlYXRlT25lID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgdXNlcklkLCBzcGVjLCByZXN1bHQsIE1vZGVsLCB0aW1lc3RhbXAsIGRvYywgZXJyXzQ7XG4gICAgdmFyIF9iO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcImNyZWF0ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiT3BlcmF0aW9uICdjcmVhdGUnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1c2VySWQgPSAoX2IgPSByZXEudXNlcikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgX2MubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMSwgNCwgLCA1XSk7XG4gICAgICAgICAgICAgICAgc3BlYyA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5sb2FkU3BlYykoZG9tYWluKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQpKHJlcS5ib2R5LCBzcGVjKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC52YWxpZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBcIlZhbGlkYXRpb24gZmFpbGVkXCIsIGRldGFpbHM6IHJlc3VsdC5lcnJvcnMgfSldO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgY2hlY2tQYXJlbnRSZWZlcmVuY2VzKHJlc3VsdC5zaGFwZWREYXRhLCBzcGVjLCBzcGFjZSwgcmVzKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCEoX2Muc2VudCgpKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgdGltZXN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBkb2MgPSBuZXcgTW9kZWwoX19hc3NpZ24oX19hc3NpZ24oe30sIHJlc3VsdC5zaGFwZWREYXRhKSwgeyByZWZlcmVuY2U6IG5hbm9pZCgpLCBjcmVhdGVkQXQ6IHRpbWVzdGFtcCwgdXBkYXRlZEF0OiB0aW1lc3RhbXAsIGNyZWF0ZWRCeTogdXNlcklkLCB1cGRhdGVkQnk6IHVzZXJJZCB9KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBkb2Muc2F2ZSgpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmZpbGxNaXNzaW5nRmllbGRzKShkb2MudG9PYmplY3QoKSwgc3BlYykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgZXJyXzQgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJFcnJvciBjcmVhdGluZyBkb2N1bWVudFwiLCBkZXRhaWxzOiBlcnJfNC5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5jcmVhdGVPbmUgPSBjcmVhdGVPbmU7XG52YXIgdXBkYXRlT25lID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgcmVmZXJlbmNlLCB1c2VySWQsIHNwZWMsIHJlc3VsdCwgTW9kZWwsIHVwZGF0ZURhdGEsIGRvYywgZXJyXzU7XG4gICAgdmFyIF9iO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluLCByZWZlcmVuY2UgPSBfYS5yZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgc2NoZW1hVmFsaWRhdG9yXzEuaXNPcGVyYXRpb25BbGxvd2VkKShkb21haW4sIFwidXBkYXRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJPcGVyYXRpb24gJ3VwZGF0ZScgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhpcyBkb21haW5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IChfYiA9IHJlcS51c2VyKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudXNlcl9pZDtcbiAgICAgICAgICAgICAgICBfYy5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFsxLCA0LCAsIDVdKTtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmxvYWRTcGVjKShkb21haW4pO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCkocmVxLmJvZHksIHNwZWMpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnZhbGlkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVmFsaWRhdGlvbiBmYWlsZWRcIiwgZGV0YWlsczogcmVzdWx0LmVycm9ycyB9KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBjaGVja1BhcmVudFJlZmVyZW5jZXMocmVzdWx0LnNoYXBlZERhdGEsIHNwZWMsIHNwYWNlLCByZXMpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBpZiAoIShfYy5zZW50KCkpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVEYXRhID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlc3VsdC5zaGFwZWREYXRhKSwgeyB1cGRhdGVkQXQ6IG5ldyBEYXRlKCksIHVwZGF0ZWRCeTogdXNlcklkIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuZmluZE9uZUFuZFVwZGF0ZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0sIHVwZGF0ZURhdGEsIHsgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBkb2MgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2MpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJOb3QgZm91bmRcIiB9KV07XG4gICAgICAgICAgICAgICAgcmVzLmpzb24oKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmZpbGxNaXNzaW5nRmllbGRzKShkb2MudG9PYmplY3QoKSwgc3BlYykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgZXJyXzUgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJFcnJvciB1cGRhdGluZyBkb2N1bWVudFwiLCBkZXRhaWxzOiBlcnJfNS5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy51cGRhdGVPbmUgPSB1cGRhdGVPbmU7XG52YXIgcGF0Y2hPbmUgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCByZWZlcmVuY2UsIHVzZXJJZCwgc3BlYywgcmVzdWx0LCBNb2RlbCwgcGF0Y2hEYXRhLCBkb2MsIGVycl82O1xuICAgIHZhciBfYjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbiwgcmVmZXJlbmNlID0gX2EucmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcInBhdGNoXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJPcGVyYXRpb24gJ3BhdGNoJyBpcyBub3Qgc3VwcG9ydGVkIGZvciB0aGlzIGRvbWFpblwiIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXNlcklkID0gKF9iID0gcmVxLnVzZXIpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi51c2VyX2lkO1xuICAgICAgICAgICAgICAgIF9jLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzEsIDQsICwgNV0pO1xuICAgICAgICAgICAgICAgIHNwZWMgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEubG9hZFNwZWMpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLnZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkKShyZXEuYm9keSwgc3BlYywgXCJcIiwgeyBhbGxvd1BhcnRpYWw6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQudmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBcIlZhbGlkYXRpb24gZmFpbGVkXCIsIGRldGFpbHM6IHJlc3VsdC5lcnJvcnMgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGNoZWNrUGFyZW50UmVmZXJlbmNlcyhyZXN1bHQuc2hhcGVkRGF0YSwgc3BlYywgc3BhY2UsIHJlcyldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGlmICghKF9jLnNlbnQoKSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHBhdGNoRGF0YSA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXN1bHQuc2hhcGVkRGF0YSksIHsgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLCB1cGRhdGVkQnk6IHVzZXJJZCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyByZWZlcmVuY2U6IHJlZmVyZW5jZSB9LCBwYXRjaERhdGEsIHsgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBkb2MgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2MpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJOb3QgZm91bmRcIiB9KV07XG4gICAgICAgICAgICAgICAgcmVzLmpzb24oKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmZpbGxNaXNzaW5nRmllbGRzKShkb2MudG9PYmplY3QoKSwgc3BlYykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgZXJyXzYgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJFcnJvciBwYXRjaGluZyBkb2N1bWVudFwiLCBkZXRhaWxzOiBlcnJfNi5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5wYXRjaE9uZSA9IHBhdGNoT25lO1xudmFyIGRlbGV0ZU9uZSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIHJlZmVyZW5jZSwgTW9kZWwsIHNwZWMsIGNoaWxkcmVuLCBkb2MsIGVycl83O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluLCByZWZlcmVuY2UgPSBfYS5yZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgc2NoZW1hVmFsaWRhdG9yXzEuaXNPcGVyYXRpb25BbGxvd2VkKShkb21haW4sIFwiZGVsZXRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJPcGVyYXRpb24gJ2RlbGV0ZScgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhpcyBkb21haW5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYi50cnlzLnB1c2goWzEsIDUsICwgNl0pO1xuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmxvYWRTcGVjKShkb21haW4pO1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmxvYWRDaGlsZHJlbikoZG9tYWluKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmZpbmRPbmUoeyByZWZlcmVuY2U6IHJlZmVyZW5jZSB9KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZG9jID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZG9jKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiTm90IGZvdW5kXCIgfSldO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgZGVsZXRlQ2hpbGRSZWNvcmRzKHJlZmVyZW5jZSwgY2hpbGRyZW4sIGRvbWFpbiwgc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5kZWxldGVPbmUoeyByZWZlcmVuY2U6IHJlZmVyZW5jZSB9KV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjA0KS5zZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBlcnJfNyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycm9yIGRlbGV0aW5nIGRvY3VtZW50XCIsIGRldGFpbHM6IGVycl83Lm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlbGV0ZU9uZSA9IGRlbGV0ZU9uZTtcbnZhciBpbmZlclR5cGVzID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgdmFyIHNwYWNlID0gcmVxLnBhcmFtcy5zcGFjZTtcbiAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZXMgPSAoMCwgdHlwZUluZmVyZW5jZV8xLmdlbmVyYXRlVHlwZXMpKHNwYWNlKTtcbiAgICAgICAgcmVzLmhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcInRleHQvdHlwZXNjcmlwdFwiKTtcbiAgICAgICAgcmVzLnNlbmQodHlwZXMpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiRXJyb3IgZ2VuZXJhdGluZyB0eXBlc1wiLCBkZXRhaWxzOiBlcnIubWVzc2FnZSB9KTtcbiAgICB9XG59O1xuZXhwb3J0cy5pbmZlclR5cGVzID0gaW5mZXJUeXBlcztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZW5lcmF0ZVR5cGVzID0gdm9pZCAwO1xudmFyIGRvbWFpbnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9zcGVjcy9kb21haW5zXCIpO1xudmFyIGNhcGl0YWxpemUgPSBmdW5jdGlvbiAoc3RyKSB7IHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7IH07XG52YXIgdG9QYXNjYWxDYXNlID0gZnVuY3Rpb24gKHBhcnRzKSB7XG4gICAgcmV0dXJuIHBhcnRzLm1hcChjYXBpdGFsaXplKS5qb2luKFwiXCIpO1xufTtcbnZhciBuZXN0ZWRJbnRlcmZhY2VzID0gW107XG52YXIgaW5mZXJUc1R5cGUgPSBmdW5jdGlvbiAoZmllbGQsIGRvbWFpbk5hbWUsIHBhdGhQYXJ0cykge1xuICAgIGlmIChwYXRoUGFydHMgPT09IHZvaWQgMCkgeyBwYXRoUGFydHMgPSBbXTsgfVxuICAgIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgY2FzZSBcImFueVwiOlxuICAgICAgICAgICAgcmV0dXJuIGZpZWxkLnR5cGU7XG4gICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgIGlmICghZmllbGQuc2NoZW1hKVxuICAgICAgICAgICAgICAgIHJldHVybiBcIlJlY29yZDxzdHJpbmcsIGFueT5cIjtcbiAgICAgICAgICAgIHZhciBpbnRlcmZhY2VOYW1lID0gdG9QYXNjYWxDYXNlKF9fc3ByZWFkQXJyYXkoW2RvbWFpbk5hbWVdLCBwYXRoUGFydHMsIHRydWUpKTtcbiAgICAgICAgICAgIG5lc3RlZEludGVyZmFjZXMucHVzaChnZW5lcmF0ZU5lc3RlZEludGVyZmFjZShpbnRlcmZhY2VOYW1lLCBmaWVsZC5zY2hlbWEsIGRvbWFpbk5hbWUsIHBhdGhQYXJ0cykpO1xuICAgICAgICAgICAgcmV0dXJuIGludGVyZmFjZU5hbWU7XG4gICAgICAgIGNhc2UgXCJhcnJheVwiOlxuICAgICAgICAgICAgdmFyIGl0ZW1UeXBlID0gaW5mZXJUc1R5cGUoZmllbGQuc2NoZW1hLCBkb21haW5OYW1lLCBwYXRoUGFydHMpO1xuICAgICAgICAgICAgcmV0dXJuIFwiXCIuY29uY2F0KGl0ZW1UeXBlLCBcIltdXCIpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFwiYW55XCI7XG4gICAgfVxufTtcbnZhciBnZW5lcmF0ZU5lc3RlZEludGVyZmFjZSA9IGZ1bmN0aW9uIChpbnRlcmZhY2VOYW1lLCBzcGVjLCBkb21haW5OYW1lLCBwYXRoUGFydHMpIHtcbiAgICBpZiAocGF0aFBhcnRzID09PSB2b2lkIDApIHsgcGF0aFBhcnRzID0gW107IH1cbiAgICB2YXIgZmllbGRzID0gXCJcIjtcbiAgICBmb3IgKHZhciBmaWVsZCBpbiBzcGVjKSB7XG4gICAgICAgIHZhciBmaWVsZERlZiA9IHNwZWNbZmllbGRdO1xuICAgICAgICB2YXIgdHNUeXBlID0gaW5mZXJUc1R5cGUoZmllbGREZWYsIGRvbWFpbk5hbWUsIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgcGF0aFBhcnRzLCB0cnVlKSwgW2ZpZWxkXSwgZmFsc2UpKTtcbiAgICAgICAgZmllbGRzICs9IFwiXFxuICBcIi5jb25jYXQoZmllbGQpLmNvbmNhdChmaWVsZERlZi5yZXF1aXJlZCA/IFwiXCIgOiBcIj9cIiwgXCI6IFwiKS5jb25jYXQodHNUeXBlLCBcIjtcIik7XG4gICAgfVxuICAgIHJldHVybiBcImV4cG9ydCBpbnRlcmZhY2UgXCIuY29uY2F0KGludGVyZmFjZU5hbWUsIFwiIHtcIikuY29uY2F0KGZpZWxkcywgXCJcXG59XCIpO1xufTtcbnZhciBnZW5lcmF0ZVR5cGVzID0gZnVuY3Rpb24gKHNwYWNlKSB7XG4gICAgdmFyIHR5cGVzID0gW107XG4gICAgT2JqZWN0LmtleXMoZG9tYWluc18xLnNwZWNzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uIChzcGVjTmFtZSkge1xuICAgICAgICB2YXIgc3BlYyA9IGRvbWFpbnNfMS5zcGVjc01hcFtzcGVjTmFtZV07XG4gICAgICAgIHZhciBkb21haW5JbnRlcmZhY2VOYW1lID0gY2FwaXRhbGl6ZShzcGVjTmFtZSk7XG4gICAgICAgIHZhciBtYWluSW50ZXJmYWNlID0gZ2VuZXJhdGVOZXN0ZWRJbnRlcmZhY2UoZG9tYWluSW50ZXJmYWNlTmFtZSwgc3BlYywgc3BlY05hbWUpO1xuICAgICAgICB0eXBlcy5wdXNoKG1haW5JbnRlcmZhY2UpO1xuICAgIH0pO1xuICAgIHJldHVybiBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIHR5cGVzLCB0cnVlKSwgbmVzdGVkSW50ZXJmYWNlcywgdHJ1ZSkuam9pbihcIlxcblxcblwiKTtcbn07XG5leHBvcnRzLmdlbmVyYXRlVHlwZXMgPSBnZW5lcmF0ZVR5cGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19yZXN0ID0gKHRoaXMgJiYgdGhpcy5fX3Jlc3QpIHx8IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFVzZXJCeUlkID0gZXhwb3J0cy5nZXRVc2VyQnlFbWFpbCA9IGV4cG9ydHMuZ2V0VXNlcnMgPSBleHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IGV4cG9ydHMuZ2V0TmV3QWNjZXNzVG9rZW4gPSBleHBvcnRzLmRlY29kZUFjY2Vzc1Rva2VuID0gdm9pZCAwO1xudmFyIGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xudmFyIE9ORUFVVEhfQVBJID0gcHJvY2Vzcy5lbnYuT05FQVVUSF9BUEkgfHwgXCJodHRwOi8vbG9jYWxob3N0OjQwMTAvYXBpXCI7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xudmFyIG1vZGVsXzIgPSByZXF1aXJlKFwiLi4vdXNlci9pbnZpdGUvbW9kZWxcIik7XG52YXIgSGVscGVyID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2hlbHBlclwiKSk7XG52YXIgZGJ1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uL2xpYi9kYnV0aWxzXCIpO1xudmFyIGhlbHBlcl8xID0gcmVxdWlyZShcIi4uL2F1dGgvaGVscGVyXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3NlcnZpY2VcIik7XG52YXIgZGVjb2RlQWNjZXNzVG9rZW4gPSBmdW5jdGlvbiAoc3BhY2UsIGFjY2Vzc1Rva2VuKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWNvZGVkUmVzcG9uc2UsIGVycl8xLCBtb2RlbCwgZXhpc3RpbmdVc2VyUmVjb3JkLCBkYXRhO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGRlY29kZWRSZXNwb25zZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBheGlvcy5nZXQoXCJcIi5jb25jYXQoT05FQVVUSF9BUEksIFwiL2F1dGgvdG9rZW4vZGVjb2RlXCIpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbjogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZGVjb2RlZFJlc3BvbnNlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGVycl8xLnJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgXCJleHBpcmVkXCJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIFwiZXhwaXJlZFwiXTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBpZiAoIShkZWNvZGVkUmVzcG9uc2Uuc3RhdHVzID09PSAyMDApKSByZXR1cm4gWzMsIDldO1xuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogZGVjb2RlZFJlc3BvbnNlLmRhdGEuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBleGlzdGluZ1VzZXJSZWNvcmQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kQnlJZEFuZFVwZGF0ZShkZWNvZGVkUmVzcG9uc2UuZGF0YS51c2VyX2lkLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVjb2RlZFJlc3BvbnNlLmRhdGEpLCB7IHJlc29sdmVyOiBcIm9uZWF1dGhfc3BhY2VcIiB9KSwgeyBuZXc6IHRydWUsIHVwc2VydDogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgZGF0YSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIShleGlzdGluZ1VzZXJSZWNvcmQubGVuZ3RoID09PSAwKSkgcmV0dXJuIFszLCA4XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGF1dG9BY2NlcHRJbnZpdGVzKGRhdGEpXTtcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSA4O1xuICAgICAgICAgICAgY2FzZSA4OiByZXR1cm4gWzIsIGRlY29kZWRSZXNwb25zZS5kYXRhIHx8IG51bGxdO1xuICAgICAgICAgICAgY2FzZSA5OiByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlQWNjZXNzVG9rZW4gPSBkZWNvZGVBY2Nlc3NUb2tlbjtcbnZhciBhdXRvQWNjZXB0SW52aXRlcyA9IGZ1bmN0aW9uICh1c2VyKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgcGVuZGluZ0ludml0ZUxpc3QsIGksIHJlcztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMi51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMi51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoeyBlbWFpbDogdXNlci5lbWFpbCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcGVuZGluZ0ludml0ZUxpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGVuZGluZ0ludml0ZUxpc3QpO1xuICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBpZiAoIShpIDwgcGVuZGluZ0ludml0ZUxpc3QubGVuZ3RoKSkgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRCeUlkQW5kVXBkYXRlKHBlbmRpbmdJbnZpdGVMaXN0W2ldLl9pZCwgX19hc3NpZ24oX19hc3NpZ24oe30sIHBlbmRpbmdJbnZpdGVMaXN0W2ldLl9kb2MpLCB7IHVzZXJJZDogdXNlci5faWQsIGFjY2VwdGVkOiB0cnVlIH0pLCB7IG5ldzogdHJ1ZSwgdXBzZXJ0OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coX19hc3NpZ24oX19hc3NpZ24oe30sIHBlbmRpbmdJbnZpdGVMaXN0W2ldKSwgeyB1c2VySWQ6IHVzZXIuX2lkLCBhY2NlcHRlZDogdHJ1ZSB9KSk7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSA0O1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDJdO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbnZhciBnZXROZXdBY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uIChzcGFjZSwgcmVmcmVzaFRva2VuKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciByZWZyZXNoVG9rZW5SZXNwb25zZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBheGlvcy5wb3N0KFwiXCIuY29uY2F0KE9ORUFVVEhfQVBJLCBcIi9hdXRoL3Rva2VuXCIpLCB7XG4gICAgICAgICAgICAgICAgICAgIGdyYW50X3R5cGU6IFwicmVmcmVzaF90b2tlblwiLFxuICAgICAgICAgICAgICAgICAgICByZWFsbTogc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbixcbiAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuUmVzcG9uc2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZnJlc2hUb2tlblJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVmcmVzaFRva2VuUmVzcG9uc2UuZGF0YV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXROZXdBY2Nlc3NUb2tlbiA9IGdldE5ld0FjY2Vzc1Rva2VuO1xudmFyIHZhbGlkYXRlU2Vzc2lvbiA9IGZ1bmN0aW9uIChsb2NhbEFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4sIGFwcFJlYWxtKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgbG9jYWxUb2tlblJlc3BvbnNlLCBhY2Nlc3NUb2tlbiwgbG9jYWxDbGFpbXMsIF9hLCBfYWNjZXNzVG9rZW4sIF9sb2NhbENsYWltcywgYWNjZXNzVG9rZW5SZXNwb25zZSwgbmV3QWNjZXNzVG9rZW4sIG5ld0FjY2Vzc1Rva2VuUmVzcG9uc2U7XG4gICAgdmFyIF9iO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgKDAsIGhlbHBlcl8xLmRlY29kZUFwcFRva2VuKShsb2NhbEFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgbG9jYWxUb2tlblJlc3BvbnNlID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuID0gXCJcIjtcbiAgICAgICAgICAgICAgICBsb2NhbENsYWltcyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICghbG9jYWxUb2tlblJlc3BvbnNlLm91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2EgPSBsb2NhbFRva2VuUmVzcG9uc2UuY2xhaW1zLCBfYWNjZXNzVG9rZW4gPSBfYS5hY2Nlc3NUb2tlbiwgX2xvY2FsQ2xhaW1zID0gX19yZXN0KF9hLCBbXCJhY2Nlc3NUb2tlblwiXSk7XG4gICAgICAgICAgICAgICAgYWNjZXNzVG9rZW4gPSBfYWNjZXNzVG9rZW47XG4gICAgICAgICAgICAgICAgbG9jYWxDbGFpbXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBfbG9jYWxDbGFpbXMuc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogX2xvY2FsQ2xhaW1zLmNvbXBhbnlJZCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmRlY29kZUFjY2Vzc1Rva2VuKE51bWJlcihhcHBSZWFsbSksIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgYWNjZXNzVG9rZW5SZXNwb25zZSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoYWNjZXNzVG9rZW5SZXNwb25zZSAhPT0gXCJleHBpcmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhaW1zOiBhY2Nlc3NUb2tlblJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlOiBsb2NhbENsYWltcy5zcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5nZXROZXdBY2Nlc3NUb2tlbihhcHBSZWFsbSwgcmVmcmVzaFRva2VuKV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgbmV3QWNjZXNzVG9rZW4gPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3QWNjZXNzVG9rZW4gPT09IG51bGwgfHwgbmV3QWNjZXNzVG9rZW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5ld0FjY2Vzc1Rva2VuLmFjY2Vzc190b2tlbikpIHJldHVybiBbMywgNl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVjb2RlQWNjZXNzVG9rZW4oYXBwUmVhbG0sIG5ld0FjY2Vzc1Rva2VuLmFjY2Vzc190b2tlbildO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIG5ld0FjY2Vzc1Rva2VuUmVzcG9uc2UgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgX2IgPSB7fTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBzZXJ2aWNlXzEuZ2V0TG9jYWxUb2tlbkltcGwpKG5ld0FjY2Vzc1Rva2VuUmVzcG9uc2UudXNlcl9pZCwgbmV3QWNjZXNzVG9rZW4uYWNjZXNzX3Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMiwgKF9iLmFjY2Vzc1Rva2VuID0gX2Muc2VudCgpLFxuICAgICAgICAgICAgICAgICAgICBfYi5jbGFpbXMgPSBuZXdBY2Nlc3NUb2tlblJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICBfYi5zcGFjZSA9IGxvY2FsQ2xhaW1zLnNwYWNlLFxuICAgICAgICAgICAgICAgICAgICBfYildO1xuICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMudmFsaWRhdGVTZXNzaW9uID0gdmFsaWRhdGVTZXNzaW9uO1xudmFyIGdldFVzZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWw7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kKCldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VycyA9IGdldFVzZXJzO1xudmFyIGdldFVzZXJCeUVtYWlsID0gZnVuY3Rpb24gKGVtYWlsKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmUoeyBlbWFpbDogZW1haWwudG9Mb3dlckNhc2UoKSB9KV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJCeUVtYWlsID0gZ2V0VXNlckJ5RW1haWw7XG52YXIgZ2V0VXNlckJ5SWQgPSBmdW5jdGlvbiAoaWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZEJ5SWQoaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlckJ5SWQgPSBnZXRVc2VyQnlJZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fbWFrZVRlbXBsYXRlT2JqZWN0ID0gKHRoaXMgJiYgdGhpcy5fX21ha2VUZW1wbGF0ZU9iamVjdCkgfHwgZnVuY3Rpb24gKGNvb2tlZCwgcmF3KSB7XG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cbiAgICByZXR1cm4gY29va2VkO1xufTtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVzb2x2ZXJzID0gZXhwb3J0cy50eXBlRGVmcyA9IHZvaWQgMDtcbnZhciBhcG9sbG9fc2VydmVyX2V4cHJlc3NfMSA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIGdldENvbGxlY3Rpb24gPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIikuZ2V0Q29sbGVjdGlvbjtcbnZhciB0eXBlRGVmcyA9ICgwLCBhcG9sbG9fc2VydmVyX2V4cHJlc3NfMS5ncWwpKHRlbXBsYXRlT2JqZWN0XzEgfHwgKHRlbXBsYXRlT2JqZWN0XzEgPSBfX21ha2VUZW1wbGF0ZU9iamVjdChbXCJcXG4gIHR5cGUgUXVlcnkge1xcbiAgICB1c2VyOiBbVXNlcl1cXG4gICAgYXV0aG9yaXplVXNlcihcXG4gICAgICBhY2Nlc3NUb2tlbjogU3RyaW5nXFxuICAgICAgcmVmcmVzaFRva2VuOiBTdHJpbmdcXG4gICAgICBzcGFjZTogU3RyaW5nXFxuICAgICk6IEF1dGhvcml6ZVJlc3BvbnNlXFxuICB9XFxuXFxuICB0eXBlIE11dGF0aW9uIHtcXG4gICAgY3JlYXRlRW1haWxBY2NvdW50KHBheWxvYWQ6IFVzZXJQYXlsb2FkKTogVXNlciFcXG4gIH1cXG5cXG4gIGlucHV0IFVzZXJQYXlsb2FkIHtcXG4gICAgZmlyc3ROYW1lOiBTdHJpbmchXFxuICAgIGxhc3ROYW1lOiBTdHJpbmchXFxuICAgIGVtYWlsOiBTdHJpbmchXFxuICB9XFxuXFxuICB0eXBlIFVzZXIge1xcbiAgICBpZDogSUQhXFxuICAgIGdpdmVuX25hbWU6IFN0cmluZ1xcbiAgICBmYW1pbHlfbmFtZTogU3RyaW5nXFxuICAgIG5hbWU6IFN0cmluZ1xcbiAgICBuaWNrbmFtZTogU3RyaW5nXFxuICAgIGVtYWlsOiBTdHJpbmdcXG4gICAgcmVzb2x2ZXI6IFN0cmluZ1xcbiAgfVxcblxcbiAgdHlwZSBBdXRob3JpemVSZXNwb25zZSB7XFxuICAgIGFjY2Vzc1Rva2VuOiBTdHJpbmdcXG4gICAgY2xhaW1zOiBKU09OXFxuICB9XFxuXCJdLCBbXCJcXG4gIHR5cGUgUXVlcnkge1xcbiAgICB1c2VyOiBbVXNlcl1cXG4gICAgYXV0aG9yaXplVXNlcihcXG4gICAgICBhY2Nlc3NUb2tlbjogU3RyaW5nXFxuICAgICAgcmVmcmVzaFRva2VuOiBTdHJpbmdcXG4gICAgICBzcGFjZTogU3RyaW5nXFxuICAgICk6IEF1dGhvcml6ZVJlc3BvbnNlXFxuICB9XFxuXFxuICB0eXBlIE11dGF0aW9uIHtcXG4gICAgY3JlYXRlRW1haWxBY2NvdW50KHBheWxvYWQ6IFVzZXJQYXlsb2FkKTogVXNlciFcXG4gIH1cXG5cXG4gIGlucHV0IFVzZXJQYXlsb2FkIHtcXG4gICAgZmlyc3ROYW1lOiBTdHJpbmchXFxuICAgIGxhc3ROYW1lOiBTdHJpbmchXFxuICAgIGVtYWlsOiBTdHJpbmchXFxuICB9XFxuXFxuICB0eXBlIFVzZXIge1xcbiAgICBpZDogSUQhXFxuICAgIGdpdmVuX25hbWU6IFN0cmluZ1xcbiAgICBmYW1pbHlfbmFtZTogU3RyaW5nXFxuICAgIG5hbWU6IFN0cmluZ1xcbiAgICBuaWNrbmFtZTogU3RyaW5nXFxuICAgIGVtYWlsOiBTdHJpbmdcXG4gICAgcmVzb2x2ZXI6IFN0cmluZ1xcbiAgfVxcblxcbiAgdHlwZSBBdXRob3JpemVSZXNwb25zZSB7XFxuICAgIGFjY2Vzc1Rva2VuOiBTdHJpbmdcXG4gICAgY2xhaW1zOiBKU09OXFxuICB9XFxuXCJdKSkpO1xuZXhwb3J0cy50eXBlRGVmcyA9IHR5cGVEZWZzO1xudmFyIHJlc29sdmVycyA9IHtcbiAgICBRdWVyeToge1xuICAgICAgICB1c2VyOiBmdW5jdGlvbiAoXzEsIF9hLCBfYikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgW18xLCBfYSwgX2JdLCB2b2lkIDAsIGZ1bmN0aW9uIChfLCBfYywgX2QpIHtcbiAgICAgICAgICAgIHZhciBtb2RlbDtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9IF9jLmVtYWlsO1xuICAgICAgICAgICAgdmFyIHNwYWNlID0gX2Quc3BhY2UsIHVzZXIgPSBfZC51c2VyO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2UubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzcGFjZSB8fCAhdXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbmV3IGFwb2xsb19zZXJ2ZXJfZXhwcmVzc18xLkF1dGhlbnRpY2F0aW9uRXJyb3IoXCJOb3QgYXV0aG9yaXplZCB0byBhY2Nlc3MgdGhpcyBjb250ZW50XCIpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgbW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCgpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9lLnNlbnQoKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9LFxuICAgICAgICBhdXRob3JpemVVc2VyOiBmdW5jdGlvbiAoXzEsIF9hLCBfXzEpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIFtfMSwgX2EsIF9fMV0sIHZvaWQgMCwgZnVuY3Rpb24gKF8sIF9iLCBfXykge1xuICAgICAgICAgICAgdmFyIG1vZGVsLCBhY2Nlc3NUb2tlblJlc3BvbnNlLCBuZXdBY2Nlc3NUb2tlbiwgbmV3QWNjZXNzVG9rZW5SZXNwb25zZTtcbiAgICAgICAgICAgIHZhciBhY2Nlc3NUb2tlbiA9IF9iLmFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4gPSBfYi5yZWZyZXNoVG9rZW4sIHNwYWNlID0gX2Iuc3BhY2U7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldENvbGxlY3Rpb24oc3BhY2UsIG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5kZWNvZGVBY2Nlc3NUb2tlbihOdW1iZXIoc3BhY2UpLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlblJlc3BvbnNlID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjY2Vzc1Rva2VuUmVzcG9uc2UgIT09IFwiZXhwaXJlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYWltczogYWNjZXNzVG9rZW5SZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5nZXROZXdBY2Nlc3NUb2tlbihzcGFjZSwgcmVmcmVzaFRva2VuKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjY2Vzc1Rva2VuID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEobmV3QWNjZXNzVG9rZW4gPT09IG51bGwgfHwgbmV3QWNjZXNzVG9rZW4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5ld0FjY2Vzc1Rva2VuLmFjY2Vzc190b2tlbikpIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5kZWNvZGVBY2Nlc3NUb2tlbihzcGFjZSwgbmV3QWNjZXNzVG9rZW4uYWNjZXNzX3Rva2VuKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FjY2Vzc1Rva2VuUmVzcG9uc2UgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IG5ld0FjY2Vzc1Rva2VuLmFjY2Vzc190b2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhaW1zOiBuZXdBY2Nlc3NUb2tlblJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9LFxuICAgIH0sXG4gICAgTXV0YXRpb246IHtcbiAgICAgICAgY3JlYXRlRW1haWxBY2NvdW50OiBmdW5jdGlvbiAoXzEsIGFyZ3NfMSwgX2EpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIFtfMSwgYXJnc18xLCBfYV0sIHZvaWQgMCwgZnVuY3Rpb24gKF8sIGFyZ3MsIF9iKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWwsIHJlc3BvbnNlO1xuICAgICAgICAgICAgdmFyIHNwYWNlID0gX2Iuc3BhY2UsIHVzZXIgPSBfYi51c2VyO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBnZXRDb2xsZWN0aW9uKHNwYWNlLCBtb2RlbF8xLnVzZXJDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJTY2hlbWEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lQW5kVXBkYXRlKHsgZW1haWw6IGFyZ3MucGF5bG9hZC5lbWFpbCwgcmVzb2x2ZXI6IFwiZW1haWxcIiB9LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYXJncy5wYXlsb2FkKSwgeyByZXNvbHZlcjogXCJlbWFpbFwiIH0pLCB7IHVwc2VydDogdHJ1ZSwgbmV3OiB0cnVlLCByYXdSZXN1bHQ6IHRydWUgfSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzcG9uc2UudmFsdWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSxcbiAgICB9LFxufTtcbmV4cG9ydHMucmVzb2x2ZXJzID0gcmVzb2x2ZXJzO1xudmFyIHRlbXBsYXRlT2JqZWN0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0VXNlckludml0ZUJ5VXNlcklkID0gZXhwb3J0cy5yZWdpc3RlclVzZXJJbnZpdGUgPSBleHBvcnRzLmdldFVzZXJJbnZpdGUgPSBleHBvcnRzLnVwZGF0ZVVzZXJJbnZpdGUgPSB2b2lkIDA7XG52YXIgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG52YXIgT05FQVVUSF9BUEkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAxMC9hcGlcIjtcbnZhciBtb2RlbF8xID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG52YXIgY29tcGFueVNlcnZpY2UgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uLy4uL2NvbXBhbnkvc2VydmljZVwiKSk7XG52YXIgdXNlclNlcnZpY2UgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uL3NlcnZpY2VcIikpO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciB1cGRhdGVVc2VySW52aXRlID0gZnVuY3Rpb24gKHNwYWNlLCBkYXRhLCB1c2VySWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBhbnksIG1vZGVsLCB1c2VyLCBwYXlsb2FkLCBleGlzdGluZ1JlY29yZDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBjb21wYW55U2VydmljZS5nZXRDb21wYW55QnlSZWZlcmVuY2Uoc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjb21wYW55ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghY29tcGFueSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIHVzZXJTZXJ2aWNlLmdldFVzZXJCeUVtYWlsKGRhdGEuZW1haWwpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB1c2VyID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHBheWxvYWQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGF0YSksIHsgZW1haWw6IGRhdGEuZW1haWwudG9Mb3dlckNhc2UoKSwgY29tcGFueUlkOiBjb21wYW55Ll9pZCwgYWNjZXB0ZWQ6ICEhdXNlciwgdXNlcklkOiB1c2VyID8gdXNlci5faWQgOiBudWxsIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogcGF5bG9hZC5lbWFpbC50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFueUlkOiBjb21wYW55Ll9pZCxcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVjb3JkID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICgoZXhpc3RpbmdSZWNvcmQgPT09IG51bGwgfHwgZXhpc3RpbmdSZWNvcmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nUmVjb3JkLmxlbmd0aCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuY3JlYXRlKHBheWxvYWQpXTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMudXBkYXRlVXNlckludml0ZSA9IHVwZGF0ZVVzZXJJbnZpdGU7XG52YXIgZ2V0VXNlckludml0ZSA9IGZ1bmN0aW9uIChzcGFjZSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29tcGFueSwgbW9kZWw7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgY29tcGFueVNlcnZpY2UuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlKHNwYWNlKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgY29tcGFueSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBbXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJJbnZpdGVDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJJbnZpdGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7IGNvbXBhbnlJZDogY29tcGFueS5faWQgfSldO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VySW52aXRlID0gZ2V0VXNlckludml0ZTtcbnZhciByZWdpc3RlclVzZXJJbnZpdGUgPSBmdW5jdGlvbiAoc3BhY2UsIGNvbXBhbnlJZCwgdXNlcklkLCBlbWFpbCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIGV4aXN0aW5nUmVjb3JkO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJJbnZpdGVDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJJbnZpdGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogY29tcGFueUlkLFxuICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZXhpc3RpbmdSZWNvcmQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKChleGlzdGluZ1JlY29yZCA9PT0gbnVsbCB8fCBleGlzdGluZ1JlY29yZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXhpc3RpbmdSZWNvcmQubGVuZ3RoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGFueUlkOiBjb21wYW55SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMucmVnaXN0ZXJVc2VySW52aXRlID0gcmVnaXN0ZXJVc2VySW52aXRlO1xudmFyIGdldFVzZXJJbnZpdGVCeVVzZXJJZCA9IGZ1bmN0aW9uICh1c2VySWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJJbnZpdGVDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJJbnZpdGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7IHVzZXJJZDogdXNlcklkIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlckludml0ZUJ5VXNlcklkID0gZ2V0VXNlckludml0ZUJ5VXNlcklkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZXJJbnZpdGVDb2xsZWN0aW9uID0gZXhwb3J0cy51c2VySW52aXRlU2NoZW1hID0gdm9pZCAwO1xudmFyIG1vbmdvb3NlID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpO1xudmFyIFNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYTtcbnZhciB1c2VySW52aXRlU2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gICAgZW1haWw6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgdXNlcklkOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIGNvbXBhbnlJZDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBhY2NlcHRlZDogeyB0eXBlOiBCb29sZWFuIH0sXG59LCB7IHRpbWVzdGFtcHM6IHRydWUgfSk7XG5leHBvcnRzLnVzZXJJbnZpdGVTY2hlbWEgPSB1c2VySW52aXRlU2NoZW1hO1xudmFyIHVzZXJJbnZpdGVDb2xsZWN0aW9uID0gXCJ1c2VyLnBlcm1pc3Npb25cIjtcbmV4cG9ydHMudXNlckludml0ZUNvbGxlY3Rpb24gPSB1c2VySW52aXRlQ29sbGVjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICByb3V0ZXIucG9zdChcIi91c2VyL2ludml0ZS86c3BhY2VcIiwgbWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS5jcmVhdGVVc2VySW52aXRlRW5kcG9pbnQpO1xuICAgIHJvdXRlci5nZXQoXCIvdXNlci9pbnZpdGUvOnNwYWNlXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuZ2V0VXNlckludml0ZSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0VXNlckludml0ZSA9IGV4cG9ydHMucmVnaXN0ZXJVc2VySW52aXRlID0gZXhwb3J0cy5jcmVhdGVVc2VySW52aXRlRW5kcG9pbnQgPSB2b2lkIDA7XG52YXIgSGVscGVyID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2hlbHBlclwiKSk7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xudmFyIGNyZWF0ZVVzZXJJbnZpdGVFbmRwb2ludCA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlcklkLCB1c2VySW52aXRlO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IHJlcS51c2VyLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIudXBkYXRlVXNlckludml0ZShyZXEucGFyYW1zLnNwYWNlLCByZXEuYm9keSwgdXNlcklkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdXNlckludml0ZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQodXNlckludml0ZSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5jcmVhdGVVc2VySW52aXRlRW5kcG9pbnQgPSBjcmVhdGVVc2VySW52aXRlRW5kcG9pbnQ7XG52YXIgcmVnaXN0ZXJVc2VySW52aXRlID0gZnVuY3Rpb24gKHNwYWNlLCBjb21wYW55SWQsIHVzZXJJZCwgZW1haWwpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgSGVscGVyLnJlZ2lzdGVyVXNlckludml0ZShzcGFjZSwgY29tcGFueUlkLCB1c2VySWQsIGVtYWlsKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnJlZ2lzdGVyVXNlckludml0ZSA9IHJlZ2lzdGVyVXNlckludml0ZTtcbnZhciBnZXRVc2VySW52aXRlID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySWQsIHVzZXJJbnZpdGVMaXN0O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IHJlcS51c2VyLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0VXNlckludml0ZShyZXEucGFyYW1zLnNwYWNlKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdXNlckludml0ZUxpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHVzZXJJbnZpdGVMaXN0KTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJJbnZpdGUgPSBnZXRVc2VySW52aXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZXJDb2xsZWN0aW9uID0gZXhwb3J0cy51c2VyU2NoZW1hID0gdm9pZCAwO1xudmFyIG1vbmdvb3NlID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpO1xudmFyIFNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYTtcbnZhciB1c2VyU2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gICAgZ2l2ZW5fbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBmYW1pbHlfbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBuYW1lOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIG5pY2tuYW1lOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIHJlc29sdmVyOiB7IHR5cGU6IFN0cmluZyB9LFxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VyU2NoZW1hID0gdXNlclNjaGVtYTtcbnZhciB1c2VyQ29sbGVjdGlvbiA9IFwidXNlclwiO1xuZXhwb3J0cy51c2VyQ29sbGVjdGlvbiA9IHVzZXJDb2xsZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgaGFuZGxlcl8xID0gcmVxdWlyZShcIi4uLy4uL2hhbmRsZXJcIik7XG52YXIgbWlkZGxld2FyZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9taWRkbGV3YXJlc1wiKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHJvdXRlci5wb3N0KFwiL3VzZXIvOnJlYWxtSWQvYXV0aG9yaXplX3VzZXJcIiwgKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKHNlcnZpY2VfMS52YWxpZGF0ZVNlc3Npb24pKTtcbiAgICByb3V0ZXIuZ2V0KFwiL3VzZXIvOnJlYWxtSWRcIiwgbWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEuZ2V0VXNlcnMpKTtcbiAgICByb3V0ZXIuZ2V0KFwiL3VzZXIvdG9rZW4vbG9jYWxcIiwgbWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGlPbmVhdXRoLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLmdldExvY2FsVG9rZW4pKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRVc2VyQnlJZCA9IGV4cG9ydHMuZ2V0VXNlckJ5RW1haWwgPSBleHBvcnRzLmdldExvY2FsVG9rZW5JbXBsID0gZXhwb3J0cy5nZXRMb2NhbFRva2VuID0gZXhwb3J0cy5nZXRVc2VycyA9IGV4cG9ydHMudmFsaWRhdGVTZXNzaW9uID0gdm9pZCAwO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIHVzZXJJbnZpdGVIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uL3VzZXIvaW52aXRlL2hlbHBlclwiKSk7XG52YXIgY29tcGFueUhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vY29tcGFueS9oZWxwZXJcIikpO1xudmFyIGhlbHBlcl8xID0gcmVxdWlyZShcIi4uL2F1dGgvaGVscGVyXCIpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciB2YWxpZGF0ZVNlc3Npb24gPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlc3Npb247XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgSGVscGVyLnZhbGlkYXRlU2Vzc2lvbihyZXEuYm9keS5hY2Nlc3NUb2tlbiwgcmVxLmJvZHkucmVmcmVzaFRva2VuLCByZXEucGFyYW1zLnJlYWxtSWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZXNzaW9uID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKFwiU2Vzc2lvbiBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHNlc3Npb24pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMudmFsaWRhdGVTZXNzaW9uID0gdmFsaWRhdGVTZXNzaW9uO1xudmFyIGdldFVzZXJzID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySWQsIHVzZXJMaXN0O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IHJlcS51c2VyLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0VXNlcnMoKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdXNlckxpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHVzZXJMaXN0KTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJzID0gZ2V0VXNlcnM7XG52YXIgZ2V0TG9jYWxUb2tlbiA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYWNjZXNzVG9rZW4sIGFwcFRva2VuO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuID0gcmVxLmhlYWRlcnNbXCJhdXRob3JpemF0aW9uXCJdO1xuICAgICAgICAgICAgICAgIGlmICghYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc2VuZFN0YXR1cyg0MDEpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5nZXRMb2NhbFRva2VuSW1wbCkocmVxLnVzZXIudXNlcl9pZCwgYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBhcHBUb2tlbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyB0b2tlbjogYXBwVG9rZW4gfSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRMb2NhbFRva2VuID0gZ2V0TG9jYWxUb2tlbjtcbnZhciBnZXRMb2NhbFRva2VuSW1wbCA9IGZ1bmN0aW9uICh1c2VySWQsIGFjY2Vzc1Rva2VuKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySW52aXRlTGlzdCwgY29tcGFueUlkTGlzdCwgY29tcGFueUxpc3QsIGNvbXBhbnlSZWZlcmVuY2VMaXN0LCBjbGFpbXM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgdXNlckludml0ZUhlbHBlci5nZXRVc2VySW52aXRlQnlVc2VySWQodXNlcklkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdXNlckludml0ZUxpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29tcGFueUlkTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGVMaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueUlkTGlzdC5wdXNoKGl0ZW0uY29tcGFueUlkKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGNvbXBhbnlIZWxwZXIuZ2V0Q29tcGFueUJ5SWRMaXN0KGNvbXBhbnlJZExpc3QpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjb21wYW55TGlzdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBjb21wYW55UmVmZXJlbmNlTGlzdCA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbXBhbnlMaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueVJlZmVyZW5jZUxpc3QucHVzaChpdGVtLnJlZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY2xhaW1zID0ge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlOiBjb21wYW55UmVmZXJlbmNlTGlzdCxcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueUlkOiBjb21wYW55SWRMaXN0LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCAoMCwgaGVscGVyXzEuZW5jb2RlQXBwVG9rZW4pKGNsYWltcyldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0TG9jYWxUb2tlbkltcGwgPSBnZXRMb2NhbFRva2VuSW1wbDtcbnZhciBnZXRVc2VyQnlFbWFpbCA9IGZ1bmN0aW9uIChlbWFpbCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBIZWxwZXIuZ2V0VXNlckJ5RW1haWwoZW1haWwpXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlckJ5RW1haWwgPSBnZXRVc2VyQnlFbWFpbDtcbnZhciBnZXRVc2VyQnlJZCA9IGZ1bmN0aW9uIChpZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBIZWxwZXIuZ2V0VXNlckJ5SWQoaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlckJ5SWQgPSBnZXRVc2VyQnlJZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcbnZhciByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xucm91dGVyLmdldChcIi9cIiwgZnVuY3Rpb24gKF8sIHJlcykge1xuICAgIHJlcy5zZW5kKFwidjEuMC4wXCIpO1xuICAgIHJlcy5lbmQoKTtcbn0pO1xucmVxdWlyZShcIi4vbW9kdWxlcy9oZWxsby9yb3V0ZVwiKShyb3V0ZXIpO1xucmVxdWlyZShcIi4vbW9kdWxlcy9hdXRoL3JvdXRlXCIpKHJvdXRlcik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL3VzZXIvcm91dGVcIikocm91dGVyKTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvdXNlci9pbnZpdGUvcm91dGVcIikocm91dGVyKTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvY29tcGFueS9yb3V0ZVwiKShyb3V0ZXIpO1xucmVxdWlyZShcIi4vbW9kdWxlcy91bml2ZXJzYWwvcm91dGVcIikocm91dGVyKTtcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZyYWdtZW50Q2hpbGRyZW4gPSBleHBvcnRzLmZyYWdtZW50U3BlYyA9IHZvaWQgMDtcbmV4cG9ydHMuZnJhZ21lbnRTcGVjID0ge1xuICAgIFwibmFtZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICB9LFxuICAgIFwibGF0ZXN0Q29udGVudFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcInN0b3J5dGhyZWFkUmVmZXJlbmNlXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgXCJwYXJlbnRcIjogXCJzdG9yeXRocmVhZFwiXG4gICAgfSxcbiAgICBcImxhYmVsc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcImFycmF5XCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcInBhcmVudFwiOiBcInN0b3J5dGhyZWFkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInRlc3RcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJhcnJheVwiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJwYXJlbnRcIjogXCJzdG9yeXRocmVhZFwiXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiY29sb3JzXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiYXJyYXlcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbiAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLmZyYWdtZW50Q2hpbGRyZW4gPSBbXCJmcmFnbWVudENvbW1lbnRcIiwgXCJmcmFnbWVudFZlcnNpb25cIl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZnJhZ21lbnRDb21tZW50U3BlYyA9IHZvaWQgMDtcbmV4cG9ydHMuZnJhZ21lbnRDb21tZW50U3BlYyA9IHtcbiAgICBcImZyYWdtZW50SWRcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlXG4gICAgfSxcbiAgICBcImZyYWdtZW50VmVyc2lvbklkXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJtb2RlXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJ1c2VyUHJvbXB0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJjb250ZW50XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZyYWdtZW50VmVyc2lvblNwZWMgPSB2b2lkIDA7XG5leHBvcnRzLmZyYWdtZW50VmVyc2lvblNwZWMgPSB7XG4gICAgXCJmcmFnbWVudElkXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJjb250ZW50XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJ2ZXJzaW9uVGFnXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICB9LFxuICAgIFwidXNlck5vdGVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZVxuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY2hpbGRyZW5NYXAgPSBleHBvcnRzLnNwZWNzTWFwID0gdm9pZCAwO1xudmFyIGZyYWdtZW50X3NwZWNfMSA9IHJlcXVpcmUoXCIuL2ZyYWdtZW50LnNwZWNcIik7XG52YXIgZnJhZ21lbnRDb21tZW50X3NwZWNfMSA9IHJlcXVpcmUoXCIuL2ZyYWdtZW50Q29tbWVudC5zcGVjXCIpO1xudmFyIGZyYWdtZW50VmVyc2lvbl9zcGVjXzEgPSByZXF1aXJlKFwiLi9mcmFnbWVudFZlcnNpb24uc3BlY1wiKTtcbnZhciBzdG9yeXRocmVhZF9zcGVjXzEgPSByZXF1aXJlKFwiLi9zdG9yeXRocmVhZC5zcGVjXCIpO1xudmFyIHVzZXJfc3BlY18xID0gcmVxdWlyZShcIi4vdXNlci5zcGVjXCIpO1xuZXhwb3J0cy5zcGVjc01hcCA9IHtcbiAgICB1c2VyOiB1c2VyX3NwZWNfMS51c2VyU3BlYyxcbiAgICBmcmFnbWVudDogZnJhZ21lbnRfc3BlY18xLmZyYWdtZW50U3BlYyxcbiAgICBmcmFnbWVudENvbW1lbnQ6IGZyYWdtZW50Q29tbWVudF9zcGVjXzEuZnJhZ21lbnRDb21tZW50U3BlYyxcbiAgICBmcmFnbWVudFZlcnNpb246IGZyYWdtZW50VmVyc2lvbl9zcGVjXzEuZnJhZ21lbnRWZXJzaW9uU3BlYyxcbiAgICBzdG9yeXRocmVhZDogc3Rvcnl0aHJlYWRfc3BlY18xLnN0b3J5dGhyZWFkU3BlY1xufTtcbmV4cG9ydHMuY2hpbGRyZW5NYXAgPSB7XG4gICAgZnJhZ21lbnQ6IGZyYWdtZW50X3NwZWNfMS5mcmFnbWVudENoaWxkcmVuLFxuICAgIHN0b3J5dGhyZWFkOiBzdG9yeXRocmVhZF9zcGVjXzEuc3Rvcnl0aHJlYWRDaGlsZHJlblxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zdG9yeXRocmVhZENoaWxkcmVuID0gZXhwb3J0cy5zdG9yeXRocmVhZFNwZWMgPSB2b2lkIDA7XG5leHBvcnRzLnN0b3J5dGhyZWFkU3BlYyA9IHtcbiAgICBcInRpdGxlXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJkZXNjcmlwdGlvblwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgfVxufTtcbmV4cG9ydHMuc3Rvcnl0aHJlYWRDaGlsZHJlbiA9IFtcImZyYWdtZW50XCJdO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVzZXJTcGVjID0gdm9pZCAwO1xuZXhwb3J0cy51c2VyU3BlYyA9IHtcbiAgICBcIm5hbWVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlXG4gICAgfSxcbiAgICBcInByb2ZpbGVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICBcImFnZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImJpb1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImFkZHJlc3NcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInppcFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInRhZ3NcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJhcnJheVwiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwibGFiZWxcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluaXRpYWxpemVTZXF1ZW5jZXMgPSB2b2lkIDA7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vbW9kdWxlcy9zZXF1ZW5jZS9zZXJ2aWNlXCIpO1xudmFyIGluaXRpYWxpemVTZXF1ZW5jZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgKDAsIHNlcnZpY2VfMS5jcmVhdGVfc2VxdWVuY2UpKFwiYXNzZXRJZFwiLCBudWxsLCAxKTtcbiAgICAoMCwgc2VydmljZV8xLmNyZWF0ZV9zZXF1ZW5jZSkoXCJjb21wYW55SWRcIiwgbnVsbCwgMSk7XG59O1xuZXhwb3J0cy5pbml0aWFsaXplU2VxdWVuY2VzID0gaW5pdGlhbGl6ZVNlcXVlbmNlcztcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbi8qKlxuICogQHBhcmFtIHsoc3RyaW5nIHwgbnVtYmVyKVtdfSB1cGRhdGVkTW9kdWxlcyB1cGRhdGVkIG1vZHVsZXNcbiAqIEBwYXJhbSB7KHN0cmluZyB8IG51bWJlcilbXSB8IG51bGx9IHJlbmV3ZWRNb2R1bGVzIHJlbmV3ZWQgbW9kdWxlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG5cdH0pO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdGlmICh1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0bG9nKFxuXHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogKFRoZXkgd291bGQgbmVlZCBhIGZ1bGwgcmVsb2FkISlcIlxuXHRcdCk7XG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1vZHVsZUlkID09PSBcInN0cmluZ1wiICYmIG1vZHVsZUlkLmluZGV4T2YoXCIhXCIpICE9PSAtMSkge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBtb2R1bGVJZC5zcGxpdChcIiFcIik7XG5cdFx0XHRcdGxvZy5ncm91cENvbGxhcHNlZChcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIHBhcnRzLnBvcCgpKTtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0XHRsb2cuZ3JvdXBFbmQoXCJpbmZvXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBudW1iZXJJZHMgPSByZW5ld2VkTW9kdWxlcy5ldmVyeShmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XG5cdFx0fSk7XG5cdFx0aWYgKG51bWJlcklkcylcblx0XHRcdGxvZyhcblx0XHRcdFx0XCJpbmZvXCIsXG5cdFx0XHRcdCdbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgb3B0aW1pemF0aW9uLm1vZHVsZUlkczogXCJuYW1lZFwiIGZvciBtb2R1bGUgbmFtZXMuJ1xuXHRcdFx0KTtcblx0fVxufTtcbiIsIi8qKiBAdHlwZWRlZiB7XCJpbmZvXCIgfCBcIndhcm5pbmdcIiB8IFwiZXJyb3JcIn0gTG9nTGV2ZWwgKi9cblxuLyoqIEB0eXBlIHtMb2dMZXZlbH0gKi9cbnZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbi8qKlxuICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgbG9nIGxldmVsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSwgaWYgc2hvdWxkIGxvZ1xuICovXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbi8qKlxuICogQHBhcmFtIHsobXNnPzogc3RyaW5nKSA9PiB2b2lkfSBsb2dGbiBsb2cgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsobGV2ZWw6IExvZ0xldmVsLCBtc2c/OiBzdHJpbmcpID0+IHZvaWR9IGZ1bmN0aW9uIHRoYXQgbG9ncyB3aGVuIGxvZyBsZXZlbCBpcyBzdWZmaWNpZW50XG4gKi9cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0xvZ0xldmVsfSBsZXZlbCBsb2cgbGV2ZWxcbiAqIEBwYXJhbSB7c3RyaW5nfEVycm9yfSBtc2cgbWVzc2FnZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbi8qKlxuICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgbG9nIGxldmVsXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RXJyb3J9IGVyciBlcnJvclxuICogQHJldHVybnMge3N0cmluZ30gZm9ybWF0dGVkIGVycm9yXG4gKi9cbm1vZHVsZS5leHBvcnRzLmZvcm1hdEVycm9yID0gZnVuY3Rpb24gKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9XG5cdHJldHVybiBzdGFjaztcbn07XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLyogZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnNsaWNlKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBmcm9tVXBkYXRlIHRydWUgd2hlbiBjYWxsZWQgZnJvbSB1cGRhdGVcblx0ICovXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uICh1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdGlmICghdXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRcdGlmIChmcm9tVXBkYXRlKSBsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlIGFwcGxpZWQuXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9sb2ctYXBwbHktcmVzdWx0XCIpKHVwZGF0ZWRNb2R1bGVzLCB1cGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdFx0Y2hlY2tGb3JVcGRhdGUodHJ1ZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdFx0aWYgKFtcImFib3J0XCIsIFwiZmFpbFwiXS5pbmRleE9mKHN0YXR1cykgPj0gMCkge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFlvdSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcGxpY2F0aW9uIVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuIiwiY29uc3QgeyBBdXRoZW50aWNhdGlvbkVycm9yIH0gPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIpO1xuXG5jb25zdCBpc1VuYXV0aG9yaXplZCA9ICh1c2VyKSA9PiB7XG4gIGlmICghdXNlcikge1xuICAgIHJldHVybiBuZXcgQXV0aGVudGljYXRpb25FcnJvcihcIk5vdCBhdXRob3JpemVkIHRvIGFjY2VzcyB0aGlzIGNvbnRlbnRcIik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGlzVW5hdXRob3JpemVkIH07XG4iLCJjb25zdCB7IGdxbCB9ID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTtcbmNvbnN0IHsgYXNzZXRDb2xsZWN0aW9uLCBhc3NldFNjaGVtYSB9ID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG5jb25zdCB7IGdldEdsb2JhbENvbGxlY3Rpb24gfSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvZGJ1dGlsc1wiKTtcbmNvbnN0IHsgaXNVbmF1dGhvcml6ZWQgfSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvYXV0aHV0aWxzXCIpO1xuY29uc3QgeyBuZXh0dmFsIH0gPSByZXF1aXJlKFwiLi4vc2VxdWVuY2Uvc2VydmljZVwiKTtcblxuY29uc3QgdHlwZURlZnMgPSBncWxgXG4gIGV4dGVuZCB0eXBlIFF1ZXJ5IHtcbiAgICBhc3NldChhc3NldElkOiBTdHJpbmchKTogQXNzZXRcbiAgICBhc3NldEJ5SWQoaWQ6IElEISk6IEFzc2V0XG4gICAgYXNzZXRzOiBbQXNzZXRdXG4gIH1cblxuICBleHRlbmQgdHlwZSBNdXRhdGlvbiB7XG4gICAgdXBkYXRlQXNzZXQocGF5bG9hZDogQXNzZXRQYXlsb2FkKTogQXNzZXRcbiAgICBjcmVhdGVBc3NldChwYXlsb2FkOiBBc3NldFBheWxvYWQsIGFkZGl0aW9uOiBBc3NldEFkZGl0aW9uUGF5bG9hZCk6IEFzc2V0XG4gIH1cblxuICBpbnB1dCBBc3NldFBheWxvYWQge1xuICAgIGlkOiBTdHJpbmdcbiAgICBuYW1lOiBTdHJpbmdcbiAgICBzZWN0aW9uOiBKU09OXG4gICAgZmVhdHVyZWRUaXRsZTogU3RyaW5nXG4gICAgZmVhdHVyZWRTdWJ0aXRsZTogU3RyaW5nXG4gICAgaGVybzogSlNPTlxuICAgIGp3dFBhc3N3b3JkOiBTdHJpbmdcbiAgICBwcm9kdWN0aW9uTW9kZTogQm9vbGVhblxuICB9XG5cbiAgaW5wdXQgQXNzZXRBZGRpdGlvblBheWxvYWQge1xuICAgIGVtYWlsOiBTdHJpbmdcbiAgfVxuXG4gIHR5cGUgQXNzZXQge1xuICAgIGlkOiBJRCFcbiAgICBuYW1lOiBTdHJpbmdcbiAgICBzZWN0aW9uOiBKU09OXG4gICAgZmVhdHVyZWRUaXRsZTogU3RyaW5nXG4gICAgZmVhdHVyZWRTdWJ0aXRsZTogU3RyaW5nXG4gICAgaGVybzogSlNPTlxuICAgIGp3dFBhc3N3b3JkOiBTdHJpbmdcbiAgICBwcm9kdWN0aW9uTW9kZTogQm9vbGVhblxuICAgIGFzc2V0SWQ6IFN0cmluZ1xuICB9XG5gO1xuXG5jb25zdCByZXNvbHZlcnMgPSB7XG4gIFF1ZXJ5OiB7XG4gICAgYXNzZXQ6IGFzeW5jIChfLCB7IGFzc2V0SWQgfSwgeyB1c2VyIH0pID0+IHtcbiAgICAgIC8vIGlmICghdXNlcikge1xuICAgICAgLy8gICByZXR1cm4gbmV3IEF1dGhlbnRpY2F0aW9uRXJyb3IoJ05vdCBhdXRob3JpemVkIHRvIGFjY2VzcyB0aGlzIGNvbnRlbnQnKTtcbiAgICAgIC8vIH1cbiAgICAgIGNvbnN0IG1vZGVsID0gZ2V0R2xvYmFsQ29sbGVjdGlvbihhc3NldENvbGxlY3Rpb24sIGFzc2V0U2NoZW1hKTtcbiAgICAgIHJldHVybiBhd2FpdCBtb2RlbC5maW5kT25lKHsgYXNzZXRJZCB9KTtcbiAgICB9LFxuICAgIGFzc2V0czogYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gaWYgKCF1c2VyKSB7XG4gICAgICAvLyAgIHJldHVybiBuZXcgQXV0aGVudGljYXRpb25FcnJvcignTm90IGF1dGhvcml6ZWQgdG8gYWNjZXNzIHRoaXMgY29udGVudCcpO1xuICAgICAgLy8gfVxuICAgICAgY29uc3QgbW9kZWwgPSBnZXRHbG9iYWxDb2xsZWN0aW9uKGFzc2V0Q29sbGVjdGlvbiwgYXNzZXRTY2hlbWEpO1xuICAgICAgcmV0dXJuIGF3YWl0IG1vZGVsLmZpbmQoKTtcbiAgICB9LFxuICB9LFxuXG4gIE11dGF0aW9uOiB7XG4gICAgdXBkYXRlQXNzZXQ6IGFzeW5jIChfLCBhcmdzLCB7IHVzZXIgfSkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBnZXRHbG9iYWxDb2xsZWN0aW9uKGFzc2V0Q29sbGVjdGlvbiwgYXNzZXRTY2hlbWEpO1xuICAgICAgaWYgKGFyZ3MucGF5bG9hZC5pZCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgbW9kZWwuZmluZEJ5SWRBbmRVcGRhdGUoYXJncy5wYXlsb2FkLmlkLCBhcmdzLnBheWxvYWQsIHtcbiAgICAgICAgICBuZXc6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChhcmdzLnBheWxvYWQuYXNzZXRJZCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgbW9kZWwuZmluZE9uZUFuZFVwZGF0ZShcbiAgICAgICAgICB7IGFzc2V0SWQ6IGFyZ3MucGF5bG9hZC5hc3NldElkIH0sXG4gICAgICAgICAgYXJncy5wYXlsb2FkLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5ldzogdHJ1ZSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkYXRhID0gbmV3IG1vZGVsKHtcbiAgICAgICAgICAuLi5hcmdzLnBheWxvYWQsXG4gICAgICAgICAgYXNzZXRJZDogYGEke2F3YWl0IG5leHR2YWwoXCJhc3NldElkXCIpfWAsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXdhaXQgZGF0YS5zYXZlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBjcmVhdGVBc3NldDogYXN5bmMgKF8sIHsgcGF5bG9hZCwgYWRkaXRpb24gfSwgeyB1c2VyIH0pID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gZ2V0R2xvYmFsQ29sbGVjdGlvbihhc3NldENvbGxlY3Rpb24sIGFzc2V0U2NoZW1hKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBuZXcgbW9kZWwoe1xuICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICBhc3NldElkOiBgYSR7YXdhaXQgbmV4dHZhbChcImFzc2V0SWRcIil9YCxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGB1c2VyIGFjY291bnQgbmVlZHMgdG8gYmUgc2V0dXAgZm9yICR7YWRkaXRpb24uZW1haWx9IGluICR7cGF5bG9hZC5uYW1lfWBcbiAgICAgICk7XG4gICAgICByZXR1cm4gYXdhaXQgZGF0YS5zYXZlKCk7XG4gICAgfSxcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyB0eXBlRGVmcywgcmVzb2x2ZXJzIH07XG4iLCJ2YXIgbW9uZ29vc2UgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7XG5cbmNvbnN0IFNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYTtcbmNvbnN0IGFzc2V0U2NoZW1hID0gbmV3IFNjaGVtYShcbiAge1xuICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgc2VjdGlvbjogeyB0eXBlOiBBcnJheSB9LFxuICAgIGZlYXR1cmVkVGl0bGU6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgZmVhdHVyZWRTdWJ0aXRsZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBqd3RQYXNzd29yZDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBwcm9kdWN0aW9uTW9kZTogeyB0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZSB9LFxuICAgIGFzc2V0SWQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgaGVybzogeyB0eXBlOiBPYmplY3QgfSxcbiAgfSxcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cbik7XG5cbmNvbnN0IGFzc2V0Q29sbGVjdGlvbiA9IFwiYXNzZXRcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7IGFzc2V0U2NoZW1hLCBhc3NldENvbGxlY3Rpb24gfTtcbiIsImNvbnN0IHsgZ3FsLCBBdXRoZW50aWNhdGlvbkVycm9yIH0gPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIpO1xuY29uc3QgR3JhcGhRTEpTT04gPSByZXF1aXJlKFwiZ3JhcGhxbC10eXBlLWpzb25cIik7XG5cbmNvbnN0IHR5cGVEZWZzID0gZ3FsYFxuICBzY2FsYXIgSlNPTlxuYDtcblxuY29uc3QgcmVzb2x2ZXJzID0ge1xuICBKU09OOiBHcmFwaFFMSlNPTixcbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyB0eXBlRGVmcywgcmVzb2x2ZXJzIH07XG4iLCJ2YXIgbW9uZ29vc2UgPSByZXF1aXJlKCdtb25nb29zZScpO1xuXG5jb25zdCBTY2hlbWEgPSBtb25nb29zZS5TY2hlbWE7XG5jb25zdCBzZXF1ZW5jZVNjaGVtYSA9IG5ldyBTY2hlbWEoXG4gIHtcbiAgICBmaWVsZDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBjb250ZXh0OiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIG5leHR2YWw6IHsgdHlwZTogTnVtYmVyIH0sXG4gICAgZmFjdG9yOiB7IHR5cGU6IE51bWJlciB9LFxuICB9LFxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxuKTtcblxuY29uc3Qgc2VxdWVuY2VDb2xsZWN0aW9uID0gJ3NlcXVlbmNlJztcblxubW9kdWxlLmV4cG9ydHMgPSB7IHNlcXVlbmNlU2NoZW1hLCBzZXF1ZW5jZUNvbGxlY3Rpb24gfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkYXRlLWZuc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtdHlwZS1qc29uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuYW5vaWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoY2FjaGVkTW9kdWxlLmVycm9yICE9PSB1bmRlZmluZWQpIHRocm93IGNhY2hlZE1vZHVsZS5lcnJvcjtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0dHJ5IHtcblx0XHR2YXIgZXhlY09wdGlvbnMgPSB7IGlkOiBtb2R1bGVJZCwgbW9kdWxlOiBtb2R1bGUsIGZhY3Rvcnk6IF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLCByZXF1aXJlOiBfX3dlYnBhY2tfcmVxdWlyZV9fIH07XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikgeyBoYW5kbGVyKGV4ZWNPcHRpb25zKTsgfSk7XG5cdFx0bW9kdWxlID0gZXhlY09wdGlvbnMubW9kdWxlO1xuXHRcdGV4ZWNPcHRpb25zLmZhY3RvcnkuY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgZXhlY09wdGlvbnMucmVxdWlyZSk7XG5cdH0gY2F0Y2goZSkge1xuXHRcdG1vZHVsZS5lcnJvciA9IGU7XG5cdFx0dGhyb3cgZTtcblx0fVxuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX187XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlIGV4ZWN1dGlvbiBpbnRlcmNlcHRvclxuX193ZWJwYWNrX3JlcXVpcmVfXy5pID0gW107XG5cbiIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFsbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uaHUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmgoKSArIFwiLmhvdC11cGRhdGUuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5obXJGID0gKCkgPT4gKFwibWFpbi5cIiArIF9fd2VicGFja19yZXF1aXJlX18uaCgpICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcIjk0OTNiY2ZhYmMxOGY0NzFlOTBhXCIpIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsInZhciBjdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xudmFyIGluc3RhbGxlZE1vZHVsZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmM7XG5cbi8vIG1vZHVsZSBhbmQgcmVxdWlyZSBjcmVhdGlvblxudmFyIGN1cnJlbnRDaGlsZE1vZHVsZTtcbnZhciBjdXJyZW50UGFyZW50cyA9IFtdO1xuXG4vLyBzdGF0dXNcbnZhciByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMgPSBbXTtcbnZhciBjdXJyZW50U3RhdHVzID0gXCJpZGxlXCI7XG5cbi8vIHdoaWxlIGRvd25sb2FkaW5nXG52YXIgYmxvY2tpbmdQcm9taXNlcyA9IDA7XG52YXIgYmxvY2tpbmdQcm9taXNlc1dhaXRpbmcgPSBbXTtcblxuLy8gVGhlIHVwZGF0ZSBpbmZvXG52YXIgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnM7XG52YXIgcXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzO1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckQgPSBjdXJyZW50TW9kdWxlRGF0YTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5pLnB1c2goZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0dmFyIG1vZHVsZSA9IG9wdGlvbnMubW9kdWxlO1xuXHR2YXIgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUob3B0aW9ucy5yZXF1aXJlLCBvcHRpb25zLmlkKTtcblx0bW9kdWxlLmhvdCA9IGNyZWF0ZU1vZHVsZUhvdE9iamVjdChvcHRpb25zLmlkLCBtb2R1bGUpO1xuXHRtb2R1bGUucGFyZW50cyA9IGN1cnJlbnRQYXJlbnRzO1xuXHRtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0Y3VycmVudFBhcmVudHMgPSBbXTtcblx0b3B0aW9ucy5yZXF1aXJlID0gcmVxdWlyZTtcbn0pO1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckMgPSB7fTtcbl9fd2VicGFja19yZXF1aXJlX18uaG1ySSA9IHt9O1xuXG5mdW5jdGlvbiBjcmVhdGVSZXF1aXJlKHJlcXVpcmUsIG1vZHVsZUlkKSB7XG5cdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXHRpZiAoIW1lKSByZXR1cm4gcmVxdWlyZTtcblx0dmFyIGZuID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcblx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuXHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcblx0XHRcdFx0dmFyIHBhcmVudHMgPSBpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHM7XG5cdFx0XHRcdGlmIChwYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuXHRcdFx0XHRcdHBhcmVudHMucHVzaChtb2R1bGVJZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcblx0XHRcdFx0Y3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcblx0XHRcdH1cblx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuXHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcblx0XHRcdFx0XHRyZXF1ZXN0ICtcblx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuXHRcdFx0XHRcdG1vZHVsZUlkXG5cdFx0XHQpO1xuXHRcdFx0Y3VycmVudFBhcmVudHMgPSBbXTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlcXVpcmUocmVxdWVzdCk7XG5cdH07XG5cdHZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiByZXF1aXJlW25hbWVdO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHJlcXVpcmVbbmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXHRmb3IgKHZhciBuYW1lIGluIHJlcXVpcmUpIHtcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlcXVpcmUsIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcihuYW1lKSk7XG5cdFx0fVxuXHR9XG5cdGZuLmUgPSBmdW5jdGlvbiAoY2h1bmtJZCwgZmV0Y2hQcmlvcml0eSkge1xuXHRcdHJldHVybiB0cmFja0Jsb2NraW5nUHJvbWlzZShyZXF1aXJlLmUoY2h1bmtJZCwgZmV0Y2hQcmlvcml0eSkpO1xuXHR9O1xuXHRyZXR1cm4gZm47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZHVsZUhvdE9iamVjdChtb2R1bGVJZCwgbWUpIHtcblx0dmFyIF9tYWluID0gY3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZDtcblx0dmFyIGhvdCA9IHtcblx0XHQvLyBwcml2YXRlIHN0dWZmXG5cdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcblx0XHRfYWNjZXB0ZWRFcnJvckhhbmRsZXJzOiB7fSxcblx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuXHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuXHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuXHRcdF9zZWxmSW52YWxpZGF0ZWQ6IGZhbHNlLFxuXHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuXHRcdF9tYWluOiBfbWFpbixcblx0XHRfcmVxdWlyZVNlbGY6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGN1cnJlbnRQYXJlbnRzID0gbWUucGFyZW50cy5zbGljZSgpO1xuXHRcdFx0Y3VycmVudENoaWxkTW9kdWxlID0gX21haW4gPyB1bmRlZmluZWQgOiBtb2R1bGVJZDtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuXHRcdH0sXG5cblx0XHQvLyBNb2R1bGUgQVBJXG5cdFx0YWN0aXZlOiB0cnVlLFxuXHRcdGFjY2VwdDogZnVuY3Rpb24gKGRlcCwgY2FsbGJhY2ssIGVycm9ySGFuZGxlcikge1xuXHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIiAmJiBkZXAgIT09IG51bGwpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBbaV1dID0gZXJyb3JIYW5kbGVyO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdFx0aG90Ll9hY2NlcHRlZEVycm9ySGFuZGxlcnNbZGVwXSA9IGVycm9ySGFuZGxlcjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRlY2xpbmU6IGZ1bmN0aW9uIChkZXApIHtcblx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIiAmJiBkZXAgIT09IG51bGwpXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG5cdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG5cdFx0fSxcblx0XHRkaXNwb3NlOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuXHRcdH0sXG5cdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG5cdFx0fSxcblx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG5cdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuXHRcdH0sXG5cdFx0aW52YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fc2VsZkludmFsaWRhdGVkID0gdHJ1ZTtcblx0XHRcdHN3aXRjaCAoY3VycmVudFN0YXR1cykge1xuXHRcdFx0XHRjYXNlIFwiaWRsZVwiOlxuXHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKFxuXHRcdFx0XHRcdFx0XHRtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnNcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c2V0U3RhdHVzKFwicmVhZHlcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJyZWFkeVwiOlxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtcklba2V5XShcblx0XHRcdFx0XHRcdFx0bW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicHJlcGFyZVwiOlxuXHRcdFx0XHRjYXNlIFwiY2hlY2tcIjpcblx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VcIjpcblx0XHRcdFx0Y2FzZSBcImFwcGx5XCI6XG5cdFx0XHRcdFx0KHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyA9IHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyB8fCBbXSkucHVzaChcblx0XHRcdFx0XHRcdG1vZHVsZUlkXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvLyBpZ25vcmUgcmVxdWVzdHMgaW4gZXJyb3Igc3RhdGVzXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIE1hbmFnZW1lbnQgQVBJXG5cdFx0Y2hlY2s6IGhvdENoZWNrLFxuXHRcdGFwcGx5OiBob3RBcHBseSxcblx0XHRzdGF0dXM6IGZ1bmN0aW9uIChsKSB7XG5cdFx0XHRpZiAoIWwpIHJldHVybiBjdXJyZW50U3RhdHVzO1xuXHRcdFx0cmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG5cdFx0fSxcblx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0cmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG5cdFx0fSxcblx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0dmFyIGlkeCA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuXHRcdFx0aWYgKGlkeCA+PSAwKSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0fSxcblxuXHRcdC8vIGluaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcblx0XHRkYXRhOiBjdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cblx0fTtcblx0Y3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuXHRyZXR1cm4gaG90O1xufVxuXG5mdW5jdGlvbiBzZXRTdGF0dXMobmV3U3RhdHVzKSB7XG5cdGN1cnJlbnRTdGF0dXMgPSBuZXdTdGF0dXM7XG5cdHZhciByZXN1bHRzID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG5cdFx0cmVzdWx0c1tpXSA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xufVxuXG5mdW5jdGlvbiB1bmJsb2NrKCkge1xuXHRpZiAoLS1ibG9ja2luZ1Byb21pc2VzID09PSAwKSB7XG5cdFx0c2V0U3RhdHVzKFwicmVhZHlcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoYmxvY2tpbmdQcm9taXNlcyA9PT0gMCkge1xuXHRcdFx0XHR2YXIgbGlzdCA9IGJsb2NraW5nUHJvbWlzZXNXYWl0aW5nO1xuXHRcdFx0XHRibG9ja2luZ1Byb21pc2VzV2FpdGluZyA9IFtdO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRsaXN0W2ldKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFja0Jsb2NraW5nUHJvbWlzZShwcm9taXNlKSB7XG5cdHN3aXRjaCAoY3VycmVudFN0YXR1cykge1xuXHRcdGNhc2UgXCJyZWFkeVwiOlxuXHRcdFx0c2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcblx0XHQvKiBmYWxsdGhyb3VnaCAqL1xuXHRcdGNhc2UgXCJwcmVwYXJlXCI6XG5cdFx0XHRibG9ja2luZ1Byb21pc2VzKys7XG5cdFx0XHRwcm9taXNlLnRoZW4odW5ibG9jaywgdW5ibG9jayk7XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gd2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZm4pIHtcblx0aWYgKGJsb2NraW5nUHJvbWlzZXMgPT09IDApIHJldHVybiBmbigpO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRibG9ja2luZ1Byb21pc2VzV2FpdGluZy5wdXNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlc29sdmUoZm4oKSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBob3RDaGVjayhhcHBseU9uVXBkYXRlKSB7XG5cdGlmIChjdXJyZW50U3RhdHVzICE9PSBcImlkbGVcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuXHR9XG5cdHJldHVybiBzZXRTdGF0dXMoXCJjaGVja1wiKVxuXHRcdC50aGVuKF9fd2VicGFja19yZXF1aXJlX18uaG1yTSlcblx0XHQudGhlbihmdW5jdGlvbiAodXBkYXRlKSB7XG5cdFx0XHRpZiAoIXVwZGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gc2V0U3RhdHVzKGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkgPyBcInJlYWR5XCIgOiBcImlkbGVcIikudGhlbihcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJwcmVwYXJlXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdXBkYXRlZE1vZHVsZXMgPSBbXTtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcblxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDKS5yZWR1Y2UoZnVuY3Rpb24gKFxuXHRcdFx0XHRcdFx0cHJvbWlzZXMsXG5cdFx0XHRcdFx0XHRrZXlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1yQ1trZXldKFxuXHRcdFx0XHRcdFx0XHR1cGRhdGUuYyxcblx0XHRcdFx0XHRcdFx0dXBkYXRlLnIsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZS5tLFxuXHRcdFx0XHRcdFx0XHRwcm9taXNlcyxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZWRNb2R1bGVzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb21pc2VzO1xuXHRcdFx0XHRcdH0sIFtdKVxuXHRcdFx0XHQpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiB3YWl0Rm9yQmxvY2tpbmdQcm9taXNlcyhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZiAoYXBwbHlPblVwZGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaW50ZXJuYWxBcHBseShhcHBseU9uVXBkYXRlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJyZWFkeVwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHVwZGF0ZWRNb2R1bGVzO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcblx0aWYgKGN1cnJlbnRTdGF0dXMgIT09IFwicmVhZHlcIikge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXMgKHN0YXRlOiBcIiArXG5cdFx0XHRcdFx0Y3VycmVudFN0YXR1cyArXG5cdFx0XHRcdFx0XCIpXCJcblx0XHRcdCk7XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGludGVybmFsQXBwbHkob3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGludGVybmFsQXBwbHkob3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRhcHBseUludmFsaWRhdGVkTW9kdWxlcygpO1xuXG5cdHZhciByZXN1bHRzID0gY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMubWFwKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG5cdFx0cmV0dXJuIGhhbmRsZXIob3B0aW9ucyk7XG5cdH0pO1xuXHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IHVuZGVmaW5lZDtcblxuXHR2YXIgZXJyb3JzID0gcmVzdWx0c1xuXHRcdC5tYXAoZnVuY3Rpb24gKHIpIHtcblx0XHRcdHJldHVybiByLmVycm9yO1xuXHRcdH0pXG5cdFx0LmZpbHRlcihCb29sZWFuKTtcblxuXHRpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcblx0XHRyZXR1cm4gc2V0U3RhdHVzKFwiYWJvcnRcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aHJvdyBlcnJvcnNbMF07XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2Vcblx0dmFyIGRpc3Bvc2VQcm9taXNlID0gc2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcblxuXHRyZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdGlmIChyZXN1bHQuZGlzcG9zZSkgcmVzdWx0LmRpc3Bvc2UoKTtcblx0fSk7XG5cblx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuXHR2YXIgYXBwbHlQcm9taXNlID0gc2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cblx0dmFyIGVycm9yO1xuXHR2YXIgcmVwb3J0RXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG5cdH07XG5cblx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuXHRyZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdGlmIChyZXN1bHQuYXBwbHkpIHtcblx0XHRcdHZhciBtb2R1bGVzID0gcmVzdWx0LmFwcGx5KHJlcG9ydEVycm9yKTtcblx0XHRcdGlmIChtb2R1bGVzKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKG1vZHVsZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gUHJvbWlzZS5hbGwoW2Rpc3Bvc2VQcm9taXNlLCBhcHBseVByb21pc2VdKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0cmV0dXJuIHNldFN0YXR1cyhcImZhaWxcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcykge1xuXHRcdFx0cmV0dXJuIGludGVybmFsQXBwbHkob3B0aW9ucykudGhlbihmdW5jdGlvbiAobGlzdCkge1xuXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdFx0XHRpZiAobGlzdC5pbmRleE9mKG1vZHVsZUlkKSA8IDApIGxpc3QucHVzaChtb2R1bGVJZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gbGlzdDtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZXRTdGF0dXMoXCJpZGxlXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG91dGRhdGVkTW9kdWxlcztcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkge1xuXHRpZiAocXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzKSB7XG5cdFx0aWYgKCFjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycykgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcblx0XHRPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKFxuXHRcdFx0XHRcdG1vZHVsZUlkLFxuXHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgPSB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4vLyBcIjFcIiBtZWFucyBcImxvYWRlZFwiLCBvdGhlcndpc2Ugbm90IGxvYWRlZCB5ZXRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtclNfcmVxdWlyZSA9IF9fd2VicGFja19yZXF1aXJlX18uaG1yU19yZXF1aXJlIHx8IHtcblx0XCJtYWluXCI6IDFcbn07XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8gY2h1bmsgaW5zdGFsbCBmdW5jdGlvbiBuZWVkZWRcblxuLy8gbm8gY2h1bmsgbG9hZGluZ1xuXG4vLyBubyBleHRlcm5hbCBpbnN0YWxsIGNodW5rXG5cbmZ1bmN0aW9uIGxvYWRVcGRhdGVDaHVuayhjaHVua0lkLCB1cGRhdGVkTW9kdWxlc0xpc3QpIHtcblx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5odShjaHVua0lkKSk7XG5cdHZhciB1cGRhdGVkTW9kdWxlcyA9IHVwZGF0ZS5tb2R1bGVzO1xuXHR2YXIgcnVudGltZSA9IHVwZGF0ZS5ydW50aW1lO1xuXHRmb3IodmFyIG1vZHVsZUlkIGluIHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKHVwZGF0ZWRNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdID0gdXBkYXRlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0aWYodXBkYXRlZE1vZHVsZXNMaXN0KSB1cGRhdGVkTW9kdWxlc0xpc3QucHVzaChtb2R1bGVJZCk7XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIGN1cnJlbnRVcGRhdGVSdW50aW1lLnB1c2gocnVudGltZSk7XG59XG5cbnZhciBjdXJyZW50VXBkYXRlQ2h1bmtzO1xudmFyIGN1cnJlbnRVcGRhdGU7XG52YXIgY3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3M7XG52YXIgY3VycmVudFVwZGF0ZVJ1bnRpbWU7XG5mdW5jdGlvbiBhcHBseUhhbmRsZXIob3B0aW9ucykge1xuXHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5mKSBkZWxldGUgX193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmVIbXI7XG5cdGN1cnJlbnRVcGRhdGVDaHVua3MgPSB1bmRlZmluZWQ7XG5cdGZ1bmN0aW9uIGdldEFmZmVjdGVkTW9kdWxlRWZmZWN0cyh1cGRhdGVNb2R1bGVJZCkge1xuXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG5cdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbiAoaWQpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNoYWluOiBbaWRdLFxuXHRcdFx0XHRpZDogaWRcblx0XHRcdH07XG5cdFx0fSk7XG5cdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcblx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcblx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcblx0XHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQhbW9kdWxlIHx8XG5cdFx0XHRcdChtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQgJiYgIW1vZHVsZS5ob3QuX3NlbGZJbnZhbGlkYXRlZClcblx0XHRcdClcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG5cdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuXHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcblx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG5cdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW3BhcmVudElkXTtcblx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcblx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG5cdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuXHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuXHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG5cdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG5cdFx0XHRcdHF1ZXVlLnB1c2goe1xuXHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG5cdFx0XHRcdFx0aWQ6IHBhcmVudElkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG5cdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG5cdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcblx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IGJbaV07XG5cdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuXHRcdH1cblx0fVxuXG5cdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG5cdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cblx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcblx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuXHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKG1vZHVsZSkge1xuXHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgbW9kdWxlLmlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG5cdFx0KTtcblx0fTtcblxuXHRmb3IgKHZhciBtb2R1bGVJZCBpbiBjdXJyZW50VXBkYXRlKSB7XG5cdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlLCBtb2R1bGVJZCkpIHtcblx0XHRcdHZhciBuZXdNb2R1bGVGYWN0b3J5ID0gY3VycmVudFVwZGF0ZVttb2R1bGVJZF07XG5cdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG5cdFx0XHR2YXIgcmVzdWx0ID0gbmV3TW9kdWxlRmFjdG9yeVxuXHRcdFx0XHQ/IGdldEFmZmVjdGVkTW9kdWxlRWZmZWN0cyhtb2R1bGVJZClcblx0XHRcdFx0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG5cdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcblx0XHRcdFx0XHR9O1xuXHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cblx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG5cdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuXHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuXHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG5cdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG5cdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcblx0XHRcdH1cblx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG5cdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuXHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuXHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG5cdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG5cdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcblx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuXHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcblx0XHRcdH1cblx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0ZXJyb3I6IGFib3J0RXJyb3Jcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChkb0FwcGx5KSB7XG5cdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gbmV3TW9kdWxlRmFjdG9yeTtcblx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcblx0XHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG5cdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuXHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuXHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcblx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGN1cnJlbnRVcGRhdGUgPSB1bmRlZmluZWQ7XG5cblx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuXHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG5cdGZvciAodmFyIGogPSAwOyBqIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaisrKSB7XG5cdFx0dmFyIG91dGRhdGVkTW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbal07XG5cdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRpZiAoXG5cdFx0XHRtb2R1bGUgJiZcblx0XHRcdChtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQgfHwgbW9kdWxlLmhvdC5fbWFpbikgJiZcblx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcblx0XHRcdGFwcGxpZWRVcGRhdGVbb3V0ZGF0ZWRNb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZSAmJlxuXHRcdFx0Ly8gd2hlbiBjYWxsZWQgaW52YWxpZGF0ZSBzZWxmLWFjY2VwdGluZyBpcyBub3QgcG9zc2libGVcblx0XHRcdCFtb2R1bGUuaG90Ll9zZWxmSW52YWxpZGF0ZWRcblx0XHQpIHtcblx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcblx0XHRcdFx0bW9kdWxlOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRyZXF1aXJlOiBtb2R1bGUuaG90Ll9yZXF1aXJlU2VsZixcblx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWRcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcblxuXHRyZXR1cm4ge1xuXHRcdGRpc3Bvc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzLmZvckVhY2goZnVuY3Rpb24gKGNodW5rSWQpIHtcblx0XHRcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcblx0XHRcdH0pO1xuXHRcdFx0Y3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MgPSB1bmRlZmluZWQ7XG5cblx0XHRcdHZhciBpZHg7XG5cdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcblx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuXHRcdFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblx0XHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG5cdFx0XHRcdHZhciBkYXRhID0ge307XG5cblx0XHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG5cdFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG5cdFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRkaXNwb3NlSGFuZGxlcnNbal0uY2FsbChudWxsLCBkYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckRbbW9kdWxlSWRdID0gZGF0YTtcblxuXHRcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuXHRcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuXHRcdFx0XHRkZWxldGUgX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblxuXHRcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG5cdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cblx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdHZhciBjaGlsZCA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuXHRcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG5cdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG5cdFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuXHRcdFx0dmFyIGRlcGVuZGVuY3k7XG5cdFx0XHRmb3IgKHZhciBvdXRkYXRlZE1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG91dGRhdGVkTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0bW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdGlmIChtb2R1bGUpIHtcblx0XHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID1cblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuXHRcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcblx0XHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhcHBseTogZnVuY3Rpb24gKHJlcG9ydEVycm9yKSB7XG5cdFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcblx0XHRcdGZvciAodmFyIHVwZGF0ZU1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcblx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhhcHBsaWVkVXBkYXRlLCB1cGRhdGVNb2R1bGVJZCkpIHtcblx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bdXBkYXRlTW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVt1cGRhdGVNb2R1bGVJZF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcnVuIG5ldyBydW50aW1lIG1vZHVsZXNcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudFVwZGF0ZVJ1bnRpbWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZVJ1bnRpbWVbaV0oX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG5cdFx0XHRmb3IgKHZhciBvdXRkYXRlZE1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG91dGRhdGVkTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRpZiAobW9kdWxlKSB7XG5cdFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9XG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuXHRcdFx0XHRcdFx0dmFyIGVycm9ySGFuZGxlcnMgPSBbXTtcblx0XHRcdFx0XHRcdHZhciBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3MgPSBbXTtcblx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0dmFyIGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcblx0XHRcdFx0XHRcdFx0dmFyIGFjY2VwdENhbGxiYWNrID1cblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9ySGFuZGxlciA9XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcGVuZGVuY3ldO1xuXHRcdFx0XHRcdFx0XHRpZiAoYWNjZXB0Q2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoYWNjZXB0Q2FsbGJhY2spICE9PSAtMSkgY29udGludWU7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goYWNjZXB0Q2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9ySGFuZGxlcnMucHVzaChlcnJvckhhbmRsZXIpO1xuXHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrcy5wdXNoKGRlcGVuZGVuY3kpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGNhbGxiYWNrcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrc1trXS5jYWxsKG51bGwsIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBlcnJvckhhbmRsZXJzW2tdID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ySGFuZGxlcnNba10oZXJyLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3Nba11cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIyKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuXHRcdFx0Zm9yICh2YXIgbyA9IDA7IG8gPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBvKyspIHtcblx0XHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbb107XG5cdFx0XHRcdHZhciBtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGl0ZW0ucmVxdWlyZShtb2R1bGVJZCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyLCB7XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZTogX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycjEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIxLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIxKTtcblx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb3V0ZGF0ZWRNb2R1bGVzO1xuXHRcdH1cblx0fTtcbn1cbl9fd2VicGFja19yZXF1aXJlX18uaG1ySS5yZXF1aXJlID0gZnVuY3Rpb24gKG1vZHVsZUlkLCBhcHBseUhhbmRsZXJzKSB7XG5cdGlmICghY3VycmVudFVwZGF0ZSkge1xuXHRcdGN1cnJlbnRVcGRhdGUgPSB7fTtcblx0XHRjdXJyZW50VXBkYXRlUnVudGltZSA9IFtdO1xuXHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gW107XG5cdFx0YXBwbHlIYW5kbGVycy5wdXNoKGFwcGx5SGFuZGxlcik7XG5cdH1cblx0aWYgKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG5cdFx0Y3VycmVudFVwZGF0ZVttb2R1bGVJZF0gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdO1xuXHR9XG59O1xuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDLnJlcXVpcmUgPSBmdW5jdGlvbiAoXG5cdGNodW5rSWRzLFxuXHRyZW1vdmVkQ2h1bmtzLFxuXHRyZW1vdmVkTW9kdWxlcyxcblx0cHJvbWlzZXMsXG5cdGFwcGx5SGFuZGxlcnMsXG5cdHVwZGF0ZWRNb2R1bGVzTGlzdFxuKSB7XG5cdGFwcGx5SGFuZGxlcnMucHVzaChhcHBseUhhbmRsZXIpO1xuXHRjdXJyZW50VXBkYXRlQ2h1bmtzID0ge307XG5cdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gcmVtb3ZlZENodW5rcztcblx0Y3VycmVudFVwZGF0ZSA9IHJlbW92ZWRNb2R1bGVzLnJlZHVjZShmdW5jdGlvbiAob2JqLCBrZXkpIHtcblx0XHRvYmpba2V5XSA9IGZhbHNlO1xuXHRcdHJldHVybiBvYmo7XG5cdH0sIHt9KTtcblx0Y3VycmVudFVwZGF0ZVJ1bnRpbWUgPSBbXTtcblx0Y2h1bmtJZHMuZm9yRWFjaChmdW5jdGlvbiAoY2h1bmtJZCkge1xuXHRcdGlmIChcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmXG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZFxuXHRcdCkge1xuXHRcdFx0cHJvbWlzZXMucHVzaChsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgdXBkYXRlZE1vZHVsZXNMaXN0KSk7XG5cdFx0XHRjdXJyZW50VXBkYXRlQ2h1bmtzW2NodW5rSWRdID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmYpIHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmYucmVxdWlyZUhtciA9IGZ1bmN0aW9uIChjaHVua0lkLCBwcm9taXNlcykge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRjdXJyZW50VXBkYXRlQ2h1bmtzICYmXG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlQ2h1bmtzLCBjaHVua0lkKSAmJlxuXHRcdFx0XHQhY3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXVxuXHRcdFx0KSB7XG5cdFx0XHRcdHByb21pc2VzLnB1c2gobG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpKTtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJNID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiByZXF1aXJlKFwiLi9cIiArIF9fd2VicGFja19yZXF1aXJlX18uaG1yRigpKTtcblx0fSlbJ2NhdGNoJ10oZnVuY3Rpb24oZXJyKSB7IGlmKGVyci5jb2RlICE9PSAnTU9EVUxFX05PVF9GT1VORCcpIHRocm93IGVycjsgfSk7XG59IiwiIiwiLy8gbW9kdWxlIGNhY2hlIGFyZSB1c2VkIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9wb2xsLmpzPzEwMDBcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9