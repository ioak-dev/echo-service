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
exports.isOperationAllowed = exports.fillMissingFields = exports.validateAndShapePayload = exports.loadSpec = void 0;
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
var validateAndShapePayload = function (payload, spec, path) {
    var _a;
    if (path === void 0) { path = ""; }
    var errors = [];
    var shapedData = {};
    for (var key in spec) {
        var fieldSpec = spec[key];
        var fullPath = path ? "".concat(path, ".").concat(key) : key;
        var value = payload === null || payload === void 0 ? void 0 : payload[key];
        if (fieldSpec.required && (value === undefined || value === null)) {
            errors.push("".concat(fullPath, " is required"));
            continue;
        }
        if (value === undefined) {
            shapedData[key] = getDefaultForType(fieldSpec.type);
            continue;
        }
        if (fieldSpec.type === "object") {
            if (typeof value !== "object" || Array.isArray(value)) {
                errors.push("".concat(fullPath, " should be an object"));
                continue;
            }
            var nested = (0, exports.validateAndShapePayload)(value, fieldSpec.schema || {}, fullPath);
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
                if (((_a = fieldSpec.schema) === null || _a === void 0 ? void 0 : _a.type) === "object") {
                    var nested = (0, exports.validateAndShapePayload)(item, fieldSpec.schema.schema || {}, itemPath);
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inferTypes = exports.deleteOne = exports.updateOne = exports.createOne = exports.getByReference = exports.search = exports.getAll = void 0;
var nanoid_1 = __webpack_require__(/*! nanoid */ "nanoid");
var schemaValidator_1 = __webpack_require__(/*! ./schemaValidator */ "./src/modules/universal/schemaValidator.ts");
var dbutils_1 = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
var filterBuilder_1 = __webpack_require__(/*! ./filterBuilder */ "./src/modules/universal/filterBuilder.ts");
var typeInference_1 = __webpack_require__(/*! ./typeInference */ "./src/modules/universal/typeInference.ts");
var alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var nanoid = (0, nanoid_1.customAlphabet)(alphanumericAlphabet, 8);
var getAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, _b, _c, page, _d, limit, rawFilters, Model, spec_1, filters, docs, total, shaped, totalPages, err_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "search")) {
                    return [2, res.status(404).json({ error: "Operation 'search' is not supported for this domain" })];
                }
                _b = req.query, _c = _b.page, page = _c === void 0 ? 1 : _c, _d = _b.limit, limit = _d === void 0 ? 10 : _d, rawFilters = __rest(_b, ["page", "limit"]);
                if (+page < 1) {
                    return [2, res.status(400).json({ error: "Page number must be 1 or greater." })];
                }
                if (+limit < 1) {
                    return [2, res.status(400).json({ error: "Limit must be 1 or greater." })];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 4, , 5]);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                spec_1 = (0, schemaValidator_1.loadSpec)(domain);
                filters = (0, filterBuilder_1.buildQueryFromFilters)(rawFilters, spec_1);
                return [4, Model.find(filters)
                        .skip((+page - 1) * +limit)
                        .limit(+limit)];
            case 2:
                docs = _e.sent();
                return [4, Model.countDocuments(filters)];
            case 3:
                total = _e.sent();
                shaped = docs.map(function (doc) { return (0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec_1); });
                totalPages = Math.ceil(total / +limit);
                res.json({ data: shaped, total: total, page: +page, limit: +limit, totalPages: totalPages });
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
    var _a, space, domain, _b, _c, filters, _d, pagination, _e, page, _f, limit, Model, spec_2, mongoQuery, docs, total, shaped, totalPages, err_2;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                _b = req.body, _c = _b.filters, filters = _c === void 0 ? {} : _c, _d = _b.pagination, pagination = _d === void 0 ? {} : _d;
                _e = pagination.page, page = _e === void 0 ? 1 : _e, _f = pagination.limit, limit = _f === void 0 ? 10 : _f;
                if (+page < 1) {
                    return [2, res.status(400).json({ error: "Page number must be 1 or greater." })];
                }
                if (+limit < 1) {
                    return [2, res.status(400).json({ error: "Limit must be 1 or greater." })];
                }
                _g.label = 1;
            case 1:
                _g.trys.push([1, 4, , 5]);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                spec_2 = (0, schemaValidator_1.loadSpec)(domain);
                mongoQuery = (0, filterBuilder_1.buildQueryFromAdvancedFilters)(filters, spec_2);
                return [4, Model.find(mongoQuery)
                        .skip((+page - 1) * +limit)
                        .limit(+limit)];
            case 2:
                docs = _g.sent();
                return [4, Model.countDocuments(mongoQuery)];
            case 3:
                total = _g.sent();
                shaped = docs.map(function (doc) {
                    return (0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec_2);
                });
                totalPages = Math.ceil(total / +limit);
                res.json({ data: shaped, total: total, page: +page, limit: +limit, totalPages: totalPages });
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
                _c.trys.push([1, 3, , 4]);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                result = (0, schemaValidator_1.validateAndShapePayload)(req.body, spec);
                if (!result.valid) {
                    return [2, res.status(400).json({ error: "Validation failed", details: result.errors })];
                }
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                timestamp = new Date();
                doc = new Model(__assign(__assign({}, result.shapedData), { reference: nanoid(), createdAt: timestamp, updatedAt: timestamp, createdBy: userId, updatedBy: userId }));
                return [4, doc.save()];
            case 2:
                _c.sent();
                res.status(201).json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                return [3, 4];
            case 3:
                err_4 = _c.sent();
                res.status(500).json({ error: "Error creating document", details: err_4.message });
                return [3, 4];
            case 4: return [2];
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
                _c.trys.push([1, 3, , 4]);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                result = (0, schemaValidator_1.validateAndShapePayload)(req.body, spec);
                if (!result.valid) {
                    return [2, res.status(400).json({ error: "Validation failed", details: result.errors })];
                }
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                updateData = __assign(__assign({}, result.shapedData), { updatedAt: new Date(), updatedBy: userId });
                return [4, Model.findOneAndUpdate({ reference: reference }, updateData, { new: true })];
            case 2:
                doc = _c.sent();
                if (!doc)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                return [3, 4];
            case 3:
                err_5 = _c.sent();
                res.status(500).json({ error: "Error updating document", details: err_5.message });
                return [3, 4];
            case 4: return [2];
        }
    });
}); };
exports.updateOne = updateOne;
var deleteOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, Model, doc, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "delete")) {
                    return [2, res.status(404).json({ error: "Operation 'delete' is not supported for this domain" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                return [4, Model.findOneAndDelete({ reference: reference })];
            case 2:
                doc = _b.sent();
                if (!doc)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.status(204).send();
                return [3, 4];
            case 3:
                err_6 = _b.sent();
                res.status(500).json({ error: "Error deleting document", details: err_6.message });
                return [3, 4];
            case 4: return [2];
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
var fragmentSpec = {
    "name": {
        "type": "string",
        "required": true
    },
    "latestContent": {
        "type": "string",
        "required": false
    },
    "storythreadId": {
        "type": "string",
        "required": true
    },
    "labels": {
        "type": "array",
        "required": false,
        "schema": {
            "type": "object",
            "schema": {
                "label": {
                    "type": "string"
                },
                "value": {
                    "type": "string"
                }
            }
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
exports["default"] = fragmentSpec;


/***/ }),

/***/ "./src/specs/domains/fragmentComment.spec.ts":
/*!***************************************************!*\
  !*** ./src/specs/domains/fragmentComment.spec.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var fragmentCommentSpec = {
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
exports["default"] = fragmentCommentSpec;


/***/ }),

/***/ "./src/specs/domains/fragmentVersion.spec.ts":
/*!***************************************************!*\
  !*** ./src/specs/domains/fragmentVersion.spec.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var fragmentVersionSpec = {
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
exports["default"] = fragmentVersionSpec;


/***/ }),

/***/ "./src/specs/domains/index.ts":
/*!************************************!*\
  !*** ./src/specs/domains/index.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.specsMap = void 0;
var fragment_spec_1 = __importDefault(__webpack_require__(/*! ./fragment.spec */ "./src/specs/domains/fragment.spec.ts"));
var fragmentComment_spec_1 = __importDefault(__webpack_require__(/*! ./fragmentComment.spec */ "./src/specs/domains/fragmentComment.spec.ts"));
var fragmentVersion_spec_1 = __importDefault(__webpack_require__(/*! ./fragmentVersion.spec */ "./src/specs/domains/fragmentVersion.spec.ts"));
var storythread_spec_1 = __importDefault(__webpack_require__(/*! ./storythread.spec */ "./src/specs/domains/storythread.spec.ts"));
var user_spec_1 = __importDefault(__webpack_require__(/*! ./user.spec */ "./src/specs/domains/user.spec.ts"));
exports.specsMap = {
    user: user_spec_1.default,
    fragment: fragment_spec_1.default,
    fragmentComment: fragmentComment_spec_1.default,
    fragmentVersion: fragmentVersion_spec_1.default,
    storythread: storythread_spec_1.default
};


/***/ }),

/***/ "./src/specs/domains/storythread.spec.ts":
/*!***********************************************!*\
  !*** ./src/specs/domains/storythread.spec.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var storythreadSpec = {
    "title": {
        "type": "string",
        "required": true
    },
    "description": {
        "type": "string",
        "required": false
    }
};
exports["default"] = storythreadSpec;


/***/ }),

/***/ "./src/specs/domains/user.spec.ts":
/*!****************************************!*\
  !*** ./src/specs/domains/user.spec.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var userSpec = {
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
exports["default"] = userSpec;


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
/******/ 		__webpack_require__.h = () => ("feb782a2bc444a31e602")
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBLG1CQUFtQjs7Ozs7Ozs7Ozs7O0FDZm5COzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBLHNCQUFzQjtVQUN0QixvREFBb0QsdUJBQXVCO1VBQzNFO1VBQ0E7VUFDQSxHQUFHO1VBQ0g7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N4Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTs7Ozs7V0NBQTs7Ozs7V0NBQTs7Ozs7V0NBQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsQ0FBQzs7V0FFRDtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwyQkFBMkI7V0FDM0IsNEJBQTRCO1dBQzVCLDJCQUEyQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHOztXQUVIO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLG9CQUFvQixnQkFBZ0I7V0FDcEM7V0FDQTtXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQSxvQkFBb0IsZ0JBQWdCO1dBQ3BDO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU07V0FDTjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRzs7V0FFSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQSxHQUFHOztXQUVIO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7O1dBRUEsaUJBQWlCLHFDQUFxQztXQUN0RDs7V0FFQSxnREFBZ0Q7V0FDaEQ7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esb0JBQW9CLGlCQUFpQjtXQUNyQztXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNILEVBQUU7V0FDRjs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsT0FBTztXQUNQLE1BQU07V0FDTixLQUFLO1dBQ0wsSUFBSTtXQUNKLEdBQUc7V0FDSDs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQTs7V0FFQTtXQUNBOztXQUVBOztXQUVBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7O1dBRUE7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIOztXQUVBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDs7V0FFQTtXQUNBOztXQUVBO1dBQ0E7V0FDQSxFQUFFOztXQUVGO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLG9CQUFvQixvQkFBb0I7V0FDeEM7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFOztXQUVGO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQSxJQUFJO1dBQ0o7O1dBRUE7V0FDQTtXQUNBLEdBQUc7V0FDSCxFQUFFO1dBQ0Y7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NsWUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxtQkFBbUIsMkJBQTJCO1dBQzlDO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBLGtCQUFrQixjQUFjO1dBQ2hDO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQSxjQUFjLE1BQU07V0FDcEI7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsY0FBYyxhQUFhO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0EsaUJBQWlCLDRCQUE0QjtXQUM3QztXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBO1dBQ0E7V0FDQSxnQkFBZ0IsNEJBQTRCO1dBQzVDO1dBQ0E7V0FDQTs7V0FFQTtXQUNBOztXQUVBO1dBQ0E7O1dBRUE7V0FDQTs7V0FFQTtXQUNBLGdCQUFnQiw0QkFBNEI7V0FDNUM7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esa0JBQWtCLHVDQUF1QztXQUN6RDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBLG1CQUFtQixpQ0FBaUM7V0FDcEQ7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHNCQUFzQix1Q0FBdUM7V0FDN0Q7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esc0JBQXNCLHNCQUFzQjtXQUM1QztXQUNBO1dBQ0EsU0FBUztXQUNUO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxXQUFXO1dBQ1gsV0FBVztXQUNYO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsWUFBWTtXQUNaO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLFVBQVU7V0FDVjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxXQUFXO1dBQ1g7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQSxtQkFBbUIsd0NBQXdDO1dBQzNEO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxRQUFRO1dBQ1IsUUFBUTtXQUNSO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLFNBQVM7V0FDVDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxPQUFPO1dBQ1A7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLFFBQVE7V0FDUjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRSxJQUFJO1dBQ047V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLElBQUk7V0FDSjtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTtXQUNBLEVBQUUsMkJBQTJCLGdEQUFnRDtXQUM3RTs7Ozs7VUUxZEE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbGliL2RidXRpbHMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbGliL3ZhbGlkYXRpb24udHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9taWRkbGV3YXJlcy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2F1dGgvaGVscGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvYXV0aC9yb3V0ZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2F1dGgvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2NvbXBhbnkvaGVscGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvY29tcGFueS9tb2RlbC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2NvbXBhbnkvcm91dGUudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9jb21wYW55L3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9oZWxsby9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9oZWxsby9yb3V0ZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2hlbGxvL3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9wZXJtaXNzaW9uL2hlbHBlci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3NlcXVlbmNlL3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9zZXNzaW9uL2luZGV4LnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvc2Vzc2lvbi9tb2RlbC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VuaXZlcnNhbC9maWx0ZXJCdWlsZGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdW5pdmVyc2FsL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdW5pdmVyc2FsL3NjaGVtYVZhbGlkYXRvci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VuaXZlcnNhbC9zZXJ2aWNlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdW5pdmVyc2FsL3R5cGVJbmZlcmVuY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2hlbHBlci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2ludml0ZS9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2ludml0ZS9tb2RlbC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvaW52aXRlL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdXNlci9pbnZpdGUvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdXNlci9zZXJ2aWNlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3NwZWNzL2RvbWFpbnMvZnJhZ21lbnQuc3BlYy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9zcGVjcy9kb21haW5zL2ZyYWdtZW50Q29tbWVudC5zcGVjLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3NwZWNzL2RvbWFpbnMvZnJhZ21lbnRWZXJzaW9uLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3BlY3MvZG9tYWlucy9pbmRleC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9zcGVjcy9kb21haW5zL3N0b3J5dGhyZWFkLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3BlY3MvZG9tYWlucy91c2VyLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3RhcnR1cC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9sb2ctYXBwbHktcmVzdWx0LmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy5qcyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9wb2xsLmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL2xpYi9hdXRodXRpbHMuanMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9hc3NldC9pbmRleC5qcyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2Fzc2V0L21vZGVsLmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvZ3FsLXNjYWxhci9pbmRleC5qcyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3NlcXVlbmNlL21vZGVsLmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJheGlvc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiYmNyeXB0XCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJkYXRlLWZuc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwiZ3JhcGhxbC10eXBlLWpzb25cIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImpzb253ZWJ0b2tlblwiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwibW9uZ29vc2VcIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcIm5hbm9pZFwiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIGNvbW1vbmpzIFwidXVpZFwiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJmc1wiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IHVwZGF0ZSBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0IHVwZGF0ZSBtYW5pZmVzdCBmaWxlbmFtZSIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvaG90IG1vZHVsZSByZXBsYWNlbWVudCIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL3J1bnRpbWUvcmVxdWlyZSBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYXN5bmNIYW5kbGVyID0gdm9pZCAwO1xudmFyIGFzeW5jSGFuZGxlciA9IGZ1bmN0aW9uIChmbikgeyByZXR1cm4gZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmbihyZXEsIHJlcywgbmV4dCkpLmNhdGNoKG5leHQpO1xufTsgfTtcbmV4cG9ydHMuYXN5bmNIYW5kbGVyID0gYXN5bmNIYW5kbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEdsb2JhbENvbGxlY3Rpb25CeU5hbWUgPSBleHBvcnRzLmdldENvbGxlY3Rpb25CeU5hbWUgPSBleHBvcnRzLmdldEdsb2JhbENvbGxlY3Rpb24gPSBleHBvcnRzLmdldENvbGxlY3Rpb24gPSB2b2lkIDA7XG52YXIgbW9uZ29vc2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibW9uZ29vc2VcIikpO1xudmFyIGdldENvbGxlY3Rpb24gPSBmdW5jdGlvbiAocmVhbG0sIGNvbGxlY3Rpb24sIHNjaGVtYSkge1xuICAgIHZhciBkYiA9IG1vbmdvb3NlXzEuZGVmYXVsdC5jb25uZWN0aW9uLnVzZURiKFwiZWNob19cIi5jb25jYXQocmVhbG0pKTtcbiAgICByZXR1cm4gZGIubW9kZWwoY29sbGVjdGlvbiwgc2NoZW1hKTtcbn07XG5leHBvcnRzLmdldENvbGxlY3Rpb24gPSBnZXRDb2xsZWN0aW9uO1xudmFyIGdldEdsb2JhbENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc2NoZW1hKSB7XG4gICAgdmFyIGRiID0gbW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3Rpb24udXNlRGIoXCJlY2hvXCIpO1xuICAgIHJldHVybiBkYi5tb2RlbChjb2xsZWN0aW9uLCBzY2hlbWEpO1xufTtcbmV4cG9ydHMuZ2V0R2xvYmFsQ29sbGVjdGlvbiA9IGdldEdsb2JhbENvbGxlY3Rpb247XG52YXIgZGVmYXVsdFNjaGVtYSA9IG5ldyBtb25nb29zZV8xLmRlZmF1bHQuU2NoZW1hKHt9LCB7IHN0cmljdDogZmFsc2UgfSk7XG52YXIgZ2V0Q29sbGVjdGlvbkJ5TmFtZSA9IGZ1bmN0aW9uIChyZWFsbSwgY29sbGVjdGlvbk5hbWUpIHtcbiAgICB2YXIgZGIgPSBtb25nb29zZV8xLmRlZmF1bHQuY29ubmVjdGlvbi51c2VEYihcImVjaG9fXCIuY29uY2F0KHJlYWxtKSk7XG4gICAgcmV0dXJuIGRiLm1vZGVsKGNvbGxlY3Rpb25OYW1lLCBkZWZhdWx0U2NoZW1hLCBjb2xsZWN0aW9uTmFtZSk7XG59O1xuZXhwb3J0cy5nZXRDb2xsZWN0aW9uQnlOYW1lID0gZ2V0Q29sbGVjdGlvbkJ5TmFtZTtcbnZhciBnZXRHbG9iYWxDb2xsZWN0aW9uQnlOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gICAgdmFyIGRiID0gbW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3Rpb24udXNlRGIoXCJlY2hvXCIpO1xuICAgIHJldHVybiBkYi5tb2RlbChjb2xsZWN0aW9uTmFtZSwgZGVmYXVsdFNjaGVtYSwgY29sbGVjdGlvbk5hbWUpO1xufTtcbmV4cG9ydHMuZ2V0R2xvYmFsQ29sbGVjdGlvbkJ5TmFtZSA9IGdldEdsb2JhbENvbGxlY3Rpb25CeU5hbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMgPSB2b2lkIDA7XG52YXIgdmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMgPSBmdW5jdGlvbiAocmVzLCBkYXRhLCBtYW5kYXRvcnlGaWVsZHMpIHtcbiAgICB2YXIgbWlzc2luZ0ZpZWxkcyA9IFtdO1xuICAgIG1hbmRhdG9yeUZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZE5hbWUpIHtcbiAgICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KGZpZWxkTmFtZSkpIHtcbiAgICAgICAgICAgIG1pc3NpbmdGaWVsZHMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG1pc3NpbmdGaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXMuc3RhdHVzKDQwMCk7XG4gICAgcmVzLnNlbmQoe1xuICAgICAgICBlcnJvcjogeyBtaXNzaW5nRmllbGRzOiBtaXNzaW5nRmllbGRzIH0sXG4gICAgfSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5leHBvcnRzLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzID0gdmFsaWRhdGVNYW5kYXRvcnlGaWVsZHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmlmIChtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyLnN0b3AoKTsgfSk7XG59XG52YXIgQXBvbGxvU2VydmVyID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKS5BcG9sbG9TZXJ2ZXI7XG52YXIgbWlkZGxld2FyZXNfMSA9IHJlcXVpcmUoXCIuL21pZGRsZXdhcmVzXCIpO1xudmFyIG1vbmdvb3NlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIm1vbmdvb3NlXCIpKTtcbnZhciBzdGFydHVwXzEgPSByZXF1aXJlKFwiLi9zdGFydHVwXCIpO1xudmFyIGV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcbnZhciBjb3JzID0gcmVxdWlyZShcImNvcnNcIik7XG52YXIgQXBpUm91dGUgPSByZXF1aXJlKFwiLi9yb3V0ZVwiKTtcbnZhciBncWxTY2FsYXJTY2hlbWEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL2dxbC1zY2FsYXJcIik7XG52YXIgYXNzZXRTY2hlbWEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL2Fzc2V0XCIpO1xudmFyIHNlc3Npb25TY2hlbWEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL3Nlc3Npb25cIik7XG52YXIgdXNlclNjaGVtYSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvdXNlclwiKTtcbnZhciBkYXRhYmFzZVVyaSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfVVJJIHx8IFwibW9uZ29kYjovLzEyNy4wLjAuMToyNzAxN1wiO1xubW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3QoZGF0YWJhc2VVcmksIHt9KTtcbm1vbmdvb3NlXzEuZGVmYXVsdC5wbHVyYWxpemUodW5kZWZpbmVkKTtcbnZhciBhcHAgPSBleHByZXNzKCk7XG52YXIgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG4gICAgdHlwZURlZnM6IFtcbiAgICAgICAgZ3FsU2NhbGFyU2NoZW1hLnR5cGVEZWZzLFxuICAgICAgICBhc3NldFNjaGVtYS50eXBlRGVmcyxcbiAgICAgICAgc2Vzc2lvblNjaGVtYS50eXBlRGVmcyxcbiAgICAgICAgdXNlclNjaGVtYS50eXBlRGVmcyxcbiAgICBdLFxuICAgIHJlc29sdmVyczogW1xuICAgICAgICBncWxTY2FsYXJTY2hlbWEucmVzb2x2ZXJzLFxuICAgICAgICBhc3NldFNjaGVtYS5yZXNvbHZlcnMsXG4gICAgICAgIHNlc3Npb25TY2hlbWEucmVzb2x2ZXJzLFxuICAgICAgICB1c2VyU2NoZW1hLnJlc29sdmVycyxcbiAgICBdLFxuICAgIGNvbnRleHQ6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgcmVxID0gX2EucmVxLCByZXMgPSBfYS5yZXM7XG4gICAgICAgIHZhciBhdXRoU3RyaW5nID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiB8fCBcIlwiO1xuICAgICAgICB2YXIgYXV0aFBhcnRzID0gYXV0aFN0cmluZy5zcGxpdChcIiBcIik7XG4gICAgICAgIHZhciB0b2tlbiA9IFwiXCI7XG4gICAgICAgIHZhciB1c2VyID0gbnVsbDtcbiAgICAgICAgdmFyIGFzc2V0ID0gXCJcIjtcbiAgICAgICAgaWYgKGF1dGhQYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIHRva2VuID0gYXV0aFBhcnRzWzFdO1xuICAgICAgICAgICAgYXNzZXQgPSBhdXRoUGFydHNbMF07XG4gICAgICAgICAgICB1c2VyID0gKDAsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplKSh0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdXNlcjogdXNlciwgdG9rZW46IHRva2VuLCBhc3NldDogYXNzZXQgfTtcbiAgICB9LFxuICAgIGludHJvc3BlY3Rpb246IHRydWUsXG4gICAgcGxheWdyb3VuZDogdHJ1ZSxcbn0pO1xuc2VydmVyLnN0YXJ0KCkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiBzZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHsgYXBwOiBhcHAgfSk7IH0pO1xuYXBwLnVzZShjb3JzKCkpO1xuYXBwLmdldChcIi9oZWxsb1wiLCBmdW5jdGlvbiAoXywgcmVzKSB7XG4gICAgcmVzLnNlbmQoXCJiYXNpYyBjb25uZWN0aW9uIHRvIHNlcnZlciB3b3Jrcy4gZGF0YWJhc2UgY29ubmVjdGlvbiBpcyBub3QgdmFsaWRhdGVkXCIpO1xuICAgIHJlcy5lbmQoKTtcbn0pO1xuYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogNTAwMDAwMCB9KSk7XG5hcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7XG4gICAgZXh0ZW5kZWQ6IHRydWUsXG59KSk7XG5hcHAudXNlKFwiL2FwaVwiLCBBcGlSb3V0ZSk7XG5hcHAudXNlKGZ1bmN0aW9uIChfLCByZXMpIHtcbiAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgcmVzLnNlbmQoXCJOb3QgZm91bmRcIik7XG4gICAgcmVzLmVuZCgpO1xufSk7XG5hcHAudXNlKGZ1bmN0aW9uIChlcnIsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnIuc3RhY2spO1xufSk7XG5hcHAubGlzdGVuKHsgcG9ydDogcHJvY2Vzcy5lbnYuUE9SVCB8fCA0MDAwIH0sIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY29uc29sZS5sb2coXCJcXHVEODNEXFx1REU4MCBTZXJ2ZXIgcmVhZHkgYXQgaHR0cDovL2xvY2FsaG9zdDpcIi5jb25jYXQocHJvY2Vzcy5lbnYuUE9SVCB8fCA0MDAwKS5jb25jYXQoc2VydmVyLmdyYXBocWxQYXRoKSk7XG59KTtcbigwLCBzdGFydHVwXzEuaW5pdGlhbGl6ZVNlcXVlbmNlcykoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hdXRob3JpemVBcGkgPSBleHBvcnRzLmF1dGhvcml6ZUFwaU9uZWF1dGggPSBleHBvcnRzLmF1dGhvcml6ZSA9IHZvaWQgMDtcbnZhciBmc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7XG52YXIganNvbndlYnRva2VuXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImpzb253ZWJ0b2tlblwiKSk7XG52YXIgaGVscGVyXzEgPSByZXF1aXJlKFwiLi9tb2R1bGVzL2F1dGgvaGVscGVyXCIpO1xudmFyIGF1dGhvcml6ZSA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHZhciBhcHBSb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB2YXIgcHVibGljS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvcHVibGljLnBlbVwiKTtcbiAgICB0cnkge1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBqc29ud2VidG9rZW5fMS5kZWZhdWx0LnZlcmlmeSh0b2tlbiwgcHVibGljS2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59O1xuZXhwb3J0cy5hdXRob3JpemUgPSBhdXRob3JpemU7XG52YXIgYXV0aG9yaXplQXBpT25lYXV0aCA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG9rZW4sIGRhdGEsIGVycl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSByZXEuaGVhZGVyc1tcImF1dGhvcml6YXRpb25cIl07XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zZW5kU3RhdHVzKDQwMSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBoZWxwZXJfMS5kZWNvZGVUb2tlbikodG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5vdXRjb21lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcS51c2VyID0gZGF0YS5jbGFpbXM7XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyXzEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5hdXRob3JpemVBcGlPbmVhdXRoID0gYXV0aG9yaXplQXBpT25lYXV0aDtcbnZhciBhdXRob3JpemVBcGkgPSBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRva2VuLCBkYXRhLCBlcnJfMjtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9kKSB7XG4gICAgICAgIHN3aXRjaCAoX2QubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfZC50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHRva2VuID0gcmVxLmhlYWRlcnNbXCJhdXRob3JpemF0aW9uXCJdO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc2VuZFN0YXR1cyg0MDEpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgaGVscGVyXzEuZGVjb2RlVG9rZW4pKHRva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZGF0YSA9IF9kLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEub3V0Y29tZSB8fFxuICAgICAgICAgICAgICAgICAgICAocmVxLnBhcmFtcy5zcGFjZSAmJiAoISgoX2EgPSBkYXRhLmNsYWltcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBlcm1pc3Npb25zKSB8fCAhKChfYyA9IChfYiA9IGRhdGEuY2xhaW1zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IucGVybWlzc2lvbnNbJ0NPTVBBTllfQURNSU4nXSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmluY2x1ZGVzKHJlcS5wYXJhbXMuc3BhY2UpKSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcS51c2VyID0gZGF0YS5jbGFpbXM7XG4gICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyXzIgPSBfZC5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyXzIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5hdXRob3JpemVBcGkgPSBhdXRob3JpemVBcGk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVjb2RlQXBwVG9rZW4gPSBleHBvcnRzLmVuY29kZUFwcFRva2VuID0gZXhwb3J0cy5nZXRIYXNoID0gZXhwb3J0cy5kZWNvZGVTZXNzaW9uID0gZXhwb3J0cy5kZWNvZGVUb2tlbiA9IGV4cG9ydHMuZGVsZXRlU2Vzc2lvbkJ5UmVmcmVzaFRva2VuID0gZXhwb3J0cy5kZWxldGVTZXNzaW9uID0gZXhwb3J0cy52YWxpZGF0ZVNlc3Npb24gPSBleHBvcnRzLmdldEFjY2Vzc1Rva2VuID0gZXhwb3J0cy5jcmVhdGVTZXNzaW9uID0gdm9pZCAwO1xudmFyIGJjcnlwdF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJiY3J5cHRcIikpO1xudmFyIHV1aWRfMSA9IHJlcXVpcmUoXCJ1dWlkXCIpO1xudmFyIGZzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImZzXCIpKTtcbnZhciBqc29ud2VidG9rZW5fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwianNvbndlYnRva2VuXCIpKTtcbnZhciBkYXRlX2Zuc18xID0gcmVxdWlyZShcImRhdGUtZm5zXCIpO1xudmFyIG1vZGVsXzEgPSByZXF1aXJlKFwiLi4vc2Vzc2lvbi9tb2RlbFwiKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xudmFyIGFwcFVybCA9IHByb2Nlc3MuZW52LkFQUF9VUkwgfHwgXCJodHRwOi8vbG9jYWxob3N0OjMwMTBcIjtcbnZhciBjcmVhdGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtLCB1c2VyKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXNzaW9uX2lkLCBtb2RlbCwgY2xhaW1zLCBhcHBSb290LCBwcml2YXRlS2V5LCByZWZyZXNoX3Rva2VuO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHNlc3Npb25faWQgPSAoMCwgdXVpZF8xLnY0KSgpO1xuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uKShTdHJpbmcocmVhbG0pLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIGNsYWltcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fbmFtZTogdXNlci5naXZlbl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICBmYW1pbHlfbmFtZTogdXNlci5mYW1pbHlfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBuaWNrbmFtZTogdXNlci5uaWNrbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IHVzZXIudHlwZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFwcFJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgICAgICAgICAgIHByaXZhdGVLZXkgPSBmc18xLmRlZmF1bHQucmVhZEZpbGVTeW5jKGFwcFJvb3QgKyBcIi9wcml2YXRlLnBlbVwiKTtcbiAgICAgICAgICAgICAgICByZWZyZXNoX3Rva2VuID0ganNvbndlYnRva2VuXzEuZGVmYXVsdC5zaWduKHtcbiAgICAgICAgICAgICAgICAgICAgcmVhbG06IHJlYWxtLFxuICAgICAgICAgICAgICAgICAgICBpZDogc2Vzc2lvbl9pZCxcbiAgICAgICAgICAgICAgICB9LCB7IGtleTogcHJpdmF0ZUtleSwgcGFzc3BocmFzZTogXCJubzFrbm93c21lXCIgfSwge1xuICAgICAgICAgICAgICAgICAgICBhbGdvcml0aG06IFwiUlMyNTZcIixcbiAgICAgICAgICAgICAgICAgICAgZXhwaXJlc0luOiBcIjhoXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbl9pZDogc2Vzc2lvbl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhaW1zOiBjbGFpbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBpYXQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXQ6ICgwLCBkYXRlX2Zuc18xLmFkZCkobmV3IERhdGUoKSwgeyBob3VyczogOCB9KSxcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHsgc2Vzc2lvbl9pZDogc2Vzc2lvbl9pZCwgcmVmcmVzaF90b2tlbjogcmVmcmVzaF90b2tlbiB9XTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmNyZWF0ZVNlc3Npb24gPSBjcmVhdGVTZXNzaW9uO1xudmFyIGdldEFjY2Vzc1Rva2VuID0gZnVuY3Rpb24gKHJlZnJlc2hUb2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVjb2RlZCwgY2xhaW1zLCBhcHBSb290LCBwcml2YXRlS2V5LCBtb2RlbCwgc2Vzc2lvbiwgcmVmcmVzaFRva2VuRHVyYXRpb24sIGFjY2Vzc190b2tlbjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5kZWNvZGVUb2tlbikocmVmcmVzaFRva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZGVjb2RlZCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRlY29kZWQub3V0Y29tZSB8fFxuICAgICAgICAgICAgICAgICAgICAhZGVjb2RlZC5jbGFpbXMgfHxcbiAgICAgICAgICAgICAgICAgICAgIWRlY29kZWQuY2xhaW1zLnJlYWxtIHx8XG4gICAgICAgICAgICAgICAgICAgICFkZWNvZGVkLmNsYWltcy5pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFpbXMgPSBkZWNvZGVkLmNsYWltcztcbiAgICAgICAgICAgICAgICBhcHBSb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgICAgICAgICAgICAgICBwcml2YXRlS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvcHJpdmF0ZS5wZW1cIik7XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKGNsYWltcy5yZWFsbSwgbW9kZWxfMS5zZXNzaW9uQ29sbGVjdGlvbiwgbW9kZWxfMS5zZXNzaW9uU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmUoeyBzZXNzaW9uX2lkOiBjbGFpbXMuaWQgfSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCgwLCBkYXRlX2Zuc18xLmRpZmZlcmVuY2VJblNlY29uZHMpKHNlc3Npb24uZWF0LCBuZXcgRGF0ZSgpKSA8IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlZnJlc2hUb2tlbkR1cmF0aW9uID0gKDAsIGRhdGVfZm5zXzEuZGlmZmVyZW5jZUluU2Vjb25kcykoc2Vzc2lvbi5lYXQsIG5ldyBEYXRlKCkpID4gNjAgKiA2MCAqIDJcbiAgICAgICAgICAgICAgICAgICAgPyA2MCAqIDYwICogMlxuICAgICAgICAgICAgICAgICAgICA6ICgwLCBkYXRlX2Zuc18xLmRpZmZlcmVuY2VJblNlY29uZHMpKHNlc3Npb24uZWF0LCBuZXcgRGF0ZSgpKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW4gPSBqc29ud2VidG9rZW5fMS5kZWZhdWx0LnNpZ24oc2Vzc2lvbi5jbGFpbXMsIHsga2V5OiBwcml2YXRlS2V5LCBwYXNzcGhyYXNlOiBcIm5vMWtub3dzbWVcIiB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGFsZ29yaXRobTogXCJSUzI1NlwiLFxuICAgICAgICAgICAgICAgICAgICBleHBpcmVzSW46IFwiXCIuY29uY2F0KHJlZnJlc2hUb2tlbkR1cmF0aW9uLCBcInNcIiksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBhY2Nlc3NfdG9rZW5dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0QWNjZXNzVG9rZW4gPSBnZXRBY2Nlc3NUb2tlbjtcbnZhciB2YWxpZGF0ZVNlc3Npb24gPSBmdW5jdGlvbiAocmVhbG0sIHNlc3Npb25JZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIHNlc3Npb247XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKFN0cmluZyhyZWFsbSksIG1vZGVsXzEuc2Vzc2lvbkNvbGxlY3Rpb24sIG1vZGVsXzEuc2Vzc2lvblNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgc2Vzc2lvbklkOiBzZXNzaW9uSWQgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBzZXNzaW9uXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZhbGlkYXRlU2Vzc2lvbjtcbnZhciBkZWxldGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtLCBzZXNzaW9uX2lkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbikoU3RyaW5nKHJlYWxtKSwgbW9kZWxfMS5zZXNzaW9uQ29sbGVjdGlvbiwgbW9kZWxfMS5zZXNzaW9uU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmRlbGV0ZU9uZSh7IHNlc3Npb25faWQ6IHNlc3Npb25faWQgfSldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWxldGVTZXNzaW9uID0gZGVsZXRlU2Vzc2lvbjtcbnZhciBkZWxldGVTZXNzaW9uQnlSZWZyZXNoVG9rZW4gPSBmdW5jdGlvbiAocmVhbG0sIHJlZnJlc2hfdG9rZW4pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uKShTdHJpbmcocmVhbG0pLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZGVsZXRlT25lKHsgcmVmcmVzaF90b2tlbjogcmVmcmVzaF90b2tlbiB9KV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlbGV0ZVNlc3Npb25CeVJlZnJlc2hUb2tlbiA9IGRlbGV0ZVNlc3Npb25CeVJlZnJlc2hUb2tlbjtcbnZhciBkZWNvZGVUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXBwUm9vdCwgcHVibGljS2V5LCByZXMsIGVycl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGFwcFJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgICAgICAgICAgIHB1YmxpY0tleSA9IGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoYXBwUm9vdCArIFwiL3B1YmxpYy5wZW1cIik7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBqc29ud2VidG9rZW5fMS5kZWZhdWx0LnZlcmlmeSh0b2tlbiwgcHVibGljS2V5KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBvdXRjb21lOiB0cnVlLCB0b2tlbjogdG9rZW4sIGNsYWltczogcmVzIH1dO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycl8xKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHsgb3V0Y29tZTogZmFsc2UsIGVycjogZXJyXzEgfV07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWNvZGVUb2tlbiA9IGRlY29kZVRva2VuO1xudmFyIGRlY29kZVNlc3Npb24gPSBmdW5jdGlvbiAocmVhbG1JZCwgc2Vzc2lvbklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXNzaW9uO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsICgwLCBleHBvcnRzLnZhbGlkYXRlU2Vzc2lvbikocmVhbG1JZCwgc2Vzc2lvbklkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBzZXNzaW9uXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCAoMCwgZXhwb3J0cy5kZWNvZGVUb2tlbikoc2Vzc2lvbi50b2tlbildO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlU2Vzc2lvbiA9IGRlY29kZVNlc3Npb247XG52YXIgZ2V0SGFzaCA9IGZ1bmN0aW9uIChwYXNzd29yZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2FsdDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBiY3J5cHRfMS5kZWZhdWx0LmdlblNhbHQoMTApXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzYWx0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgYmNyeXB0XzEuZGVmYXVsdC5oYXNoKHBhc3N3b3JkLCBzYWx0KV07XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldEhhc2ggPSBnZXRIYXNoO1xudmFyIGVuY29kZUFwcFRva2VuID0gZnVuY3Rpb24gKGNsYWltcykge1xuICAgIHZhciBhcHBSb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB2YXIgcHJpdmF0ZUtleSA9IGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoYXBwUm9vdCArIFwiL2xvY2FsX3ByaXZhdGUucGVtXCIpO1xuICAgIHZhciB0b2tlbiA9IGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQuc2lnbihjbGFpbXMsIHsga2V5OiBwcml2YXRlS2V5LCBwYXNzcGhyYXNlOiBcImZldmljcnlsXCIgfSwge1xuICAgICAgICBhbGdvcml0aG06IFwiUlMyNTZcIixcbiAgICAgICAgZXhwaXJlc0luOiBcIjEwMGhcIixcbiAgICB9KTtcbiAgICByZXR1cm4gdG9rZW47XG59O1xuZXhwb3J0cy5lbmNvZGVBcHBUb2tlbiA9IGVuY29kZUFwcFRva2VuO1xudmFyIGRlY29kZUFwcFRva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcHBSb290LCBwdWJsaWNLZXksIHJlcywgZXJyXzI7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgYXBwUm9vdCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgICAgICAgICAgcHVibGljS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvbG9jYWxfcHVibGljLnBlbVwiKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHRva2VuLCBwdWJsaWNLZXkpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7IG91dGNvbWU6IHRydWUsIHRva2VuOiB0b2tlbiwgY2xhaW1zOiByZXMgfV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyXzIgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyXzIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBvdXRjb21lOiBmYWxzZSwgZXJyOiBlcnJfMiB9XTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlY29kZUFwcFRva2VuID0gZGVjb2RlQXBwVG9rZW47XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBoYW5kbGVyXzEgPSByZXF1aXJlKFwiLi4vLi4vaGFuZGxlclwiKTtcbnZhciBtaWRkbGV3YXJlc18xID0gcmVxdWlyZShcIi4uLy4uL21pZGRsZXdhcmVzXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3NlcnZpY2VcIik7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgcm91dGVyLnBvc3QoXCIvYXV0aC9hdXRob3JpemVcIiwgKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKHNlcnZpY2VfMS5zaWduaW4pKTtcbiAgICByb3V0ZXIucG9zdChcIi9hdXRoL3Rva2VuXCIsICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEuaXNzdWVUb2tlbikpO1xuICAgIHJvdXRlci5nZXQoXCIvYXV0aC90b2tlbi9kZWNvZGVcIiwgbWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEuZGVjb2RlVG9rZW4pKTtcbiAgICByb3V0ZXIucG9zdChcIi9hdXRoL2xvZ291dFwiLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLmxvZ291dCkpO1xuICAgIHJvdXRlci5nZXQoXCIvYXV0aC9vYS9zZXNzaW9uLzppZFwiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmV0dXJuICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKSgoMCwgc2VydmljZV8xLnZhbGlkYXRlU2Vzc2lvbikoc2VsZlJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xuICAgIHJvdXRlci5kZWxldGUoXCIvYXV0aC9vYS9zZXNzaW9uLzppZFwiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmV0dXJuICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKSgoMCwgc2VydmljZV8xLmRlbGV0ZVNlc3Npb24pKHNlbGZSZWFsbSwgcmVxLCByZXMsIG5leHQpKTtcbiAgICB9KTtcbiAgICByb3V0ZXIuZ2V0KFwiL2F1dGgvb2Evc2Vzc2lvbi86aWQvZGVjb2RlXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICByZXR1cm4gKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKCgwLCBzZXJ2aWNlXzEuZGVjb2RlU2Vzc2lvbikoc2VsZlJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xuICAgIHJvdXRlci5nZXQoXCIvYXV0aC9yZWFsbS86cmVhbG0vc2Vzc2lvbi86aWRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHJldHVybiAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoKDAsIHNlcnZpY2VfMS52YWxpZGF0ZVNlc3Npb24pKHJlcS5wYXJhbXMucmVhbG0sIHJlcSwgcmVzLCBuZXh0KSk7XG4gICAgfSk7XG4gICAgcm91dGVyLmdldChcIi9hdXRoL3JlYWxtLzpyZWFsbS9zZXNzaW9uLzppZC9kZWNvZGVcIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHJldHVybiAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoKDAsIHNlcnZpY2VfMS5kZWNvZGVTZXNzaW9uKShyZXEucGFyYW1zLnJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xuICAgIHJvdXRlci5kZWxldGUoXCIvYXV0aC9yZWFsbS86cmVhbG0vc2Vzc2lvbi86aWRcIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHJldHVybiAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoKDAsIHNlcnZpY2VfMS5kZWxldGVTZXNzaW9uKShyZXEucGFyYW1zLnJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWNvZGVTZXNzaW9uID0gZXhwb3J0cy5kZWNvZGVUb2tlbiA9IGV4cG9ydHMuZGVsZXRlU2Vzc2lvbiA9IGV4cG9ydHMudmFsaWRhdGVTZXNzaW9uID0gZXhwb3J0cy5sb2dvdXQgPSBleHBvcnRzLmlzc3VlVG9rZW4gPSBleHBvcnRzLnNpZ25pbiA9IHZvaWQgMDtcbnZhciBiY3J5cHRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYmNyeXB0XCIpKTtcbnZhciB2YWxpZGF0aW9uXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL3ZhbGlkYXRpb25cIik7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuLi91c2VyL21vZGVsXCIpO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG52YXIgc2lnbmluID0gZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXlsb2FkLCBtb2RlbCwgdXNlciwgb3V0Y29tZSwgX2EsIHNlc3Npb25faWQsIHJlZnJlc2hfdG9rZW4sIGFjY2Vzc190b2tlbjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVxLmJvZHk7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgdmFsaWRhdGlvbl8xLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzKShyZXMsIHBheWxvYWQsIFtcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICBcInBhc3N3b3JkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmVhbG1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZXNwb25zZV90eXBlXCIsXG4gICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKHBheWxvYWQucmVhbG0sIG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBwYXlsb2FkLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvbmVhdXRoXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB1c2VyID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgZXJyb3I6IHsgbWVzc2FnZTogXCJVc2VyIHdpdGggdGhpcyB1c2VyIG5hbWUgZG9lcyBub3QgZXhpc3RcIiB9IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdXNlci5lbWFpbF92ZXJpZmllZCkge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMyk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgZXJyb3I6IHsgbWVzc2FnZTogXCJFbWFpbCBvZiB1c2VyIG5vdCB2ZXJpZmllZFwiIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBiY3J5cHRfMS5kZWZhdWx0LmNvbXBhcmUocGF5bG9hZC5wYXNzd29yZCwgdXNlci5oYXNoKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgb3V0Y29tZSA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIW91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDEpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZCh7IGVycm9yOiB7IG1lc3NhZ2U6IFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5jcmVhdGVTZXNzaW9uKHBheWxvYWQucmVhbG0sIHVzZXIpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBfYSA9IF9iLnNlbnQoKSwgc2Vzc2lvbl9pZCA9IF9hLnNlc3Npb25faWQsIHJlZnJlc2hfdG9rZW4gPSBfYS5yZWZyZXNoX3Rva2VuO1xuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkLnJlc3BvbnNlX3R5cGUgPT09IFwiY29kZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBzZXNzaW9uX2lkOiBzZXNzaW9uX2lkIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5nZXRBY2Nlc3NUb2tlbihyZWZyZXNoX3Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgdG9rZW5fdHlwZTogXCJCZWFyZXJcIiwgYWNjZXNzX3Rva2VuOiBhY2Nlc3NfdG9rZW4sIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hfdG9rZW4gfSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5zaWduaW4gPSBzaWduaW47XG52YXIgaXNzdWVUb2tlbiA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF5bG9hZCwgYWNjZXNzX3Rva2VuLCB0b2tlbiwgb3V0Y29tZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVxLmJvZHk7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgdmFsaWRhdGlvbl8xLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzKShyZXMsIHBheWxvYWQsIFtcbiAgICAgICAgICAgICAgICAgICAgXCJncmFudF90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicmVhbG1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZWZyZXNoX3Rva2VuXCIsXG4gICAgICAgICAgICAgICAgXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEocGF5bG9hZC5ncmFudF90eXBlID09PSBcInJlZnJlc2hfdG9rZW5cIikpIHJldHVybiBbMywgMl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0QWNjZXNzVG9rZW4ocGF5bG9hZC5yZWZyZXNoX3Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBlcnJvcjogeyBtZXNzYWdlOiBcIlJlZnJlc2ggdG9rZW4gaW52YWxpZCBvciBleHBpcmVkXCIgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyB0b2tlbl90eXBlOiBcIkJlYXJlclwiLCBhY2Nlc3NfdG9rZW46IGFjY2Vzc190b2tlbiB9KTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHJlcS5wYXJhbXMudG9rZW47XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBvdXRjb21lID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChvdXRjb21lKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmlzc3VlVG9rZW4gPSBpc3N1ZVRva2VuO1xudmFyIGxvZ291dCA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF5bG9hZCwgb3V0Y29tZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVxLmJvZHk7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgdmFsaWRhdGlvbl8xLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzKShyZXMsIHBheWxvYWQsIFtcInJlYWxtXCIsIFwicmVmcmVzaF90b2tlblwiXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVsZXRlU2Vzc2lvbkJ5UmVmcmVzaFRva2VuKHBheWxvYWQucmVhbG0sIHBheWxvYWQucmVmcmVzaF90b2tlbildO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIG91dGNvbWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKG91dGNvbWUuZGVsZXRlZENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBlcnJvcjogeyBtZXNzYWdlOiBcIkludmFsaWQgc2Vzc2lvblwiIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgcmVmcmVzaF90b2tlbjogcGF5bG9hZC5yZWZyZXNoX3Rva2VuIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMubG9nb3V0ID0gbG9nb3V0O1xudmFyIHZhbGlkYXRlU2Vzc2lvbiA9IGZ1bmN0aW9uIChyZWFsbUlkLCByZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2Vzc2lvbiwgZXJyXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci52YWxpZGF0ZVNlc3Npb24ocmVhbG1JZCwgcmVxLnBhcmFtcy5pZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHNlc3Npb24gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFzZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJTZXNzaW9uIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBzZXNzaW9uSWQ6IHJlcS5wYXJhbXMuaWQsIHRva2VuOiBzZXNzaW9uLnRva2VuIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDNdO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyXzEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy52YWxpZGF0ZVNlc3Npb24gPSB2YWxpZGF0ZVNlc3Npb247XG52YXIgZGVsZXRlU2Vzc2lvbiA9IGZ1bmN0aW9uIChyZWFsbUlkLCByZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3V0Y29tZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBIZWxwZXIuZGVsZXRlU2Vzc2lvbihzZWxmUmVhbG0sIHJlcS5wYXJhbXMuaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBvdXRjb21lID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChvdXRjb21lLmRlbGV0ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKFwiU2Vzc2lvbiBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgc2Vzc2lvbklkOiByZXEucGFyYW1zLmlkIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVsZXRlU2Vzc2lvbiA9IGRlbGV0ZVNlc3Npb247XG52YXIgZGVjb2RlVG9rZW4gPSBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgIHJlcy5zZW5kKF9fYXNzaWduKHt9LCByZXEudXNlcikpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybiBbMl07XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlVG9rZW4gPSBkZWNvZGVUb2tlbjtcbnZhciBkZWNvZGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtSWQsIHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdXRjb21lLCBlcnJfMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmRlY29kZVNlc3Npb24oc2VsZlJlYWxtLCByZXEucGFyYW1zLmlkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgb3V0Y29tZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIW91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChcIlNlc3Npb24gbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChvdXRjb21lKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJfMiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBuZXh0KGVycl8yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDNdO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlU2Vzc2lvbiA9IGRlY29kZVNlc3Npb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENvbXBhbnlCeUlkTGlzdCA9IGV4cG9ydHMuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZXhwb3J0cy5nZXRDb21wYW55ID0gZXhwb3J0cy51cGRhdGVDb21wYW55ID0gdm9pZCAwO1xudmFyIGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xudmFyIE9ORUFVVEhfQVBJID0gcHJvY2Vzcy5lbnYuT05FQVVUSF9BUEkgfHwgXCJodHRwOi8vbG9jYWxob3N0OjQwMTAvYXBpXCI7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi4vc2VxdWVuY2Uvc2VydmljZVwiKTtcbnZhciB1cGRhdGVDb21wYW55ID0gZnVuY3Rpb24gKGRhdGEsIHVzZXJJZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIHJlc3BvbnNlXzEsIHJlc3BvbnNlLCBfYSwgX2IsIF9jO1xuICAgIHZhciBfZDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9lKSB7XG4gICAgICAgIHN3aXRjaCAoX2UubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS5jb21wYW55Q29sbGVjdGlvbiwgbW9kZWxfMS5jb21wYW55U2NoZW1hKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEuX2lkKSByZXR1cm4gWzMsIDJdO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZEJ5SWRBbmRVcGRhdGUoZGF0YS5faWQsIF9fYXNzaWduKHt9LCBkYXRhKSwgeyBuZXc6IHRydWUsIHVwc2VydDogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VfMSA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlXzFdO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIF9iID0gKF9hID0gbW9kZWwpLmNyZWF0ZTtcbiAgICAgICAgICAgICAgICBfYyA9IFtfX2Fzc2lnbih7fSwgZGF0YSldO1xuICAgICAgICAgICAgICAgIF9kID0ge307XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgc2VydmljZV8xLm5leHR2YWwpKFwiY29tcGFueUlkXCIpXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFs0LCBfYi5hcHBseShfYSwgW19fYXNzaWduLmFwcGx5KHZvaWQgMCwgX2MuY29uY2F0KFsoX2QucmVmZXJlbmNlID0gX2Uuc2VudCgpLCBfZCldKSldKV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgc2VydmljZV8xLmNyZWF0ZV9zZXF1ZW5jZSkoXCJmcmFnbWVudElkXCIsIG51bGwsIDEsIHJlc3BvbnNlLnJlZmVyZW5jZSldO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnVwZGF0ZUNvbXBhbnkgPSB1cGRhdGVDb21wYW55O1xudmFyIGdldENvbXBhbnkgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS5jb21wYW55Q29sbGVjdGlvbiwgbW9kZWxfMS5jb21wYW55U2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldENvbXBhbnkgPSBnZXRDb21wYW55O1xudmFyIGdldENvbXBhbnlCeVJlZmVyZW5jZSA9IGZ1bmN0aW9uIChyZWZlcmVuY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLmNvbXBhbnlDb2xsZWN0aW9uLCBtb2RlbF8xLmNvbXBhbnlTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZ2V0Q29tcGFueUJ5UmVmZXJlbmNlO1xudmFyIGdldENvbXBhbnlCeUlkTGlzdCA9IGZ1bmN0aW9uIChpZExpc3QpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLmNvbXBhbnlDb2xsZWN0aW9uLCBtb2RlbF8xLmNvbXBhbnlTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7IF9pZDogeyAkaW46IGlkTGlzdCB9IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0Q29tcGFueUJ5SWRMaXN0ID0gZ2V0Q29tcGFueUJ5SWRMaXN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbXBhbnlDb2xsZWN0aW9uID0gZXhwb3J0cy5jb21wYW55U2NoZW1hID0gdm9pZCAwO1xudmFyIG1vbmdvb3NlID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpO1xudmFyIFNjaGVtYSA9IG1vbmdvb3NlLlNjaGVtYTtcbnZhciBjb21wYW55U2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gICAgbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBkZXNjcmlwdGlvbjogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICByZWZlcmVuY2U6IHsgdHlwZTogTnVtYmVyIH0sXG4gICAgY3VycmVuY3k6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgbnVtYmVyRm9ybWF0OiB7IHR5cGU6IFN0cmluZyB9LFxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xuZXhwb3J0cy5jb21wYW55U2NoZW1hID0gY29tcGFueVNjaGVtYTtcbnZhciBjb21wYW55Q29sbGVjdGlvbiA9IFwiY29tcGFueVwiO1xuZXhwb3J0cy5jb21wYW55Q29sbGVjdGlvbiA9IGNvbXBhbnlDb2xsZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbWlkZGxld2FyZXNfMSA9IHJlcXVpcmUoXCIuLi8uLi9taWRkbGV3YXJlc1wiKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHJvdXRlci5wdXQoXCIvY29tcGFueVwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLnVwZGF0ZUNvbXBhbnkpO1xuICAgIHJvdXRlci5nZXQoXCIvY29tcGFueVwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLmdldENvbXBhbnkpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldENvbXBhbnlCeVJlZmVyZW5jZSA9IGV4cG9ydHMuZ2V0Q29tcGFueSA9IGV4cG9ydHMudXBkYXRlQ29tcGFueSA9IHZvaWQgMDtcbnZhciBIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vaGVscGVyXCIpKTtcbnZhciB1c2VySW52aXRlU2VydmljZSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vdXNlci9pbnZpdGUvc2VydmljZVwiKSk7XG52YXIgUGVybWlzc2lvbkhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vcGVybWlzc2lvbi9oZWxwZXJcIikpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciB1cGRhdGVDb21wYW55ID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySWQsIGNvbXBhbnk7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgdXNlcklkID0gcmVxLnVzZXIudXNlcl9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci51cGRhdGVDb21wYW55KHJlcS5ib2R5LCB1c2VySWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjb21wYW55ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGVTZXJ2aWNlLnJlZ2lzdGVyVXNlckludml0ZShjb21wYW55Ll9kb2MucmVmZXJlbmNlLCBjb21wYW55Ll9kb2MuX2lkLCB1c2VySWQsIHJlcS51c2VyLmVtYWlsKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIFBlcm1pc3Npb25IZWxwZXIuYWRkUm9sZShyZXEudXNlci5lbWFpbCwgY29tcGFueS5fZG9jLnJlZmVyZW5jZSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoY29tcGFueSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy51cGRhdGVDb21wYW55ID0gdXBkYXRlQ29tcGFueTtcbnZhciBnZXRDb21wYW55ID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1c2VySWQsIGNvbXBhbnlMaXN0O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IHJlcS51c2VyLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0Q29tcGFueSgpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBjb21wYW55TGlzdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoY29tcGFueUxpc3QpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0Q29tcGFueSA9IGdldENvbXBhbnk7XG52YXIgZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlZmVyZW5jZSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBIZWxwZXIuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlKHJlZmVyZW5jZSldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRDb21wYW55QnlSZWZlcmVuY2UgPSBnZXRDb21wYW55QnlSZWZlcmVuY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudHJhaW5fc2ltaWxhcml0eV9tb2RlbCA9IHZvaWQgMDtcbnZhciBheGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbnZhciBPTkVBVVRIX0FQSSA9IHByb2Nlc3MuZW52Lk9ORUFVVEhfQVBJIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo0MDEwL2FwaVwiO1xudmFyIEFJX0FQSSA9IHByb2Nlc3MuZW52LkFJX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMy9hcGlcIjtcbnZhciB0cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gZnVuY3Rpb24gKHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIFsyLCB7IFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiIH1dO1xuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwgPSB0cmFpbl9zaW1pbGFyaXR5X21vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgaGFuZGxlcl8xID0gcmVxdWlyZShcIi4uLy4uL2hhbmRsZXJcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHJvdXRlci5nZXQoXCIvYWRtaW5cIiwgZnVuY3Rpb24gKF8sIHJlcykge1xuICAgICAgICByZXMuc2VuZChcImJhc2ljIGNvbm5lY3Rpb24gdG8gc2VydmVyIHdvcmtzLiBkYXRhYmFzZSBjb25uZWN0aW9uIGlzIG5vdCB2YWxpZGF0ZWRcIik7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICB9KTtcbiAgICByb3V0ZXIuZ2V0KFwiL2FkbWluLzpzcGFjZS90cmFpblwiLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwpKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gdm9pZCAwO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciB0cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBub3RlO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci50cmFpbl9zaW1pbGFyaXR5X21vZGVsKHJlcS5wYXJhbXMuc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBub3RlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChub3RlKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwgPSB0cmFpbl9zaW1pbGFyaXR5X21vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZFJvbGUgPSB2b2lkIDA7XG52YXIgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG52YXIgT05FQVVUSF9BUEkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAxMC9hcGlcIjtcbnZhciBPTkVBVVRIX0FQSV9LRVkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSV9LRVkgfHwgXCIxZDk1MjRhNi0zMGRmLTRiM2MtOTQwMi01MDNmNDAxMTg5NmNcIjtcbnZhciBhZGRSb2xlID0gZnVuY3Rpb24gKGVtYWlsLCBjb21wYW55SWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3BvbnNlLCBlcnJfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBheGlvcy5wb3N0KFwiXCIuY29uY2F0KE9ORUFVVEhfQVBJLCBcIi8yMTIvYWRtaW4vcGVybWlzc2lvblwiKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBcIkFERFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVOYW1lOiBcIkNPTVBBTllfQURNSU5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiBjb21wYW55SWRcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb246IE9ORUFVVEhfQVBJX0tFWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwge31dO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlLmRhdGEgfHwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5hZGRSb2xlID0gYWRkUm9sZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZXNldHZhbCA9IGV4cG9ydHMubmV4dHZhbCA9IGV4cG9ydHMuY3JlYXRlX3NlcXVlbmNlID0gdm9pZCAwO1xudmFyIF9hID0gcmVxdWlyZSgnLi9tb2RlbCcpLCBzZXF1ZW5jZUNvbGxlY3Rpb24gPSBfYS5zZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hID0gX2Euc2VxdWVuY2VTY2hlbWE7XG52YXIgX2IgPSByZXF1aXJlKCcuLi8uLi9saWIvZGJ1dGlscycpLCBnZXRHbG9iYWxDb2xsZWN0aW9uID0gX2IuZ2V0R2xvYmFsQ29sbGVjdGlvbiwgZ2V0Q29sbGVjdGlvbiA9IF9iLmdldENvbGxlY3Rpb247XG52YXIgY3JlYXRlX3NlcXVlbmNlID0gZnVuY3Rpb24gKGZpZWxkLCBjb250ZXh0LCBmYWN0b3IsIHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgZXhpc3Rpbmdfc2VxdWVuY2U7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZXhpc3Rpbmdfc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nX3NlcXVlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgZXhpc3Rpbmdfc2VxdWVuY2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQgfSwgeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQsIGZhY3RvcjogZmFjdG9yLCBuZXh0dmFsOiAxIH0sIHsgdXBzZXJ0OiB0cnVlLCBuZXc6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5jcmVhdGVfc2VxdWVuY2UgPSBjcmVhdGVfc2VxdWVuY2U7XG52YXIgbmV4dHZhbCA9IGZ1bmN0aW9uIChmaWVsZCwgY29udGV4dCwgc3BhY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsLCBzZXF1ZW5jZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBpZiAoc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBnZXRDb2xsZWN0aW9uKHNwYWNlLCBzZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0R2xvYmFsQ29sbGVjdGlvbihzZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgZmllbGQ6IGZpZWxkLCBjb250ZXh0OiBjb250ZXh0IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoISFzZXF1ZW5jZSkgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBleHBvcnRzLmNyZWF0ZV9zZXF1ZW5jZSkoZmllbGQsIGNvbnRleHQgfHwgbnVsbCwgMSwgc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgZmllbGQ6IGZpZWxkLCBjb250ZXh0OiBjb250ZXh0IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbNCwgbW9kZWwuZmluZE9uZUFuZFVwZGF0ZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9LCB7IG5leHR2YWw6IHNlcXVlbmNlLm5leHR2YWwgKyBzZXF1ZW5jZS5mYWN0b3IgfSwgeyB1cHNlcnQ6IHRydWUsIG5ldzogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgc2VxdWVuY2UubmV4dHZhbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5uZXh0dmFsID0gbmV4dHZhbDtcbnZhciByZXNldHZhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZmllbGQsIGNvbnRleHQsIHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgc2VxdWVuY2U7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCEhc2VxdWVuY2UpIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5jcmVhdGVfc2VxdWVuY2UpKGZpZWxkLCBjb250ZXh0IHx8IG51bGwsIDEsIHNwYWNlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSA0O1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQgfSwgeyBuZXh0dmFsOiB2YWx1ZSB9LCB7IHVwc2VydDogdHJ1ZSwgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnJlc2V0dmFsID0gcmVzZXR2YWw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX21ha2VUZW1wbGF0ZU9iamVjdCA9ICh0aGlzICYmIHRoaXMuX19tYWtlVGVtcGxhdGVPYmplY3QpIHx8IGZ1bmN0aW9uIChjb29rZWQsIHJhdykge1xuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XG4gICAgcmV0dXJuIGNvb2tlZDtcbn07XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZXNvbHZlcnMgPSBleHBvcnRzLnR5cGVEZWZzID0gdm9pZCAwO1xudmFyIGpzb253ZWJ0b2tlbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIikpO1xudmFyIGFwb2xsb19zZXJ2ZXJfZXhwcmVzc18xID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTtcbnZhciBtb2RlbF8xID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG52YXIgbW9kZWxfMiA9IHJlcXVpcmUoXCIuLi91c2VyL21vZGVsXCIpO1xudmFyIGdldENvbGxlY3Rpb24gPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIikuZ2V0Q29sbGVjdGlvbjtcbnZhciBheGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbnZhciBPTkVBVVRIX0FQSSA9IHByb2Nlc3MuZW52Lk9ORUFVVEhfQVBJIHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4MDIwXCI7XG52YXIgdHlwZURlZnMgPSAoMCwgYXBvbGxvX3NlcnZlcl9leHByZXNzXzEuZ3FsKSh0ZW1wbGF0ZU9iamVjdF8xIHx8ICh0ZW1wbGF0ZU9iamVjdF8xID0gX19tYWtlVGVtcGxhdGVPYmplY3QoW1wiXFxuICBleHRlbmQgdHlwZSBRdWVyeSB7XFxuICAgIHNlc3Npb24oaWQ6IElEISwgc3BhY2U6IFN0cmluZyk6IFVzZXJTZXNzaW9uXFxuICB9XFxuXFxuICB0eXBlIFNlc3Npb24ge1xcbiAgICBpZDogSUQhXFxuICAgIHNlc3Npb25JZDogU3RyaW5nIVxcbiAgICB0b2tlbjogU3RyaW5nIVxcbiAgfVxcblxcbiAgdHlwZSBVc2VyU2Vzc2lvbiB7XFxuICAgIGlkOiBJRCFcXG4gICAgZmlyc3ROYW1lOiBTdHJpbmdcXG4gICAgbGFzdE5hbWU6IFN0cmluZ1xcbiAgICBlbWFpbDogU3RyaW5nXFxuICAgIHRva2VuOiBTdHJpbmdcXG4gIH1cXG5cIl0sIFtcIlxcbiAgZXh0ZW5kIHR5cGUgUXVlcnkge1xcbiAgICBzZXNzaW9uKGlkOiBJRCEsIHNwYWNlOiBTdHJpbmcpOiBVc2VyU2Vzc2lvblxcbiAgfVxcblxcbiAgdHlwZSBTZXNzaW9uIHtcXG4gICAgaWQ6IElEIVxcbiAgICBzZXNzaW9uSWQ6IFN0cmluZyFcXG4gICAgdG9rZW46IFN0cmluZyFcXG4gIH1cXG5cXG4gIHR5cGUgVXNlclNlc3Npb24ge1xcbiAgICBpZDogSUQhXFxuICAgIGZpcnN0TmFtZTogU3RyaW5nXFxuICAgIGxhc3ROYW1lOiBTdHJpbmdcXG4gICAgZW1haWw6IFN0cmluZ1xcbiAgICB0b2tlbjogU3RyaW5nXFxuICB9XFxuXCJdKSkpO1xuZXhwb3J0cy50eXBlRGVmcyA9IHR5cGVEZWZzO1xudmFyIG9hU2Vzc2lvbiA9IGZ1bmN0aW9uIChzcGFjZSwgaWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3BvbnNlLCB1c2VyLCBtb2RlbCwgZGF0YSwgZXJyb3JfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDUsICwgNl0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgYXhpb3MuZ2V0KFwiXCIuY29uY2F0KE9ORUFVVEhfQVBJLCBcIi9hdXRoL3NwYWNlL1wiKS5jb25jYXQoc3BhY2UsIFwiL3Nlc3Npb24vXCIpLmNvbmNhdChpZCkpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIShyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkpIHJldHVybiBbMywgM107XG4gICAgICAgICAgICAgICAgdXNlciA9IGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHJlc3BvbnNlLmRhdGEudG9rZW4sIFwiand0c2VjcmV0XCIpO1xuICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgbW9kZWxfMi51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMi51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRCeUlkQW5kVXBkYXRlKHVzZXIudXNlcklkLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdXNlciksIHsgcmVzb2x2ZXI6IFwib25lYXV0aF9zcGFjZVwiIH0pLCB7IG5ldzogdHJ1ZSwgdXBzZXJ0OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IGRhdGEuZmlyc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBkYXRhLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBkYXRhLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiByZXNwb25zZS5kYXRhLnRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzMsIDZdO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG52YXIgZW1haWxPckV4dGVyblNlc3Npb24gPSBmdW5jdGlvbiAoc3BhY2UsIHNlc3Npb25JZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIHNlc3Npb24sIGRhdGE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSBnZXRDb2xsZWN0aW9uKHNwYWNlLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IHNlc3Npb25JZDogc2Vzc2lvbklkIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZXNzaW9uID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHNlc3Npb24udG9rZW4sIFwiand0c2VjcmV0XCIpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZGF0YS5maXJzdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZTogZGF0YS5sYXN0TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBkYXRhLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IHNlc3Npb24udG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbnZhciByZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgc2Vzc2lvbjogZnVuY3Rpb24gKF8xLCBfYSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgW18xLCBfYV0sIHZvaWQgMCwgZnVuY3Rpb24gKF8sIF9iKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBfYi5pZCwgc3BhY2UgPSBfYi5zcGFjZTtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0LCBvYVNlc3Npb24oc3BhY2UsIGlkKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYy5zZW50KCldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSxcbiAgICB9LFxufTtcbmV4cG9ydHMucmVzb2x2ZXJzID0gcmVzb2x2ZXJzO1xudmFyIHRlbXBsYXRlT2JqZWN0XzE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2Vzc2lvbkNvbGxlY3Rpb24gPSBleHBvcnRzLnNlc3Npb25TY2hlbWEgPSB2b2lkIDA7XG52YXIgbW9uZ29vc2UgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7XG52YXIgU2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hO1xudmFyIHNlc3Npb25TY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgICBzZXNzaW9uSWQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgdG9rZW46IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgdHlwZTogeyB0eXBlOiBTdHJpbmcgfSxcbn0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcbmV4cG9ydHMuc2Vzc2lvblNjaGVtYSA9IHNlc3Npb25TY2hlbWE7XG52YXIgc2Vzc2lvbkNvbGxlY3Rpb24gPSBcInNlc3Npb25cIjtcbmV4cG9ydHMuc2Vzc2lvbkNvbGxlY3Rpb24gPSBzZXNzaW9uQ29sbGVjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycyA9IGV4cG9ydHMuYnVpbGRRdWVyeUZyb21GaWx0ZXJzID0gdm9pZCAwO1xudmFyIGJ1aWxkUXVlcnlGcm9tRmlsdGVycyA9IGZ1bmN0aW9uIChxdWVyeVBhcmFtcywgc3BlYykge1xuICAgIHZhciBtb25nb1F1ZXJ5ID0ge307XG4gICAgZm9yICh2YXIgZmllbGQgaW4gcXVlcnlQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZpbHRlclZhbHVlID0gcXVlcnlQYXJhbXNbZmllbGRdO1xuICAgICAgICB2YXIgZmllbGRTcGVjID0gc3BlY1tmaWVsZF07XG4gICAgICAgIGlmICghZmllbGRTcGVjKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIHN3aXRjaCAoZmllbGRTcGVjLmZpbHRlcikge1xuICAgICAgICAgICAgY2FzZSBcImxpa2VcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJHJlZ2V4OiBuZXcgUmVnRXhwKGZpbHRlclZhbHVlLCBcImlcIikgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJpblwiOlxuICAgICAgICAgICAgICAgIG1vbmdvUXVlcnlbZmllbGRdID0geyAkaW46IEFycmF5LmlzQXJyYXkoZmlsdGVyVmFsdWUpID8gZmlsdGVyVmFsdWUgOiBbZmlsdGVyVmFsdWVdIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZ3RcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGd0OiBmaWx0ZXJWYWx1ZSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImx0XCI6XG4gICAgICAgICAgICAgICAgbW9uZ29RdWVyeVtmaWVsZF0gPSB7ICRsdDogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJndGVcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGd0ZTogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsdGVcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGx0ZTogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleGFjdFwiOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IGZpbHRlclZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb25nb1F1ZXJ5O1xufTtcbmV4cG9ydHMuYnVpbGRRdWVyeUZyb21GaWx0ZXJzID0gYnVpbGRRdWVyeUZyb21GaWx0ZXJzO1xudmFyIGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzID0gZnVuY3Rpb24gKGZpbHRlcnMsIHNwZWMpIHtcbiAgICB2YXIgbW9uZ29RdWVyeSA9IHt9O1xuICAgIGZvciAodmFyIGZpZWxkIGluIGZpbHRlcnMpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZmlsdGVyc1tmaWVsZF07XG4gICAgICAgIHZhciBmaWVsZFNwZWMgPSBzcGVjW2ZpZWxkXTtcbiAgICAgICAgaWYgKCFmaWVsZFNwZWMpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBvcGVyYXRvcnMgPSB7XG4gICAgICAgICAgICAgICAgZXE6IFwiJGVxXCIsXG4gICAgICAgICAgICAgICAgbmU6IFwiJG5lXCIsXG4gICAgICAgICAgICAgICAgZ3Q6IFwiJGd0XCIsXG4gICAgICAgICAgICAgICAgZ3RlOiBcIiRndGVcIixcbiAgICAgICAgICAgICAgICBsdDogXCIkbHRcIixcbiAgICAgICAgICAgICAgICBsdGU6IFwiJGx0ZVwiLFxuICAgICAgICAgICAgICAgIGluOiBcIiRpblwiLFxuICAgICAgICAgICAgICAgIG5pbjogXCIkbmluXCIsXG4gICAgICAgICAgICAgICAgcmVnZXg6IFwiJHJlZ2V4XCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgbW9uZ29PcHMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIG9wIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdG9yc1tvcF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9uZ29PcHNbb3BlcmF0b3JzW29wXV0gPSB2YWx1ZVtvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9uZ29RdWVyeVtmaWVsZF0gPSBtb25nb09wcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1vbmdvUXVlcnlbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vbmdvUXVlcnk7XG59O1xuZXhwb3J0cy5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycyA9IGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZXhwcmVzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzXCIpKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgcm91dGVyID0gZXhwcmVzc18xLmRlZmF1bHQuUm91dGVyKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICByb3V0ZXJcbiAgICAgICAgLnJvdXRlKFwiL3Jlc291cmNlcy86c3BhY2UvOmRvbWFpblwiKVxuICAgICAgICAuZ2V0KG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuZ2V0QWxsKVxuICAgICAgICAucG9zdChtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLmNyZWF0ZU9uZSk7XG4gICAgcm91dGVyXG4gICAgICAgIC5yb3V0ZShcIi9yZXNvdXJjZXMvOnNwYWNlLzpkb21haW4vOnJlZmVyZW5jZVwiKVxuICAgICAgICAuZ2V0KG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuZ2V0QnlSZWZlcmVuY2UpXG4gICAgICAgIC5wdXQobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS51cGRhdGVPbmUpXG4gICAgICAgIC5kZWxldGUobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS5kZWxldGVPbmUpO1xuICAgIHJvdXRlci5wb3N0KFwiL3Jlc291cmNlcy86c3BhY2UvOmRvbWFpbi9zZWFyY2hcIiwgbWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS5zZWFyY2gpO1xuICAgIHJvdXRlci5nZXQoXCIvaW5mZXJlbmNlL3Jlc291cmNlc1wiLCBzZXJ2aWNlXzEuaW5mZXJUeXBlcyk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzT3BlcmF0aW9uQWxsb3dlZCA9IGV4cG9ydHMuZmlsbE1pc3NpbmdGaWVsZHMgPSBleHBvcnRzLnZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkID0gZXhwb3J0cy5sb2FkU3BlYyA9IHZvaWQgMDtcbnZhciBmc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7XG52YXIgcGF0aF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJwYXRoXCIpKTtcbnZhciBkb21haW5zXzEgPSByZXF1aXJlKFwiLi4vLi4vc3BlY3MvZG9tYWluc1wiKTtcbnZhciBsb2FkU3BlYyA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICB2YXIgc3BlYyA9IGRvbWFpbnNfMS5zcGVjc01hcFtkb21haW5dO1xuICAgIGlmICghc3BlYykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzY2hlbWEgc3BlYyBmb3VuZCBmb3IgZG9tYWluICdcIi5jb25jYXQoZG9tYWluLCBcIidcIikpO1xuICAgIH1cbiAgICByZXR1cm4gc3BlYztcbn07XG5leHBvcnRzLmxvYWRTcGVjID0gbG9hZFNwZWM7XG52YXIgdmFsaWRhdGVBbmRTaGFwZVBheWxvYWQgPSBmdW5jdGlvbiAocGF5bG9hZCwgc3BlYywgcGF0aCkge1xuICAgIHZhciBfYTtcbiAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSBcIlwiOyB9XG4gICAgdmFyIGVycm9ycyA9IFtdO1xuICAgIHZhciBzaGFwZWREYXRhID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHNwZWMpIHtcbiAgICAgICAgdmFyIGZpZWxkU3BlYyA9IHNwZWNba2V5XTtcbiAgICAgICAgdmFyIGZ1bGxQYXRoID0gcGF0aCA/IFwiXCIuY29uY2F0KHBhdGgsIFwiLlwiKS5jb25jYXQoa2V5KSA6IGtleTtcbiAgICAgICAgdmFyIHZhbHVlID0gcGF5bG9hZCA9PT0gbnVsbCB8fCBwYXlsb2FkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXlsb2FkW2tleV07XG4gICAgICAgIGlmIChmaWVsZFNwZWMucmVxdWlyZWQgJiYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpKSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgaXMgcmVxdWlyZWRcIikpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNoYXBlZERhdGFba2V5XSA9IGdldERlZmF1bHRGb3JUeXBlKGZpZWxkU3BlYy50eXBlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWVsZFNwZWMudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBzaG91bGQgYmUgYW4gb2JqZWN0XCIpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXN0ZWQgPSAoMCwgZXhwb3J0cy52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCkodmFsdWUsIGZpZWxkU3BlYy5zY2hlbWEgfHwge30sIGZ1bGxQYXRoKTtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoLmFwcGx5KGVycm9ycywgbmVzdGVkLmVycm9ycyk7XG4gICAgICAgICAgICBzaGFwZWREYXRhW2tleV0gPSBuZXN0ZWQuc2hhcGVkRGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaWVsZFNwZWMudHlwZSA9PT0gXCJhcnJheVwiKSB7XG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIHNob3VsZCBiZSBhbiBhcnJheVwiKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaGFwZWREYXRhW2tleV0gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZhbHVlW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtUGF0aCA9IFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIltcIikuY29uY2F0KGksIFwiXVwiKTtcbiAgICAgICAgICAgICAgICBpZiAoKChfYSA9IGZpZWxkU3BlYy5zY2hlbWEpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50eXBlKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmVzdGVkID0gKDAsIGV4cG9ydHMudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQpKGl0ZW0sIGZpZWxkU3BlYy5zY2hlbWEuc2NoZW1hIHx8IHt9LCBpdGVtUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoLmFwcGx5KGVycm9ycywgbmVzdGVkLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlZERhdGFba2V5XS5wdXNoKG5lc3RlZC5zaGFwZWREYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gZmllbGRTcGVjLnNjaGVtYS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChpdGVtUGF0aCwgXCIgc2hvdWxkIGJlIG9mIHR5cGUgXCIpLmNvbmNhdChmaWVsZFNwZWMuc2NoZW1hLnR5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlZERhdGFba2V5XS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gZmllbGRTcGVjLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgc2hvdWxkIGJlIG9mIHR5cGUgXCIpLmNvbmNhdChmaWVsZFNwZWMudHlwZSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsaWQ6IGVycm9ycy5sZW5ndGggPT09IDAsIGVycm9yczogZXJyb3JzLCBzaGFwZWREYXRhOiBzaGFwZWREYXRhIH07XG59O1xuZXhwb3J0cy52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCA9IHZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkO1xudmFyIGdldERlZmF1bHRGb3JUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcInN0cmluZ1wiOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6IHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIGNhc2UgXCJhcnJheVwiOiByZXR1cm4gW107XG4gICAgICAgIGNhc2UgXCJvYmplY3RcIjogcmV0dXJuIHt9O1xuICAgICAgICBkZWZhdWx0OiByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn07XG52YXIgZmlsbE1pc3NpbmdGaWVsZHMgPSBmdW5jdGlvbiAoZG9jLCBzcGVjKSB7XG4gICAgdmFyIHNoYXBlZCA9IHsgcmVmZXJlbmNlOiBkb2MucmVmZXJlbmNlLCBjcmVhdGVkQnk6IGRvYy5jcmVhdGVkQnksIGNyZWF0ZWRBdDogZG9jLmNyZWF0ZWRBdCwgdXBkYXRlZEJ5OiBkb2MudXBkYXRlZEJ5LCB1cGRhdGVkQXQ6IGRvYy51cGRhdGVkQXQgfTtcbiAgICBmb3IgKHZhciBmaWVsZCBpbiBzcGVjKSB7XG4gICAgICAgIGlmIChkb2MuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICAgICAgICBzaGFwZWRbZmllbGRdID0gZG9jW2ZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNoYXBlZFtmaWVsZF0gPSBzcGVjW2ZpZWxkXS50eXBlID09PSBcImFycmF5XCIgPyBbXSA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNoYXBlZDtcbn07XG5leHBvcnRzLmZpbGxNaXNzaW5nRmllbGRzID0gZmlsbE1pc3NpbmdGaWVsZHM7XG52YXIgaXNPcGVyYXRpb25BbGxvd2VkID0gZnVuY3Rpb24gKGRvbWFpbiwgb3BlcmF0aW9uKSB7XG4gICAgdmFyIGZpbGVQYXRoID0gcGF0aF8xLmRlZmF1bHQuam9pbihfX2Rpcm5hbWUsIFwiLi9zcGVjcy9kb21haW5zL1wiLCBcIlwiLmNvbmNhdChkb21haW4sIFwiLmV4Y2x1ZGUuanNvblwiKSk7XG4gICAgaWYgKCFmc18xLmRlZmF1bHQuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHZhciBleGNsdWRlZE9wcyA9IEpTT04ucGFyc2UoZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgXCJ1dGYtOFwiKSk7XG4gICAgcmV0dXJuICFleGNsdWRlZE9wcy5pbmNsdWRlcyhcIipcIikgJiYgIWV4Y2x1ZGVkT3BzLmluY2x1ZGVzKG9wZXJhdGlvbik7XG59O1xuZXhwb3J0cy5pc09wZXJhdGlvbkFsbG93ZWQgPSBpc09wZXJhdGlvbkFsbG93ZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19yZXN0ID0gKHRoaXMgJiYgdGhpcy5fX3Jlc3QpIHx8IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluZmVyVHlwZXMgPSBleHBvcnRzLmRlbGV0ZU9uZSA9IGV4cG9ydHMudXBkYXRlT25lID0gZXhwb3J0cy5jcmVhdGVPbmUgPSBleHBvcnRzLmdldEJ5UmVmZXJlbmNlID0gZXhwb3J0cy5zZWFyY2ggPSBleHBvcnRzLmdldEFsbCA9IHZvaWQgMDtcbnZhciBuYW5vaWRfMSA9IHJlcXVpcmUoXCJuYW5vaWRcIik7XG52YXIgc2NoZW1hVmFsaWRhdG9yXzEgPSByZXF1aXJlKFwiLi9zY2hlbWFWYWxpZGF0b3JcIik7XG52YXIgZGJ1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uL2xpYi9kYnV0aWxzXCIpO1xudmFyIGZpbHRlckJ1aWxkZXJfMSA9IHJlcXVpcmUoXCIuL2ZpbHRlckJ1aWxkZXJcIik7XG52YXIgdHlwZUluZmVyZW5jZV8xID0gcmVxdWlyZShcIi4vdHlwZUluZmVyZW5jZVwiKTtcbnZhciBhbHBoYW51bWVyaWNBbHBoYWJldCA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XG52YXIgbmFub2lkID0gKDAsIG5hbm9pZF8xLmN1c3RvbUFscGhhYmV0KShhbHBoYW51bWVyaWNBbHBoYWJldCwgOCk7XG52YXIgZ2V0QWxsID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgX2IsIF9jLCBwYWdlLCBfZCwgbGltaXQsIHJhd0ZpbHRlcnMsIE1vZGVsLCBzcGVjXzEsIGZpbHRlcnMsIGRvY3MsIHRvdGFsLCBzaGFwZWQsIHRvdGFsUGFnZXMsIGVycl8xO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2UpIHtcbiAgICAgICAgc3dpdGNoIChfZS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcInNlYXJjaFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiT3BlcmF0aW9uICdzZWFyY2gnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYiA9IHJlcS5xdWVyeSwgX2MgPSBfYi5wYWdlLCBwYWdlID0gX2MgPT09IHZvaWQgMCA/IDEgOiBfYywgX2QgPSBfYi5saW1pdCwgbGltaXQgPSBfZCA9PT0gdm9pZCAwID8gMTAgOiBfZCwgcmF3RmlsdGVycyA9IF9fcmVzdChfYiwgW1wicGFnZVwiLCBcImxpbWl0XCJdKTtcbiAgICAgICAgICAgICAgICBpZiAoK3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJQYWdlIG51bWJlciBtdXN0IGJlIDEgb3IgZ3JlYXRlci5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgrbGltaXQgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJMaW1pdCBtdXN0IGJlIDEgb3IgZ3JlYXRlci5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9lLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfZS50cnlzLnB1c2goWzEsIDQsICwgNV0pO1xuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICBzcGVjXzEgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEubG9hZFNwZWMpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgZmlsdGVycyA9ICgwLCBmaWx0ZXJCdWlsZGVyXzEuYnVpbGRRdWVyeUZyb21GaWx0ZXJzKShyYXdGaWx0ZXJzLCBzcGVjXzEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuZmluZChmaWx0ZXJzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNraXAoKCtwYWdlIC0gMSkgKiArbGltaXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGltaXQoK2xpbWl0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZG9jcyA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmNvdW50RG9jdW1lbnRzKGZpbHRlcnMpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0b3RhbCA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBzaGFwZWQgPSBkb2NzLm1hcChmdW5jdGlvbiAoZG9jKSB7IHJldHVybiAoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjXzEpOyB9KTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhZ2VzID0gTWF0aC5jZWlsKHRvdGFsIC8gK2xpbWl0KTtcbiAgICAgICAgICAgICAgICByZXMuanNvbih7IGRhdGE6IHNoYXBlZCwgdG90YWw6IHRvdGFsLCBwYWdlOiArcGFnZSwgbGltaXQ6ICtsaW1pdCwgdG90YWxQYWdlczogdG90YWxQYWdlcyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDVdO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiRmFpbGVkIHRvIGZldGNoIHJlY29yZHNcIiwgZGV0YWlsczogZXJyXzEubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDVdO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0QWxsID0gZ2V0QWxsO1xudmFyIHNlYXJjaCA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIF9iLCBfYywgZmlsdGVycywgX2QsIHBhZ2luYXRpb24sIF9lLCBwYWdlLCBfZiwgbGltaXQsIE1vZGVsLCBzcGVjXzIsIG1vbmdvUXVlcnksIGRvY3MsIHRvdGFsLCBzaGFwZWQsIHRvdGFsUGFnZXMsIGVycl8yO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2cpIHtcbiAgICAgICAgc3dpdGNoIChfZy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluO1xuICAgICAgICAgICAgICAgIF9iID0gcmVxLmJvZHksIF9jID0gX2IuZmlsdGVycywgZmlsdGVycyA9IF9jID09PSB2b2lkIDAgPyB7fSA6IF9jLCBfZCA9IF9iLnBhZ2luYXRpb24sIHBhZ2luYXRpb24gPSBfZCA9PT0gdm9pZCAwID8ge30gOiBfZDtcbiAgICAgICAgICAgICAgICBfZSA9IHBhZ2luYXRpb24ucGFnZSwgcGFnZSA9IF9lID09PSB2b2lkIDAgPyAxIDogX2UsIF9mID0gcGFnaW5hdGlvbi5saW1pdCwgbGltaXQgPSBfZiA9PT0gdm9pZCAwID8gMTAgOiBfZjtcbiAgICAgICAgICAgICAgICBpZiAoK3BhZ2UgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJQYWdlIG51bWJlciBtdXN0IGJlIDEgb3IgZ3JlYXRlci5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgrbGltaXQgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJMaW1pdCBtdXN0IGJlIDEgb3IgZ3JlYXRlci5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9nLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfZy50cnlzLnB1c2goWzEsIDQsICwgNV0pO1xuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICBzcGVjXzIgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEubG9hZFNwZWMpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgbW9uZ29RdWVyeSA9ICgwLCBmaWx0ZXJCdWlsZGVyXzEuYnVpbGRRdWVyeUZyb21BZHZhbmNlZEZpbHRlcnMpKGZpbHRlcnMsIHNwZWNfMik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kKG1vbmdvUXVlcnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2tpcCgoK3BhZ2UgLSAxKSAqICtsaW1pdClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5saW1pdCgrbGltaXQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkb2NzID0gX2cuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuY291bnREb2N1bWVudHMobW9uZ29RdWVyeSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHRvdGFsID0gX2cuc2VudCgpO1xuICAgICAgICAgICAgICAgIHNoYXBlZCA9IGRvY3MubWFwKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5maWxsTWlzc2luZ0ZpZWxkcykoZG9jLnRvT2JqZWN0KCksIHNwZWNfMik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdG90YWxQYWdlcyA9IE1hdGguY2VpbCh0b3RhbCAvICtsaW1pdCk7XG4gICAgICAgICAgICAgICAgcmVzLmpzb24oeyBkYXRhOiBzaGFwZWQsIHRvdGFsOiB0b3RhbCwgcGFnZTogK3BhZ2UsIGxpbWl0OiArbGltaXQsIHRvdGFsUGFnZXM6IHRvdGFsUGFnZXMgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBlcnJfMiA9IF9nLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIlNlYXJjaCBmYWlsZWRcIiwgZGV0YWlsczogZXJyXzIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDVdO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuc2VhcmNoID0gc2VhcmNoO1xudmFyIGdldEJ5UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgcmVmZXJlbmNlLCBNb2RlbCwgc3BlYywgZG9jLCBlcnJfMztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbiwgcmVmZXJlbmNlID0gX2EucmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcImdldFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiT3BlcmF0aW9uICdnZXQnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgc3BlYyA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5sb2FkU3BlYykoZG9tYWluKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmZpbmRPbmUoeyByZWZlcmVuY2U6IHJlZmVyZW5jZSB9KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZG9jID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZG9jKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiTm90IGZvdW5kXCIgfSldO1xuICAgICAgICAgICAgICAgIHJlcy5qc29uKCgwLCBzY2hlbWFWYWxpZGF0b3JfMS5maWxsTWlzc2luZ0ZpZWxkcykoZG9jLnRvT2JqZWN0KCksIHNwZWMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8zID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiRXJyb3IgZmV0Y2hpbmcgZG9jdW1lbnRcIiwgZGV0YWlsczogZXJyXzMubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0QnlSZWZlcmVuY2UgPSBnZXRCeVJlZmVyZW5jZTtcbnZhciBjcmVhdGVPbmUgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCB1c2VySWQsIHNwZWMsIHJlc3VsdCwgTW9kZWwsIHRpbWVzdGFtcCwgZG9jLCBlcnJfNDtcbiAgICB2YXIgX2I7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW47XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgc2NoZW1hVmFsaWRhdG9yXzEuaXNPcGVyYXRpb25BbGxvd2VkKShkb21haW4sIFwiY3JlYXRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJPcGVyYXRpb24gJ2NyZWF0ZScgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhpcyBkb21haW5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IChfYiA9IHJlcS51c2VyKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudXNlcl9pZDtcbiAgICAgICAgICAgICAgICBfYy5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2MudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmxvYWRTcGVjKShkb21haW4pO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCkocmVxLmJvZHksIHNwZWMpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJWYWxpZGF0aW9uIGZhaWxlZFwiLCBkZXRhaWxzOiByZXN1bHQuZXJyb3JzIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgZG9jID0gbmV3IE1vZGVsKF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXN1bHQuc2hhcGVkRGF0YSksIHsgcmVmZXJlbmNlOiBuYW5vaWQoKSwgY3JlYXRlZEF0OiB0aW1lc3RhbXAsIHVwZGF0ZWRBdDogdGltZXN0YW1wLCBjcmVhdGVkQnk6IHVzZXJJZCwgdXBkYXRlZEJ5OiB1c2VySWQgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgZG9jLnNhdmUoKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKCgwLCBzY2hlbWFWYWxpZGF0b3JfMS5maWxsTWlzc2luZ0ZpZWxkcykoZG9jLnRvT2JqZWN0KCksIHNwZWMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl80ID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiRXJyb3IgY3JlYXRpbmcgZG9jdW1lbnRcIiwgZGV0YWlsczogZXJyXzQubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuY3JlYXRlT25lID0gY3JlYXRlT25lO1xudmFyIHVwZGF0ZU9uZSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIHJlZmVyZW5jZSwgdXNlcklkLCBzcGVjLCByZXN1bHQsIE1vZGVsLCB1cGRhdGVEYXRhLCBkb2MsIGVycl81O1xuICAgIHZhciBfYjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbiwgcmVmZXJlbmNlID0gX2EucmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcInVwZGF0ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiT3BlcmF0aW9uICd1cGRhdGUnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1c2VySWQgPSAoX2IgPSByZXEudXNlcikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgX2MubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgc3BlYyA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5sb2FkU3BlYykoZG9tYWluKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQpKHJlcS5ib2R5LCBzcGVjKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC52YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVmFsaWRhdGlvbiBmYWlsZWRcIiwgZGV0YWlsczogcmVzdWx0LmVycm9ycyB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVEYXRhID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlc3VsdC5zaGFwZWREYXRhKSwgeyB1cGRhdGVkQXQ6IG5ldyBEYXRlKCksIHVwZGF0ZWRCeTogdXNlcklkIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuZmluZE9uZUFuZFVwZGF0ZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0sIHVwZGF0ZURhdGEsIHsgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkb2MgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2MpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJOb3QgZm91bmRcIiB9KV07XG4gICAgICAgICAgICAgICAgcmVzLmpzb24oKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmZpbGxNaXNzaW5nRmllbGRzKShkb2MudG9PYmplY3QoKSwgc3BlYykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyXzUgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJFcnJvciB1cGRhdGluZyBkb2N1bWVudFwiLCBkZXRhaWxzOiBlcnJfNS5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy51cGRhdGVPbmUgPSB1cGRhdGVPbmU7XG52YXIgZGVsZXRlT25lID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgcmVmZXJlbmNlLCBNb2RlbCwgZG9jLCBlcnJfNjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbiwgcmVmZXJlbmNlID0gX2EucmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcImRlbGV0ZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiT3BlcmF0aW9uICdkZWxldGUnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kT25lQW5kRGVsZXRlKHsgcmVmZXJlbmNlOiByZWZlcmVuY2UgfSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGRvYyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk5vdCBmb3VuZFwiIH0pXTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwNCkuc2VuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyXzYgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJFcnJvciBkZWxldGluZyBkb2N1bWVudFwiLCBkZXRhaWxzOiBlcnJfNi5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWxldGVPbmUgPSBkZWxldGVPbmU7XG52YXIgaW5mZXJUeXBlcyA9IGZ1bmN0aW9uIChyZXEsIHJlcykge1xuICAgIHZhciBzcGFjZSA9IHJlcS5wYXJhbXMuc3BhY2U7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHR5cGVzID0gKDAsIHR5cGVJbmZlcmVuY2VfMS5nZW5lcmF0ZVR5cGVzKShzcGFjZSk7XG4gICAgICAgIHJlcy5oZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3R5cGVzY3JpcHRcIik7XG4gICAgICAgIHJlcy5zZW5kKHR5cGVzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycm9yIGdlbmVyYXRpbmcgdHlwZXNcIiwgZGV0YWlsczogZXJyLm1lc3NhZ2UgfSk7XG4gICAgfVxufTtcbmV4cG9ydHMuaW5mZXJUeXBlcyA9IGluZmVyVHlwZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2VuZXJhdGVUeXBlcyA9IHZvaWQgMDtcbnZhciBkb21haW5zXzEgPSByZXF1aXJlKFwiLi4vLi4vc3BlY3MvZG9tYWluc1wiKTtcbnZhciBjYXBpdGFsaXplID0gZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpOyB9O1xudmFyIHRvUGFzY2FsQ2FzZSA9IGZ1bmN0aW9uIChwYXJ0cykge1xuICAgIHJldHVybiBwYXJ0cy5tYXAoY2FwaXRhbGl6ZSkuam9pbihcIlwiKTtcbn07XG52YXIgbmVzdGVkSW50ZXJmYWNlcyA9IFtdO1xudmFyIGluZmVyVHNUeXBlID0gZnVuY3Rpb24gKGZpZWxkLCBkb21haW5OYW1lLCBwYXRoUGFydHMpIHtcbiAgICBpZiAocGF0aFBhcnRzID09PSB2b2lkIDApIHsgcGF0aFBhcnRzID0gW107IH1cbiAgICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIGNhc2UgXCJhbnlcIjpcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC50eXBlO1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBpZiAoIWZpZWxkLnNjaGVtYSlcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJSZWNvcmQ8c3RyaW5nLCBhbnk+XCI7XG4gICAgICAgICAgICB2YXIgaW50ZXJmYWNlTmFtZSA9IHRvUGFzY2FsQ2FzZShfX3NwcmVhZEFycmF5KFtkb21haW5OYW1lXSwgcGF0aFBhcnRzLCB0cnVlKSk7XG4gICAgICAgICAgICBuZXN0ZWRJbnRlcmZhY2VzLnB1c2goZ2VuZXJhdGVOZXN0ZWRJbnRlcmZhY2UoaW50ZXJmYWNlTmFtZSwgZmllbGQuc2NoZW1hLCBkb21haW5OYW1lLCBwYXRoUGFydHMpKTtcbiAgICAgICAgICAgIHJldHVybiBpbnRlcmZhY2VOYW1lO1xuICAgICAgICBjYXNlIFwiYXJyYXlcIjpcbiAgICAgICAgICAgIHZhciBpdGVtVHlwZSA9IGluZmVyVHNUeXBlKGZpZWxkLnNjaGVtYSwgZG9tYWluTmFtZSwgcGF0aFBhcnRzKTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiLmNvbmNhdChpdGVtVHlwZSwgXCJbXVwiKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBcImFueVwiO1xuICAgIH1cbn07XG52YXIgZ2VuZXJhdGVOZXN0ZWRJbnRlcmZhY2UgPSBmdW5jdGlvbiAoaW50ZXJmYWNlTmFtZSwgc3BlYywgZG9tYWluTmFtZSwgcGF0aFBhcnRzKSB7XG4gICAgaWYgKHBhdGhQYXJ0cyA9PT0gdm9pZCAwKSB7IHBhdGhQYXJ0cyA9IFtdOyB9XG4gICAgdmFyIGZpZWxkcyA9IFwiXCI7XG4gICAgZm9yICh2YXIgZmllbGQgaW4gc3BlYykge1xuICAgICAgICB2YXIgZmllbGREZWYgPSBzcGVjW2ZpZWxkXTtcbiAgICAgICAgdmFyIHRzVHlwZSA9IGluZmVyVHNUeXBlKGZpZWxkRGVmLCBkb21haW5OYW1lLCBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIHBhdGhQYXJ0cywgdHJ1ZSksIFtmaWVsZF0sIGZhbHNlKSk7XG4gICAgICAgIGZpZWxkcyArPSBcIlxcbiAgXCIuY29uY2F0KGZpZWxkKS5jb25jYXQoZmllbGREZWYucmVxdWlyZWQgPyBcIlwiIDogXCI/XCIsIFwiOiBcIikuY29uY2F0KHRzVHlwZSwgXCI7XCIpO1xuICAgIH1cbiAgICByZXR1cm4gXCJleHBvcnQgaW50ZXJmYWNlIFwiLmNvbmNhdChpbnRlcmZhY2VOYW1lLCBcIiB7XCIpLmNvbmNhdChmaWVsZHMsIFwiXFxufVwiKTtcbn07XG52YXIgZ2VuZXJhdGVUeXBlcyA9IGZ1bmN0aW9uIChzcGFjZSkge1xuICAgIHZhciB0eXBlcyA9IFtdO1xuICAgIE9iamVjdC5rZXlzKGRvbWFpbnNfMS5zcGVjc01hcCkuZm9yRWFjaChmdW5jdGlvbiAoc3BlY05hbWUpIHtcbiAgICAgICAgdmFyIHNwZWMgPSBkb21haW5zXzEuc3BlY3NNYXBbc3BlY05hbWVdO1xuICAgICAgICB2YXIgZG9tYWluSW50ZXJmYWNlTmFtZSA9IGNhcGl0YWxpemUoc3BlY05hbWUpO1xuICAgICAgICB2YXIgbWFpbkludGVyZmFjZSA9IGdlbmVyYXRlTmVzdGVkSW50ZXJmYWNlKGRvbWFpbkludGVyZmFjZU5hbWUsIHNwZWMsIHNwZWNOYW1lKTtcbiAgICAgICAgdHlwZXMucHVzaChtYWluSW50ZXJmYWNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCB0eXBlcywgdHJ1ZSksIG5lc3RlZEludGVyZmFjZXMsIHRydWUpLmpvaW4oXCJcXG5cXG5cIik7XG59O1xuZXhwb3J0cy5nZW5lcmF0ZVR5cGVzID0gZ2VuZXJhdGVUeXBlcztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRVc2VyQnlJZCA9IGV4cG9ydHMuZ2V0VXNlckJ5RW1haWwgPSBleHBvcnRzLmdldFVzZXJzID0gZXhwb3J0cy52YWxpZGF0ZVNlc3Npb24gPSBleHBvcnRzLmdldE5ld0FjY2Vzc1Rva2VuID0gZXhwb3J0cy5kZWNvZGVBY2Nlc3NUb2tlbiA9IHZvaWQgMDtcbnZhciBheGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbnZhciBPTkVBVVRIX0FQSSA9IHByb2Nlc3MuZW52Lk9ORUFVVEhfQVBJIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo0MDEwL2FwaVwiO1xudmFyIG1vZGVsXzEgPSByZXF1aXJlKFwiLi9tb2RlbFwiKTtcbnZhciBtb2RlbF8yID0gcmVxdWlyZShcIi4uL3VzZXIvaW52aXRlL21vZGVsXCIpO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciBoZWxwZXJfMSA9IHJlcXVpcmUoXCIuLi9hdXRoL2hlbHBlclwiKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIGRlY29kZUFjY2Vzc1Rva2VuID0gZnVuY3Rpb24gKHNwYWNlLCBhY2Nlc3NUb2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVjb2RlZFJlc3BvbnNlLCBlcnJfMSwgbW9kZWwsIGV4aXN0aW5nVXNlclJlY29yZCwgZGF0YTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBkZWNvZGVkUmVzcG9uc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgYXhpb3MuZ2V0KFwiXCIuY29uY2F0KE9ORUFVVEhfQVBJLCBcIi9hdXRoL3Rva2VuL2RlY29kZVwiKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb246IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGRlY29kZWRSZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChlcnJfMS5yZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIFwiZXhwaXJlZFwiXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBcImV4cGlyZWRcIl07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgaWYgKCEoZGVjb2RlZFJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSkgcmV0dXJuIFszLCA5XTtcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGRlY29kZWRSZXNwb25zZS5kYXRhLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgZXhpc3RpbmdVc2VyUmVjb3JkID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZEJ5SWRBbmRVcGRhdGUoZGVjb2RlZFJlc3BvbnNlLmRhdGEudXNlcl9pZCwgX19hc3NpZ24oX19hc3NpZ24oe30sIGRlY29kZWRSZXNwb25zZS5kYXRhKSwgeyByZXNvbHZlcjogXCJvbmVhdXRoX3NwYWNlXCIgfSksIHsgbmV3OiB0cnVlLCB1cHNlcnQ6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIGRhdGEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCEoZXhpc3RpbmdVc2VyUmVjb3JkLmxlbmd0aCA9PT0gMCkpIHJldHVybiBbMywgOF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBhdXRvQWNjZXB0SW52aXRlcyhkYXRhKV07XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gODtcbiAgICAgICAgICAgIGNhc2UgODogcmV0dXJuIFsyLCBkZWNvZGVkUmVzcG9uc2UuZGF0YSB8fCBudWxsXTtcbiAgICAgICAgICAgIGNhc2UgOTogcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlY29kZUFjY2Vzc1Rva2VuID0gZGVjb2RlQWNjZXNzVG9rZW47XG52YXIgYXV0b0FjY2VwdEludml0ZXMgPSBmdW5jdGlvbiAodXNlcikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIHBlbmRpbmdJbnZpdGVMaXN0LCBpLCByZXM7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzIudXNlckludml0ZUNvbGxlY3Rpb24sIG1vZGVsXzIudXNlckludml0ZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kKHsgZW1haWw6IHVzZXIuZW1haWwgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHBlbmRpbmdJbnZpdGVMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBlbmRpbmdJbnZpdGVMaXN0KTtcbiAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDI7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCEoaSA8IHBlbmRpbmdJbnZpdGVMaXN0Lmxlbmd0aCkpIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kQnlJZEFuZFVwZGF0ZShwZW5kaW5nSW52aXRlTGlzdFtpXS5faWQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBwZW5kaW5nSW52aXRlTGlzdFtpXS5fZG9jKSwgeyB1c2VySWQ6IHVzZXIuX2lkLCBhY2NlcHRlZDogdHJ1ZSB9KSwgeyBuZXc6IHRydWUsIHVwc2VydDogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcmVzID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKF9fYXNzaWduKF9fYXNzaWduKHt9LCBwZW5kaW5nSW52aXRlTGlzdFtpXSksIHsgdXNlcklkOiB1c2VyLl9pZCwgYWNjZXB0ZWQ6IHRydWUgfSkpO1xuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gNDtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCAyXTtcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG52YXIgZ2V0TmV3QWNjZXNzVG9rZW4gPSBmdW5jdGlvbiAoc3BhY2UsIHJlZnJlc2hUb2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVmcmVzaFRva2VuUmVzcG9uc2U7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgYXhpb3MucG9zdChcIlwiLmNvbmNhdChPTkVBVVRIX0FQSSwgXCIvYXV0aC90b2tlblwiKSwge1xuICAgICAgICAgICAgICAgICAgICBncmFudF90eXBlOiBcInJlZnJlc2hfdG9rZW5cIixcbiAgICAgICAgICAgICAgICAgICAgcmVhbG06IHNwYWNlLFxuICAgICAgICAgICAgICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoVG9rZW4sXG4gICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJlZnJlc2hUb2tlblJlc3BvbnNlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChyZWZyZXNoVG9rZW5SZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlZnJlc2hUb2tlblJlc3BvbnNlLmRhdGFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0TmV3QWNjZXNzVG9rZW4gPSBnZXROZXdBY2Nlc3NUb2tlbjtcbnZhciB2YWxpZGF0ZVNlc3Npb24gPSBmdW5jdGlvbiAobG9jYWxBY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuLCBhcHBSZWFsbSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWwsIGxvY2FsVG9rZW5SZXNwb25zZSwgYWNjZXNzVG9rZW4sIGxvY2FsQ2xhaW1zLCBfYSwgX2FjY2Vzc1Rva2VuLCBfbG9jYWxDbGFpbXMsIGFjY2Vzc1Rva2VuUmVzcG9uc2UsIG5ld0FjY2Vzc1Rva2VuLCBuZXdBY2Nlc3NUb2tlblJlc3BvbnNlO1xuICAgIHZhciBfYjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBoZWxwZXJfMS5kZWNvZGVBcHBUb2tlbikobG9jYWxBY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGxvY2FsVG9rZW5SZXNwb25zZSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgbG9jYWxDbGFpbXMgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIWxvY2FsVG9rZW5SZXNwb25zZS5vdXRjb21lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9hID0gbG9jYWxUb2tlblJlc3BvbnNlLmNsYWltcywgX2FjY2Vzc1Rva2VuID0gX2EuYWNjZXNzVG9rZW4sIF9sb2NhbENsYWltcyA9IF9fcmVzdChfYSwgW1wiYWNjZXNzVG9rZW5cIl0pO1xuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuID0gX2FjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgICAgIGxvY2FsQ2xhaW1zID0ge1xuICAgICAgICAgICAgICAgICAgICBzcGFjZTogX2xvY2FsQ2xhaW1zLnNwYWNlLFxuICAgICAgICAgICAgICAgICAgICBjb21wYW55SWQ6IF9sb2NhbENsYWltcy5jb21wYW55SWQsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5kZWNvZGVBY2Nlc3NUb2tlbihOdW1iZXIoYXBwUmVhbG0pLCBhY2Nlc3NUb2tlbildO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuUmVzcG9uc2UgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGFjY2Vzc1Rva2VuUmVzcG9uc2UgIT09IFwiZXhwaXJlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYWltczogYWNjZXNzVG9rZW5SZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGFjZTogbG9jYWxDbGFpbXMuc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0TmV3QWNjZXNzVG9rZW4oYXBwUmVhbG0sIHJlZnJlc2hUb2tlbildO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIG5ld0FjY2Vzc1Rva2VuID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghKG5ld0FjY2Vzc1Rva2VuID09PSBudWxsIHx8IG5ld0FjY2Vzc1Rva2VuID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZXdBY2Nlc3NUb2tlbi5hY2Nlc3NfdG9rZW4pKSByZXR1cm4gWzMsIDZdO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmRlY29kZUFjY2Vzc1Rva2VuKGFwcFJlYWxtLCBuZXdBY2Nlc3NUb2tlbi5hY2Nlc3NfdG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBuZXdBY2Nlc3NUb2tlblJlc3BvbnNlID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIF9iID0ge307XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgc2VydmljZV8xLmdldExvY2FsVG9rZW5JbXBsKShuZXdBY2Nlc3NUb2tlblJlc3BvbnNlLnVzZXJfaWQsIG5ld0FjY2Vzc1Rva2VuLmFjY2Vzc190b2tlbildO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzIsIChfYi5hY2Nlc3NUb2tlbiA9IF9jLnNlbnQoKSxcbiAgICAgICAgICAgICAgICAgICAgX2IuY2xhaW1zID0gbmV3QWNjZXNzVG9rZW5SZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgX2Iuc3BhY2UgPSBsb2NhbENsYWltcy5zcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgX2IpXTtcbiAgICAgICAgICAgIGNhc2UgNjogcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZhbGlkYXRlU2Vzc2lvbjtcbnZhciBnZXRVc2VycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCgpXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlcnMgPSBnZXRVc2VycztcbnZhciBnZXRVc2VyQnlFbWFpbCA9IGZ1bmN0aW9uIChlbWFpbCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWw7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgZW1haWw6IGVtYWlsLnRvTG93ZXJDYXNlKCkgfSldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VyQnlFbWFpbCA9IGdldFVzZXJCeUVtYWlsO1xudmFyIGdldFVzZXJCeUlkID0gZnVuY3Rpb24gKGlkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRCeUlkKGlkKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJCeUlkID0gZ2V0VXNlckJ5SWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX21ha2VUZW1wbGF0ZU9iamVjdCA9ICh0aGlzICYmIHRoaXMuX19tYWtlVGVtcGxhdGVPYmplY3QpIHx8IGZ1bmN0aW9uIChjb29rZWQsIHJhdykge1xuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XG4gICAgcmV0dXJuIGNvb2tlZDtcbn07XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlc29sdmVycyA9IGV4cG9ydHMudHlwZURlZnMgPSB2b2lkIDA7XG52YXIgYXBvbGxvX3NlcnZlcl9leHByZXNzXzEgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIpO1xudmFyIG1vZGVsXzEgPSByZXF1aXJlKFwiLi9tb2RlbFwiKTtcbnZhciBIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vaGVscGVyXCIpKTtcbnZhciBnZXRDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4uLy4uL2xpYi9kYnV0aWxzXCIpLmdldENvbGxlY3Rpb247XG52YXIgdHlwZURlZnMgPSAoMCwgYXBvbGxvX3NlcnZlcl9leHByZXNzXzEuZ3FsKSh0ZW1wbGF0ZU9iamVjdF8xIHx8ICh0ZW1wbGF0ZU9iamVjdF8xID0gX19tYWtlVGVtcGxhdGVPYmplY3QoW1wiXFxuICB0eXBlIFF1ZXJ5IHtcXG4gICAgdXNlcjogW1VzZXJdXFxuICAgIGF1dGhvcml6ZVVzZXIoXFxuICAgICAgYWNjZXNzVG9rZW46IFN0cmluZ1xcbiAgICAgIHJlZnJlc2hUb2tlbjogU3RyaW5nXFxuICAgICAgc3BhY2U6IFN0cmluZ1xcbiAgICApOiBBdXRob3JpemVSZXNwb25zZVxcbiAgfVxcblxcbiAgdHlwZSBNdXRhdGlvbiB7XFxuICAgIGNyZWF0ZUVtYWlsQWNjb3VudChwYXlsb2FkOiBVc2VyUGF5bG9hZCk6IFVzZXIhXFxuICB9XFxuXFxuICBpbnB1dCBVc2VyUGF5bG9hZCB7XFxuICAgIGZpcnN0TmFtZTogU3RyaW5nIVxcbiAgICBsYXN0TmFtZTogU3RyaW5nIVxcbiAgICBlbWFpbDogU3RyaW5nIVxcbiAgfVxcblxcbiAgdHlwZSBVc2VyIHtcXG4gICAgaWQ6IElEIVxcbiAgICBnaXZlbl9uYW1lOiBTdHJpbmdcXG4gICAgZmFtaWx5X25hbWU6IFN0cmluZ1xcbiAgICBuYW1lOiBTdHJpbmdcXG4gICAgbmlja25hbWU6IFN0cmluZ1xcbiAgICBlbWFpbDogU3RyaW5nXFxuICAgIHJlc29sdmVyOiBTdHJpbmdcXG4gIH1cXG5cXG4gIHR5cGUgQXV0aG9yaXplUmVzcG9uc2Uge1xcbiAgICBhY2Nlc3NUb2tlbjogU3RyaW5nXFxuICAgIGNsYWltczogSlNPTlxcbiAgfVxcblwiXSwgW1wiXFxuICB0eXBlIFF1ZXJ5IHtcXG4gICAgdXNlcjogW1VzZXJdXFxuICAgIGF1dGhvcml6ZVVzZXIoXFxuICAgICAgYWNjZXNzVG9rZW46IFN0cmluZ1xcbiAgICAgIHJlZnJlc2hUb2tlbjogU3RyaW5nXFxuICAgICAgc3BhY2U6IFN0cmluZ1xcbiAgICApOiBBdXRob3JpemVSZXNwb25zZVxcbiAgfVxcblxcbiAgdHlwZSBNdXRhdGlvbiB7XFxuICAgIGNyZWF0ZUVtYWlsQWNjb3VudChwYXlsb2FkOiBVc2VyUGF5bG9hZCk6IFVzZXIhXFxuICB9XFxuXFxuICBpbnB1dCBVc2VyUGF5bG9hZCB7XFxuICAgIGZpcnN0TmFtZTogU3RyaW5nIVxcbiAgICBsYXN0TmFtZTogU3RyaW5nIVxcbiAgICBlbWFpbDogU3RyaW5nIVxcbiAgfVxcblxcbiAgdHlwZSBVc2VyIHtcXG4gICAgaWQ6IElEIVxcbiAgICBnaXZlbl9uYW1lOiBTdHJpbmdcXG4gICAgZmFtaWx5X25hbWU6IFN0cmluZ1xcbiAgICBuYW1lOiBTdHJpbmdcXG4gICAgbmlja25hbWU6IFN0cmluZ1xcbiAgICBlbWFpbDogU3RyaW5nXFxuICAgIHJlc29sdmVyOiBTdHJpbmdcXG4gIH1cXG5cXG4gIHR5cGUgQXV0aG9yaXplUmVzcG9uc2Uge1xcbiAgICBhY2Nlc3NUb2tlbjogU3RyaW5nXFxuICAgIGNsYWltczogSlNPTlxcbiAgfVxcblwiXSkpKTtcbmV4cG9ydHMudHlwZURlZnMgPSB0eXBlRGVmcztcbnZhciByZXNvbHZlcnMgPSB7XG4gICAgUXVlcnk6IHtcbiAgICAgICAgdXNlcjogZnVuY3Rpb24gKF8xLCBfYSwgX2IpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIFtfMSwgX2EsIF9iXSwgdm9pZCAwLCBmdW5jdGlvbiAoXywgX2MsIF9kKSB7XG4gICAgICAgICAgICB2YXIgbW9kZWw7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSBfYy5lbWFpbDtcbiAgICAgICAgICAgIHZhciBzcGFjZSA9IF9kLnNwYWNlLCB1c2VyID0gX2QudXNlcjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2UpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9lLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3BhY2UgfHwgIXVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG5ldyBhcG9sbG9fc2VydmVyX2V4cHJlc3NfMS5BdXRoZW50aWNhdGlvbkVycm9yKFwiTm90IGF1dGhvcml6ZWQgdG8gYWNjZXNzIHRoaXMgY29udGVudFwiKV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldENvbGxlY3Rpb24oc3BhY2UsIG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfZS5zZW50KCldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSxcbiAgICAgICAgYXV0aG9yaXplVXNlcjogZnVuY3Rpb24gKF8xLCBfYSwgX18xKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCBbXzEsIF9hLCBfXzFdLCB2b2lkIDAsIGZ1bmN0aW9uIChfLCBfYiwgX18pIHtcbiAgICAgICAgICAgIHZhciBtb2RlbCwgYWNjZXNzVG9rZW5SZXNwb25zZSwgbmV3QWNjZXNzVG9rZW4sIG5ld0FjY2Vzc1Rva2VuUmVzcG9uc2U7XG4gICAgICAgICAgICB2YXIgYWNjZXNzVG9rZW4gPSBfYi5hY2Nlc3NUb2tlbiwgcmVmcmVzaFRva2VuID0gX2IucmVmcmVzaFRva2VuLCBzcGFjZSA9IF9iLnNwYWNlO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2MubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBnZXRDb2xsZWN0aW9uKHNwYWNlLCBtb2RlbF8xLnVzZXJDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJTY2hlbWEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVjb2RlQWNjZXNzVG9rZW4oTnVtYmVyKHNwYWNlKSwgYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW5SZXNwb25zZSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY2Nlc3NUb2tlblJlc3BvbnNlICE9PSBcImV4cGlyZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFpbXM6IGFjY2Vzc1Rva2VuUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZ2V0TmV3QWNjZXNzVG9rZW4oc3BhY2UsIHJlZnJlc2hUb2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdBY2Nlc3NUb2tlbiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKG5ld0FjY2Vzc1Rva2VuID09PSBudWxsIHx8IG5ld0FjY2Vzc1Rva2VuID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZXdBY2Nlc3NUb2tlbi5hY2Nlc3NfdG9rZW4pKSByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVjb2RlQWNjZXNzVG9rZW4oc3BhY2UsIG5ld0FjY2Vzc1Rva2VuLmFjY2Vzc190b2tlbildO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdBY2Nlc3NUb2tlblJlc3BvbnNlID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiBuZXdBY2Nlc3NUb2tlbi5hY2Nlc3NfdG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYWltczogbmV3QWNjZXNzVG9rZW5SZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSxcbiAgICB9LFxuICAgIE11dGF0aW9uOiB7XG4gICAgICAgIGNyZWF0ZUVtYWlsQWNjb3VudDogZnVuY3Rpb24gKF8xLCBhcmdzXzEsIF9hKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCBbXzEsIGFyZ3NfMSwgX2FdLCB2b2lkIDAsIGZ1bmN0aW9uIChfLCBhcmdzLCBfYikge1xuICAgICAgICAgICAgdmFyIG1vZGVsLCByZXNwb25zZTtcbiAgICAgICAgICAgIHZhciBzcGFjZSA9IF9iLnNwYWNlLCB1c2VyID0gX2IudXNlcjtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgbW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZUFuZFVwZGF0ZSh7IGVtYWlsOiBhcmdzLnBheWxvYWQuZW1haWwsIHJlc29sdmVyOiBcImVtYWlsXCIgfSwgX19hc3NpZ24oX19hc3NpZ24oe30sIGFyZ3MucGF5bG9hZCksIHsgcmVzb2x2ZXI6IFwiZW1haWxcIiB9KSwgeyB1cHNlcnQ6IHRydWUsIG5ldzogdHJ1ZSwgcmF3UmVzdWx0OiB0cnVlIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlLnZhbHVlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7IH0sXG4gICAgfSxcbn07XG5leHBvcnRzLnJlc29sdmVycyA9IHJlc29sdmVycztcbnZhciB0ZW1wbGF0ZU9iamVjdF8xO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFVzZXJJbnZpdGVCeVVzZXJJZCA9IGV4cG9ydHMucmVnaXN0ZXJVc2VySW52aXRlID0gZXhwb3J0cy5nZXRVc2VySW52aXRlID0gZXhwb3J0cy51cGRhdGVVc2VySW52aXRlID0gdm9pZCAwO1xudmFyIGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xudmFyIE9ORUFVVEhfQVBJID0gcHJvY2Vzcy5lbnYuT05FQVVUSF9BUEkgfHwgXCJodHRwOi8vbG9jYWxob3N0OjQwMTAvYXBpXCI7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xudmFyIGNvbXBhbnlTZXJ2aWNlID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi8uLi9jb21wYW55L3NlcnZpY2VcIikpO1xudmFyIHVzZXJTZXJ2aWNlID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgdXBkYXRlVXNlckludml0ZSA9IGZ1bmN0aW9uIChzcGFjZSwgZGF0YSwgdXNlcklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb21wYW55LCBtb2RlbCwgdXNlciwgcGF5bG9hZCwgZXhpc3RpbmdSZWNvcmQ7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgY29tcGFueVNlcnZpY2UuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlKHNwYWNlKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgY29tcGFueSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEudXNlckludml0ZUNvbGxlY3Rpb24sIG1vZGVsXzEudXNlckludml0ZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCB1c2VyU2VydmljZS5nZXRVc2VyQnlFbWFpbChkYXRhLmVtYWlsKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdXNlciA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRhdGEpLCB7IGVtYWlsOiBkYXRhLmVtYWlsLnRvTG93ZXJDYXNlKCksIGNvbXBhbnlJZDogY29tcGFueS5faWQsIGFjY2VwdGVkOiAhIXVzZXIsIHVzZXJJZDogdXNlciA/IHVzZXIuX2lkIDogbnVsbCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHBheWxvYWQuZW1haWwudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogY29tcGFueS5faWQsXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlY29yZCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoKGV4aXN0aW5nUmVjb3JkID09PSBudWxsIHx8IGV4aXN0aW5nUmVjb3JkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBleGlzdGluZ1JlY29yZC5sZW5ndGgpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmNyZWF0ZShwYXlsb2FkKV07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnVwZGF0ZVVzZXJJbnZpdGUgPSB1cGRhdGVVc2VySW52aXRlO1xudmFyIGdldFVzZXJJbnZpdGUgPSBmdW5jdGlvbiAoc3BhY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBhbnksIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIGNvbXBhbnlTZXJ2aWNlLmdldENvbXBhbnlCeVJlZmVyZW5jZShzcGFjZSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNvbXBhbnkgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgW11dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoeyBjb21wYW55SWQ6IGNvbXBhbnkuX2lkIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlckludml0ZSA9IGdldFVzZXJJbnZpdGU7XG52YXIgcmVnaXN0ZXJVc2VySW52aXRlID0gZnVuY3Rpb24gKHNwYWNlLCBjb21wYW55SWQsIHVzZXJJZCwgZW1haWwpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsLCBleGlzdGluZ1JlY29yZDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55SWQ6IGNvbXBhbnlJZCxcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVjb3JkID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICgoZXhpc3RpbmdSZWNvcmQgPT09IG51bGwgfHwgZXhpc3RpbmdSZWNvcmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nUmVjb3JkLmxlbmd0aCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogY29tcGFueUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnJlZ2lzdGVyVXNlckludml0ZSA9IHJlZ2lzdGVyVXNlckludml0ZTtcbnZhciBnZXRVc2VySW52aXRlQnlVc2VySWQgPSBmdW5jdGlvbiAodXNlcklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoeyB1c2VySWQ6IHVzZXJJZCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJJbnZpdGVCeVVzZXJJZCA9IGdldFVzZXJJbnZpdGVCeVVzZXJJZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VySW52aXRlQ29sbGVjdGlvbiA9IGV4cG9ydHMudXNlckludml0ZVNjaGVtYSA9IHZvaWQgMDtcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTtcbnZhciBTY2hlbWEgPSBtb25nb29zZS5TY2hlbWE7XG52YXIgdXNlckludml0ZVNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIHVzZXJJZDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBjb21wYW55SWQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgYWNjZXB0ZWQ6IHsgdHlwZTogQm9vbGVhbiB9LFxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VySW52aXRlU2NoZW1hID0gdXNlckludml0ZVNjaGVtYTtcbnZhciB1c2VySW52aXRlQ29sbGVjdGlvbiA9IFwidXNlci5wZXJtaXNzaW9uXCI7XG5leHBvcnRzLnVzZXJJbnZpdGVDb2xsZWN0aW9uID0gdXNlckludml0ZUNvbGxlY3Rpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBtaWRkbGV3YXJlc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL21pZGRsZXdhcmVzXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3NlcnZpY2VcIik7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgcm91dGVyLnBvc3QoXCIvdXNlci9pbnZpdGUvOnNwYWNlXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuY3JlYXRlVXNlckludml0ZUVuZHBvaW50KTtcbiAgICByb3V0ZXIuZ2V0KFwiL3VzZXIvaW52aXRlLzpzcGFjZVwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLmdldFVzZXJJbnZpdGUpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFVzZXJJbnZpdGUgPSBleHBvcnRzLnJlZ2lzdGVyVXNlckludml0ZSA9IGV4cG9ydHMuY3JlYXRlVXNlckludml0ZUVuZHBvaW50ID0gdm9pZCAwO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciBjcmVhdGVVc2VySW52aXRlRW5kcG9pbnQgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVzZXJJZCwgdXNlckludml0ZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB1c2VySWQgPSByZXEudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLnVwZGF0ZVVzZXJJbnZpdGUocmVxLnBhcmFtcy5zcGFjZSwgcmVxLmJvZHksIHVzZXJJZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHVzZXJJbnZpdGUpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuY3JlYXRlVXNlckludml0ZUVuZHBvaW50ID0gY3JlYXRlVXNlckludml0ZUVuZHBvaW50O1xudmFyIHJlZ2lzdGVyVXNlckludml0ZSA9IGZ1bmN0aW9uIChzcGFjZSwgY29tcGFueUlkLCB1c2VySWQsIGVtYWlsKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci5yZWdpc3RlclVzZXJJbnZpdGUoc3BhY2UsIGNvbXBhbnlJZCwgdXNlcklkLCBlbWFpbCldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5yZWdpc3RlclVzZXJJbnZpdGUgPSByZWdpc3RlclVzZXJJbnZpdGU7XG52YXIgZ2V0VXNlckludml0ZSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlcklkLCB1c2VySW52aXRlTGlzdDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB1c2VySWQgPSByZXEudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJJbnZpdGUocmVxLnBhcmFtcy5zcGFjZSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGVMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh1c2VySW52aXRlTGlzdCk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VySW52aXRlID0gZ2V0VXNlckludml0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VyQ29sbGVjdGlvbiA9IGV4cG9ydHMudXNlclNjaGVtYSA9IHZvaWQgMDtcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTtcbnZhciBTY2hlbWEgPSBtb25nb29zZS5TY2hlbWE7XG52YXIgdXNlclNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICAgIGdpdmVuX25hbWU6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgZmFtaWx5X25hbWU6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBuaWNrbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICByZXNvbHZlcjogeyB0eXBlOiBTdHJpbmcgfSxcbn0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcbmV4cG9ydHMudXNlclNjaGVtYSA9IHVzZXJTY2hlbWE7XG52YXIgdXNlckNvbGxlY3Rpb24gPSBcInVzZXJcIjtcbmV4cG9ydHMudXNlckNvbGxlY3Rpb24gPSB1c2VyQ29sbGVjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9oYW5kbGVyXCIpO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICByb3V0ZXIucG9zdChcIi91c2VyLzpyZWFsbUlkL2F1dGhvcml6ZV91c2VyXCIsICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEudmFsaWRhdGVTZXNzaW9uKSk7XG4gICAgcm91dGVyLmdldChcIi91c2VyLzpyZWFsbUlkXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLmdldFVzZXJzKSk7XG4gICAgcm91dGVyLmdldChcIi91c2VyL3Rva2VuL2xvY2FsXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpT25lYXV0aCwgKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKHNlcnZpY2VfMS5nZXRMb2NhbFRva2VuKSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0VXNlckJ5SWQgPSBleHBvcnRzLmdldFVzZXJCeUVtYWlsID0gZXhwb3J0cy5nZXRMb2NhbFRva2VuSW1wbCA9IGV4cG9ydHMuZ2V0TG9jYWxUb2tlbiA9IGV4cG9ydHMuZ2V0VXNlcnMgPSBleHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZvaWQgMDtcbnZhciBIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vaGVscGVyXCIpKTtcbnZhciB1c2VySW52aXRlSGVscGVyID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi91c2VyL2ludml0ZS9oZWxwZXJcIikpO1xudmFyIGNvbXBhbnlIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uL2NvbXBhbnkvaGVscGVyXCIpKTtcbnZhciBoZWxwZXJfMSA9IHJlcXVpcmUoXCIuLi9hdXRoL2hlbHBlclwiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG52YXIgdmFsaWRhdGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXNzaW9uO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci52YWxpZGF0ZVNlc3Npb24ocmVxLmJvZHkuYWNjZXNzVG9rZW4sIHJlcS5ib2R5LnJlZnJlc2hUb2tlbiwgcmVxLnBhcmFtcy5yZWFsbUlkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChcIlNlc3Npb24gbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChzZXNzaW9uKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZhbGlkYXRlU2Vzc2lvbjtcbnZhciBnZXRVc2VycyA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlcklkLCB1c2VyTGlzdDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB1c2VySWQgPSByZXEudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJzKCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh1c2VyTGlzdCk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VycyA9IGdldFVzZXJzO1xudmFyIGdldExvY2FsVG9rZW4gPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuLCBhcHBUb2tlbjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbiA9IHJlcS5oZWFkZXJzW1wiYXV0aG9yaXphdGlvblwiXTtcbiAgICAgICAgICAgICAgICBpZiAoIWFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgKDAsIGV4cG9ydHMuZ2V0TG9jYWxUb2tlbkltcGwpKHJlcS51c2VyLnVzZXJfaWQsIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgYXBwVG9rZW4gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgdG9rZW46IGFwcFRva2VuIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0TG9jYWxUb2tlbiA9IGdldExvY2FsVG9rZW47XG52YXIgZ2V0TG9jYWxUb2tlbkltcGwgPSBmdW5jdGlvbiAodXNlcklkLCBhY2Nlc3NUb2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlckludml0ZUxpc3QsIGNvbXBhbnlJZExpc3QsIGNvbXBhbnlMaXN0LCBjb21wYW55UmVmZXJlbmNlTGlzdCwgY2xhaW1zO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIHVzZXJJbnZpdGVIZWxwZXIuZ2V0VXNlckludml0ZUJ5VXNlcklkKHVzZXJJZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGVMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGNvbXBhbnlJZExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICB1c2VySW52aXRlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZExpc3QucHVzaChpdGVtLmNvbXBhbnlJZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBjb21wYW55SGVscGVyLmdldENvbXBhbnlCeUlkTGlzdChjb21wYW55SWRMaXN0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY29tcGFueUxpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29tcGFueVJlZmVyZW5jZUxpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBjb21wYW55TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlSZWZlcmVuY2VMaXN0LnB1c2goaXRlbS5yZWZlcmVuY2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNsYWltcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZTogY29tcGFueVJlZmVyZW5jZUxpc3QsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogY29tcGFueUlkTGlzdCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgKDAsIGhlbHBlcl8xLmVuY29kZUFwcFRva2VuKShjbGFpbXMpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldExvY2FsVG9rZW5JbXBsID0gZ2V0TG9jYWxUb2tlbkltcGw7XG52YXIgZ2V0VXNlckJ5RW1haWwgPSBmdW5jdGlvbiAoZW1haWwpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJCeUVtYWlsKGVtYWlsKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJCeUVtYWlsID0gZ2V0VXNlckJ5RW1haWw7XG52YXIgZ2V0VXNlckJ5SWQgPSBmdW5jdGlvbiAoaWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJCeUlkKGlkKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJCeUlkID0gZ2V0VXNlckJ5SWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBleHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG52YXIgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbnJvdXRlci5nZXQoXCIvXCIsIGZ1bmN0aW9uIChfLCByZXMpIHtcbiAgICByZXMuc2VuZChcInYxLjAuMFwiKTtcbiAgICByZXMuZW5kKCk7XG59KTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvaGVsbG8vcm91dGVcIikocm91dGVyKTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvYXV0aC9yb3V0ZVwiKShyb3V0ZXIpO1xucmVxdWlyZShcIi4vbW9kdWxlcy91c2VyL3JvdXRlXCIpKHJvdXRlcik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL3VzZXIvaW52aXRlL3JvdXRlXCIpKHJvdXRlcik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL2NvbXBhbnkvcm91dGVcIikocm91dGVyKTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvdW5pdmVyc2FsL3JvdXRlXCIpKHJvdXRlcik7XG5tb2R1bGUuZXhwb3J0cyA9IHJvdXRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGZyYWdtZW50U3BlYyA9IHtcbiAgICBcIm5hbWVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlXG4gICAgfSxcbiAgICBcImxhdGVzdENvbnRlbnRcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZVxuICAgIH0sXG4gICAgXCJzdG9yeXRocmVhZElkXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJsYWJlbHNcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJhcnJheVwiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICBcImxhYmVsXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJjb2xvcnNcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJhcnJheVwiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZyYWdtZW50U3BlYztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGZyYWdtZW50Q29tbWVudFNwZWMgPSB7XG4gICAgXCJmcmFnbWVudElkXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJmcmFnbWVudFZlcnNpb25JZFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICB9LFxuICAgIFwibW9kZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICB9LFxuICAgIFwidXNlclByb21wdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICB9LFxuICAgIFwiY29udGVudFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgfVxufTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZyYWdtZW50Q29tbWVudFNwZWM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBmcmFnbWVudFZlcnNpb25TcGVjID0ge1xuICAgIFwiZnJhZ21lbnRJZFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICB9LFxuICAgIFwiY29udGVudFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICB9LFxuICAgIFwidmVyc2lvblRhZ1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcInVzZXJOb3RlXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICB9XG59O1xuZXhwb3J0cy5kZWZhdWx0ID0gZnJhZ21lbnRWZXJzaW9uU3BlYztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zcGVjc01hcCA9IHZvaWQgMDtcbnZhciBmcmFnbWVudF9zcGVjXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZnJhZ21lbnQuc3BlY1wiKSk7XG52YXIgZnJhZ21lbnRDb21tZW50X3NwZWNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9mcmFnbWVudENvbW1lbnQuc3BlY1wiKSk7XG52YXIgZnJhZ21lbnRWZXJzaW9uX3NwZWNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9mcmFnbWVudFZlcnNpb24uc3BlY1wiKSk7XG52YXIgc3Rvcnl0aHJlYWRfc3BlY18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3N0b3J5dGhyZWFkLnNwZWNcIikpO1xudmFyIHVzZXJfc3BlY18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3VzZXIuc3BlY1wiKSk7XG5leHBvcnRzLnNwZWNzTWFwID0ge1xuICAgIHVzZXI6IHVzZXJfc3BlY18xLmRlZmF1bHQsXG4gICAgZnJhZ21lbnQ6IGZyYWdtZW50X3NwZWNfMS5kZWZhdWx0LFxuICAgIGZyYWdtZW50Q29tbWVudDogZnJhZ21lbnRDb21tZW50X3NwZWNfMS5kZWZhdWx0LFxuICAgIGZyYWdtZW50VmVyc2lvbjogZnJhZ21lbnRWZXJzaW9uX3NwZWNfMS5kZWZhdWx0LFxuICAgIHN0b3J5dGhyZWFkOiBzdG9yeXRocmVhZF9zcGVjXzEuZGVmYXVsdFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHN0b3J5dGhyZWFkU3BlYyA9IHtcbiAgICBcInRpdGxlXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJkZXNjcmlwdGlvblwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgfVxufTtcbmV4cG9ydHMuZGVmYXVsdCA9IHN0b3J5dGhyZWFkU3BlYztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHVzZXJTcGVjID0ge1xuICAgIFwibmFtZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICB9LFxuICAgIFwicHJvZmlsZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgIFwiYWdlXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiYmlvXCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiYWRkcmVzc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjaXR5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiemlwXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwidGFnc1wiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcImFycmF5XCIsXG4gICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICBcInNjaGVtYVwiOiB7XG4gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLmRlZmF1bHQgPSB1c2VyU3BlYztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbml0aWFsaXplU2VxdWVuY2VzID0gdm9pZCAwO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvc2VxdWVuY2Uvc2VydmljZVwiKTtcbnZhciBpbml0aWFsaXplU2VxdWVuY2VzID0gZnVuY3Rpb24gKCkge1xuICAgICgwLCBzZXJ2aWNlXzEuY3JlYXRlX3NlcXVlbmNlKShcImFzc2V0SWRcIiwgbnVsbCwgMSk7XG4gICAgKDAsIHNlcnZpY2VfMS5jcmVhdGVfc2VxdWVuY2UpKFwiY29tcGFueUlkXCIsIG51bGwsIDEpO1xufTtcbmV4cG9ydHMuaW5pdGlhbGl6ZVNlcXVlbmNlcyA9IGluaXRpYWxpemVTZXF1ZW5jZXM7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG4vKipcbiAqIEBwYXJhbSB7KHN0cmluZyB8IG51bWJlcilbXX0gdXBkYXRlZE1vZHVsZXMgdXBkYXRlZCBtb2R1bGVzXG4gKiBAcGFyYW0geyhzdHJpbmcgfCBudW1iZXIpW10gfCBudWxsfSByZW5ld2VkTW9kdWxlcyByZW5ld2VkIG1vZHVsZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHQnW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIG9wdGltaXphdGlvbi5tb2R1bGVJZHM6IFwibmFtZWRcIiBmb3IgbW9kdWxlIG5hbWVzLidcblx0XHRcdCk7XG5cdH1cbn07XG4iLCIvKiogQHR5cGVkZWYge1wiaW5mb1wiIHwgXCJ3YXJuaW5nXCIgfCBcImVycm9yXCJ9IExvZ0xldmVsICovXG5cbi8qKiBAdHlwZSB7TG9nTGV2ZWx9ICovXG52YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG4vKipcbiAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxldmVsIGxvZyBsZXZlbFxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUsIGlmIHNob3VsZCBsb2dcbiAqL1xuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7KG1zZz86IHN0cmluZykgPT4gdm9pZH0gbG9nRm4gbG9nIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7KGxldmVsOiBMb2dMZXZlbCwgbXNnPzogc3RyaW5nKSA9PiB2b2lkfSBmdW5jdGlvbiB0aGF0IGxvZ3Mgd2hlbiBsb2cgbGV2ZWwgaXMgc3VmZmljaWVudFxuICovXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgbG9nIGxldmVsXG4gKiBAcGFyYW0ge3N0cmluZ3xFcnJvcn0gbXNnIG1lc3NhZ2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxudmFyIGdyb3VwID0gY29uc29sZS5ncm91cCB8fCBkdW1teTtcbnZhciBncm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgfHwgZHVtbXk7XG52YXIgZ3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kIHx8IGR1bW15O1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG4vKipcbiAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxldmVsIGxvZyBsZXZlbFxuICovXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnIgZXJyb3JcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGZvcm1hdHRlZCBlcnJvclxuICovXG5tb2R1bGUuZXhwb3J0cy5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcblx0dmFyIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcblx0dmFyIHN0YWNrID0gZXJyLnN0YWNrO1xuXHRpZiAoIXN0YWNrKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoc3RhY2suaW5kZXhPZihtZXNzYWdlKSA8IDApIHtcblx0XHRyZXR1cm4gbWVzc2FnZSArIFwiXFxuXCIgKyBzdGFjaztcblx0fVxuXHRyZXR1cm4gc3RhY2s7XG59O1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8qIGdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zbGljZSgxKSB8fCAxMCAqIDYwICogMTAwMDtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHQvKipcblx0ICogQHBhcmFtIHtib29sZWFuPX0gZnJvbVVwZGF0ZSB0cnVlIHdoZW4gY2FsbGVkIGZyb20gdXBkYXRlXG5cdCAqL1xuXHR2YXIgY2hlY2tGb3JVcGRhdGUgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZShmcm9tVXBkYXRlKSB7XG5cdFx0aWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRtb2R1bGUuaG90XG5cdFx0XHRcdC5jaGVjayh0cnVlKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAodXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsImNvbnN0IHsgQXV0aGVudGljYXRpb25FcnJvciB9ID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTtcblxuY29uc3QgaXNVbmF1dGhvcml6ZWQgPSAodXNlcikgPT4ge1xuICBpZiAoIXVzZXIpIHtcbiAgICByZXR1cm4gbmV3IEF1dGhlbnRpY2F0aW9uRXJyb3IoXCJOb3QgYXV0aG9yaXplZCB0byBhY2Nlc3MgdGhpcyBjb250ZW50XCIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyBpc1VuYXV0aG9yaXplZCB9O1xuIiwiY29uc3QgeyBncWwgfSA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7XG5jb25zdCB7IGFzc2V0Q29sbGVjdGlvbiwgYXNzZXRTY2hlbWEgfSA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xuY29uc3QgeyBnZXRHbG9iYWxDb2xsZWN0aW9uIH0gPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIik7XG5jb25zdCB7IGlzVW5hdXRob3JpemVkIH0gPSByZXF1aXJlKFwiLi4vLi4vbGliL2F1dGh1dGlsc1wiKTtcbmNvbnN0IHsgbmV4dHZhbCB9ID0gcmVxdWlyZShcIi4uL3NlcXVlbmNlL3NlcnZpY2VcIik7XG5cbmNvbnN0IHR5cGVEZWZzID0gZ3FsYFxuICBleHRlbmQgdHlwZSBRdWVyeSB7XG4gICAgYXNzZXQoYXNzZXRJZDogU3RyaW5nISk6IEFzc2V0XG4gICAgYXNzZXRCeUlkKGlkOiBJRCEpOiBBc3NldFxuICAgIGFzc2V0czogW0Fzc2V0XVxuICB9XG5cbiAgZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xuICAgIHVwZGF0ZUFzc2V0KHBheWxvYWQ6IEFzc2V0UGF5bG9hZCk6IEFzc2V0XG4gICAgY3JlYXRlQXNzZXQocGF5bG9hZDogQXNzZXRQYXlsb2FkLCBhZGRpdGlvbjogQXNzZXRBZGRpdGlvblBheWxvYWQpOiBBc3NldFxuICB9XG5cbiAgaW5wdXQgQXNzZXRQYXlsb2FkIHtcbiAgICBpZDogU3RyaW5nXG4gICAgbmFtZTogU3RyaW5nXG4gICAgc2VjdGlvbjogSlNPTlxuICAgIGZlYXR1cmVkVGl0bGU6IFN0cmluZ1xuICAgIGZlYXR1cmVkU3VidGl0bGU6IFN0cmluZ1xuICAgIGhlcm86IEpTT05cbiAgICBqd3RQYXNzd29yZDogU3RyaW5nXG4gICAgcHJvZHVjdGlvbk1vZGU6IEJvb2xlYW5cbiAgfVxuXG4gIGlucHV0IEFzc2V0QWRkaXRpb25QYXlsb2FkIHtcbiAgICBlbWFpbDogU3RyaW5nXG4gIH1cblxuICB0eXBlIEFzc2V0IHtcbiAgICBpZDogSUQhXG4gICAgbmFtZTogU3RyaW5nXG4gICAgc2VjdGlvbjogSlNPTlxuICAgIGZlYXR1cmVkVGl0bGU6IFN0cmluZ1xuICAgIGZlYXR1cmVkU3VidGl0bGU6IFN0cmluZ1xuICAgIGhlcm86IEpTT05cbiAgICBqd3RQYXNzd29yZDogU3RyaW5nXG4gICAgcHJvZHVjdGlvbk1vZGU6IEJvb2xlYW5cbiAgICBhc3NldElkOiBTdHJpbmdcbiAgfVxuYDtcblxuY29uc3QgcmVzb2x2ZXJzID0ge1xuICBRdWVyeToge1xuICAgIGFzc2V0OiBhc3luYyAoXywgeyBhc3NldElkIH0sIHsgdXNlciB9KSA9PiB7XG4gICAgICAvLyBpZiAoIXVzZXIpIHtcbiAgICAgIC8vICAgcmV0dXJuIG5ldyBBdXRoZW50aWNhdGlvbkVycm9yKCdOb3QgYXV0aG9yaXplZCB0byBhY2Nlc3MgdGhpcyBjb250ZW50Jyk7XG4gICAgICAvLyB9XG4gICAgICBjb25zdCBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oYXNzZXRDb2xsZWN0aW9uLCBhc3NldFNjaGVtYSk7XG4gICAgICByZXR1cm4gYXdhaXQgbW9kZWwuZmluZE9uZSh7IGFzc2V0SWQgfSk7XG4gICAgfSxcbiAgICBhc3NldHM6IGFzeW5jICgpID0+IHtcbiAgICAgIC8vIGlmICghdXNlcikge1xuICAgICAgLy8gICByZXR1cm4gbmV3IEF1dGhlbnRpY2F0aW9uRXJyb3IoJ05vdCBhdXRob3JpemVkIHRvIGFjY2VzcyB0aGlzIGNvbnRlbnQnKTtcbiAgICAgIC8vIH1cbiAgICAgIGNvbnN0IG1vZGVsID0gZ2V0R2xvYmFsQ29sbGVjdGlvbihhc3NldENvbGxlY3Rpb24sIGFzc2V0U2NoZW1hKTtcbiAgICAgIHJldHVybiBhd2FpdCBtb2RlbC5maW5kKCk7XG4gICAgfSxcbiAgfSxcblxuICBNdXRhdGlvbjoge1xuICAgIHVwZGF0ZUFzc2V0OiBhc3luYyAoXywgYXJncywgeyB1c2VyIH0pID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gZ2V0R2xvYmFsQ29sbGVjdGlvbihhc3NldENvbGxlY3Rpb24sIGFzc2V0U2NoZW1hKTtcbiAgICAgIGlmIChhcmdzLnBheWxvYWQuaWQpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1vZGVsLmZpbmRCeUlkQW5kVXBkYXRlKGFyZ3MucGF5bG9hZC5pZCwgYXJncy5wYXlsb2FkLCB7XG4gICAgICAgICAgbmV3OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoYXJncy5wYXlsb2FkLmFzc2V0SWQpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoXG4gICAgICAgICAgeyBhc3NldElkOiBhcmdzLnBheWxvYWQuYXNzZXRJZCB9LFxuICAgICAgICAgIGFyZ3MucGF5bG9hZCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuZXc6IHRydWUsXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBtb2RlbCh7XG4gICAgICAgICAgLi4uYXJncy5wYXlsb2FkLFxuICAgICAgICAgIGFzc2V0SWQ6IGBhJHthd2FpdCBuZXh0dmFsKFwiYXNzZXRJZFwiKX1gLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGRhdGEuc2F2ZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY3JlYXRlQXNzZXQ6IGFzeW5jIChfLCB7IHBheWxvYWQsIGFkZGl0aW9uIH0sIHsgdXNlciB9KSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oYXNzZXRDb2xsZWN0aW9uLCBhc3NldFNjaGVtYSk7XG4gICAgICBjb25zdCBkYXRhID0gbmV3IG1vZGVsKHtcbiAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgYXNzZXRJZDogYGEke2F3YWl0IG5leHR2YWwoXCJhc3NldElkXCIpfWAsXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgdXNlciBhY2NvdW50IG5lZWRzIHRvIGJlIHNldHVwIGZvciAke2FkZGl0aW9uLmVtYWlsfSBpbiAke3BheWxvYWQubmFtZX1gXG4gICAgICApO1xuICAgICAgcmV0dXJuIGF3YWl0IGRhdGEuc2F2ZSgpO1xuICAgIH0sXG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHsgdHlwZURlZnMsIHJlc29sdmVycyB9O1xuIiwidmFyIG1vbmdvb3NlID0gcmVxdWlyZShcIm1vbmdvb3NlXCIpO1xuXG5jb25zdCBTY2hlbWEgPSBtb25nb29zZS5TY2hlbWE7XG5jb25zdCBhc3NldFNjaGVtYSA9IG5ldyBTY2hlbWEoXG4gIHtcbiAgICBuYW1lOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIHNlY3Rpb246IHsgdHlwZTogQXJyYXkgfSxcbiAgICBmZWF0dXJlZFRpdGxlOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIGZlYXR1cmVkU3VidGl0bGU6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgand0UGFzc3dvcmQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgcHJvZHVjdGlvbk1vZGU6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2UgfSxcbiAgICBhc3NldElkOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIGhlcm86IHsgdHlwZTogT2JqZWN0IH0sXG4gIH0sXG4gIHsgdGltZXN0YW1wczogdHJ1ZSB9XG4pO1xuXG5jb25zdCBhc3NldENvbGxlY3Rpb24gPSBcImFzc2V0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0geyBhc3NldFNjaGVtYSwgYXNzZXRDb2xsZWN0aW9uIH07XG4iLCJjb25zdCB7IGdxbCwgQXV0aGVudGljYXRpb25FcnJvciB9ID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTtcbmNvbnN0IEdyYXBoUUxKU09OID0gcmVxdWlyZShcImdyYXBocWwtdHlwZS1qc29uXCIpO1xuXG5jb25zdCB0eXBlRGVmcyA9IGdxbGBcbiAgc2NhbGFyIEpTT05cbmA7XG5cbmNvbnN0IHJlc29sdmVycyA9IHtcbiAgSlNPTjogR3JhcGhRTEpTT04sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHsgdHlwZURlZnMsIHJlc29sdmVycyB9O1xuIiwidmFyIG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKTtcblxuY29uc3QgU2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hO1xuY29uc3Qgc2VxdWVuY2VTY2hlbWEgPSBuZXcgU2NoZW1hKFxuICB7XG4gICAgZmllbGQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgY29udGV4dDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBuZXh0dmFsOiB7IHR5cGU6IE51bWJlciB9LFxuICAgIGZhY3RvcjogeyB0eXBlOiBOdW1iZXIgfSxcbiAgfSxcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cbik7XG5cbmNvbnN0IHNlcXVlbmNlQ29sbGVjdGlvbiA9ICdzZXF1ZW5jZSc7XG5cbm1vZHVsZS5leHBvcnRzID0geyBzZXF1ZW5jZVNjaGVtYSwgc2VxdWVuY2VDb2xsZWN0aW9uIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXhpb3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmNyeXB0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGF0ZS1mbnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLXR5cGUtanNvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmFub2lkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0aWYgKGNhY2hlZE1vZHVsZS5lcnJvciAhPT0gdW5kZWZpbmVkKSB0aHJvdyBjYWNoZWRNb2R1bGUuZXJyb3I7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdHRyeSB7XG5cdFx0dmFyIGV4ZWNPcHRpb25zID0geyBpZDogbW9kdWxlSWQsIG1vZHVsZTogbW9kdWxlLCBmYWN0b3J5OiBfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXSwgcmVxdWlyZTogX193ZWJwYWNrX3JlcXVpcmVfXyB9O1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uaS5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHsgaGFuZGxlcihleGVjT3B0aW9ucyk7IH0pO1xuXHRcdG1vZHVsZSA9IGV4ZWNPcHRpb25zLm1vZHVsZTtcblx0XHRleGVjT3B0aW9ucy5mYWN0b3J5LmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGV4ZWNPcHRpb25zLnJlcXVpcmUpO1xuXHR9IGNhdGNoKGUpIHtcblx0XHRtb2R1bGUuZXJyb3IgPSBlO1xuXHRcdHRocm93IGU7XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuX193ZWJwYWNrX3JlcXVpcmVfXy5jID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fO1xuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBleGVjdXRpb24gaW50ZXJjZXB0b3Jcbl9fd2VicGFja19yZXF1aXJlX18uaSA9IFtdO1xuXG4iLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhbGwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmh1ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5oKCkgKyBcIi5ob3QtdXBkYXRlLmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uaG1yRiA9ICgpID0+IChcIm1haW4uXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmgoKSArIFwiLmhvdC11cGRhdGUuanNvblwiKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCJmZWI3ODJhMmJjNDQ0YTMxZTYwMlwiKSIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJ2YXIgY3VycmVudE1vZHVsZURhdGEgPSB7fTtcbnZhciBpbnN0YWxsZWRNb2R1bGVzID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jO1xuXG4vLyBtb2R1bGUgYW5kIHJlcXVpcmUgY3JlYXRpb25cbnZhciBjdXJyZW50Q2hpbGRNb2R1bGU7XG52YXIgY3VycmVudFBhcmVudHMgPSBbXTtcblxuLy8gc3RhdHVzXG52YXIgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzID0gW107XG52YXIgY3VycmVudFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4vLyB3aGlsZSBkb3dubG9hZGluZ1xudmFyIGJsb2NraW5nUHJvbWlzZXMgPSAwO1xudmFyIGJsb2NraW5nUHJvbWlzZXNXYWl0aW5nID0gW107XG5cbi8vIFRoZSB1cGRhdGUgaW5mb1xudmFyIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzO1xudmFyIHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcztcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJEID0gY3VycmVudE1vZHVsZURhdGE7XG5cbl9fd2VicGFja19yZXF1aXJlX18uaS5wdXNoKGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdHZhciBtb2R1bGUgPSBvcHRpb25zLm1vZHVsZTtcblx0dmFyIHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKG9wdGlvbnMucmVxdWlyZSwgb3B0aW9ucy5pZCk7XG5cdG1vZHVsZS5ob3QgPSBjcmVhdGVNb2R1bGVIb3RPYmplY3Qob3B0aW9ucy5pZCwgbW9kdWxlKTtcblx0bW9kdWxlLnBhcmVudHMgPSBjdXJyZW50UGFyZW50cztcblx0bW9kdWxlLmNoaWxkcmVuID0gW107XG5cdGN1cnJlbnRQYXJlbnRzID0gW107XG5cdG9wdGlvbnMucmVxdWlyZSA9IHJlcXVpcmU7XG59KTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDID0ge307XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkgPSB7fTtcblxuZnVuY3Rpb24gY3JlYXRlUmVxdWlyZShyZXF1aXJlLCBtb2R1bGVJZCkge1xuXHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblx0aWYgKCFtZSkgcmV0dXJuIHJlcXVpcmU7XG5cdHZhciBmbiA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG5cdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcblx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG5cdFx0XHRcdHZhciBwYXJlbnRzID0gaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzO1xuXHRcdFx0XHRpZiAocGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRwYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG5cdFx0XHRcdGN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG5cdFx0XHR9XG5cdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcblx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG5cdFx0XHRcdFx0cmVxdWVzdCArXG5cdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcblx0XHRcdFx0XHRtb2R1bGVJZFxuXHRcdFx0KTtcblx0XHRcdGN1cnJlbnRQYXJlbnRzID0gW107XG5cdFx0fVxuXHRcdHJldHVybiByZXF1aXJlKHJlcXVlc3QpO1xuXHR9O1xuXHR2YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gKG5hbWUpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gcmVxdWlyZVtuYW1lXTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRyZXF1aXJlW25hbWVdID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fTtcblx0fTtcblx0Zm9yICh2YXIgbmFtZSBpbiByZXF1aXJlKSB7XG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXF1aXJlLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IobmFtZSkpO1xuXHRcdH1cblx0fVxuXHRmbi5lID0gZnVuY3Rpb24gKGNodW5rSWQsIGZldGNoUHJpb3JpdHkpIHtcblx0XHRyZXR1cm4gdHJhY2tCbG9ja2luZ1Byb21pc2UocmVxdWlyZS5lKGNodW5rSWQsIGZldGNoUHJpb3JpdHkpKTtcblx0fTtcblx0cmV0dXJuIGZuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNb2R1bGVIb3RPYmplY3QobW9kdWxlSWQsIG1lKSB7XG5cdHZhciBfbWFpbiA9IGN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQ7XG5cdHZhciBob3QgPSB7XG5cdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuXHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG5cdFx0X2FjY2VwdGVkRXJyb3JIYW5kbGVyczoge30sXG5cdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcblx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcblx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcblx0XHRfc2VsZkludmFsaWRhdGVkOiBmYWxzZSxcblx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcblx0XHRfbWFpbjogX21haW4sXG5cdFx0X3JlcXVpcmVTZWxmOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjdXJyZW50UGFyZW50cyA9IG1lLnBhcmVudHMuc2xpY2UoKTtcblx0XHRcdGN1cnJlbnRDaGlsZE1vZHVsZSA9IF9tYWluID8gdW5kZWZpbmVkIDogbW9kdWxlSWQ7XG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcblx0XHR9LFxuXG5cdFx0Ly8gTW9kdWxlIEFQSVxuXHRcdGFjdGl2ZTogdHJ1ZSxcblx0XHRhY2NlcHQ6IGZ1bmN0aW9uIChkZXAsIGNhbGxiYWNrLCBlcnJvckhhbmRsZXIpIHtcblx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIgJiYgZGVwICE9PSBudWxsKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0XHRcdFx0aG90Ll9hY2NlcHRlZEVycm9ySGFuZGxlcnNbZGVwW2ldXSA9IGVycm9ySGFuZGxlcjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cdFx0XHRcdGhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcF0gPSBlcnJvckhhbmRsZXI7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZWNsaW5lOiBmdW5jdGlvbiAoZGVwKSB7XG5cdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIgJiYgZGVwICE9PSBudWxsKVxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcblx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuXHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuXHRcdH0sXG5cdFx0ZGlzcG9zZTogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcblx0XHR9LFxuXHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuXHRcdH0sXG5cdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcblx0XHR9LFxuXHRcdGludmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuX3NlbGZJbnZhbGlkYXRlZCA9IHRydWU7XG5cdFx0XHRzd2l0Y2ggKGN1cnJlbnRTdGF0dXMpIHtcblx0XHRcdFx0Y2FzZSBcImlkbGVcIjpcblx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IFtdO1xuXHRcdFx0XHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtcklba2V5XShcblx0XHRcdFx0XHRcdFx0bW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHNldFN0YXR1cyhcInJlYWR5XCIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicmVhZHlcIjpcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJJW2tleV0oXG5cdFx0XHRcdFx0XHRcdG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVyc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInByZXBhcmVcIjpcblx0XHRcdFx0Y2FzZSBcImNoZWNrXCI6XG5cdFx0XHRcdGNhc2UgXCJkaXNwb3NlXCI6XG5cdFx0XHRcdGNhc2UgXCJhcHBseVwiOlxuXHRcdFx0XHRcdChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgPSBxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgfHwgW10pLnB1c2goXG5cdFx0XHRcdFx0XHRtb2R1bGVJZFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0Ly8gaWdub3JlIHJlcXVlc3RzIGluIGVycm9yIHN0YXRlc1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuXHRcdGNoZWNrOiBob3RDaGVjayxcblx0XHRhcHBseTogaG90QXBwbHksXG5cdFx0c3RhdHVzOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0aWYgKCFsKSByZXR1cm4gY3VycmVudFN0YXR1cztcblx0XHRcdHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuXHRcdH0sXG5cdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24gKGwpIHtcblx0XHRcdHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24gKGwpIHtcblx0XHRcdHZhciBpZHggPSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcblx0XHRcdGlmIChpZHggPj0gMCkgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuXHRcdH0sXG5cblx0XHQvLyBpbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG5cdFx0ZGF0YTogY3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG5cdH07XG5cdGN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcblx0cmV0dXJuIGhvdDtcbn1cblxuZnVuY3Rpb24gc2V0U3RhdHVzKG5ld1N0YXR1cykge1xuXHRjdXJyZW50U3RhdHVzID0gbmV3U3RhdHVzO1xuXHR2YXIgcmVzdWx0cyA9IFtdO1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuXHRcdHJlc3VsdHNbaV0gPSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChyZXN1bHRzKS50aGVuKGZ1bmN0aW9uICgpIHt9KTtcbn1cblxuZnVuY3Rpb24gdW5ibG9jaygpIHtcblx0aWYgKC0tYmxvY2tpbmdQcm9taXNlcyA9PT0gMCkge1xuXHRcdHNldFN0YXR1cyhcInJlYWR5XCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKGJsb2NraW5nUHJvbWlzZXMgPT09IDApIHtcblx0XHRcdFx0dmFyIGxpc3QgPSBibG9ja2luZ1Byb21pc2VzV2FpdGluZztcblx0XHRcdFx0YmxvY2tpbmdQcm9taXNlc1dhaXRpbmcgPSBbXTtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0bGlzdFtpXSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhY2tCbG9ja2luZ1Byb21pc2UocHJvbWlzZSkge1xuXHRzd2l0Y2ggKGN1cnJlbnRTdGF0dXMpIHtcblx0XHRjYXNlIFwicmVhZHlcIjpcblx0XHRcdHNldFN0YXR1cyhcInByZXBhcmVcIik7XG5cdFx0LyogZmFsbHRocm91Z2ggKi9cblx0XHRjYXNlIFwicHJlcGFyZVwiOlxuXHRcdFx0YmxvY2tpbmdQcm9taXNlcysrO1xuXHRcdFx0cHJvbWlzZS50aGVuKHVuYmxvY2ssIHVuYmxvY2spO1xuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHdhaXRGb3JCbG9ja2luZ1Byb21pc2VzKGZuKSB7XG5cdGlmIChibG9ja2luZ1Byb21pc2VzID09PSAwKSByZXR1cm4gZm4oKTtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdFx0YmxvY2tpbmdQcm9taXNlc1dhaXRpbmcucHVzaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXNvbHZlKGZuKCkpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gaG90Q2hlY2soYXBwbHlPblVwZGF0ZSkge1xuXHRpZiAoY3VycmVudFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcblx0fVxuXHRyZXR1cm4gc2V0U3RhdHVzKFwiY2hlY2tcIilcblx0XHQudGhlbihfX3dlYnBhY2tfcmVxdWlyZV9fLmhtck0pXG5cdFx0LnRoZW4oZnVuY3Rpb24gKHVwZGF0ZSkge1xuXHRcdFx0aWYgKCF1cGRhdGUpIHtcblx0XHRcdFx0cmV0dXJuIHNldFN0YXR1cyhhcHBseUludmFsaWRhdGVkTW9kdWxlcygpID8gXCJyZWFkeVwiIDogXCJpZGxlXCIpLnRoZW4oXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc2V0U3RhdHVzKFwicHJlcGFyZVwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHVwZGF0ZWRNb2R1bGVzID0gW107XG5cdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG5cblx0XHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKFxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1yQykucmVkdWNlKGZ1bmN0aW9uIChcblx0XHRcdFx0XHRcdHByb21pc2VzLFxuXHRcdFx0XHRcdFx0a2V5XG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckNba2V5XShcblx0XHRcdFx0XHRcdFx0dXBkYXRlLmMsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZS5yLFxuXHRcdFx0XHRcdFx0XHR1cGRhdGUubSxcblx0XHRcdFx0XHRcdFx0cHJvbWlzZXMsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzLFxuXHRcdFx0XHRcdFx0XHR1cGRhdGVkTW9kdWxlc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHJldHVybiBwcm9taXNlcztcblx0XHRcdFx0XHR9LCBbXSlcblx0XHRcdFx0KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4gd2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0aWYgKGFwcGx5T25VcGRhdGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGludGVybmFsQXBwbHkoYXBwbHlPblVwZGF0ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2V0U3RhdHVzKFwicmVhZHlcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1cGRhdGVkTW9kdWxlcztcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xufVxuXG5mdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG5cdGlmIChjdXJyZW50U3RhdHVzICE9PSBcInJlYWR5XCIpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzIChzdGF0ZTogXCIgK1xuXHRcdFx0XHRcdGN1cnJlbnRTdGF0dXMgK1xuXHRcdFx0XHRcdFwiKVwiXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0YXBwbHlJbnZhbGlkYXRlZE1vZHVsZXMoKTtcblxuXHR2YXIgcmVzdWx0cyA9IGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzLm1hcChmdW5jdGlvbiAoaGFuZGxlcikge1xuXHRcdHJldHVybiBoYW5kbGVyKG9wdGlvbnMpO1xuXHR9KTtcblx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSB1bmRlZmluZWQ7XG5cblx0dmFyIGVycm9ycyA9IHJlc3VsdHNcblx0XHQubWFwKGZ1bmN0aW9uIChyKSB7XG5cdFx0XHRyZXR1cm4gci5lcnJvcjtcblx0XHR9KVxuXHRcdC5maWx0ZXIoQm9vbGVhbik7XG5cblx0aWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuIHNldFN0YXR1cyhcImFib3J0XCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhyb3cgZXJyb3JzWzBdO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG5cdHZhciBkaXNwb3NlUHJvbWlzZSA9IHNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG5cblx0cmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRpZiAocmVzdWx0LmRpc3Bvc2UpIHJlc3VsdC5kaXNwb3NlKCk7XG5cdH0pO1xuXG5cdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2Vcblx0dmFyIGFwcGx5UHJvbWlzZSA9IHNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG5cdHZhciBlcnJvcjtcblx0dmFyIHJlcG9ydEVycm9yID0gZnVuY3Rpb24gKGVycikge1xuXHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuXHR9O1xuXG5cdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcblx0cmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRpZiAocmVzdWx0LmFwcGx5KSB7XG5cdFx0XHR2YXIgbW9kdWxlcyA9IHJlc3VsdC5hcHBseShyZXBvcnRFcnJvcik7XG5cdFx0XHRpZiAobW9kdWxlcykge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChtb2R1bGVzW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKFtkaXNwb3NlUHJvbWlzZSwgYXBwbHlQcm9taXNlXSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJmYWlsXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aHJvdyBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmIChxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMpIHtcblx0XHRcdHJldHVybiBpbnRlcm5hbEFwcGx5KG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKGxpc3QpIHtcblx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRcdFx0aWYgKGxpc3QuaW5kZXhPZihtb2R1bGVJZCkgPCAwKSBsaXN0LnB1c2gobW9kdWxlSWQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2V0U3RhdHVzKFwiaWRsZVwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBvdXRkYXRlZE1vZHVsZXM7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhcHBseUludmFsaWRhdGVkTW9kdWxlcygpIHtcblx0aWYgKHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcykge1xuXHRcdGlmICghY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMpIGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG5cdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtcklba2V5XShcblx0XHRcdFx0XHRtb2R1bGVJZCxcblx0XHRcdFx0XHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVyc1xuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzID0gdW5kZWZpbmVkO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGNodW5rc1xuLy8gXCIxXCIgbWVhbnMgXCJsb2FkZWRcIiwgb3RoZXJ3aXNlIG5vdCBsb2FkZWQgeWV0XG52YXIgaW5zdGFsbGVkQ2h1bmtzID0gX193ZWJwYWNrX3JlcXVpcmVfXy5obXJTX3JlcXVpcmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtclNfcmVxdWlyZSB8fCB7XG5cdFwibWFpblwiOiAxXG59O1xuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGNodW5rIGluc3RhbGwgZnVuY3Rpb24gbmVlZGVkXG5cbi8vIG5vIGNodW5rIGxvYWRpbmdcblxuLy8gbm8gZXh0ZXJuYWwgaW5zdGFsbCBjaHVua1xuXG5mdW5jdGlvbiBsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgdXBkYXRlZE1vZHVsZXNMaXN0KSB7XG5cdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIF9fd2VicGFja19yZXF1aXJlX18uaHUoY2h1bmtJZCkpO1xuXHR2YXIgdXBkYXRlZE1vZHVsZXMgPSB1cGRhdGUubW9kdWxlcztcblx0dmFyIHJ1bnRpbWUgPSB1cGRhdGUucnVudGltZTtcblx0Zm9yKHZhciBtb2R1bGVJZCBpbiB1cGRhdGVkTW9kdWxlcykge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyh1cGRhdGVkTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRjdXJyZW50VXBkYXRlW21vZHVsZUlkXSA9IHVwZGF0ZWRNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdGlmKHVwZGF0ZWRNb2R1bGVzTGlzdCkgdXBkYXRlZE1vZHVsZXNMaXN0LnB1c2gobW9kdWxlSWQpO1xuXHRcdH1cblx0fVxuXHRpZihydW50aW1lKSBjdXJyZW50VXBkYXRlUnVudGltZS5wdXNoKHJ1bnRpbWUpO1xufVxuXG52YXIgY3VycmVudFVwZGF0ZUNodW5rcztcbnZhciBjdXJyZW50VXBkYXRlO1xudmFyIGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzO1xudmFyIGN1cnJlbnRVcGRhdGVSdW50aW1lO1xuZnVuY3Rpb24gYXBwbHlIYW5kbGVyKG9wdGlvbnMpIHtcblx0aWYgKF9fd2VicGFja19yZXF1aXJlX18uZikgZGVsZXRlIF9fd2VicGFja19yZXF1aXJlX18uZi5yZXF1aXJlSG1yO1xuXHRjdXJyZW50VXBkYXRlQ2h1bmtzID0gdW5kZWZpbmVkO1xuXHRmdW5jdGlvbiBnZXRBZmZlY3RlZE1vZHVsZUVmZmVjdHModXBkYXRlTW9kdWxlSWQpIHtcblx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcblx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRjaGFpbjogW2lkXSxcblx0XHRcdFx0aWQ6IGlkXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG5cdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG5cdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG5cdFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblx0XHRcdGlmIChcblx0XHRcdFx0IW1vZHVsZSB8fFxuXHRcdFx0XHQobW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkICYmICFtb2R1bGUuaG90Ll9zZWxmSW52YWxpZGF0ZWQpXG5cdFx0XHQpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuXHRcdFx0XHRcdGNoYWluOiBjaGFpbixcblx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG5cdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuXHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcblx0XHRcdFx0dmFyIHBhcmVudCA9IF9fd2VicGFja19yZXF1aXJlX18uY1twYXJlbnRJZF07XG5cdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG5cdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG5cdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcblx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcblx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcblx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuXHRcdFx0XHRxdWV1ZS5wdXNoKHtcblx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuXHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuXHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuXHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG5cdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuXHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcblx0XHR9XG5cdH1cblxuXHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuXHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG5cdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG5cdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cblx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZShtb2R1bGUpIHtcblx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIG1vZHVsZS5pZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuXHRcdCk7XG5cdH07XG5cblx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gY3VycmVudFVwZGF0ZSkge1xuXHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG5cdFx0XHR2YXIgbmV3TW9kdWxlRmFjdG9yeSA9IGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdO1xuXHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuXHRcdFx0dmFyIHJlc3VsdCA9IG5ld01vZHVsZUZhY3Rvcnlcblx0XHRcdFx0PyBnZXRBZmZlY3RlZE1vZHVsZUVmZmVjdHMobW9kdWxlSWQpXG5cdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG5cdFx0XHRcdFx0fTtcblx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG5cdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuXHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcblx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcblx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuXHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuXHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuXHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcblx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcblx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuXHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuXHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG5cdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuXHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcblx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGVycm9yOiBhYm9ydEVycm9yXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRpZiAoZG9BcHBseSkge1xuXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IG5ld01vZHVsZUZhY3Rvcnk7XG5cdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcblx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcblx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG5cdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjdXJyZW50VXBkYXRlID0gdW5kZWZpbmVkO1xuXG5cdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cblx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuXHRmb3IgKHZhciBqID0gMDsgaiA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGorKykge1xuXHRcdHZhciBvdXRkYXRlZE1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2pdO1xuXHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0aWYgKFxuXHRcdFx0bW9kdWxlICYmXG5cdFx0XHQobW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkIHx8IG1vZHVsZS5ob3QuX21haW4pICYmXG5cdFx0XHQvLyByZW1vdmVkIHNlbGYtYWNjZXB0ZWQgbW9kdWxlcyBzaG91bGQgbm90IGJlIHJlcXVpcmVkXG5cdFx0XHRhcHBsaWVkVXBkYXRlW291dGRhdGVkTW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmUgJiZcblx0XHRcdC8vIHdoZW4gY2FsbGVkIGludmFsaWRhdGUgc2VsZi1hY2NlcHRpbmcgaXMgbm90IHBvc3NpYmxlXG5cdFx0XHQhbW9kdWxlLmhvdC5fc2VsZkludmFsaWRhdGVkXG5cdFx0KSB7XG5cdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG5cdFx0XHRcdG1vZHVsZTogb3V0ZGF0ZWRNb2R1bGVJZCxcblx0XHRcdFx0cmVxdWlyZTogbW9kdWxlLmhvdC5fcmVxdWlyZVNlbGYsXG5cdFx0XHRcdGVycm9ySGFuZGxlcjogbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG5cblx0cmV0dXJuIHtcblx0XHRkaXNwb3NlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChjaHVua0lkKSB7XG5cdFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG5cdFx0XHR9KTtcblx0XHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gdW5kZWZpbmVkO1xuXG5cdFx0XHR2YXIgaWR4O1xuXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG5cdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcblx0XHRcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF07XG5cdFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuXHRcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG5cdFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuXHRcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuXHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0ZGlzcG9zZUhhbmRsZXJzW2pdLmNhbGwobnVsbCwgZGF0YSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5obXJEW21vZHVsZUlkXSA9IGRhdGE7XG5cblx0XHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcblx0XHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuXHRcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcblx0XHRcdFx0ZGVsZXRlIF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF07XG5cblx0XHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuXHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG5cdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHR2YXIgY2hpbGQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcblx0XHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcblx0XHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuXHRcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuXHRcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cblx0XHRcdHZhciBkZXBlbmRlbmN5O1xuXHRcdFx0Zm9yICh2YXIgb3V0ZGF0ZWRNb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuXHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBvdXRkYXRlZE1vZHVsZUlkKSkge1xuXHRcdFx0XHRcdG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRpZiAobW9kdWxlKSB7XG5cdFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9XG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcblx0XHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG5cdFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YXBwbHk6IGZ1bmN0aW9uIChyZXBvcnRFcnJvcikge1xuXHRcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG5cdFx0XHRmb3IgKHZhciB1cGRhdGVNb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8oYXBwbGllZFVwZGF0ZSwgdXBkYXRlTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW3VwZGF0ZU1vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbdXBkYXRlTW9kdWxlSWRdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHJ1biBuZXcgcnVudGltZSBtb2R1bGVzXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRVcGRhdGVSdW50aW1lLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGN1cnJlbnRVcGRhdGVSdW50aW1lW2ldKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuXHRcdFx0Zm9yICh2YXIgb3V0ZGF0ZWRNb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuXHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBvdXRkYXRlZE1vZHVsZUlkKSkge1xuXHRcdFx0XHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuXHRcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPVxuXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcblx0XHRcdFx0XHRcdHZhciBlcnJvckhhbmRsZXJzID0gW107XG5cdFx0XHRcdFx0XHR2YXIgZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzID0gW107XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG5cdFx0XHRcdFx0XHRcdHZhciBhY2NlcHRDYWxsYmFjayA9XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG5cdFx0XHRcdFx0XHRcdHZhciBlcnJvckhhbmRsZXIgPVxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZS5ob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBlbmRlbmN5XTtcblx0XHRcdFx0XHRcdFx0aWYgKGFjY2VwdENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGFjY2VwdENhbGxiYWNrKSAhPT0gLTEpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGFjY2VwdENhbGxiYWNrKTtcblx0XHRcdFx0XHRcdFx0XHRlcnJvckhhbmRsZXJzLnB1c2goZXJyb3JIYW5kbGVyKTtcblx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3MucHVzaChkZXBlbmRlbmN5KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCBjYWxsYmFja3MubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0XHRjYWxsYmFja3Nba10uY2FsbChudWxsLCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG5cdFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgZXJyb3JIYW5kbGVyc1trXSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvckhhbmRsZXJzW2tdKGVyciwge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3Nba10sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyMik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogb3V0ZGF0ZWRNb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcblx0XHRcdGZvciAodmFyIG8gPSAwOyBvIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgbysrKSB7XG5cdFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW29dO1xuXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRpdGVtLnJlcXVpcmUobW9kdWxlSWQpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVyciwge1xuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRtb2R1bGU6IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGVJZF1cblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIxKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMSxcblx0XHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyMSk7XG5cdFx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0cmVwb3J0RXJyb3IoZXJyKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG91dGRhdGVkTW9kdWxlcztcblx0XHR9XG5cdH07XG59XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkucmVxdWlyZSA9IGZ1bmN0aW9uIChtb2R1bGVJZCwgYXBwbHlIYW5kbGVycykge1xuXHRpZiAoIWN1cnJlbnRVcGRhdGUpIHtcblx0XHRjdXJyZW50VXBkYXRlID0ge307XG5cdFx0Y3VycmVudFVwZGF0ZVJ1bnRpbWUgPSBbXTtcblx0XHRjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IFtdO1xuXHRcdGFwcGx5SGFuZGxlcnMucHVzaChhcHBseUhhbmRsZXIpO1xuXHR9XG5cdGlmICghX193ZWJwYWNrX3JlcXVpcmVfXy5vKGN1cnJlbnRVcGRhdGUsIG1vZHVsZUlkKSkge1xuXHRcdGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdID0gX193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXTtcblx0fVxufTtcbl9fd2VicGFja19yZXF1aXJlX18uaG1yQy5yZXF1aXJlID0gZnVuY3Rpb24gKFxuXHRjaHVua0lkcyxcblx0cmVtb3ZlZENodW5rcyxcblx0cmVtb3ZlZE1vZHVsZXMsXG5cdHByb21pc2VzLFxuXHRhcHBseUhhbmRsZXJzLFxuXHR1cGRhdGVkTW9kdWxlc0xpc3Rcbikge1xuXHRhcHBseUhhbmRsZXJzLnB1c2goYXBwbHlIYW5kbGVyKTtcblx0Y3VycmVudFVwZGF0ZUNodW5rcyA9IHt9O1xuXHRjdXJyZW50VXBkYXRlUmVtb3ZlZENodW5rcyA9IHJlbW92ZWRDaHVua3M7XG5cdGN1cnJlbnRVcGRhdGUgPSByZW1vdmVkTW9kdWxlcy5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwga2V5KSB7XG5cdFx0b2JqW2tleV0gPSBmYWxzZTtcblx0XHRyZXR1cm4gb2JqO1xuXHR9LCB7fSk7XG5cdGN1cnJlbnRVcGRhdGVSdW50aW1lID0gW107XG5cdGNodW5rSWRzLmZvckVhY2goZnVuY3Rpb24gKGNodW5rSWQpIHtcblx0XHRpZiAoXG5cdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJlxuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdICE9PSB1bmRlZmluZWRcblx0XHQpIHtcblx0XHRcdHByb21pc2VzLnB1c2gobG9hZFVwZGF0ZUNodW5rKGNodW5rSWQsIHVwZGF0ZWRNb2R1bGVzTGlzdCkpO1xuXHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9IHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF0gPSBmYWxzZTtcblx0XHR9XG5cdH0pO1xuXHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5mKSB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmVIbXIgPSBmdW5jdGlvbiAoY2h1bmtJZCwgcHJvbWlzZXMpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rcyAmJlxuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZUNodW5rcywgY2h1bmtJZCkgJiZcblx0XHRcdFx0IWN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF1cblx0XHRcdCkge1xuXHRcdFx0XHRwcm9taXNlcy5wdXNoKGxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSk7XG5cdFx0XHRcdGN1cnJlbnRVcGRhdGVDaHVua3NbY2h1bmtJZF0gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn07XG5cbl9fd2VicGFja19yZXF1aXJlX18uaG1yTSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gcmVxdWlyZShcIi4vXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckYoKSk7XG5cdH0pWydjYXRjaCddKGZ1bmN0aW9uKGVycikgeyBpZihlcnIuY29kZSAhPT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB0aHJvdyBlcnI7IH0pO1xufSIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvcG9sbC5qcz8xMDAwXCIpO1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==