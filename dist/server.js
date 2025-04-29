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

/***/ "./src/lib/Utils.ts":
/*!**************************!*\
  !*** ./src/lib/Utils.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeLabel = void 0;
exports.isEmptyOrSpaces = isEmptyOrSpaces;
exports.isEmptyAttributes = isEmptyAttributes;
exports.match = match;
exports.sort = sort;
exports.htmlToText = htmlToText;
function isEmptyOrSpaces(str) {
    return !str || str.match(/^ *$/) !== null;
}
function isEmptyAttributes(object) {
    if (!object) {
        return true;
    }
    return !Object.keys(object).find(function (key) {
        if (object[key]) {
            return true;
        }
        return false;
    });
}
function match(text, words) {
    var found = false;
    if (words) {
        words.split(' ').forEach(function (word) {
            if (text.toString().match(new RegExp("(\\w*".concat(word, "\\w*)"), 'gi'))) {
                found = true;
            }
        });
    }
    return found;
}
function sort(array, property, isReverseOrder) {
    var result = array.sort(function (o1, o2) {
        if (isReverseOrder) {
            return o1[property] > o2[property]
                ? -1
                : o1[property] < o2[property]
                    ? 1
                    : 0;
        }
        return o1[property] < o2[property]
            ? -1
            : o1[property] > o2[property]
                ? 1
                : 0;
    });
    return result;
}
function htmlToText(str) {
    if (!str)
        return false;
    str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
}
var normalizeLabel = function (input) {
    if (input == null)
        return '';
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};
exports.normalizeLabel = normalizeLabel;


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
    module.hot.dispose(function () {
        process.exit();
    });
}
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
var mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
var startup_1 = __webpack_require__(/*! ./startup */ "./src/startup.ts");
var ApiRoute = __webpack_require__(/*! ./route */ "./src/route.ts");
var databaseUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose_1.default.connect(databaseUri, {});
mongoose_1.default.pluralize(undefined);
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: 5000000 }));
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.get("/hello", function (_, res) {
    res.send("basic connection to server works. database connection is not validated");
    res.end();
});
app.use("/api", ApiRoute);
app.use(function (_, res) {
    res.status(404);
    res.send("Not found");
    res.end();
});
app.use(function (err, req, res, next) {
    console.error("Error:", err);
    res.status(500).send(err.stack);
});
var PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(PORT));
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

/***/ "./src/modules/domain/api/route.ts":
/*!*****************************************!*\
  !*** ./src/modules/domain/api/route.ts ***!
  \*****************************************/
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformDomain = void 0;
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var service_1 = __webpack_require__(/*! ./service */ "./src/modules/domain/api/service.ts");
var middlewares_1 = __webpack_require__(/*! ../../../middlewares */ "./src/middlewares.ts");
var router = express_1.default.Router();
function kebabToCamelCase(kebab) {
    return kebab.replace(/-([a-z])/g, function (_, char) { return char.toUpperCase(); });
}
var transformDomain = function (req, res, next) {
    if (req.params && req.params.domain) {
        req.params.domain = kebabToCamelCase(req.params.domain);
    }
    next();
};
exports.transformDomain = transformDomain;
module.exports = function (router) {
    router
        .route("/resources/:space/:domain")
        .get(middlewares_1.authorizeApi, exports.transformDomain, service_1.getMeta)
        .post(middlewares_1.authorizeApi, exports.transformDomain, service_1.create);
    router
        .route("/resources/:space/:domain/:reference")
        .get(middlewares_1.authorizeApi, exports.transformDomain, service_1.getOne)
        .put(middlewares_1.authorizeApi, exports.transformDomain, service_1.update)
        .patch(middlewares_1.authorizeApi, exports.transformDomain, service_1.patch)
        .delete(middlewares_1.authorizeApi, exports.transformDomain, service_1.deleteOne);
    router.post("/resources/:space/:domain/search", middlewares_1.authorizeApi, exports.transformDomain, service_1.search);
    router.get("/inference/resources", service_1.inferTypes);
};


/***/ }),

/***/ "./src/modules/domain/api/service.ts":
/*!*******************************************!*\
  !*** ./src/modules/domain/api/service.ts ***!
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
exports.inferTypes = exports.deleteOne = exports.update = exports.patch = exports.create = exports.getOne = exports.search = exports.getMeta = exports.checkParentReferences = void 0;
var nanoid_1 = __webpack_require__(/*! nanoid */ "nanoid");
var dbutils_1 = __webpack_require__(/*! ../../../lib/dbutils */ "./src/lib/dbutils.ts");
var schemaValidator_1 = __webpack_require__(/*! ../utils/schemaValidator */ "./src/modules/domain/utils/schemaValidator.ts");
var specRegistry_1 = __webpack_require__(/*! ../specs/specRegistry */ "./src/modules/domain/specs/specRegistry.ts");
var filterBuilder_1 = __webpack_require__(/*! ../filterBuilder */ "./src/modules/domain/filterBuilder.ts");
var typeInference_1 = __webpack_require__(/*! ../utils/typeInference */ "./src/modules/domain/utils/typeInference.ts");
var alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var nanoid = (0, nanoid_1.customAlphabet)(alphanumericAlphabet, 8);
var checkParentReferences = function (shapedData_1, spec_1, space_1, res_1) {
    var args_1 = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args_1[_i - 4] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([shapedData_1, spec_1, space_1, res_1], args_1, true), void 0, function (shapedData, spec, space, res, path) {
        var _a, _b, _c, _d, fieldName, fieldSpec, value, fullPath, parentModel, found, ok, itemFields, i, item, itemPath, ok, parentModel, found;
        var _e, _f;
        if (path === void 0) { path = ""; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = spec.fields;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _d = 0;
                    _g.label = 1;
                case 1:
                    if (!(_d < _b.length)) return [3, 12];
                    _c = _b[_d];
                    if (!(_c in _a)) return [3, 11];
                    fieldName = _c;
                    fieldSpec = spec.fields[fieldName];
                    value = shapedData === null || shapedData === void 0 ? void 0 : shapedData[fieldName];
                    fullPath = path ? "".concat(path, ".").concat(fieldName) : fieldName;
                    if (value === undefined || value === null)
                        return [3, 11];
                    if (!('parent' in fieldSpec)) return [3, 3];
                    if (!(["string", "number"].includes(fieldSpec.type) &&
                        fieldSpec.parent &&
                        typeof value === 'string')) return [3, 3];
                    parentModel = (0, dbutils_1.getCollectionByName)(space, fieldSpec.parent.domain);
                    return [4, parentModel.findOne((_e = {}, _e[fieldSpec.parent.field] = value, _e))];
                case 2:
                    found = _g.sent();
                    if (!found) {
                        res.status(400).json({
                            error: "Invalid parent reference '".concat(value, "' for '").concat(fullPath, "' in domain '").concat(fieldSpec.parent.domain, "', field '").concat(fieldSpec.parent.field, "'")
                        });
                        return [2, false];
                    }
                    _g.label = 3;
                case 3:
                    if (!(fieldSpec.type === 'object')) return [3, 5];
                    return [4, (0, exports.checkParentReferences)(value, { fields: fieldSpec.fields }, space, res, fullPath)];
                case 4:
                    ok = _g.sent();
                    if (!ok)
                        return [2, false];
                    _g.label = 5;
                case 5:
                    if (!(fieldSpec.type === 'array' && Array.isArray(value))) return [3, 11];
                    itemFields = fieldSpec.fields;
                    i = 0;
                    _g.label = 6;
                case 6:
                    if (!(i < value.length)) return [3, 11];
                    item = value[i];
                    itemPath = "".concat(fullPath, "[").concat(i, "]");
                    if (!(fieldSpec.itemType === 'object' && itemFields)) return [3, 8];
                    return [4, (0, exports.checkParentReferences)(item, { fields: itemFields }, space, res, itemPath)];
                case 7:
                    ok = _g.sent();
                    if (!ok)
                        return [2, false];
                    _g.label = 8;
                case 8:
                    if (!(["string", "number"].includes(fieldSpec.itemType) &&
                        fieldSpec.parent &&
                        typeof item === "string")) return [3, 10];
                    parentModel = (0, dbutils_1.getCollectionByName)(space, fieldSpec.parent.domain);
                    return [4, parentModel.findOne((_f = {}, _f[fieldSpec.parent.field] = item, _f))];
                case 9:
                    found = _g.sent();
                    if (!found) {
                        res.status(400).json({
                            error: "Invalid parent reference '".concat(item, "' for '").concat(itemPath, "' in domain '").concat(fieldSpec.parent.domain, "'")
                        });
                        return [2, false];
                    }
                    _g.label = 10;
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
exports.checkParentReferences = checkParentReferences;
function reorderWithinGroup(Model, reference, groupFilter, oldOrder, newOrder) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(newOrder > oldOrder)) return [3, 2];
                    return [4, Model.updateMany(__assign(__assign({}, groupFilter), { order: { $gt: oldOrder, $lte: newOrder } }), { $inc: { order: -1 } })];
                case 1:
                    _a.sent();
                    return [3, 4];
                case 2: return [4, Model.updateMany(__assign(__assign({}, groupFilter), { order: { $lt: oldOrder, $gte: newOrder } }), { $inc: { order: 1 } })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4, Model.updateOne({ reference: reference }, { order: newOrder })];
                case 5:
                    _a.sent();
                    return [2];
            }
        });
    });
}
var getMeta = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, spec, supportedHooks, endpoints, meta;
    var _b;
    return __generator(this, function (_c) {
        _a = req.params, space = _a.space, domain = _a.domain;
        spec = (0, specRegistry_1.getSpecByName)(domain);
        if (!spec)
            return [2, res.status(404).json({ error: "Domain (".concat(domain, ") does not exists") })];
        supportedHooks = Object.keys(((_b = spec.meta) === null || _b === void 0 ? void 0 : _b.hooks) || {});
        endpoints = [
            "GET /api/".concat(domain, "/meta"),
            "POST /api/".concat(domain, "/search"),
            "GET /api/".concat(domain, "/:id"),
            "POST /api/".concat(domain),
            "PATCH /api/".concat(domain, "/:id"),
            "PUT /api/".concat(domain, "/:id"),
            "DELETE /api/".concat(domain, "/:id")
        ];
        meta = {
            domain: domain,
            fields: spec.fields,
            endpoints: endpoints
        };
        res.json(meta);
        return [2];
    });
}); };
exports.getMeta = getMeta;
var search = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, spec, _b, _c, filters, _d, pagination, _e, sort, page, limit, Model, mongoQuery, mongoSort, docs, total, shaped, err_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                spec = (0, specRegistry_1.getSpecByName)(domain);
                if (!spec)
                    return [2, res.status(404).json({ error: "Domain (".concat(domain, ") does not exist") })];
                _f.label = 1;
            case 1:
                _f.trys.push([1, 4, , 5]);
                _b = req.body, _c = _b.filters, filters = _c === void 0 ? {} : _c, _d = _b.pagination, pagination = _d === void 0 ? {} : _d, _e = _b.sort, sort = _e === void 0 ? {} : _e;
                page = Math.max(1, +pagination.page || 1);
                limit = Math.max(1, +pagination.limit || 10);
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                mongoQuery = (0, filterBuilder_1.buildQueryFromAdvancedFilters)(filters, spec);
                mongoSort = (0, filterBuilder_1.buildSortQuery)(sort);
                console.log("Query:", mongoQuery);
                console.log("Sort:", mongoSort);
                return [4, Model.find(mongoQuery)
                        .sort(mongoSort)
                        .skip((page - 1) * limit)
                        .limit(limit)];
            case 2:
                docs = _f.sent();
                return [4, Model.countDocuments(mongoQuery)];
            case 3:
                total = _f.sent();
                shaped = docs.map(function (doc) { return (0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec); });
                res.json({
                    data: shaped,
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit)
                });
                return [3, 5];
            case 4:
                err_1 = _f.sent();
                res.status(500).json({ error: "Search failed", details: err_1.message });
                return [3, 5];
            case 5: return [2];
        }
    });
}); };
exports.search = search;
var getOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, spec, Model, doc;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                spec = (0, specRegistry_1.getSpecByName)(domain);
                if (!spec)
                    return [2, res.status(404).json({ error: "Domain (".concat(domain, ") does not exists") })];
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                return [4, Model.findOne({ reference: reference })];
            case 1:
                doc = _b.sent();
                if (!doc)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                return [2];
        }
    });
}); };
exports.getOne = getOne;
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, payload, userId, spec, _b, valid, shapedDataOriginal, errors, shapedData, hooks, hookResponse, ok, Model, groupFilter, _i, _c, field, lastInGroup, maxOrder, timestamp, doc;
    var _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                payload = req.body;
                userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.user_id;
                spec = (0, specRegistry_1.getSpecByName)(domain);
                if (!spec)
                    return [2, res.status(404).json({ error: "Domain (".concat(domain, ") does not exists") })];
                _b = (0, schemaValidator_1.validateAndShapePayload)(payload, spec), valid = _b.valid, shapedDataOriginal = _b.shapedData, errors = _b.errors;
                shapedData = shapedDataOriginal;
                if (!valid)
                    return [2, res.status(400).json({ error: "Validation failed", details: errors })];
                hooks = (_e = spec.meta) === null || _e === void 0 ? void 0 : _e.hooks;
                if (!(hooks === null || hooks === void 0 ? void 0 : hooks.beforeCreate)) return [3, 2];
                return [4, hooks.beforeCreate(shapedDataOriginal, { space: space, domain: domain, operation: "create", userId: userId })];
            case 1:
                hookResponse = _k.sent();
                if (hookResponse.errors.length > 0)
                    return [2, res.status(400).json({ error: "Validation failed", details: hookResponse.errors })];
                shapedData = hookResponse.doc;
                _k.label = 2;
            case 2: return [4, (0, exports.checkParentReferences)(shapedData, spec, space, res)];
            case 3:
                ok = _k.sent();
                if (!ok)
                    return [2];
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                if (!((_g = (_f = spec.meta) === null || _f === void 0 ? void 0 : _f.ordering) === null || _g === void 0 ? void 0 : _g.length)) return [3, 5];
                groupFilter = {};
                for (_i = 0, _c = spec.meta.ordering; _i < _c.length; _i++) {
                    field = _c[_i];
                    groupFilter[field] = shapedData[field];
                }
                return [4, Model.find(groupFilter).sort({ order: -1 }).limit(1)];
            case 4:
                lastInGroup = _k.sent();
                maxOrder = (_j = (_h = lastInGroup[0]) === null || _h === void 0 ? void 0 : _h.order) !== null && _j !== void 0 ? _j : 0;
                shapedData.order = maxOrder + 1;
                _k.label = 5;
            case 5:
                timestamp = new Date();
                doc = new Model(__assign(__assign({}, shapedData), { reference: nanoid(), createdAt: timestamp, updatedAt: timestamp, createdBy: userId, updatedBy: userId }));
                return [4, doc.save()];
            case 6:
                _k.sent();
                res.status(201).json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                if (hooks === null || hooks === void 0 ? void 0 : hooks.afterCreate) {
                    hooks.afterCreate(doc.toObject(), { space: space, domain: domain, operation: "create", userId: userId }).catch(console.error);
                }
                return [2];
        }
    });
}); };
exports.create = create;
var patch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, payload, userId, spec, _b, valid, shapedDataOriginal, errors, shapedData, hooks, hookResponse, ok, Model, oldDoc, oldOrder, newOrder, groupFilter, _i, _c, field, updated;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                payload = req.body;
                userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.user_id;
                spec = (0, specRegistry_1.getSpecByName)(domain);
                if (!spec)
                    return [2, res.status(404).json({ error: "Domain (".concat(domain, ") does not exists") })];
                _b = (0, schemaValidator_1.validateAndShapePayload)(payload, spec, "", { allowPartial: true }), valid = _b.valid, shapedDataOriginal = _b.shapedData, errors = _b.errors;
                if (!valid)
                    return [2, res.status(400).json({ error: "Validation failed", details: errors })];
                shapedData = shapedDataOriginal;
                hooks = (_e = spec.meta) === null || _e === void 0 ? void 0 : _e.hooks;
                if (!(hooks === null || hooks === void 0 ? void 0 : hooks.beforePatch)) return [3, 2];
                return [4, hooks.beforePatch(shapedDataOriginal, { space: space, domain: domain, operation: "create", userId: userId })];
            case 1:
                hookResponse = _h.sent();
                if (hookResponse.errors.length > 0)
                    return [2, res.status(400).json({ error: "Validation failed", details: hookResponse.errors })];
                shapedData = hookResponse.doc;
                _h.label = 2;
            case 2: return [4, (0, exports.checkParentReferences)(shapedData, spec, space, res)];
            case 3:
                ok = _h.sent();
                if (!ok)
                    return [2];
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                if (!(((_g = (_f = spec.meta) === null || _f === void 0 ? void 0 : _f.ordering) === null || _g === void 0 ? void 0 : _g.length) && shapedData.order !== undefined)) return [3, 6];
                return [4, Model.findOne({ reference: reference })];
            case 4:
                oldDoc = _h.sent();
                oldOrder = oldDoc === null || oldDoc === void 0 ? void 0 : oldDoc.order;
                newOrder = shapedData.order;
                if (!(newOrder !== oldOrder)) return [3, 6];
                groupFilter = {};
                for (_i = 0, _c = spec.meta.ordering; _i < _c.length; _i++) {
                    field = _c[_i];
                    groupFilter[field] = oldDoc[field];
                }
                return [4, reorderWithinGroup(Model, reference, groupFilter, oldOrder, newOrder)];
            case 5:
                _h.sent();
                delete shapedData.order;
                _h.label = 6;
            case 6: return [4, Model.findOneAndUpdate({ reference: reference }, { $set: shapedData }, { new: true })];
            case 7:
                updated = _h.sent();
                if (!updated)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.json(updated);
                if (hooks === null || hooks === void 0 ? void 0 : hooks.afterPatch) {
                    hooks.afterPatch(updated.toObject(), { space: space, domain: domain, operation: "patch", userId: userId }).catch(console.error);
                }
                return [2];
        }
    });
}); };
exports.patch = patch;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, payload, userId, spec, _b, valid, shapedDataOriginal, errors, shapedData, hooks, hookResponse, ok, Model, oldDoc, oldOrder, newOrder, groupFilter, _i, _c, field, updated;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                payload = req.body;
                userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.user_id;
                spec = (0, specRegistry_1.getSpecByName)(domain);
                if (!spec)
                    return [2, res.status(404).json({ error: "Domain (".concat(domain, ") does not exists") })];
                _b = (0, schemaValidator_1.validateAndShapePayload)(payload, spec), valid = _b.valid, shapedDataOriginal = _b.shapedData, errors = _b.errors;
                shapedData = shapedDataOriginal;
                hooks = (_e = spec.meta) === null || _e === void 0 ? void 0 : _e.hooks;
                if (!(hooks === null || hooks === void 0 ? void 0 : hooks.beforeUpdate)) return [3, 2];
                return [4, hooks.beforeUpdate(shapedDataOriginal, { space: space, domain: domain, operation: "create", userId: userId })];
            case 1:
                hookResponse = _h.sent();
                if (hookResponse.errors.length > 0)
                    return [2, res.status(400).json({ error: "Validation failed", details: hookResponse.errors })];
                shapedData = hookResponse.doc;
                _h.label = 2;
            case 2:
                if (!valid)
                    return [2, res.status(400).json({ error: "Validation failed", details: errors })];
                return [4, (0, exports.checkParentReferences)(shapedData, spec, space, res)];
            case 3:
                ok = _h.sent();
                if (!ok)
                    return [2];
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                if (!(((_g = (_f = spec.meta) === null || _f === void 0 ? void 0 : _f.ordering) === null || _g === void 0 ? void 0 : _g.length) && shapedData.order !== undefined)) return [3, 6];
                return [4, Model.findOne({ reference: reference })];
            case 4:
                oldDoc = _h.sent();
                oldOrder = oldDoc === null || oldDoc === void 0 ? void 0 : oldDoc.order;
                newOrder = shapedData.order;
                if (!(newOrder !== oldOrder)) return [3, 6];
                groupFilter = {};
                for (_i = 0, _c = spec.meta.ordering; _i < _c.length; _i++) {
                    field = _c[_i];
                    groupFilter[field] = oldDoc[field];
                }
                return [4, reorderWithinGroup(Model, reference, groupFilter, oldOrder, newOrder)];
            case 5:
                _h.sent();
                delete shapedData.order;
                _h.label = 6;
            case 6: return [4, Model.findOneAndUpdate({ reference: reference }, shapedData, { new: true })];
            case 7:
                updated = _h.sent();
                if (!updated)
                    return [2, res.status(404).json({ error: "Not found" })];
                res.json(updated);
                if (hooks === null || hooks === void 0 ? void 0 : hooks.afterUpdate) {
                    hooks.afterUpdate(updated.toObject(), { space: space, domain: domain, operation: "update", userId: userId }).catch(console.error);
                }
                return [2];
        }
    });
}); };
exports.update = update;
var deleteOne = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, space, domain, reference, spec, Model, existing, children, _i, children_1, child, childDomain, field, cascadeDelete, parentField, childField, parentValue, ChildModel, dependent;
    var _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain, reference = _a.reference;
                spec = (0, specRegistry_1.getSpecByName)(domain);
                if (!spec) {
                    return [2, res.status(404).json({ error: "Domain (".concat(domain, ") does not exist") })];
                }
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                return [4, Model.findOne({ reference: reference })];
            case 1:
                existing = _e.sent();
                if (!existing) {
                    return [2, res.status(404).json({ error: "Not found" })];
                }
                children = ((_d = spec.meta) === null || _d === void 0 ? void 0 : _d.children) || [];
                _i = 0, children_1 = children;
                _e.label = 2;
            case 2:
                if (!(_i < children_1.length)) return [3, 7];
                child = children_1[_i];
                childDomain = child.domain, field = child.field, cascadeDelete = child.cascadeDelete;
                parentField = field.parent, childField = field.child;
                parentValue = existing[parentField];
                if (parentValue === undefined)
                    return [3, 6];
                ChildModel = (0, dbutils_1.getCollectionByName)(space, childDomain);
                if (!cascadeDelete) return [3, 4];
                return [4, ChildModel.deleteMany((_b = {}, _b[childField] = parentValue, _b))];
            case 3:
                _e.sent();
                return [3, 6];
            case 4: return [4, ChildModel.findOne((_c = {}, _c[childField] = parentValue, _c))];
            case 5:
                dependent = _e.sent();
                if (dependent) {
                    return [2, res.status(400).json({
                            error: "Cannot delete ".concat(domain, ".").concat(reference, " because its value '").concat(parentValue, "' in '").concat(parentField, "' is referenced in ").concat(childDomain, ".").concat(childField),
                        })];
                }
                _e.label = 6;
            case 6:
                _i++;
                return [3, 2];
            case 7: return [4, Model.deleteOne({ reference: reference })];
            case 8:
                _e.sent();
                res.status(204).send();
                return [2];
        }
    });
}); };
exports.deleteOne = deleteOne;
var inferTypes = function (req, res) {
    try {
        var types = (0, typeInference_1.generateTypesFromSpecs)();
        res.header("Content-Type", "text/typescript");
        res.send(types);
    }
    catch (err) {
        res.status(500).json({ error: "Error generating types", details: err.message });
    }
};
exports.inferTypes = inferTypes;


/***/ }),

/***/ "./src/modules/domain/definitions/fragment.spec.ts":
/*!*********************************************************!*\
  !*** ./src/modules/domain/definitions/fragment.spec.ts ***!
  \*********************************************************/
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
exports.fragmentSpec = void 0;
var nanoid_1 = __webpack_require__(/*! nanoid */ "nanoid");
var dbutils_1 = __webpack_require__(/*! ../../../lib/dbutils */ "./src/lib/dbutils.ts");
var spec_types_1 = __webpack_require__(/*! ../specs/types/spec.types */ "./src/modules/domain/specs/types/spec.types.ts");
var alphanumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var nanoid = (0, nanoid_1.customAlphabet)(alphanumericAlphabet, 8);
exports.fragmentSpec = {
    fields: {
        "name": {
            type: "string",
            required: true,
            displayOptions: {
                type: "h2",
            }
        },
        "content": {
            type: "string",
            required: false,
            displayOptions: {
                type: "richtext",
                toolbarOptions: [
                    spec_types_1.ToolbarOption.Bold,
                    spec_types_1.ToolbarOption.Italic,
                    spec_types_1.ToolbarOption.Underline,
                    spec_types_1.ToolbarOption.AlignLeft,
                    spec_types_1.ToolbarOption.AlignCenter,
                    spec_types_1.ToolbarOption.AlignRight,
                    spec_types_1.ToolbarOption.AlignJustify,
                    spec_types_1.ToolbarOption.Heading,
                    spec_types_1.ToolbarOption.BulletList,
                    spec_types_1.ToolbarOption.OrderedList,
                ]
            }
        },
        "labels": {
            type: "array",
            required: true,
            itemType: "string",
            parent: {
                domain: "fragmentLabel", field: "reference"
            },
            displayOptions: {
                type: "autocomplete",
                label: "Labels"
            }
        }
    },
    meta: {
        hooks: {
            beforeCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(doc, context);
                    return [2, { doc: doc, errors: [] }];
                });
            }); },
            afterCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                var FragmentVersion, timestamp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            FragmentVersion = (0, dbutils_1.getCollectionByName)(context.space, "fragmentVersion");
                            timestamp = new Date();
                            return [4, FragmentVersion.create({
                                    reference: nanoid(),
                                    fragmentReference: doc.reference,
                                    content: doc.content,
                                    versionTag: generateVersionTag(),
                                    createdAt: timestamp,
                                    updatedAt: timestamp,
                                    createdBy: context.userId,
                                    updatedBy: context.userId
                                })];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); },
            afterUpdate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, maybeAddFragmentVersion(doc, context)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); },
            afterPatch: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, maybeAddFragmentVersion(doc, context)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); }
        }
    }
};
var maybeAddFragmentVersion = function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
    var FragmentVersion, latestVersion, timestamp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                FragmentVersion = (0, dbutils_1.getCollectionByName)(context.space, "fragmentVersion");
                return [4, FragmentVersion.findOne({ fragmentReference: doc.reference }, null, { sort: { createdAt: -1 } })];
            case 1:
                latestVersion = _a.sent();
                console.log(latestVersion);
                if (!(!latestVersion || latestVersion.content !== doc.content)) return [3, 3];
                timestamp = new Date();
                return [4, FragmentVersion.create({
                        reference: nanoid(),
                        fragmentReference: doc.reference,
                        content: doc.content,
                        versionTag: generateVersionTag(),
                        createdAt: timestamp,
                        updatedAt: timestamp,
                        createdBy: context.userId,
                        updatedBy: context.userId
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2];
        }
    });
}); };
var generateVersionTag = function () {
    var now = new Date();
    return "".concat(now.getFullYear(), ".").concat(String(now.getMonth() + 1).padStart(2, '0'), ".").concat(String(now.getDate()).padStart(2, '0'), "_") +
        "".concat(String(now.getHours()).padStart(2, '0'), ".").concat(String(now.getMinutes()).padStart(2, '0'), ".").concat(String(now.getSeconds()).padStart(2, '0'));
};


/***/ }),

/***/ "./src/modules/domain/definitions/fragmentLabel.spec.ts":
/*!**************************************************************!*\
  !*** ./src/modules/domain/definitions/fragmentLabel.spec.ts ***!
  \**************************************************************/
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
exports.fragmentLabelSpec = void 0;
var dbutils_1 = __webpack_require__(/*! ../../../lib/dbutils */ "./src/lib/dbutils.ts");
var Utils_1 = __webpack_require__(/*! ../../../lib/Utils */ "./src/lib/Utils.ts");
exports.fragmentLabelSpec = {
    fields: {
        "name": {
            type: "string",
            required: true
        }
    },
    meta: {
        hooks: {
            beforeCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                var errors, Model, existing, isDuplicate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            errors = [];
                            Model = (0, dbutils_1.getCollectionByName)(context.space, context.domain);
                            if (!Model) {
                                errors.push("Invalid collection context.");
                                return [2, { doc: doc, errors: errors }];
                            }
                            doc.name = (0, Utils_1.normalizeLabel)(doc.name);
                            return [4, Model.findOne({ name: doc.name })];
                        case 1:
                            existing = _a.sent();
                            isDuplicate = existing && (context.operation === "create" || existing._id.toString() !== doc._id.toString());
                            if (isDuplicate) {
                                errors.push("Label '".concat(doc.name, "' already exists"));
                            }
                            return [2, { doc: doc, errors: errors }];
                    }
                });
            }); }
        }
    }
};


/***/ }),

/***/ "./src/modules/domain/definitions/fragmentVersion.spec.ts":
/*!****************************************************************!*\
  !*** ./src/modules/domain/definitions/fragmentVersion.spec.ts ***!
  \****************************************************************/
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
exports.fragmentVersionSpec = void 0;
var dbutils_1 = __webpack_require__(/*! ../../../lib/dbutils */ "./src/lib/dbutils.ts");
var applyVersionTagIfMissing = function (doc) { return __awaiter(void 0, void 0, void 0, function () {
    var now, versionTag;
    return __generator(this, function (_a) {
        if (!doc.versionTag) {
            now = new Date();
            versionTag = "".concat(now.getFullYear(), ".").concat(String(now.getMonth() + 1).padStart(2, '0'), ".").concat(String(now.getDate()).padStart(2, '0'), "_") +
                "".concat(String(now.getHours()).padStart(2, '0'), ".").concat(String(now.getMinutes()).padStart(2, '0'), ".").concat(String(now.getSeconds()).padStart(2, '0'));
            doc.versionTag = versionTag;
        }
        return [2, { doc: doc, errors: [] }];
    });
}); };
exports.fragmentVersionSpec = {
    fields: {
        "fragmentReference": {
            "type": "string",
            "required": true,
            parent: {
                domain: "fragment",
                field: "reference"
            }
        },
        "content": {
            "type": "string",
            "required": true,
        },
        "versionTag": {
            "type": "string",
            "required": false,
            displayOptions: {
                label: "Version tag",
                type: "text"
            }
        },
        "userNote": {
            "type": "string",
            "required": false,
            displayOptions: {
                label: "Change note",
                type: "textarea"
            }
        }
    },
    meta: {
        hooks: {
            beforeCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, applyVersionTagIfMissing(doc)];
                });
            }); },
            afterCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                var Fragment, updatedFragment, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            Fragment = (0, dbutils_1.getCollectionByName)(context.space, "fragment");
                            return [4, Fragment.findOneAndUpdate({ reference: doc.fragmentReference }, {
                                    $set: {
                                        content: doc.content,
                                        updatedAt: new Date(),
                                        updatedBy: context.userId
                                    }
                                }, { new: true })];
                        case 1:
                            updatedFragment = _a.sent();
                            if (!updatedFragment) {
                                return [2];
                            }
                            return [3, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.error("Error updating fragment content:", err_1.message);
                            return [3, 3];
                        case 3: return [2];
                    }
                });
            }); },
            afterUpdate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log("Fragment updated: ".concat(doc.reference));
                    return [2];
                });
            }); },
        },
    },
};


/***/ }),

/***/ "./src/modules/domain/definitions/storythread.spec.ts":
/*!************************************************************!*\
  !*** ./src/modules/domain/definitions/storythread.spec.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.storythreadSpec = void 0;
exports.storythreadSpec = {
    fields: {
        "name": {
            type: "string",
            required: true
        }
    },
    meta: {
        hooks: {
            beforeCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(doc, context);
                    return [2, { doc: doc, errors: [] }];
                });
            }); },
        }
    }
};


/***/ }),

/***/ "./src/modules/domain/definitions/storythreadFragment.spec.ts":
/*!********************************************************************!*\
  !*** ./src/modules/domain/definitions/storythreadFragment.spec.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.storythreadFragmentSpec = void 0;
exports.storythreadFragmentSpec = {
    fields: {
        "storythreadReference": {
            type: "string",
            required: true
        },
        "fragmentReference": {
            type: "string",
            required: true
        }
    },
    meta: {
        hooks: {
            beforeCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log(doc, context);
                    return [2, { doc: doc, errors: [] }];
                });
            }); },
        },
        ordering: [
            "storythreadReference"
        ]
    }
};


/***/ }),

/***/ "./src/modules/domain/filterBuilder.ts":
/*!*********************************************!*\
  !*** ./src/modules/domain/filterBuilder.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildQueryFromAdvancedFilters = exports.buildSortQuery = void 0;
var OP_MAP = {
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
var resolveFieldSpec = function (path, spec) {
    var currentField;
    var currentFields = spec.fields;
    for (var i = 0; i < path.length; i++) {
        var part = path[i];
        currentField = currentFields[part];
        if (!currentField)
            return null;
        if (currentField.type === "object") {
            currentFields = currentField.fields;
        }
        else if (currentField.type === "array") {
            var arrayField = currentField;
            if (arrayField.itemType === "object" && arrayField.fields) {
                currentFields = arrayField.fields;
            }
            else if (i < path.length - 1) {
                return null;
            }
        }
        else {
            if (i < path.length - 1) {
                return null;
            }
        }
    }
    return currentField !== null && currentField !== void 0 ? currentField : null;
};
var buildSortQuery = function (sort) {
    var mongoSort = {};
    for (var key in sort) {
        var direction = sort[key];
        mongoSort[key] = direction === "desc" || direction === -1 ? -1 : 1;
    }
    return mongoSort;
};
exports.buildSortQuery = buildSortQuery;
var buildQueryFromAdvancedFilters = function (filters, spec) {
    var mongoQuery = {};
    for (var rawField in filters) {
        var value = filters[rawField];
        var path = rawField.split(".");
        var fieldSpec = resolveFieldSpec(path, spec);
        if (!fieldSpec)
            continue;
        if (typeof value === "object" && !Array.isArray(value)) {
            var mongoOps = {};
            for (var op in value) {
                if (OP_MAP[op]) {
                    mongoOps[OP_MAP[op]] = op === "regex"
                        ? new RegExp(value[op], "i")
                        : value[op];
                }
            }
            mongoQuery[rawField] = mongoOps;
        }
        else {
            mongoQuery[rawField] = value;
        }
    }
    return mongoQuery;
};
exports.buildQueryFromAdvancedFilters = buildQueryFromAdvancedFilters;


/***/ }),

/***/ "./src/modules/domain/specs/specRegistry.ts":
/*!**************************************************!*\
  !*** ./src/modules/domain/specs/specRegistry.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listAllSpecs = exports.getSpecByName = void 0;
var fragment_spec_1 = __webpack_require__(/*! ../definitions/fragment.spec */ "./src/modules/domain/definitions/fragment.spec.ts");
var fragmentLabel_spec_1 = __webpack_require__(/*! ../definitions/fragmentLabel.spec */ "./src/modules/domain/definitions/fragmentLabel.spec.ts");
var fragmentVersion_spec_1 = __webpack_require__(/*! ../definitions/fragmentVersion.spec */ "./src/modules/domain/definitions/fragmentVersion.spec.ts");
var storythread_spec_1 = __webpack_require__(/*! ../definitions/storythread.spec */ "./src/modules/domain/definitions/storythread.spec.ts");
var storythreadFragment_spec_1 = __webpack_require__(/*! ../definitions/storythreadFragment.spec */ "./src/modules/domain/definitions/storythreadFragment.spec.ts");
var specRegistry = {
    storythread: storythread_spec_1.storythreadSpec,
    fragment: fragment_spec_1.fragmentSpec,
    fragmentVersion: fragmentVersion_spec_1.fragmentVersionSpec,
    fragmentLabel: fragmentLabel_spec_1.fragmentLabelSpec,
    storythreadFragment: storythreadFragment_spec_1.storythreadFragmentSpec
};
var getSpecByName = function (name) {
    return specRegistry[name];
};
exports.getSpecByName = getSpecByName;
var listAllSpecs = function () { return Object.keys(specRegistry); };
exports.listAllSpecs = listAllSpecs;


/***/ }),

/***/ "./src/modules/domain/specs/types/spec.types.ts":
/*!******************************************************!*\
  !*** ./src/modules/domain/specs/types/spec.types.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolbarOption = void 0;
var ToolbarOption;
(function (ToolbarOption) {
    ToolbarOption["Bold"] = "bold";
    ToolbarOption["Italic"] = "italic";
    ToolbarOption["Underline"] = "underline";
    ToolbarOption["Strikethrough"] = "strikethrough";
    ToolbarOption["Heading"] = "heading";
    ToolbarOption["AlignLeft"] = "alignLeft";
    ToolbarOption["AlignCenter"] = "alignCenter";
    ToolbarOption["AlignRight"] = "alignRight";
    ToolbarOption["AlignJustify"] = "alignJustify";
    ToolbarOption["BulletList"] = "bulletList";
    ToolbarOption["OrderedList"] = "orderedList";
    ToolbarOption["BlockQuote"] = "blockQuote";
    ToolbarOption["Code"] = "code";
    ToolbarOption["CodeBlock"] = "codeBlock";
    ToolbarOption["FontColor"] = "fontColor";
    ToolbarOption["HighlightColor"] = "highlightColor";
    ToolbarOption["Link"] = "link";
    ToolbarOption["ClearFormatting"] = "clearFormatting";
    ToolbarOption["HorizontalRule"] = "horizontalRule";
    ToolbarOption["Image"] = "image";
    ToolbarOption["AddTable"] = "addTable";
    ToolbarOption["YouTubeVideo"] = "youTubeVideo";
    ToolbarOption["Undo"] = "undo";
    ToolbarOption["Redo"] = "redo";
})(ToolbarOption || (exports.ToolbarOption = ToolbarOption = {}));


/***/ }),

/***/ "./src/modules/domain/utils/schemaValidator.ts":
/*!*****************************************************!*\
  !*** ./src/modules/domain/utils/schemaValidator.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fillMissingFields = void 0;
exports.validateAndShapePayload = validateAndShapePayload;
function validateAndShapePayload(payload, spec, path, options) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (path === void 0) { path = ""; }
    if (options === void 0) { options = {}; }
    var errors = [];
    var shapedData = {};
    var _loop_1 = function (key) {
        var field = spec.fields[key];
        var value = payload === null || payload === void 0 ? void 0 : payload[key];
        var fullPath = path ? "".concat(path, ".").concat(key) : key;
        var isMissing = value === undefined || value === null;
        var isRequired = field.required === true;
        if (isMissing) {
            if (isRequired && !options.allowPartial) {
                errors.push("".concat(fullPath, " is required"));
            }
            return "continue";
        }
        var validateBase = function () {
            var _a;
            if (typeof ((_a = field.validate) === null || _a === void 0 ? void 0 : _a.custom) === "function") {
                try {
                    if (!field.validate.custom(value)) {
                        errors.push("".concat(fullPath, " failed custom validation"));
                    }
                }
                catch (e) {
                    errors.push("".concat(fullPath, " failed custom validation: ").concat(e.message));
                }
            }
        };
        switch (field.type) {
            case "string":
                if (typeof value !== "string") {
                    errors.push("".concat(fullPath, " must be a string"));
                }
                else {
                    if (((_a = field.validate) === null || _a === void 0 ? void 0 : _a.minLength) && value.length < field.validate.minLength) {
                        errors.push("".concat(fullPath, " must be at least ").concat(field.validate.minLength, " characters"));
                    }
                    if (((_b = field.validate) === null || _b === void 0 ? void 0 : _b.maxLength) && value.length > field.validate.maxLength) {
                        errors.push("".concat(fullPath, " must be at most ").concat(field.validate.maxLength, " characters"));
                    }
                    if (((_c = field.validate) === null || _c === void 0 ? void 0 : _c.regex) && !(new RegExp(field.validate.regex).test(value))) {
                        errors.push("".concat(fullPath, " does not match required pattern"));
                    }
                }
                validateBase();
                shapedData[key] = value;
                break;
            case "number":
                if (typeof value !== "number") {
                    errors.push("".concat(fullPath, " must be a number"));
                }
                else {
                    if (((_d = field.validate) === null || _d === void 0 ? void 0 : _d.min) !== undefined && value < field.validate.min) {
                        errors.push("".concat(fullPath, " must be at least ").concat(field.validate.min));
                    }
                    if (((_e = field.validate) === null || _e === void 0 ? void 0 : _e.max) !== undefined && value > field.validate.max) {
                        errors.push("".concat(fullPath, " must be at most ").concat(field.validate.max));
                    }
                }
                validateBase();
                shapedData[key] = value;
                break;
            case "boolean":
                if (typeof value !== "boolean") {
                    errors.push("".concat(fullPath, " must be a boolean"));
                }
                else {
                    validateBase();
                    shapedData[key] = value;
                }
                break;
            case "enum":
                if (!field.options.map(function (o) { return o.value; }).includes(value)) {
                    errors.push("".concat(fullPath, " must be one of ").concat(field.options.map(function (o) { return o.value; }).join(", ")));
                }
                validateBase();
                shapedData[key] = value;
                break;
            case "object":
                if (typeof value !== "object" || Array.isArray(value)) {
                    errors.push("".concat(fullPath, " must be an object"));
                }
                else {
                    var nestedResult = validateAndShapePayload(value, { fields: field.fields }, fullPath, options);
                    if (!nestedResult.valid) {
                        errors.push.apply(errors, nestedResult.errors);
                    }
                    else {
                        shapedData[key] = nestedResult.shapedData;
                    }
                }
                break;
            case "array":
                if (!Array.isArray(value)) {
                    errors.push("".concat(fullPath, " must be an array"));
                }
                else {
                    if (((_f = field.validate) === null || _f === void 0 ? void 0 : _f.minItems) !== undefined && value.length < field.validate.minItems) {
                        errors.push("".concat(fullPath, " must have at least ").concat(field.validate.minItems, " items"));
                    }
                    if (((_g = field.validate) === null || _g === void 0 ? void 0 : _g.maxItems) !== undefined && value.length > field.validate.maxItems) {
                        errors.push("".concat(fullPath, " must have at most ").concat(field.validate.maxItems, " items"));
                    }
                    var itemType = field.itemType;
                    var shapedArray = [];
                    for (var i = 0; i < value.length; i++) {
                        var item = value[i];
                        var itemPath = "".concat(fullPath, "[").concat(i, "]");
                        if (itemType === "object" && field.fields) {
                            var nested = validateAndShapePayload(item, { fields: field.fields }, itemPath, options);
                            if (!nested.valid) {
                                errors.push.apply(errors, nested.errors);
                            }
                            else {
                                shapedArray.push(nested.shapedData);
                            }
                        }
                        else {
                            var expectedType = itemType;
                            if (typeof item !== expectedType) {
                                errors.push("".concat(itemPath, " must be a ").concat(expectedType));
                            }
                            else {
                                shapedArray.push(item);
                            }
                        }
                    }
                    shapedData[key] = shapedArray;
                }
                break;
            default:
                errors.push("".concat(fullPath, " has unsupported field type"));
                break;
        }
    };
    for (var key in spec.fields) {
        _loop_1(key);
    }
    return {
        valid: errors.length === 0,
        shapedData: shapedData,
        errors: errors
    };
}
var fillMissingFields = function (doc, spec) {
    var _a;
    var shaped = {
        id: (_a = doc._id) !== null && _a !== void 0 ? _a : doc.id,
        reference: doc.reference,
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        updatedBy: doc.updatedBy,
        updatedAt: doc.updatedAt,
    };
    for (var key in spec.fields) {
        var field = spec.fields[key];
        var value = doc[key];
        if (value !== undefined && value !== null) {
            shaped[key] = value;
        }
        else {
            shaped[key] = getDefaultValueForField(field);
        }
    }
    return shaped;
};
exports.fillMissingFields = fillMissingFields;
var getDefaultValueForField = function (field) {
    switch (field.type) {
        case "string":
        case "number":
        case "boolean":
        case "enum":
            return null;
        case "object":
            var nested = {};
            for (var subField in field.fields) {
                nested[subField] = getDefaultValueForField(field.fields[subField]);
            }
            return nested;
        case "array":
            return [];
        default:
            return null;
    }
};


/***/ }),

/***/ "./src/modules/domain/utils/typeInference.ts":
/*!***************************************************!*\
  !*** ./src/modules/domain/utils/typeInference.ts ***!
  \***************************************************/
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
exports.generateTypesFromSpecs = void 0;
var specRegistry_1 = __webpack_require__(/*! ../specs/specRegistry */ "./src/modules/domain/specs/specRegistry.ts");
var capitalize = function (str) { return str.charAt(0).toUpperCase() + str.slice(1); };
var toPascalCase = function (parts) { return parts.map(capitalize).join(''); };
var nestedInterfaces = [];
var inferFieldType = function (field, domainName, pathParts) {
    if (pathParts === void 0) { pathParts = []; }
    switch (field.type) {
        case 'string':
        case 'number':
        case 'boolean':
            return field.type;
        case 'enum':
            return field.options.map(function (opt) { return "\"".concat(opt.value, "\""); }).join(' | ');
        case 'object':
            var objectName = toPascalCase(__spreadArray([domainName], pathParts, true));
            nestedInterfaces.push(generateInterfaceFromFields(objectName, field.fields, domainName, pathParts));
            return objectName;
        case 'array':
            var itemType = void 0;
            if (field.itemType === 'object' && field.fields) {
                var arrayName = toPascalCase(__spreadArray([domainName], pathParts, true));
                nestedInterfaces.push(generateInterfaceFromFields(arrayName, field.fields, domainName, pathParts));
                itemType = arrayName;
            }
            else {
                itemType = field.itemType;
            }
            return "".concat(itemType, "[]");
        default:
            return 'any';
    }
};
var generateInterfaceFromFields = function (interfaceName, fields, domainName, pathParts) {
    if (pathParts === void 0) { pathParts = []; }
    var output = "export interface ".concat(interfaceName, " {");
    for (var key in fields) {
        var field = fields[key];
        var tsType = inferFieldType(field, domainName, __spreadArray(__spreadArray([], pathParts, true), [key], false));
        var optional = field.required ? '' : '?';
        output += "\n  ".concat(key).concat(optional, ": ").concat(tsType, ";");
    }
    output += "\n  id: string;";
    output += "\n  reference: string;";
    output += "\n  createdBy: string;";
    output += "\n  createdAt: string;";
    output += "\n  updatedBy: string;";
    output += "\n  updatedAt: string;";
    output += "\n}";
    return output;
};
var generateTypesFromSpecs = function () {
    nestedInterfaces.length = 0;
    var mainInterfaces = [];
    var domains = (0, specRegistry_1.listAllSpecs)();
    for (var _i = 0, domains_1 = domains; _i < domains_1.length; _i++) {
        var domain = domains_1[_i];
        var spec = (0, specRegistry_1.getSpecByName)(domain);
        if (!spec)
            continue;
        var domainInterfaceName = capitalize(domain);
        var mainInterface = generateInterfaceFromFields(domainInterfaceName, spec.fields, domain);
        mainInterfaces.push(mainInterface);
    }
    return __spreadArray(__spreadArray([], mainInterfaces, true), nestedInterfaces, true).join('\n\n');
};
exports.generateTypesFromSpecs = generateTypesFromSpecs;


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
var ONEAUTH_API_SPACE = process.env.ONEAUTH_API_SPACE || "212";
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
                return [4, axios.post("".concat(ONEAUTH_API, "/").concat(ONEAUTH_API_SPACE, "/admin/permission"), {
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
        .route("/resources-dep/:space/:domain")
        .get(middlewares_1.authorizeApi, service_1.getAll)
        .post(middlewares_1.authorizeApi, service_1.createOne);
    router
        .route("/resources-dep/:space/:domain/:reference")
        .get(middlewares_1.authorizeApi, service_1.getByReference)
        .put(middlewares_1.authorizeApi, service_1.updateOne)
        .patch(middlewares_1.authorizeApi, service_1.patchOne)
        .delete(middlewares_1.authorizeApi, service_1.deleteOne);
    router.post("/resources-dep/:space/:domain/search", middlewares_1.authorizeApi, service_1.search);
    router.get("/inference/resources-dep", service_1.inferTypes);
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
    for (var key in spec.fields) {
        var fieldSpec = spec.fields[key];
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
    var shaped = { id: doc._id, reference: doc.reference, createdBy: doc.createdBy, createdAt: doc.createdAt, updatedBy: doc.updatedBy, updatedAt: doc.updatedAt };
    for (var field in spec.fields) {
        if (doc.hasOwnProperty(field)) {
            shaped[field] = doc[field];
        }
        else {
            shaped[field] = spec.fields[field].type === "array" ? [] : null;
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
                    _a = spec.fields;
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
                    fieldSpec = spec.fields[fieldName];
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
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "search")) {
                    return [2, res.status(404).json({ error: "Operation 'search' is not supported for this domain" })];
                }
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
    var _a, space, domain, userId, spec, result, hooks, _b, Model, timestamp, doc, err_4;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.params, space = _a.space, domain = _a.domain;
                if (!(0, schemaValidator_1.isOperationAllowed)(domain, "create")) {
                    return [2, res.status(404).json({ error: "Operation 'create' is not supported for this domain" })];
                }
                userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.user_id;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 7]);
                spec = (0, schemaValidator_1.loadSpec)(domain);
                result = (0, schemaValidator_1.validateAndShapePayload)(req.body, spec);
                if (!result.valid)
                    return [2, res.status(400).json({ error: "Validation failed", details: result.errors })];
                return [4, checkParentReferences(result.shapedData, spec, space, res)];
            case 2:
                if (!(_e.sent()))
                    return [2];
                hooks = (_d = spec.meta) === null || _d === void 0 ? void 0 : _d.hooks;
                if (!(hooks === null || hooks === void 0 ? void 0 : hooks.beforeCreate)) return [3, 4];
                _b = result;
                return [4, hooks.beforeCreate(result.shapedData, { space: space, domain: domain, userId: userId })];
            case 3:
                _b.shapedData = _e.sent();
                _e.label = 4;
            case 4:
                Model = (0, dbutils_1.getCollectionByName)(space, domain);
                timestamp = new Date();
                doc = new Model(__assign(__assign({}, result.shapedData), { reference: nanoid(), createdAt: timestamp, updatedAt: timestamp, createdBy: userId, updatedBy: userId }));
                return [4, doc.save()];
            case 5:
                _e.sent();
                res.status(201).json((0, schemaValidator_1.fillMissingFields)(doc.toObject(), spec));
                if (hooks === null || hooks === void 0 ? void 0 : hooks.afterCreate) {
                    hooks.afterCreate(doc.toObject(), { space: space, domain: domain, userId: userId }).catch(console.error);
                }
                return [3, 7];
            case 6:
                err_4 = _e.sent();
                res.status(500).json({ error: "Error creating document", details: err_4.message });
                return [3, 7];
            case 7: return [2];
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
    fields += "\n  id: string;";
    fields += "\n  reference: string;";
    fields += "\n  createdBy: string;";
    fields += "\n  createdAt: string;";
    fields += "\n  updatedBy: string;";
    fields += "\n  updatedAt: string;";
    return "export interface ".concat(interfaceName, " {").concat(fields, "\n}");
};
var generateTypes = function (space) {
    var types = [];
    Object.keys(domains_1.specsMap).forEach(function (specName) {
        var spec = domains_1.specsMap[specName];
        var domainInterfaceName = capitalize(specName);
        var mainInterface = generateNestedInterface(domainInterfaceName, spec.fields, specName);
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
__webpack_require__(/*! ./modules/domain/api/route */ "./src/modules/domain/api/route.ts")(router);
module.exports = router;


/***/ }),

/***/ "./src/specs/domains/course.spec.ts":
/*!******************************************!*\
  !*** ./src/specs/domains/course.spec.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.courseSpec = void 0;
var questionField = {
    type: "object",
    schema: {
        fields: {
            questionId: {
                type: "string",
                required: true,
            },
            prompt: {
                type: "string",
                required: true,
            },
            options: {
                type: "array",
                schema: {
                    type: "string",
                },
            },
            correctAnswer: {
                type: "string",
            },
        },
    },
};
var quizField = {
    type: "object",
    schema: {
        fields: {
            quizId: {
                type: "string",
                required: true,
            },
            title: {
                type: "string",
                required: true,
            },
            questions: {
                type: "array",
                schema: questionField,
            },
        }
    },
};
var lessonField = {
    type: "object",
    schema: {
        fields: {
            lessonId: {
                type: "string",
                required: true,
            },
            title: {
                type: "string",
                required: true,
            },
            content: {
                type: "string",
            },
            quizzes: {
                type: "array",
                schema: quizField,
            },
        }
    },
};
exports.courseSpec = {
    fields: {
        courseId: {
            type: "string",
            required: true,
        },
        title: {
            type: "string",
            required: true,
        },
        description: {
            type: "string",
        },
        lessons: {
            type: "array",
            required: true,
            schema: lessonField,
        },
    },
};


/***/ }),

/***/ "./src/specs/domains/fragment.spec.ts":
/*!********************************************!*\
  !*** ./src/specs/domains/fragment.spec.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports) {

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
exports.fragmentChildren = exports.fragmentSpec = void 0;
var labelSchema = {
    fields: {
        label: {
            type: "string",
            required: true,
        },
        value: {
            type: "string",
            required: false,
        }
    }
};
exports.fragmentSpec = {
    fields: {
        "name": {
            type: "string",
            required: true
        },
        "content": {
            type: "string",
            required: false
        },
        "storythreadReference": {
            type: "string",
            required: true,
            parent: "storythread"
        },
        "labels": {
            type: "array",
            required: true,
            schema: {
                type: "object",
                schema: labelSchema,
            }
        }
    },
    meta: {
        hooks: {
            beforeCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2, doc];
                });
            }); }
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
    fields: {
        "fragmentReference": {
            "type": "string",
            "required": true
        },
        "fragmentVersionId": {
            "type": "string",
            "required": true
        },
        "content": {
            "type": "string",
            "required": false
        }
    }
};


/***/ }),

/***/ "./src/specs/domains/fragmentVersion.spec.ts":
/*!***************************************************!*\
  !*** ./src/specs/domains/fragmentVersion.spec.ts ***!
  \***************************************************/
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
exports.fragmentVersionSpec = void 0;
var dbutils_1 = __webpack_require__(/*! ../../lib/dbutils */ "./src/lib/dbutils.ts");
exports.fragmentVersionSpec = {
    fields: {
        "fragmentReference": {
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
    },
    meta: {
        hooks: {
            beforeCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                var now, versionTag;
                return __generator(this, function (_a) {
                    console.log("Before creating fragment version for fragmentId: ".concat(doc.fragmentId));
                    if (!doc.versionTag) {
                        now = new Date();
                        versionTag = "".concat(now.getFullYear(), ".").concat(String(now.getMonth() + 1).padStart(2, '0'), ".").concat(String(now.getDate()).padStart(2, '0'), "_").concat(String(now.getHours()).padStart(2, '0'), ".").concat(String(now.getMinutes()).padStart(2, '0'));
                        doc.versionTag = versionTag;
                    }
                    return [2, doc];
                });
            }); },
            afterCreate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                var Fragment, updatedFragment, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("New fragment version created in ".concat(context.space, "/").concat(context.domain, ":"), doc);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            Fragment = (0, dbutils_1.getCollectionByName)(context.space, "fragment");
                            return [4, Fragment.findOneAndUpdate({ reference: doc.fragmentReference }, {
                                    $set: {
                                        content: doc.content,
                                        updatedAt: new Date(),
                                        updatedBy: context.userId
                                    }
                                }, { new: true })];
                        case 2:
                            updatedFragment = _a.sent();
                            if (!updatedFragment) {
                                return [2];
                            }
                            return [3, 4];
                        case 3:
                            err_1 = _a.sent();
                            console.error("Error updating fragment content:", err_1.message);
                            return [3, 4];
                        case 4: return [2];
                    }
                });
            }); },
            afterUpdate: function (doc, context) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log("Fragment updated: ".concat(doc.reference));
                    return [2];
                });
            }); },
        },
    },
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
var course_spec_1 = __webpack_require__(/*! ./course.spec */ "./src/specs/domains/course.spec.ts");
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
    storythread: storythread_spec_1.storythreadSpec,
    course: course_spec_1.courseSpec
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
    fields: {
        "title": {
            "type": "string",
            "required": true
        },
        "description": {
            "type": "string",
            "required": false
        }
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
    fields: {
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
/******/ 		__webpack_require__.h = () => ("5df5cb1432fde398caa3")
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQSxVQUFVO1dBQ1Y7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsV0FBVztXQUNYO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0EsbUJBQW1CLHdDQUF3QztXQUMzRDtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU07V0FDTjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsUUFBUTtXQUNSLFFBQVE7V0FDUjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxTQUFTO1dBQ1Q7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsT0FBTztXQUNQO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxRQUFRO1dBQ1I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUUsSUFBSTtXQUNOO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxJQUFJO1dBQ0o7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQSxFQUFFLDJCQUEyQixnREFBZ0Q7V0FDN0U7Ozs7O1VFMWRBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9oYW5kbGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL2xpYi9VdGlscy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9saWIvZGJ1dGlscy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9saWIvdmFsaWRhdGlvbi50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tYWluLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21pZGRsZXdhcmVzLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvYXV0aC9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9hdXRoL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvYXV0aC9zZXJ2aWNlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvY29tcGFueS9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9jb21wYW55L21vZGVsLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvY29tcGFueS9yb3V0ZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2NvbXBhbnkvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2RvbWFpbi9hcGkvcm91dGUudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9kb21haW4vYXBpL3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9kb21haW4vZGVmaW5pdGlvbnMvZnJhZ21lbnQuc3BlYy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2RvbWFpbi9kZWZpbml0aW9ucy9mcmFnbWVudExhYmVsLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9kb21haW4vZGVmaW5pdGlvbnMvZnJhZ21lbnRWZXJzaW9uLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9kb21haW4vZGVmaW5pdGlvbnMvc3Rvcnl0aHJlYWQuc3BlYy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2RvbWFpbi9kZWZpbml0aW9ucy9zdG9yeXRocmVhZEZyYWdtZW50LnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9kb21haW4vZmlsdGVyQnVpbGRlci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2RvbWFpbi9zcGVjcy9zcGVjUmVnaXN0cnkudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9kb21haW4vc3BlY3MvdHlwZXMvc3BlYy50eXBlcy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2RvbWFpbi91dGlscy9zY2hlbWFWYWxpZGF0b3IudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9kb21haW4vdXRpbHMvdHlwZUluZmVyZW5jZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2hlbGxvL2hlbHBlci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL2hlbGxvL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvaGVsbG8vc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3Blcm1pc3Npb24vaGVscGVyLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvc2VxdWVuY2Uvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3Nlc3Npb24vbW9kZWwudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91bml2ZXJzYWwvZmlsdGVyQnVpbGRlci50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VuaXZlcnNhbC9yb3V0ZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VuaXZlcnNhbC9zY2hlbWFWYWxpZGF0b3IudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91bml2ZXJzYWwvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VuaXZlcnNhbC90eXBlSW5mZXJlbmNlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdXNlci9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2ludml0ZS9oZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL2ludml0ZS9tb2RlbC50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvaW52aXRlL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdXNlci9pbnZpdGUvc2VydmljZS50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9tb2R1bGVzL3VzZXIvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy91c2VyL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL21vZHVsZXMvdXNlci9zZXJ2aWNlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3JvdXRlLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3NwZWNzL2RvbWFpbnMvY291cnNlLnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3BlY3MvZG9tYWlucy9mcmFnbWVudC5zcGVjLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3NwZWNzL2RvbWFpbnMvZnJhZ21lbnRDb21tZW50LnNwZWMudHMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvc3BlY3MvZG9tYWlucy9mcmFnbWVudFZlcnNpb24uc3BlYy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9zcGVjcy9kb21haW5zL2luZGV4LnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vc3JjL3NwZWNzL2RvbWFpbnMvc3Rvcnl0aHJlYWQuc3BlYy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9zcGVjcy9kb21haW5zL3VzZXIuc3BlYy50cyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci8uL3NyYy9zdGFydHVwLnRzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy1hcHBseS1yZXN1bHQuanMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLmpzIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyLy4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L3BvbGwuanMiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvLi9zcmMvbW9kdWxlcy9zZXF1ZW5jZS9tb2RlbC5qcyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImF4aW9zXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJiY3J5cHRcIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcImRhdGUtZm5zXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcIm1vbmdvb3NlXCIiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvZXh0ZXJuYWwgY29tbW9uanMgXCJuYW5vaWRcIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBjb21tb25qcyBcInV1aWRcIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCB1cGRhdGUgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2dldCB1cGRhdGUgbWFuaWZlc3QgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL2hvdCBtb2R1bGUgcmVwbGFjZW1lbnQiLCJ3ZWJwYWNrOi8vZWNoby1ncmFwaC1zZXJ2ZXIvd2VicGFjay9ydW50aW1lL3JlcXVpcmUgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2VjaG8tZ3JhcGgtc2VydmVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9lY2hvLWdyYXBoLXNlcnZlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFzeW5jSGFuZGxlciA9IHZvaWQgMDtcbnZhciBhc3luY0hhbmRsZXIgPSBmdW5jdGlvbiAoZm4pIHsgcmV0dXJuIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZm4ocmVxLCByZXMsIG5leHQpKS5jYXRjaChuZXh0KTtcbn07IH07XG5leHBvcnRzLmFzeW5jSGFuZGxlciA9IGFzeW5jSGFuZGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5ub3JtYWxpemVMYWJlbCA9IHZvaWQgMDtcbmV4cG9ydHMuaXNFbXB0eU9yU3BhY2VzID0gaXNFbXB0eU9yU3BhY2VzO1xuZXhwb3J0cy5pc0VtcHR5QXR0cmlidXRlcyA9IGlzRW1wdHlBdHRyaWJ1dGVzO1xuZXhwb3J0cy5tYXRjaCA9IG1hdGNoO1xuZXhwb3J0cy5zb3J0ID0gc29ydDtcbmV4cG9ydHMuaHRtbFRvVGV4dCA9IGh0bWxUb1RleHQ7XG5mdW5jdGlvbiBpc0VtcHR5T3JTcGFjZXMoc3RyKSB7XG4gICAgcmV0dXJuICFzdHIgfHwgc3RyLm1hdGNoKC9eICokLykgIT09IG51bGw7XG59XG5mdW5jdGlvbiBpc0VtcHR5QXR0cmlidXRlcyhvYmplY3QpIHtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuICFPYmplY3Qua2V5cyhvYmplY3QpLmZpbmQoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAob2JqZWN0W2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG1hdGNoKHRleHQsIHdvcmRzKSB7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgaWYgKHdvcmRzKSB7XG4gICAgICAgIHdvcmRzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAod29yZCkge1xuICAgICAgICAgICAgaWYgKHRleHQudG9TdHJpbmcoKS5tYXRjaChuZXcgUmVnRXhwKFwiKFxcXFx3KlwiLmNvbmNhdCh3b3JkLCBcIlxcXFx3KilcIiksICdnaScpKSkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmb3VuZDtcbn1cbmZ1bmN0aW9uIHNvcnQoYXJyYXksIHByb3BlcnR5LCBpc1JldmVyc2VPcmRlcikge1xuICAgIHZhciByZXN1bHQgPSBhcnJheS5zb3J0KGZ1bmN0aW9uIChvMSwgbzIpIHtcbiAgICAgICAgaWYgKGlzUmV2ZXJzZU9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbzFbcHJvcGVydHldID4gbzJbcHJvcGVydHldXG4gICAgICAgICAgICAgICAgPyAtMVxuICAgICAgICAgICAgICAgIDogbzFbcHJvcGVydHldIDwgbzJbcHJvcGVydHldXG4gICAgICAgICAgICAgICAgICAgID8gMVxuICAgICAgICAgICAgICAgICAgICA6IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG8xW3Byb3BlcnR5XSA8IG8yW3Byb3BlcnR5XVxuICAgICAgICAgICAgPyAtMVxuICAgICAgICAgICAgOiBvMVtwcm9wZXJ0eV0gPiBvMltwcm9wZXJ0eV1cbiAgICAgICAgICAgICAgICA/IDFcbiAgICAgICAgICAgICAgICA6IDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGh0bWxUb1RleHQoc3RyKSB7XG4gICAgaWYgKCFzdHIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBzdHIgPSBzdHIudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyg8KFtePl0rKT4pL2dpLCAnJyk7XG59XG52YXIgbm9ybWFsaXplTGFiZWwgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIHJldHVybiBpbnB1dFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAubm9ybWFsaXplKCdORkQnKVxuICAgICAgICAucmVwbGFjZSgvW1xcdTAzMDAtXFx1MDM2Zl0vZywgJycpXG4gICAgICAgIC5yZXBsYWNlKC9bXmEtejAtOVxccy1dL2csICcnKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICctJylcbiAgICAgICAgLnJlcGxhY2UoLy0rL2csICctJyk7XG59O1xuZXhwb3J0cy5ub3JtYWxpemVMYWJlbCA9IG5vcm1hbGl6ZUxhYmVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEdsb2JhbENvbGxlY3Rpb25CeU5hbWUgPSBleHBvcnRzLmdldENvbGxlY3Rpb25CeU5hbWUgPSBleHBvcnRzLmdldEdsb2JhbENvbGxlY3Rpb24gPSBleHBvcnRzLmdldENvbGxlY3Rpb24gPSB2b2lkIDA7XG52YXIgbW9uZ29vc2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibW9uZ29vc2VcIikpO1xudmFyIGdldENvbGxlY3Rpb24gPSBmdW5jdGlvbiAocmVhbG0sIGNvbGxlY3Rpb24sIHNjaGVtYSkge1xuICAgIHZhciBkYiA9IG1vbmdvb3NlXzEuZGVmYXVsdC5jb25uZWN0aW9uLnVzZURiKFwiZWNob19cIi5jb25jYXQocmVhbG0pKTtcbiAgICByZXR1cm4gZGIubW9kZWwoY29sbGVjdGlvbiwgc2NoZW1hKTtcbn07XG5leHBvcnRzLmdldENvbGxlY3Rpb24gPSBnZXRDb2xsZWN0aW9uO1xudmFyIGdldEdsb2JhbENvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc2NoZW1hKSB7XG4gICAgdmFyIGRiID0gbW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3Rpb24udXNlRGIoXCJlY2hvXCIpO1xuICAgIHJldHVybiBkYi5tb2RlbChjb2xsZWN0aW9uLCBzY2hlbWEpO1xufTtcbmV4cG9ydHMuZ2V0R2xvYmFsQ29sbGVjdGlvbiA9IGdldEdsb2JhbENvbGxlY3Rpb247XG52YXIgZGVmYXVsdFNjaGVtYSA9IG5ldyBtb25nb29zZV8xLmRlZmF1bHQuU2NoZW1hKHt9LCB7IHN0cmljdDogZmFsc2UgfSk7XG52YXIgZ2V0Q29sbGVjdGlvbkJ5TmFtZSA9IGZ1bmN0aW9uIChyZWFsbSwgY29sbGVjdGlvbk5hbWUpIHtcbiAgICB2YXIgZGIgPSBtb25nb29zZV8xLmRlZmF1bHQuY29ubmVjdGlvbi51c2VEYihcImVjaG9fXCIuY29uY2F0KHJlYWxtKSk7XG4gICAgcmV0dXJuIGRiLm1vZGVsKGNvbGxlY3Rpb25OYW1lLCBkZWZhdWx0U2NoZW1hLCBjb2xsZWN0aW9uTmFtZSk7XG59O1xuZXhwb3J0cy5nZXRDb2xsZWN0aW9uQnlOYW1lID0gZ2V0Q29sbGVjdGlvbkJ5TmFtZTtcbnZhciBnZXRHbG9iYWxDb2xsZWN0aW9uQnlOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb25OYW1lKSB7XG4gICAgdmFyIGRiID0gbW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3Rpb24udXNlRGIoXCJlY2hvXCIpO1xuICAgIHJldHVybiBkYi5tb2RlbChjb2xsZWN0aW9uTmFtZSwgZGVmYXVsdFNjaGVtYSwgY29sbGVjdGlvbk5hbWUpO1xufTtcbmV4cG9ydHMuZ2V0R2xvYmFsQ29sbGVjdGlvbkJ5TmFtZSA9IGdldEdsb2JhbENvbGxlY3Rpb25CeU5hbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMgPSB2b2lkIDA7XG52YXIgdmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMgPSBmdW5jdGlvbiAocmVzLCBkYXRhLCBtYW5kYXRvcnlGaWVsZHMpIHtcbiAgICB2YXIgbWlzc2luZ0ZpZWxkcyA9IFtdO1xuICAgIG1hbmRhdG9yeUZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZE5hbWUpIHtcbiAgICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KGZpZWxkTmFtZSkpIHtcbiAgICAgICAgICAgIG1pc3NpbmdGaWVsZHMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG1pc3NpbmdGaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXMuc3RhdHVzKDQwMCk7XG4gICAgcmVzLnNlbmQoe1xuICAgICAgICBlcnJvcjogeyBtaXNzaW5nRmllbGRzOiBtaXNzaW5nRmllbGRzIH0sXG4gICAgfSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5leHBvcnRzLnZhbGlkYXRlTWFuZGF0b3J5RmllbGRzID0gdmFsaWRhdGVNYW5kYXRvcnlGaWVsZHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmlmIChtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICBwcm9jZXNzLmV4aXQoKTtcbiAgICB9KTtcbn1cbnZhciBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xudmFyIGNvcnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiY29yc1wiKSk7XG52YXIgbW9uZ29vc2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibW9uZ29vc2VcIikpO1xudmFyIHN0YXJ0dXBfMSA9IHJlcXVpcmUoXCIuL3N0YXJ0dXBcIik7XG52YXIgQXBpUm91dGUgPSByZXF1aXJlKFwiLi9yb3V0ZVwiKTtcbnZhciBkYXRhYmFzZVVyaSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfVVJJIHx8IFwibW9uZ29kYjovLzEyNy4wLjAuMToyNzAxN1wiO1xubW9uZ29vc2VfMS5kZWZhdWx0LmNvbm5lY3QoZGF0YWJhc2VVcmksIHt9KTtcbm1vbmdvb3NlXzEuZGVmYXVsdC5wbHVyYWxpemUodW5kZWZpbmVkKTtcbnZhciBhcHAgPSAoMCwgZXhwcmVzc18xLmRlZmF1bHQpKCk7XG5hcHAudXNlKCgwLCBjb3JzXzEuZGVmYXVsdCkoKSk7XG5hcHAudXNlKGV4cHJlc3NfMS5kZWZhdWx0Lmpzb24oeyBsaW1pdDogNTAwMDAwMCB9KSk7XG5hcHAudXNlKGV4cHJlc3NfMS5kZWZhdWx0LnVybGVuY29kZWQoe1xuICAgIGV4dGVuZGVkOiB0cnVlLFxufSkpO1xuYXBwLmdldChcIi9oZWxsb1wiLCBmdW5jdGlvbiAoXywgcmVzKSB7XG4gICAgcmVzLnNlbmQoXCJiYXNpYyBjb25uZWN0aW9uIHRvIHNlcnZlciB3b3Jrcy4gZGF0YWJhc2UgY29ubmVjdGlvbiBpcyBub3QgdmFsaWRhdGVkXCIpO1xuICAgIHJlcy5lbmQoKTtcbn0pO1xuYXBwLnVzZShcIi9hcGlcIiwgQXBpUm91dGUpO1xuYXBwLnVzZShmdW5jdGlvbiAoXywgcmVzKSB7XG4gICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgIHJlcy5zZW5kKFwiTm90IGZvdW5kXCIpO1xuICAgIHJlcy5lbmQoKTtcbn0pO1xuYXBwLnVzZShmdW5jdGlvbiAoZXJyLCByZXEsIHJlcywgbmV4dCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnIuc3RhY2spO1xufSk7XG52YXIgUE9SVCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgNDAwMDtcbmFwcC5saXN0ZW4oUE9SVCwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKFwiXFx1RDgzRFxcdURFODAgU2VydmVyIHJlYWR5IGF0IGh0dHA6Ly9sb2NhbGhvc3Q6XCIuY29uY2F0KFBPUlQpKTtcbn0pO1xuKDAsIHN0YXJ0dXBfMS5pbml0aWFsaXplU2VxdWVuY2VzKSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmF1dGhvcml6ZUFwaSA9IGV4cG9ydHMuYXV0aG9yaXplQXBpT25lYXV0aCA9IGV4cG9ydHMuYXV0aG9yaXplID0gdm9pZCAwO1xudmFyIGZzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImZzXCIpKTtcbnZhciBqc29ud2VidG9rZW5fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwianNvbndlYnRva2VuXCIpKTtcbnZhciBoZWxwZXJfMSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvYXV0aC9oZWxwZXJcIik7XG52YXIgYXV0aG9yaXplID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgdmFyIGFwcFJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgIHZhciBwdWJsaWNLZXkgPSBmc18xLmRlZmF1bHQucmVhZEZpbGVTeW5jKGFwcFJvb3QgKyBcIi9wdWJsaWMucGVtXCIpO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHRva2VuLCBwdWJsaWNLZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5leHBvcnRzLmF1dGhvcml6ZSA9IGF1dGhvcml6ZTtcbnZhciBhdXRob3JpemVBcGlPbmVhdXRoID0gZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB0b2tlbiwgZGF0YSwgZXJyXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCAyLCAsIDNdKTtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHJlcS5oZWFkZXJzW1wiYXV0aG9yaXphdGlvblwiXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgKDAsIGhlbHBlcl8xLmRlY29kZVRva2VuKSh0b2tlbildO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGRhdGEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFkYXRhLm91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc2VuZFN0YXR1cyg0MDEpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVxLnVzZXIgPSBkYXRhLmNsYWltcztcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJfMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc2VuZFN0YXR1cyg0MDEpXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmF1dGhvcml6ZUFwaU9uZWF1dGggPSBhdXRob3JpemVBcGlPbmVhdXRoO1xudmFyIGF1dGhvcml6ZUFwaSA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG9rZW4sIGRhdGEsIGVycl8yO1xuICAgIHZhciBfYSwgX2IsIF9jO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2QpIHtcbiAgICAgICAgc3dpdGNoIChfZC5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9kLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSByZXEuaGVhZGVyc1tcImF1dGhvcml6YXRpb25cIl07XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zZW5kU3RhdHVzKDQwMSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBoZWxwZXJfMS5kZWNvZGVUb2tlbikodG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Quc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5vdXRjb21lIHx8XG4gICAgICAgICAgICAgICAgICAgIChyZXEucGFyYW1zLnNwYWNlICYmICghKChfYSA9IGRhdGEuY2xhaW1zKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGVybWlzc2lvbnMpIHx8ICEoKF9jID0gKF9iID0gZGF0YS5jbGFpbXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5wZXJtaXNzaW9uc1snQ09NUEFOWV9BRE1JTiddKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuaW5jbHVkZXMocmVxLnBhcmFtcy5zcGFjZSkpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc2VuZFN0YXR1cyg0MDEpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVxLnVzZXIgPSBkYXRhLmNsYWltcztcbiAgICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBlcnJfMiA9IF9kLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJfMik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc2VuZFN0YXR1cyg0MDEpXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmF1dGhvcml6ZUFwaSA9IGF1dGhvcml6ZUFwaTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWNvZGVBcHBUb2tlbiA9IGV4cG9ydHMuZW5jb2RlQXBwVG9rZW4gPSBleHBvcnRzLmdldEhhc2ggPSBleHBvcnRzLmRlY29kZVNlc3Npb24gPSBleHBvcnRzLmRlY29kZVRva2VuID0gZXhwb3J0cy5kZWxldGVTZXNzaW9uQnlSZWZyZXNoVG9rZW4gPSBleHBvcnRzLmRlbGV0ZVNlc3Npb24gPSBleHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IGV4cG9ydHMuZ2V0QWNjZXNzVG9rZW4gPSBleHBvcnRzLmNyZWF0ZVNlc3Npb24gPSB2b2lkIDA7XG52YXIgYmNyeXB0XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImJjcnlwdFwiKSk7XG52YXIgdXVpZF8xID0gcmVxdWlyZShcInV1aWRcIik7XG52YXIgZnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZnNcIikpO1xudmFyIGpzb253ZWJ0b2tlbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIikpO1xudmFyIGRhdGVfZm5zXzEgPSByZXF1aXJlKFwiZGF0ZS1mbnNcIik7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuLi9zZXNzaW9uL21vZGVsXCIpO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG52YXIgYXBwVXJsID0gcHJvY2Vzcy5lbnYuQVBQX1VSTCB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAxMFwiO1xudmFyIGNyZWF0ZVNlc3Npb24gPSBmdW5jdGlvbiAocmVhbG0sIHVzZXIpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlc3Npb25faWQsIG1vZGVsLCBjbGFpbXMsIGFwcFJvb3QsIHByaXZhdGVLZXksIHJlZnJlc2hfdG9rZW47XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbl9pZCA9ICgwLCB1dWlkXzEudjQpKCk7XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKFN0cmluZyhyZWFsbSksIG1vZGVsXzEuc2Vzc2lvbkNvbGxlY3Rpb24sIG1vZGVsXzEuc2Vzc2lvblNjaGVtYSk7XG4gICAgICAgICAgICAgICAgY2xhaW1zID0ge1xuICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgICAgICBnaXZlbl9uYW1lOiB1c2VyLmdpdmVuX25hbWUsXG4gICAgICAgICAgICAgICAgICAgIGZhbWlseV9uYW1lOiB1c2VyLmZhbWlseV9uYW1lLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG5pY2tuYW1lOiB1c2VyLm5pY2tuYW1lLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdXNlci50eXBlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYXBwUm9vdCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgICAgICAgICAgcHJpdmF0ZUtleSA9IGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoYXBwUm9vdCArIFwiL3ByaXZhdGUucGVtXCIpO1xuICAgICAgICAgICAgICAgIHJlZnJlc2hfdG9rZW4gPSBqc29ud2VidG9rZW5fMS5kZWZhdWx0LnNpZ24oe1xuICAgICAgICAgICAgICAgICAgICByZWFsbTogcmVhbG0sXG4gICAgICAgICAgICAgICAgICAgIGlkOiBzZXNzaW9uX2lkLFxuICAgICAgICAgICAgICAgIH0sIHsga2V5OiBwcml2YXRlS2V5LCBwYXNzcGhyYXNlOiBcIm5vMWtub3dzbWVcIiB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGFsZ29yaXRobTogXCJSUzI1NlwiLFxuICAgICAgICAgICAgICAgICAgICBleHBpcmVzSW46IFwiOGhcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uX2lkOiBzZXNzaW9uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFpbXM6IGNsYWltcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlhdDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhdDogKDAsIGRhdGVfZm5zXzEuYWRkKShuZXcgRGF0ZSgpLCB7IGhvdXJzOiA4IH0pLFxuICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBzZXNzaW9uX2lkOiBzZXNzaW9uX2lkLCByZWZyZXNoX3Rva2VuOiByZWZyZXNoX3Rva2VuIH1dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuY3JlYXRlU2Vzc2lvbiA9IGNyZWF0ZVNlc3Npb247XG52YXIgZ2V0QWNjZXNzVG9rZW4gPSBmdW5jdGlvbiAocmVmcmVzaFRva2VuKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWNvZGVkLCBjbGFpbXMsIGFwcFJvb3QsIHByaXZhdGVLZXksIG1vZGVsLCBzZXNzaW9uLCByZWZyZXNoVG9rZW5EdXJhdGlvbiwgYWNjZXNzX3Rva2VuO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsICgwLCBleHBvcnRzLmRlY29kZVRva2VuKShyZWZyZXNoVG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBkZWNvZGVkID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZGVjb2RlZC5vdXRjb21lIHx8XG4gICAgICAgICAgICAgICAgICAgICFkZWNvZGVkLmNsYWltcyB8fFxuICAgICAgICAgICAgICAgICAgICAhZGVjb2RlZC5jbGFpbXMucmVhbG0gfHxcbiAgICAgICAgICAgICAgICAgICAgIWRlY29kZWQuY2xhaW1zLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsYWltcyA9IGRlY29kZWQuY2xhaW1zO1xuICAgICAgICAgICAgICAgIGFwcFJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgICAgICAgICAgIHByaXZhdGVLZXkgPSBmc18xLmRlZmF1bHQucmVhZEZpbGVTeW5jKGFwcFJvb3QgKyBcIi9wcml2YXRlLnBlbVwiKTtcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbikoY2xhaW1zLnJlYWxtLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IHNlc3Npb25faWQ6IGNsYWltcy5pZCB9KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoKDAsIGRhdGVfZm5zXzEuZGlmZmVyZW5jZUluU2Vjb25kcykoc2Vzc2lvbi5lYXQsIG5ldyBEYXRlKCkpIDwgNjApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVmcmVzaFRva2VuRHVyYXRpb24gPSAoMCwgZGF0ZV9mbnNfMS5kaWZmZXJlbmNlSW5TZWNvbmRzKShzZXNzaW9uLmVhdCwgbmV3IERhdGUoKSkgPiA2MCAqIDYwICogMlxuICAgICAgICAgICAgICAgICAgICA/IDYwICogNjAgKiAyXG4gICAgICAgICAgICAgICAgICAgIDogKDAsIGRhdGVfZm5zXzEuZGlmZmVyZW5jZUluU2Vjb25kcykoc2Vzc2lvbi5lYXQsIG5ldyBEYXRlKCkpO1xuICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbiA9IGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQuc2lnbihzZXNzaW9uLmNsYWltcywgeyBrZXk6IHByaXZhdGVLZXksIHBhc3NwaHJhc2U6IFwibm8xa25vd3NtZVwiIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgYWxnb3JpdGhtOiBcIlJTMjU2XCIsXG4gICAgICAgICAgICAgICAgICAgIGV4cGlyZXNJbjogXCJcIi5jb25jYXQocmVmcmVzaFRva2VuRHVyYXRpb24sIFwic1wiKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGFjY2Vzc190b2tlbl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRBY2Nlc3NUb2tlbiA9IGdldEFjY2Vzc1Rva2VuO1xudmFyIHZhbGlkYXRlU2Vzc2lvbiA9IGZ1bmN0aW9uIChyZWFsbSwgc2Vzc2lvbklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgc2Vzc2lvbjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbikoU3RyaW5nKHJlYWxtKSwgbW9kZWxfMS5zZXNzaW9uQ29sbGVjdGlvbiwgbW9kZWxfMS5zZXNzaW9uU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmUoeyBzZXNzaW9uSWQ6IHNlc3Npb25JZCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHNlc3Npb25dO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMudmFsaWRhdGVTZXNzaW9uID0gdmFsaWRhdGVTZXNzaW9uO1xudmFyIGRlbGV0ZVNlc3Npb24gPSBmdW5jdGlvbiAocmVhbG0sIHNlc3Npb25faWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uKShTdHJpbmcocmVhbG0pLCBtb2RlbF8xLnNlc3Npb25Db2xsZWN0aW9uLCBtb2RlbF8xLnNlc3Npb25TY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZGVsZXRlT25lKHsgc2Vzc2lvbl9pZDogc2Vzc2lvbl9pZCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlbGV0ZVNlc3Npb24gPSBkZWxldGVTZXNzaW9uO1xudmFyIGRlbGV0ZVNlc3Npb25CeVJlZnJlc2hUb2tlbiA9IGZ1bmN0aW9uIChyZWFsbSwgcmVmcmVzaF90b2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWw7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb24pKFN0cmluZyhyZWFsbSksIG1vZGVsXzEuc2Vzc2lvbkNvbGxlY3Rpb24sIG1vZGVsXzEuc2Vzc2lvblNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5kZWxldGVPbmUoeyByZWZyZXNoX3Rva2VuOiByZWZyZXNoX3Rva2VuIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVsZXRlU2Vzc2lvbkJ5UmVmcmVzaFRva2VuID0gZGVsZXRlU2Vzc2lvbkJ5UmVmcmVzaFRva2VuO1xudmFyIGRlY29kZVRva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcHBSb290LCBwdWJsaWNLZXksIHJlcywgZXJyXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgYXBwUm9vdCA9IHByb2Nlc3MuY3dkKCk7XG4gICAgICAgICAgICAgICAgcHVibGljS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvcHVibGljLnBlbVwiKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGpzb253ZWJ0b2tlbl8xLmRlZmF1bHQudmVyaWZ5KHRva2VuLCBwdWJsaWNLZXkpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7IG91dGNvbWU6IHRydWUsIHRva2VuOiB0b2tlbiwgY2xhaW1zOiByZXMgfV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZXJyXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyXzEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBvdXRjb21lOiBmYWxzZSwgZXJyOiBlcnJfMSB9XTtcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmRlY29kZVRva2VuID0gZGVjb2RlVG9rZW47XG52YXIgZGVjb2RlU2Vzc2lvbiA9IGZ1bmN0aW9uIChyZWFsbUlkLCBzZXNzaW9uSWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlc3Npb247XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgKDAsIGV4cG9ydHMudmFsaWRhdGVTZXNzaW9uKShyZWFsbUlkLCBzZXNzaW9uSWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZXNzaW9uID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHNlc3Npb25dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsICgwLCBleHBvcnRzLmRlY29kZVRva2VuKShzZXNzaW9uLnRva2VuKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWNvZGVTZXNzaW9uID0gZGVjb2RlU2Vzc2lvbjtcbnZhciBnZXRIYXNoID0gZnVuY3Rpb24gKHBhc3N3b3JkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzYWx0O1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIGJjcnlwdF8xLmRlZmF1bHQuZ2VuU2FsdCgxMCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHNhbHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBiY3J5cHRfMS5kZWZhdWx0Lmhhc2gocGFzc3dvcmQsIHNhbHQpXTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0SGFzaCA9IGdldEhhc2g7XG52YXIgZW5jb2RlQXBwVG9rZW4gPSBmdW5jdGlvbiAoY2xhaW1zKSB7XG4gICAgdmFyIGFwcFJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgIHZhciBwcml2YXRlS2V5ID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyhhcHBSb290ICsgXCIvbG9jYWxfcHJpdmF0ZS5wZW1cIik7XG4gICAgdmFyIHRva2VuID0ganNvbndlYnRva2VuXzEuZGVmYXVsdC5zaWduKGNsYWltcywgeyBrZXk6IHByaXZhdGVLZXksIHBhc3NwaHJhc2U6IFwiZmV2aWNyeWxcIiB9LCB7XG4gICAgICAgIGFsZ29yaXRobTogXCJSUzI1NlwiLFxuICAgICAgICBleHBpcmVzSW46IFwiMTAwaFwiLFxuICAgIH0pO1xuICAgIHJldHVybiB0b2tlbjtcbn07XG5leHBvcnRzLmVuY29kZUFwcFRva2VuID0gZW5jb2RlQXBwVG9rZW47XG52YXIgZGVjb2RlQXBwVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFwcFJvb3QsIHB1YmxpY0tleSwgcmVzLCBlcnJfMjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBhcHBSb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgICAgICAgICAgICAgICBwdWJsaWNLZXkgPSBmc18xLmRlZmF1bHQucmVhZEZpbGVTeW5jKGFwcFJvb3QgKyBcIi9sb2NhbF9wdWJsaWMucGVtXCIpO1xuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwganNvbndlYnRva2VuXzEuZGVmYXVsdC52ZXJpZnkodG9rZW4sIHB1YmxpY0tleSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHsgb3V0Y29tZTogdHJ1ZSwgdG9rZW46IHRva2VuLCBjbGFpbXM6IHJlcyB9XTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJfMiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJfMik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7IG91dGNvbWU6IGZhbHNlLCBlcnI6IGVycl8yIH1dO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVjb2RlQXBwVG9rZW4gPSBkZWNvZGVBcHBUb2tlbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9oYW5kbGVyXCIpO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICByb3V0ZXIucG9zdChcIi9hdXRoL2F1dGhvcml6ZVwiLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLnNpZ25pbikpO1xuICAgIHJvdXRlci5wb3N0KFwiL2F1dGgvdG9rZW5cIiwgKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKHNlcnZpY2VfMS5pc3N1ZVRva2VuKSk7XG4gICAgcm91dGVyLmdldChcIi9hdXRoL3Rva2VuL2RlY29kZVwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKHNlcnZpY2VfMS5kZWNvZGVUb2tlbikpO1xuICAgIHJvdXRlci5wb3N0KFwiL2F1dGgvbG9nb3V0XCIsICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEubG9nb3V0KSk7XG4gICAgcm91dGVyLmdldChcIi9hdXRoL29hL3Nlc3Npb24vOmlkXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICByZXR1cm4gKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKCgwLCBzZXJ2aWNlXzEudmFsaWRhdGVTZXNzaW9uKShzZWxmUmVhbG0sIHJlcSwgcmVzLCBuZXh0KSk7XG4gICAgfSk7XG4gICAgcm91dGVyLmRlbGV0ZShcIi9hdXRoL29hL3Nlc3Npb24vOmlkXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgICAgICByZXR1cm4gKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKCgwLCBzZXJ2aWNlXzEuZGVsZXRlU2Vzc2lvbikoc2VsZlJlYWxtLCByZXEsIHJlcywgbmV4dCkpO1xuICAgIH0pO1xuICAgIHJvdXRlci5nZXQoXCIvYXV0aC9vYS9zZXNzaW9uLzppZC9kZWNvZGVcIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgICAgIHJldHVybiAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoKDAsIHNlcnZpY2VfMS5kZWNvZGVTZXNzaW9uKShzZWxmUmVhbG0sIHJlcSwgcmVzLCBuZXh0KSk7XG4gICAgfSk7XG4gICAgcm91dGVyLmdldChcIi9hdXRoL3JlYWxtLzpyZWFsbS9zZXNzaW9uLzppZFwiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmV0dXJuICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKSgoMCwgc2VydmljZV8xLnZhbGlkYXRlU2Vzc2lvbikocmVxLnBhcmFtcy5yZWFsbSwgcmVxLCByZXMsIG5leHQpKTtcbiAgICB9KTtcbiAgICByb3V0ZXIuZ2V0KFwiL2F1dGgvcmVhbG0vOnJlYWxtL3Nlc3Npb24vOmlkL2RlY29kZVwiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmV0dXJuICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKSgoMCwgc2VydmljZV8xLmRlY29kZVNlc3Npb24pKHJlcS5wYXJhbXMucmVhbG0sIHJlcSwgcmVzLCBuZXh0KSk7XG4gICAgfSk7XG4gICAgcm91dGVyLmRlbGV0ZShcIi9hdXRoL3JlYWxtLzpyZWFsbS9zZXNzaW9uLzppZFwiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgcmV0dXJuICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKSgoMCwgc2VydmljZV8xLmRlbGV0ZVNlc3Npb24pKHJlcS5wYXJhbXMucmVhbG0sIHJlcSwgcmVzLCBuZXh0KSk7XG4gICAgfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlY29kZVNlc3Npb24gPSBleHBvcnRzLmRlY29kZVRva2VuID0gZXhwb3J0cy5kZWxldGVTZXNzaW9uID0gZXhwb3J0cy52YWxpZGF0ZVNlc3Npb24gPSBleHBvcnRzLmxvZ291dCA9IGV4cG9ydHMuaXNzdWVUb2tlbiA9IGV4cG9ydHMuc2lnbmluID0gdm9pZCAwO1xudmFyIGJjcnlwdF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJiY3J5cHRcIikpO1xudmFyIHZhbGlkYXRpb25fMSA9IHJlcXVpcmUoXCIuLi8uLi9saWIvdmFsaWRhdGlvblwiKTtcbnZhciBtb2RlbF8xID0gcmVxdWlyZShcIi4uL3VzZXIvbW9kZWxcIik7XG52YXIgSGVscGVyID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2hlbHBlclwiKSk7XG52YXIgZGJ1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uL2xpYi9kYnV0aWxzXCIpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciBzaWduaW4gPSBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBheWxvYWQsIG1vZGVsLCB1c2VyLCBvdXRjb21lLCBfYSwgc2Vzc2lvbl9pZCwgcmVmcmVzaF90b2tlbiwgYWNjZXNzX3Rva2VuO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHBheWxvYWQgPSByZXEuYm9keTtcbiAgICAgICAgICAgICAgICBpZiAoISgwLCB2YWxpZGF0aW9uXzEudmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMpKHJlcywgcGF5bG9hZCwgW1xuICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZWFsbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInJlc3BvbnNlX3R5cGVcIixcbiAgICAgICAgICAgICAgICBdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbikocGF5bG9hZC5yZWFsbSwgbW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHBheWxvYWQuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm9uZWF1dGhcIixcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXIgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBlcnJvcjogeyBtZXNzYWdlOiBcIlVzZXIgd2l0aCB0aGlzIHVzZXIgbmFtZSBkb2VzIG5vdCBleGlzdFwiIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF1c2VyLmVtYWlsX3ZlcmlmaWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAzKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBlcnJvcjogeyBtZXNzYWdlOiBcIkVtYWlsIG9mIHVzZXIgbm90IHZlcmlmaWVkXCIgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGJjcnlwdF8xLmRlZmF1bHQuY29tcGFyZShwYXlsb2FkLnBhc3N3b3JkLCB1c2VyLmhhc2gpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBvdXRjb21lID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghb3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgZXJyb3I6IHsgbWVzc2FnZTogXCJJbmNvcnJlY3QgcGFzc3dvcmRcIiB9IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmNyZWF0ZVNlc3Npb24ocGF5bG9hZC5yZWFsbSwgdXNlcildO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIF9hID0gX2Iuc2VudCgpLCBzZXNzaW9uX2lkID0gX2Euc2Vzc2lvbl9pZCwgcmVmcmVzaF90b2tlbiA9IF9hLnJlZnJlc2hfdG9rZW47XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQucmVzcG9uc2VfdHlwZSA9PT0gXCJjb2RlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZCh7IHNlc3Npb25faWQ6IHNlc3Npb25faWQgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmdldEFjY2Vzc1Rva2VuKHJlZnJlc2hfdG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW4gPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyB0b2tlbl90eXBlOiBcIkJlYXJlclwiLCBhY2Nlc3NfdG9rZW46IGFjY2Vzc190b2tlbiwgcmVmcmVzaF90b2tlbjogcmVmcmVzaF90b2tlbiB9KTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnNpZ25pbiA9IHNpZ25pbjtcbnZhciBpc3N1ZVRva2VuID0gZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXlsb2FkLCBhY2Nlc3NfdG9rZW4sIHRva2VuLCBvdXRjb21lO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHBheWxvYWQgPSByZXEuYm9keTtcbiAgICAgICAgICAgICAgICBpZiAoISgwLCB2YWxpZGF0aW9uXzEudmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMpKHJlcywgcGF5bG9hZCwgW1xuICAgICAgICAgICAgICAgICAgICBcImdyYW50X3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJyZWFsbVwiLFxuICAgICAgICAgICAgICAgICAgICBcInJlZnJlc2hfdG9rZW5cIixcbiAgICAgICAgICAgICAgICBdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIShwYXlsb2FkLmdyYW50X3R5cGUgPT09IFwicmVmcmVzaF90b2tlblwiKSkgcmV0dXJuIFszLCAyXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5nZXRBY2Nlc3NUb2tlbihwYXlsb2FkLnJlZnJlc2hfdG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW4gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZCh7IGVycm9yOiB7IG1lc3NhZ2U6IFwiUmVmcmVzaCB0b2tlbiBpbnZhbGlkIG9yIGV4cGlyZWRcIiB9IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh7IHRva2VuX3R5cGU6IFwiQmVhcmVyXCIsIGFjY2Vzc190b2tlbjogYWNjZXNzX3Rva2VuIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHRva2VuID0gcmVxLnBhcmFtcy50b2tlbjtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbildO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIG91dGNvbWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKG91dGNvbWUpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuaXNzdWVUb2tlbiA9IGlzc3VlVG9rZW47XG52YXIgbG9nb3V0ID0gZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXlsb2FkLCBvdXRjb21lO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHBheWxvYWQgPSByZXEuYm9keTtcbiAgICAgICAgICAgICAgICBpZiAoISgwLCB2YWxpZGF0aW9uXzEudmFsaWRhdGVNYW5kYXRvcnlGaWVsZHMpKHJlcywgcGF5bG9hZCwgW1wicmVhbG1cIiwgXCJyZWZyZXNoX3Rva2VuXCJdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5kZWxldGVTZXNzaW9uQnlSZWZyZXNoVG9rZW4ocGF5bG9hZC5yZWFsbSwgcGF5bG9hZC5yZWZyZXNoX3Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgb3V0Y29tZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAob3V0Y29tZS5kZWxldGVkQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZCh7IGVycm9yOiB7IG1lc3NhZ2U6IFwiSW52YWxpZCBzZXNzaW9uXCIgfSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyByZWZyZXNoX3Rva2VuOiBwYXlsb2FkLnJlZnJlc2hfdG9rZW4gfSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5sb2dvdXQgPSBsb2dvdXQ7XG52YXIgdmFsaWRhdGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtSWQsIHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXNzaW9uLCBlcnJfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLnZhbGlkYXRlU2Vzc2lvbihyZWFsbUlkLCByZXEucGFyYW1zLmlkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChcIlNlc3Npb24gbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh7IHNlc3Npb25JZDogcmVxLnBhcmFtcy5pZCwgdG9rZW46IHNlc3Npb24udG9rZW4gfSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZXJyXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgbmV4dChlcnJfMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZhbGlkYXRlU2Vzc2lvbjtcbnZhciBkZWxldGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlYWxtSWQsIHJlcSwgcmVzLCBuZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBvdXRjb21lO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci5kZWxldGVTZXNzaW9uKHNlbGZSZWFsbSwgcmVxLnBhcmFtcy5pZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIG91dGNvbWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKG91dGNvbWUuZGVsZXRlZENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoXCJTZXNzaW9uIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoeyBzZXNzaW9uSWQ6IHJlcS5wYXJhbXMuaWQgfSk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWxldGVTZXNzaW9uID0gZGVsZXRlU2Vzc2lvbjtcbnZhciBkZWNvZGVUb2tlbiA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgcmVzLnNlbmQoX19hc3NpZ24oe30sIHJlcS51c2VyKSk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuIFsyXTtcbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWNvZGVUb2tlbiA9IGRlY29kZVRva2VuO1xudmFyIGRlY29kZVNlc3Npb24gPSBmdW5jdGlvbiAocmVhbG1JZCwgcmVxLCByZXMsIG5leHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG91dGNvbWUsIGVycl8yO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVjb2RlU2Vzc2lvbihzZWxmUmVhbG0sIHJlcS5wYXJhbXMuaWQpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBvdXRjb21lID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghb3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwNCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKFwiU2Vzc2lvbiBub3QgZm91bmRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKG91dGNvbWUpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDNdO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGVycl8yID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIG5leHQoZXJyXzIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgM107XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWNvZGVTZXNzaW9uID0gZGVjb2RlU2Vzc2lvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0Q29tcGFueUJ5SWRMaXN0ID0gZXhwb3J0cy5nZXRDb21wYW55QnlSZWZlcmVuY2UgPSBleHBvcnRzLmdldENvbXBhbnkgPSBleHBvcnRzLnVwZGF0ZUNvbXBhbnkgPSB2b2lkIDA7XG52YXIgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG52YXIgT05FQVVUSF9BUEkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAxMC9hcGlcIjtcbnZhciBtb2RlbF8xID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG52YXIgZGJ1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uL2xpYi9kYnV0aWxzXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuLi9zZXF1ZW5jZS9zZXJ2aWNlXCIpO1xudmFyIHVwZGF0ZUNvbXBhbnkgPSBmdW5jdGlvbiAoZGF0YSwgdXNlcklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgcmVzcG9uc2VfMSwgcmVzcG9uc2UsIF9hLCBfYiwgX2M7XG4gICAgdmFyIF9kO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2UpIHtcbiAgICAgICAgc3dpdGNoIChfZS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLmNvbXBhbnlDb2xsZWN0aW9uLCBtb2RlbF8xLmNvbXBhbnlTY2hlbWEpO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5faWQpIHJldHVybiBbMywgMl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kQnlJZEFuZFVwZGF0ZShkYXRhLl9pZCwgX19hc3NpZ24oe30sIGRhdGEpLCB7IG5ldzogdHJ1ZSwgdXBzZXJ0OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXNwb25zZV8xID0gX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzcG9uc2VfMV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgX2IgPSAoX2EgPSBtb2RlbCkuY3JlYXRlO1xuICAgICAgICAgICAgICAgIF9jID0gW19fYXNzaWduKHt9LCBkYXRhKV07XG4gICAgICAgICAgICAgICAgX2QgPSB7fTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBzZXJ2aWNlXzEubmV4dHZhbCkoXCJjb21wYW55SWRcIildO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzQsIF9iLmFwcGx5KF9hLCBbX19hc3NpZ24uYXBwbHkodm9pZCAwLCBfYy5jb25jYXQoWyhfZC5yZWZlcmVuY2UgPSBfZS5zZW50KCksIF9kKV0pKV0pXTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBzZXJ2aWNlXzEuY3JlYXRlX3NlcXVlbmNlKShcImZyYWdtZW50SWRcIiwgbnVsbCwgMSwgcmVzcG9uc2UucmVmZXJlbmNlKV07XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzcG9uc2VdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMudXBkYXRlQ29tcGFueSA9IHVwZGF0ZUNvbXBhbnk7XG52YXIgZ2V0Q29tcGFueSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLmNvbXBhbnlDb2xsZWN0aW9uLCBtb2RlbF8xLmNvbXBhbnlTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCgpXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0Q29tcGFueSA9IGdldENvbXBhbnk7XG52YXIgZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlZmVyZW5jZSkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWw7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEuY29tcGFueUNvbGxlY3Rpb24sIG1vZGVsXzEuY29tcGFueVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgcmVmZXJlbmNlOiByZWZlcmVuY2UgfSldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRDb21wYW55QnlSZWZlcmVuY2UgPSBnZXRDb21wYW55QnlSZWZlcmVuY2U7XG52YXIgZ2V0Q29tcGFueUJ5SWRMaXN0ID0gZnVuY3Rpb24gKGlkTGlzdCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWw7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEuY29tcGFueUNvbGxlY3Rpb24sIG1vZGVsXzEuY29tcGFueVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kKHsgX2lkOiB7ICRpbjogaWRMaXN0IH0gfSldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRDb21wYW55QnlJZExpc3QgPSBnZXRDb21wYW55QnlJZExpc3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY29tcGFueUNvbGxlY3Rpb24gPSBleHBvcnRzLmNvbXBhbnlTY2hlbWEgPSB2b2lkIDA7XG52YXIgbW9uZ29vc2UgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7XG52YXIgU2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hO1xudmFyIGNvbXBhbnlTY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgICBuYW1lOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIHJlZmVyZW5jZTogeyB0eXBlOiBOdW1iZXIgfSxcbiAgICBjdXJyZW5jeTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBudW1iZXJGb3JtYXQ6IHsgdHlwZTogU3RyaW5nIH0sXG59LCB7IHRpbWVzdGFtcHM6IHRydWUgfSk7XG5leHBvcnRzLmNvbXBhbnlTY2hlbWEgPSBjb21wYW55U2NoZW1hO1xudmFyIGNvbXBhbnlDb2xsZWN0aW9uID0gXCJjb21wYW55XCI7XG5leHBvcnRzLmNvbXBhbnlDb2xsZWN0aW9uID0gY29tcGFueUNvbGxlY3Rpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBtaWRkbGV3YXJlc18xID0gcmVxdWlyZShcIi4uLy4uL21pZGRsZXdhcmVzXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3NlcnZpY2VcIik7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgcm91dGVyLnB1dChcIi9jb21wYW55XCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEudXBkYXRlQ29tcGFueSk7XG4gICAgcm91dGVyLmdldChcIi9jb21wYW55XCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuZ2V0Q29tcGFueSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlID0gZXhwb3J0cy5nZXRDb21wYW55ID0gZXhwb3J0cy51cGRhdGVDb21wYW55ID0gdm9pZCAwO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIHVzZXJJbnZpdGVTZXJ2aWNlID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi91c2VyL2ludml0ZS9zZXJ2aWNlXCIpKTtcbnZhciBQZXJtaXNzaW9uSGVscGVyID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi9wZXJtaXNzaW9uL2hlbHBlclwiKSk7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xudmFyIHVwZGF0ZUNvbXBhbnkgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVzZXJJZCwgY29tcGFueTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB1c2VySWQgPSByZXEudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLnVwZGF0ZUNvbXBhbnkocmVxLmJvZHksIHVzZXJJZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNvbXBhbnkgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgdXNlckludml0ZVNlcnZpY2UucmVnaXN0ZXJVc2VySW52aXRlKGNvbXBhbnkuX2RvYy5yZWZlcmVuY2UsIGNvbXBhbnkuX2RvYy5faWQsIHVzZXJJZCwgcmVxLnVzZXIuZW1haWwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgUGVybWlzc2lvbkhlbHBlci5hZGRSb2xlKHJlcS51c2VyLmVtYWlsLCBjb21wYW55Ll9kb2MucmVmZXJlbmNlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChjb21wYW55KTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnVwZGF0ZUNvbXBhbnkgPSB1cGRhdGVDb21wYW55O1xudmFyIGdldENvbXBhbnkgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVzZXJJZCwgY29tcGFueUxpc3Q7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgdXNlcklkID0gcmVxLnVzZXIudXNlcl9pZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5nZXRDb21wYW55KCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNvbXBhbnlMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChjb21wYW55TGlzdCk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRDb21wYW55ID0gZ2V0Q29tcGFueTtcbnZhciBnZXRDb21wYW55QnlSZWZlcmVuY2UgPSBmdW5jdGlvbiAocmVmZXJlbmNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci5nZXRDb21wYW55QnlSZWZlcmVuY2UocmVmZXJlbmNlKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldENvbXBhbnlCeVJlZmVyZW5jZSA9IGdldENvbXBhbnlCeVJlZmVyZW5jZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50cmFuc2Zvcm1Eb21haW4gPSB2b2lkIDA7XG52YXIgZXhwcmVzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzXCIpKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgcm91dGVyID0gZXhwcmVzc18xLmRlZmF1bHQuUm91dGVyKCk7XG5mdW5jdGlvbiBrZWJhYlRvQ2FtZWxDYXNlKGtlYmFiKSB7XG4gICAgcmV0dXJuIGtlYmFiLnJlcGxhY2UoLy0oW2Etel0pL2csIGZ1bmN0aW9uIChfLCBjaGFyKSB7IHJldHVybiBjaGFyLnRvVXBwZXJDYXNlKCk7IH0pO1xufVxudmFyIHRyYW5zZm9ybURvbWFpbiA9IGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICAgIGlmIChyZXEucGFyYW1zICYmIHJlcS5wYXJhbXMuZG9tYWluKSB7XG4gICAgICAgIHJlcS5wYXJhbXMuZG9tYWluID0ga2ViYWJUb0NhbWVsQ2FzZShyZXEucGFyYW1zLmRvbWFpbik7XG4gICAgfVxuICAgIG5leHQoKTtcbn07XG5leHBvcnRzLnRyYW5zZm9ybURvbWFpbiA9IHRyYW5zZm9ybURvbWFpbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHJvdXRlclxuICAgICAgICAucm91dGUoXCIvcmVzb3VyY2VzLzpzcGFjZS86ZG9tYWluXCIpXG4gICAgICAgIC5nZXQobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIGV4cG9ydHMudHJhbnNmb3JtRG9tYWluLCBzZXJ2aWNlXzEuZ2V0TWV0YSlcbiAgICAgICAgLnBvc3QobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIGV4cG9ydHMudHJhbnNmb3JtRG9tYWluLCBzZXJ2aWNlXzEuY3JlYXRlKTtcbiAgICByb3V0ZXJcbiAgICAgICAgLnJvdXRlKFwiL3Jlc291cmNlcy86c3BhY2UvOmRvbWFpbi86cmVmZXJlbmNlXCIpXG4gICAgICAgIC5nZXQobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIGV4cG9ydHMudHJhbnNmb3JtRG9tYWluLCBzZXJ2aWNlXzEuZ2V0T25lKVxuICAgICAgICAucHV0KG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBleHBvcnRzLnRyYW5zZm9ybURvbWFpbiwgc2VydmljZV8xLnVwZGF0ZSlcbiAgICAgICAgLnBhdGNoKG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBleHBvcnRzLnRyYW5zZm9ybURvbWFpbiwgc2VydmljZV8xLnBhdGNoKVxuICAgICAgICAuZGVsZXRlKG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBleHBvcnRzLnRyYW5zZm9ybURvbWFpbiwgc2VydmljZV8xLmRlbGV0ZU9uZSk7XG4gICAgcm91dGVyLnBvc3QoXCIvcmVzb3VyY2VzLzpzcGFjZS86ZG9tYWluL3NlYXJjaFwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgZXhwb3J0cy50cmFuc2Zvcm1Eb21haW4sIHNlcnZpY2VfMS5zZWFyY2gpO1xuICAgIHJvdXRlci5nZXQoXCIvaW5mZXJlbmNlL3Jlc291cmNlc1wiLCBzZXJ2aWNlXzEuaW5mZXJUeXBlcyk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbmZlclR5cGVzID0gZXhwb3J0cy5kZWxldGVPbmUgPSBleHBvcnRzLnVwZGF0ZSA9IGV4cG9ydHMucGF0Y2ggPSBleHBvcnRzLmNyZWF0ZSA9IGV4cG9ydHMuZ2V0T25lID0gZXhwb3J0cy5zZWFyY2ggPSBleHBvcnRzLmdldE1ldGEgPSBleHBvcnRzLmNoZWNrUGFyZW50UmVmZXJlbmNlcyA9IHZvaWQgMDtcbnZhciBuYW5vaWRfMSA9IHJlcXVpcmUoXCJuYW5vaWRcIik7XG52YXIgZGJ1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2xpYi9kYnV0aWxzXCIpO1xudmFyIHNjaGVtYVZhbGlkYXRvcl8xID0gcmVxdWlyZShcIi4uL3V0aWxzL3NjaGVtYVZhbGlkYXRvclwiKTtcbnZhciBzcGVjUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuLi9zcGVjcy9zcGVjUmVnaXN0cnlcIik7XG52YXIgZmlsdGVyQnVpbGRlcl8xID0gcmVxdWlyZShcIi4uL2ZpbHRlckJ1aWxkZXJcIik7XG52YXIgdHlwZUluZmVyZW5jZV8xID0gcmVxdWlyZShcIi4uL3V0aWxzL3R5cGVJbmZlcmVuY2VcIik7XG52YXIgYWxwaGFudW1lcmljQWxwaGFiZXQgPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xudmFyIG5hbm9pZCA9ICgwLCBuYW5vaWRfMS5jdXN0b21BbHBoYWJldCkoYWxwaGFudW1lcmljQWxwaGFiZXQsIDgpO1xudmFyIGNoZWNrUGFyZW50UmVmZXJlbmNlcyA9IGZ1bmN0aW9uIChzaGFwZWREYXRhXzEsIHNwZWNfMSwgc3BhY2VfMSwgcmVzXzEpIHtcbiAgICB2YXIgYXJnc18xID0gW107XG4gICAgZm9yICh2YXIgX2kgPSA0OyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgYXJnc18xW19pIC0gNF0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgX19zcHJlYWRBcnJheShbc2hhcGVkRGF0YV8xLCBzcGVjXzEsIHNwYWNlXzEsIHJlc18xXSwgYXJnc18xLCB0cnVlKSwgdm9pZCAwLCBmdW5jdGlvbiAoc2hhcGVkRGF0YSwgc3BlYywgc3BhY2UsIHJlcywgcGF0aCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIGZpZWxkTmFtZSwgZmllbGRTcGVjLCB2YWx1ZSwgZnVsbFBhdGgsIHBhcmVudE1vZGVsLCBmb3VuZCwgb2ssIGl0ZW1GaWVsZHMsIGksIGl0ZW0sIGl0ZW1QYXRoLCBvaywgcGFyZW50TW9kZWwsIGZvdW5kO1xuICAgICAgICB2YXIgX2UsIF9mO1xuICAgICAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSBcIlwiOyB9XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2cpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2cubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9hID0gc3BlYy5maWVsZHM7XG4gICAgICAgICAgICAgICAgICAgIF9iID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAoX2MgaW4gX2EpXG4gICAgICAgICAgICAgICAgICAgICAgICBfYi5wdXNoKF9jKTtcbiAgICAgICAgICAgICAgICAgICAgX2QgPSAwO1xuICAgICAgICAgICAgICAgICAgICBfZy5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShfZCA8IF9iLmxlbmd0aCkpIHJldHVybiBbMywgMTJdO1xuICAgICAgICAgICAgICAgICAgICBfYyA9IF9iW19kXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2MgaW4gX2EpKSByZXR1cm4gWzMsIDExXTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lID0gX2M7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkU3BlYyA9IHNwZWMuZmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2hhcGVkRGF0YSA9PT0gbnVsbCB8fCBzaGFwZWREYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzaGFwZWREYXRhW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGZ1bGxQYXRoID0gcGF0aCA/IFwiXCIuY29uY2F0KHBhdGgsIFwiLlwiKS5jb25jYXQoZmllbGROYW1lKSA6IGZpZWxkTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDExXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoJ3BhcmVudCcgaW4gZmllbGRTcGVjKSkgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoW1wic3RyaW5nXCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkU3BlYy50eXBlKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRTcGVjLnBhcmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykpIHJldHVybiBbMywgM107XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZmllbGRTcGVjLnBhcmVudC5kb21haW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIHBhcmVudE1vZGVsLmZpbmRPbmUoKF9lID0ge30sIF9lW2ZpZWxkU3BlYy5wYXJlbnQuZmllbGRdID0gdmFsdWUsIF9lKSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBfZy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogXCJJbnZhbGlkIHBhcmVudCByZWZlcmVuY2UgJ1wiLmNvbmNhdCh2YWx1ZSwgXCInIGZvciAnXCIpLmNvbmNhdChmdWxsUGF0aCwgXCInIGluIGRvbWFpbiAnXCIpLmNvbmNhdChmaWVsZFNwZWMucGFyZW50LmRvbWFpbiwgXCInLCBmaWVsZCAnXCIpLmNvbmNhdChmaWVsZFNwZWMucGFyZW50LmZpZWxkLCBcIidcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBmYWxzZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2cubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZmllbGRTcGVjLnR5cGUgPT09ICdvYmplY3QnKSkgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5jaGVja1BhcmVudFJlZmVyZW5jZXMpKHZhbHVlLCB7IGZpZWxkczogZmllbGRTcGVjLmZpZWxkcyB9LCBzcGFjZSwgcmVzLCBmdWxsUGF0aCldO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgb2sgPSBfZy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2spXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgX2cubGFiZWwgPSA1O1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZmllbGRTcGVjLnR5cGUgPT09ICdhcnJheScgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpKSByZXR1cm4gWzMsIDExXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUZpZWxkcyA9IGZpZWxkU3BlYy5maWVsZHM7XG4gICAgICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICBfZy5sYWJlbCA9IDY7XG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShpIDwgdmFsdWUubGVuZ3RoKSkgcmV0dXJuIFszLCAxMV07XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSB2YWx1ZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVBhdGggPSBcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCJbXCIpLmNvbmNhdChpLCBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGZpZWxkU3BlYy5pdGVtVHlwZSA9PT0gJ29iamVjdCcgJiYgaXRlbUZpZWxkcykpIHJldHVybiBbMywgOF07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgKDAsIGV4cG9ydHMuY2hlY2tQYXJlbnRSZWZlcmVuY2VzKShpdGVtLCB7IGZpZWxkczogaXRlbUZpZWxkcyB9LCBzcGFjZSwgcmVzLCBpdGVtUGF0aCldO1xuICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgb2sgPSBfZy5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2spXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgX2cubGFiZWwgPSA4O1xuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoW1wic3RyaW5nXCIsIFwibnVtYmVyXCJdLmluY2x1ZGVzKGZpZWxkU3BlYy5pdGVtVHlwZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkU3BlYy5wYXJlbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKSkgcmV0dXJuIFszLCAxMF07XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZmllbGRTcGVjLnBhcmVudC5kb21haW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIHBhcmVudE1vZGVsLmZpbmRPbmUoKF9mID0ge30sIF9mW2ZpZWxkU3BlYy5wYXJlbnQuZmllbGRdID0gaXRlbSwgX2YpKV07XG4gICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IF9nLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBcIkludmFsaWQgcGFyZW50IHJlZmVyZW5jZSAnXCIuY29uY2F0KGl0ZW0sIFwiJyBmb3IgJ1wiKS5jb25jYXQoaXRlbVBhdGgsIFwiJyBpbiBkb21haW4gJ1wiKS5jb25jYXQoZmllbGRTcGVjLnBhcmVudC5kb21haW4sIFwiJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfZy5sYWJlbCA9IDEwO1xuICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgICAgICAgICBfZCsrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDFdO1xuICAgICAgICAgICAgICAgIGNhc2UgMTI6IHJldHVybiBbMiwgdHJ1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmV4cG9ydHMuY2hlY2tQYXJlbnRSZWZlcmVuY2VzID0gY2hlY2tQYXJlbnRSZWZlcmVuY2VzO1xuZnVuY3Rpb24gcmVvcmRlcldpdGhpbkdyb3VwKE1vZGVsLCByZWZlcmVuY2UsIGdyb3VwRmlsdGVyLCBvbGRPcmRlciwgbmV3T3JkZXIpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKG5ld09yZGVyID4gb2xkT3JkZXIpKSByZXR1cm4gWzMsIDJdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLnVwZGF0ZU1hbnkoX19hc3NpZ24oX19hc3NpZ24oe30sIGdyb3VwRmlsdGVyKSwgeyBvcmRlcjogeyAkZ3Q6IG9sZE9yZGVyLCAkbHRlOiBuZXdPcmRlciB9IH0pLCB7ICRpbmM6IHsgb3JkZXI6IC0xIH0gfSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFs0LCBNb2RlbC51cGRhdGVNYW55KF9fYXNzaWduKF9fYXNzaWduKHt9LCBncm91cEZpbHRlciksIHsgb3JkZXI6IHsgJGx0OiBvbGRPcmRlciwgJGd0ZTogbmV3T3JkZXIgfSB9KSwgeyAkaW5jOiB7IG9yZGVyOiAxIH0gfSldO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzQsIE1vZGVsLnVwZGF0ZU9uZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0sIHsgb3JkZXI6IG5ld09yZGVyIH0pXTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG52YXIgZ2V0TWV0YSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIHNwZWMsIHN1cHBvcnRlZEhvb2tzLCBlbmRwb2ludHMsIG1ldGE7XG4gICAgdmFyIF9iO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW47XG4gICAgICAgIHNwZWMgPSAoMCwgc3BlY1JlZ2lzdHJ5XzEuZ2V0U3BlY0J5TmFtZSkoZG9tYWluKTtcbiAgICAgICAgaWYgKCFzcGVjKVxuICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIkRvbWFpbiAoXCIuY29uY2F0KGRvbWFpbiwgXCIpIGRvZXMgbm90IGV4aXN0c1wiKSB9KV07XG4gICAgICAgIHN1cHBvcnRlZEhvb2tzID0gT2JqZWN0LmtleXMoKChfYiA9IHNwZWMubWV0YSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmhvb2tzKSB8fCB7fSk7XG4gICAgICAgIGVuZHBvaW50cyA9IFtcbiAgICAgICAgICAgIFwiR0VUIC9hcGkvXCIuY29uY2F0KGRvbWFpbiwgXCIvbWV0YVwiKSxcbiAgICAgICAgICAgIFwiUE9TVCAvYXBpL1wiLmNvbmNhdChkb21haW4sIFwiL3NlYXJjaFwiKSxcbiAgICAgICAgICAgIFwiR0VUIC9hcGkvXCIuY29uY2F0KGRvbWFpbiwgXCIvOmlkXCIpLFxuICAgICAgICAgICAgXCJQT1NUIC9hcGkvXCIuY29uY2F0KGRvbWFpbiksXG4gICAgICAgICAgICBcIlBBVENIIC9hcGkvXCIuY29uY2F0KGRvbWFpbiwgXCIvOmlkXCIpLFxuICAgICAgICAgICAgXCJQVVQgL2FwaS9cIi5jb25jYXQoZG9tYWluLCBcIi86aWRcIiksXG4gICAgICAgICAgICBcIkRFTEVURSAvYXBpL1wiLmNvbmNhdChkb21haW4sIFwiLzppZFwiKVxuICAgICAgICBdO1xuICAgICAgICBtZXRhID0ge1xuICAgICAgICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICAgICAgICBmaWVsZHM6IHNwZWMuZmllbGRzLFxuICAgICAgICAgICAgZW5kcG9pbnRzOiBlbmRwb2ludHNcbiAgICAgICAgfTtcbiAgICAgICAgcmVzLmpzb24obWV0YSk7XG4gICAgICAgIHJldHVybiBbMl07XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0TWV0YSA9IGdldE1ldGE7XG52YXIgc2VhcmNoID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgc3BlYywgX2IsIF9jLCBmaWx0ZXJzLCBfZCwgcGFnaW5hdGlvbiwgX2UsIHNvcnQsIHBhZ2UsIGxpbWl0LCBNb2RlbCwgbW9uZ29RdWVyeSwgbW9uZ29Tb3J0LCBkb2NzLCB0b3RhbCwgc2hhcGVkLCBlcnJfMTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9mKSB7XG4gICAgICAgIHN3aXRjaCAoX2YubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbjtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNwZWNSZWdpc3RyeV8xLmdldFNwZWNCeU5hbWUpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgaWYgKCFzcGVjKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiRG9tYWluIChcIi5jb25jYXQoZG9tYWluLCBcIikgZG9lcyBub3QgZXhpc3RcIikgfSldO1xuICAgICAgICAgICAgICAgIF9mLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfZi50cnlzLnB1c2goWzEsIDQsICwgNV0pO1xuICAgICAgICAgICAgICAgIF9iID0gcmVxLmJvZHksIF9jID0gX2IuZmlsdGVycywgZmlsdGVycyA9IF9jID09PSB2b2lkIDAgPyB7fSA6IF9jLCBfZCA9IF9iLnBhZ2luYXRpb24sIHBhZ2luYXRpb24gPSBfZCA9PT0gdm9pZCAwID8ge30gOiBfZCwgX2UgPSBfYi5zb3J0LCBzb3J0ID0gX2UgPT09IHZvaWQgMCA/IHt9IDogX2U7XG4gICAgICAgICAgICAgICAgcGFnZSA9IE1hdGgubWF4KDEsICtwYWdpbmF0aW9uLnBhZ2UgfHwgMSk7XG4gICAgICAgICAgICAgICAgbGltaXQgPSBNYXRoLm1heCgxLCArcGFnaW5hdGlvbi5saW1pdCB8fCAxMCk7XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIG1vbmdvUXVlcnkgPSAoMCwgZmlsdGVyQnVpbGRlcl8xLmJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzKShmaWx0ZXJzLCBzcGVjKTtcbiAgICAgICAgICAgICAgICBtb25nb1NvcnQgPSAoMCwgZmlsdGVyQnVpbGRlcl8xLmJ1aWxkU29ydFF1ZXJ5KShzb3J0KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlF1ZXJ5OlwiLCBtb25nb1F1ZXJ5KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNvcnQ6XCIsIG1vbmdvU29ydCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kKG1vbmdvUXVlcnkpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc29ydChtb25nb1NvcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2tpcCgocGFnZSAtIDEpICogbGltaXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGltaXQobGltaXQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkb2NzID0gX2Yuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuY291bnREb2N1bWVudHMobW9uZ29RdWVyeSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHRvdGFsID0gX2Yuc2VudCgpO1xuICAgICAgICAgICAgICAgIHNoYXBlZCA9IGRvY3MubWFwKGZ1bmN0aW9uIChkb2MpIHsgcmV0dXJuICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5maWxsTWlzc2luZ0ZpZWxkcykoZG9jLnRvT2JqZWN0KCksIHNwZWMpOyB9KTtcbiAgICAgICAgICAgICAgICByZXMuanNvbih7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHNoYXBlZCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHRvdGFsLFxuICAgICAgICAgICAgICAgICAgICBwYWdlOiBwYWdlLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbCAvIGxpbWl0KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgZXJyXzEgPSBfZi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJTZWFyY2ggZmFpbGVkXCIsIGRldGFpbHM6IGVycl8xLm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnNlYXJjaCA9IHNlYXJjaDtcbnZhciBnZXRPbmUgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCByZWZlcmVuY2UsIHNwZWMsIE1vZGVsLCBkb2M7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW4sIHJlZmVyZW5jZSA9IF9hLnJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNwZWNSZWdpc3RyeV8xLmdldFNwZWNCeU5hbWUpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgaWYgKCFzcGVjKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiRG9tYWluIChcIi5jb25jYXQoZG9tYWluLCBcIikgZG9lcyBub3QgZXhpc3RzXCIpIH0pXTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kT25lKHsgcmVmZXJlbmNlOiByZWZlcmVuY2UgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGRvYyA9IF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk5vdCBmb3VuZFwiIH0pXTtcbiAgICAgICAgICAgICAgICByZXMuanNvbigoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldE9uZSA9IGdldE9uZTtcbnZhciBjcmVhdGUgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCBwYXlsb2FkLCB1c2VySWQsIHNwZWMsIF9iLCB2YWxpZCwgc2hhcGVkRGF0YU9yaWdpbmFsLCBlcnJvcnMsIHNoYXBlZERhdGEsIGhvb2tzLCBob29rUmVzcG9uc2UsIG9rLCBNb2RlbCwgZ3JvdXBGaWx0ZXIsIF9pLCBfYywgZmllbGQsIGxhc3RJbkdyb3VwLCBtYXhPcmRlciwgdGltZXN0YW1wLCBkb2M7XG4gICAgdmFyIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfaykge1xuICAgICAgICBzd2l0Y2ggKF9rLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW47XG4gICAgICAgICAgICAgICAgcGF5bG9hZCA9IHJlcS5ib2R5O1xuICAgICAgICAgICAgICAgIHVzZXJJZCA9IChfZCA9IHJlcS51c2VyKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QudXNlcl9pZDtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNwZWNSZWdpc3RyeV8xLmdldFNwZWNCeU5hbWUpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgaWYgKCFzcGVjKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiRG9tYWluIChcIi5jb25jYXQoZG9tYWluLCBcIikgZG9lcyBub3QgZXhpc3RzXCIpIH0pXTtcbiAgICAgICAgICAgICAgICBfYiA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCkocGF5bG9hZCwgc3BlYyksIHZhbGlkID0gX2IudmFsaWQsIHNoYXBlZERhdGFPcmlnaW5hbCA9IF9iLnNoYXBlZERhdGEsIGVycm9ycyA9IF9iLmVycm9ycztcbiAgICAgICAgICAgICAgICBzaGFwZWREYXRhID0gc2hhcGVkRGF0YU9yaWdpbmFsO1xuICAgICAgICAgICAgICAgIGlmICghdmFsaWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJWYWxpZGF0aW9uIGZhaWxlZFwiLCBkZXRhaWxzOiBlcnJvcnMgfSldO1xuICAgICAgICAgICAgICAgIGhvb2tzID0gKF9lID0gc3BlYy5tZXRhKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuaG9va3M7XG4gICAgICAgICAgICAgICAgaWYgKCEoaG9va3MgPT09IG51bGwgfHwgaG9va3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGhvb2tzLmJlZm9yZUNyZWF0ZSkpIHJldHVybiBbMywgMl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBob29rcy5iZWZvcmVDcmVhdGUoc2hhcGVkRGF0YU9yaWdpbmFsLCB7IHNwYWNlOiBzcGFjZSwgZG9tYWluOiBkb21haW4sIG9wZXJhdGlvbjogXCJjcmVhdGVcIiwgdXNlcklkOiB1c2VySWQgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGhvb2tSZXNwb25zZSA9IF9rLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaG9va1Jlc3BvbnNlLmVycm9ycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVmFsaWRhdGlvbiBmYWlsZWRcIiwgZGV0YWlsczogaG9va1Jlc3BvbnNlLmVycm9ycyB9KV07XG4gICAgICAgICAgICAgICAgc2hhcGVkRGF0YSA9IGhvb2tSZXNwb25zZS5kb2M7XG4gICAgICAgICAgICAgICAgX2subGFiZWwgPSAyO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzQsICgwLCBleHBvcnRzLmNoZWNrUGFyZW50UmVmZXJlbmNlcykoc2hhcGVkRGF0YSwgc3BlYywgc3BhY2UsIHJlcyldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIG9rID0gX2suc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghb2spXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIGlmICghKChfZyA9IChfZiA9IHNwZWMubWV0YSkgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLm9yZGVyaW5nKSA9PT0gbnVsbCB8fCBfZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2cubGVuZ3RoKSkgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgICAgICBncm91cEZpbHRlciA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfYyA9IHNwZWMubWV0YS5vcmRlcmluZzsgX2kgPCBfYy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQgPSBfY1tfaV07XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwRmlsdGVyW2ZpZWxkXSA9IHNoYXBlZERhdGFbZmllbGRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmZpbmQoZ3JvdXBGaWx0ZXIpLnNvcnQoeyBvcmRlcjogLTEgfSkubGltaXQoMSldO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGxhc3RJbkdyb3VwID0gX2suc2VudCgpO1xuICAgICAgICAgICAgICAgIG1heE9yZGVyID0gKF9qID0gKF9oID0gbGFzdEluR3JvdXBbMF0pID09PSBudWxsIHx8IF9oID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfaC5vcmRlcikgIT09IG51bGwgJiYgX2ogIT09IHZvaWQgMCA/IF9qIDogMDtcbiAgICAgICAgICAgICAgICBzaGFwZWREYXRhLm9yZGVyID0gbWF4T3JkZXIgKyAxO1xuICAgICAgICAgICAgICAgIF9rLmxhYmVsID0gNTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGRvYyA9IG5ldyBNb2RlbChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc2hhcGVkRGF0YSksIHsgcmVmZXJlbmNlOiBuYW5vaWQoKSwgY3JlYXRlZEF0OiB0aW1lc3RhbXAsIHVwZGF0ZWRBdDogdGltZXN0YW1wLCBjcmVhdGVkQnk6IHVzZXJJZCwgdXBkYXRlZEJ5OiB1c2VySWQgfSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgZG9jLnNhdmUoKV07XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgX2suc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKCgwLCBzY2hlbWFWYWxpZGF0b3JfMS5maWxsTWlzc2luZ0ZpZWxkcykoZG9jLnRvT2JqZWN0KCksIHNwZWMpKTtcbiAgICAgICAgICAgICAgICBpZiAoaG9va3MgPT09IG51bGwgfHwgaG9va3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGhvb2tzLmFmdGVyQ3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGhvb2tzLmFmdGVyQ3JlYXRlKGRvYy50b09iamVjdCgpLCB7IHNwYWNlOiBzcGFjZSwgZG9tYWluOiBkb21haW4sIG9wZXJhdGlvbjogXCJjcmVhdGVcIiwgdXNlcklkOiB1c2VySWQgfSkuY2F0Y2goY29uc29sZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGU7XG52YXIgcGF0Y2ggPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCByZWZlcmVuY2UsIHBheWxvYWQsIHVzZXJJZCwgc3BlYywgX2IsIHZhbGlkLCBzaGFwZWREYXRhT3JpZ2luYWwsIGVycm9ycywgc2hhcGVkRGF0YSwgaG9va3MsIGhvb2tSZXNwb25zZSwgb2ssIE1vZGVsLCBvbGREb2MsIG9sZE9yZGVyLCBuZXdPcmRlciwgZ3JvdXBGaWx0ZXIsIF9pLCBfYywgZmllbGQsIHVwZGF0ZWQ7XG4gICAgdmFyIF9kLCBfZSwgX2YsIF9nO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2gpIHtcbiAgICAgICAgc3dpdGNoIChfaC5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluLCByZWZlcmVuY2UgPSBfYS5yZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgcGF5bG9hZCA9IHJlcS5ib2R5O1xuICAgICAgICAgICAgICAgIHVzZXJJZCA9IChfZCA9IHJlcS51c2VyKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QudXNlcl9pZDtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNwZWNSZWdpc3RyeV8xLmdldFNwZWNCeU5hbWUpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgaWYgKCFzcGVjKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiRG9tYWluIChcIi5jb25jYXQoZG9tYWluLCBcIikgZG9lcyBub3QgZXhpc3RzXCIpIH0pXTtcbiAgICAgICAgICAgICAgICBfYiA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCkocGF5bG9hZCwgc3BlYywgXCJcIiwgeyBhbGxvd1BhcnRpYWw6IHRydWUgfSksIHZhbGlkID0gX2IudmFsaWQsIHNoYXBlZERhdGFPcmlnaW5hbCA9IF9iLnNoYXBlZERhdGEsIGVycm9ycyA9IF9iLmVycm9ycztcbiAgICAgICAgICAgICAgICBpZiAoIXZhbGlkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVmFsaWRhdGlvbiBmYWlsZWRcIiwgZGV0YWlsczogZXJyb3JzIH0pXTtcbiAgICAgICAgICAgICAgICBzaGFwZWREYXRhID0gc2hhcGVkRGF0YU9yaWdpbmFsO1xuICAgICAgICAgICAgICAgIGhvb2tzID0gKF9lID0gc3BlYy5tZXRhKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuaG9va3M7XG4gICAgICAgICAgICAgICAgaWYgKCEoaG9va3MgPT09IG51bGwgfHwgaG9va3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGhvb2tzLmJlZm9yZVBhdGNoKSkgcmV0dXJuIFszLCAyXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGhvb2tzLmJlZm9yZVBhdGNoKHNoYXBlZERhdGFPcmlnaW5hbCwgeyBzcGFjZTogc3BhY2UsIGRvbWFpbjogZG9tYWluLCBvcGVyYXRpb246IFwiY3JlYXRlXCIsIHVzZXJJZDogdXNlcklkIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBob29rUmVzcG9uc2UgPSBfaC5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2tSZXNwb25zZS5lcnJvcnMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBcIlZhbGlkYXRpb24gZmFpbGVkXCIsIGRldGFpbHM6IGhvb2tSZXNwb25zZS5lcnJvcnMgfSldO1xuICAgICAgICAgICAgICAgIHNoYXBlZERhdGEgPSBob29rUmVzcG9uc2UuZG9jO1xuICAgICAgICAgICAgICAgIF9oLmxhYmVsID0gMjtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5jaGVja1BhcmVudFJlZmVyZW5jZXMpKHNoYXBlZERhdGEsIHNwZWMsIHNwYWNlLCByZXMpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBvayA9IF9oLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIW9rKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICBpZiAoISgoKF9nID0gKF9mID0gc3BlYy5tZXRhKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Yub3JkZXJpbmcpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5sZW5ndGgpICYmIHNoYXBlZERhdGEub3JkZXIgIT09IHVuZGVmaW5lZCkpIHJldHVybiBbMywgNl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kT25lKHsgcmVmZXJlbmNlOiByZWZlcmVuY2UgfSldO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIG9sZERvYyA9IF9oLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBvbGRPcmRlciA9IG9sZERvYyA9PT0gbnVsbCB8fCBvbGREb2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9sZERvYy5vcmRlcjtcbiAgICAgICAgICAgICAgICBuZXdPcmRlciA9IHNoYXBlZERhdGEub3JkZXI7XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3T3JkZXIgIT09IG9sZE9yZGVyKSkgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgICAgICBncm91cEZpbHRlciA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfYyA9IHNwZWMubWV0YS5vcmRlcmluZzsgX2kgPCBfYy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQgPSBfY1tfaV07XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwRmlsdGVyW2ZpZWxkXSA9IG9sZERvY1tmaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgcmVvcmRlcldpdGhpbkdyb3VwKE1vZGVsLCByZWZlcmVuY2UsIGdyb3VwRmlsdGVyLCBvbGRPcmRlciwgbmV3T3JkZXIpXTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBfaC5zZW50KCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHNoYXBlZERhdGEub3JkZXI7XG4gICAgICAgICAgICAgICAgX2gubGFiZWwgPSA2O1xuICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzQsIE1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyByZWZlcmVuY2U6IHJlZmVyZW5jZSB9LCB7ICRzZXQ6IHNoYXBlZERhdGEgfSwgeyBuZXc6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgIHVwZGF0ZWQgPSBfaC5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiTm90IGZvdW5kXCIgfSldO1xuICAgICAgICAgICAgICAgIHJlcy5qc29uKHVwZGF0ZWQpO1xuICAgICAgICAgICAgICAgIGlmIChob29rcyA9PT0gbnVsbCB8fCBob29rcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogaG9va3MuYWZ0ZXJQYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBob29rcy5hZnRlclBhdGNoKHVwZGF0ZWQudG9PYmplY3QoKSwgeyBzcGFjZTogc3BhY2UsIGRvbWFpbjogZG9tYWluLCBvcGVyYXRpb246IFwicGF0Y2hcIiwgdXNlcklkOiB1c2VySWQgfSkuY2F0Y2goY29uc29sZS5lcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5wYXRjaCA9IHBhdGNoO1xudmFyIHVwZGF0ZSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIHJlZmVyZW5jZSwgcGF5bG9hZCwgdXNlcklkLCBzcGVjLCBfYiwgdmFsaWQsIHNoYXBlZERhdGFPcmlnaW5hbCwgZXJyb3JzLCBzaGFwZWREYXRhLCBob29rcywgaG9va1Jlc3BvbnNlLCBvaywgTW9kZWwsIG9sZERvYywgb2xkT3JkZXIsIG5ld09yZGVyLCBncm91cEZpbHRlciwgX2ksIF9jLCBmaWVsZCwgdXBkYXRlZDtcbiAgICB2YXIgX2QsIF9lLCBfZiwgX2c7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfaCkge1xuICAgICAgICBzd2l0Y2ggKF9oLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW4sIHJlZmVyZW5jZSA9IF9hLnJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVxLmJvZHk7XG4gICAgICAgICAgICAgICAgdXNlcklkID0gKF9kID0gcmVxLnVzZXIpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHNwZWMgPSAoMCwgc3BlY1JlZ2lzdHJ5XzEuZ2V0U3BlY0J5TmFtZSkoZG9tYWluKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNwZWMpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJEb21haW4gKFwiLmNvbmNhdChkb21haW4sIFwiKSBkb2VzIG5vdCBleGlzdHNcIikgfSldO1xuICAgICAgICAgICAgICAgIF9iID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLnZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkKShwYXlsb2FkLCBzcGVjKSwgdmFsaWQgPSBfYi52YWxpZCwgc2hhcGVkRGF0YU9yaWdpbmFsID0gX2Iuc2hhcGVkRGF0YSwgZXJyb3JzID0gX2IuZXJyb3JzO1xuICAgICAgICAgICAgICAgIHNoYXBlZERhdGEgPSBzaGFwZWREYXRhT3JpZ2luYWw7XG4gICAgICAgICAgICAgICAgaG9va3MgPSAoX2UgPSBzcGVjLm1ldGEpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5ob29rcztcbiAgICAgICAgICAgICAgICBpZiAoIShob29rcyA9PT0gbnVsbCB8fCBob29rcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogaG9va3MuYmVmb3JlVXBkYXRlKSkgcmV0dXJuIFszLCAyXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGhvb2tzLmJlZm9yZVVwZGF0ZShzaGFwZWREYXRhT3JpZ2luYWwsIHsgc3BhY2U6IHNwYWNlLCBkb21haW46IGRvbWFpbiwgb3BlcmF0aW9uOiBcImNyZWF0ZVwiLCB1c2VySWQ6IHVzZXJJZCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgaG9va1Jlc3BvbnNlID0gX2guc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChob29rUmVzcG9uc2UuZXJyb3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJWYWxpZGF0aW9uIGZhaWxlZFwiLCBkZXRhaWxzOiBob29rUmVzcG9uc2UuZXJyb3JzIH0pXTtcbiAgICAgICAgICAgICAgICBzaGFwZWREYXRhID0gaG9va1Jlc3BvbnNlLmRvYztcbiAgICAgICAgICAgICAgICBfaC5sYWJlbCA9IDI7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCF2YWxpZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiBcIlZhbGlkYXRpb24gZmFpbGVkXCIsIGRldGFpbHM6IGVycm9ycyB9KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5jaGVja1BhcmVudFJlZmVyZW5jZXMpKHNoYXBlZERhdGEsIHNwZWMsIHNwYWNlLCByZXMpXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBvayA9IF9oLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIW9rKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICBpZiAoISgoKF9nID0gKF9mID0gc3BlYy5tZXRhKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Yub3JkZXJpbmcpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5sZW5ndGgpICYmIHNoYXBlZERhdGEub3JkZXIgIT09IHVuZGVmaW5lZCkpIHJldHVybiBbMywgNl07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kT25lKHsgcmVmZXJlbmNlOiByZWZlcmVuY2UgfSldO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIG9sZERvYyA9IF9oLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBvbGRPcmRlciA9IG9sZERvYyA9PT0gbnVsbCB8fCBvbGREb2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9sZERvYy5vcmRlcjtcbiAgICAgICAgICAgICAgICBuZXdPcmRlciA9IHNoYXBlZERhdGEub3JkZXI7XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3T3JkZXIgIT09IG9sZE9yZGVyKSkgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgICAgICBncm91cEZpbHRlciA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfYyA9IHNwZWMubWV0YS5vcmRlcmluZzsgX2kgPCBfYy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQgPSBfY1tfaV07XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwRmlsdGVyW2ZpZWxkXSA9IG9sZERvY1tmaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgcmVvcmRlcldpdGhpbkdyb3VwKE1vZGVsLCByZWZlcmVuY2UsIGdyb3VwRmlsdGVyLCBvbGRPcmRlciwgbmV3T3JkZXIpXTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBfaC5zZW50KCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHNoYXBlZERhdGEub3JkZXI7XG4gICAgICAgICAgICAgICAgX2gubGFiZWwgPSA2O1xuICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzQsIE1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyByZWZlcmVuY2U6IHJlZmVyZW5jZSB9LCBzaGFwZWREYXRhLCB7IG5ldzogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9IF9oLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXVwZGF0ZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJOb3QgZm91bmRcIiB9KV07XG4gICAgICAgICAgICAgICAgcmVzLmpzb24odXBkYXRlZCk7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2tzID09PSBudWxsIHx8IGhvb2tzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBob29rcy5hZnRlclVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBob29rcy5hZnRlclVwZGF0ZSh1cGRhdGVkLnRvT2JqZWN0KCksIHsgc3BhY2U6IHNwYWNlLCBkb21haW46IGRvbWFpbiwgb3BlcmF0aW9uOiBcInVwZGF0ZVwiLCB1c2VySWQ6IHVzZXJJZCB9KS5jYXRjaChjb25zb2xlLmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnVwZGF0ZSA9IHVwZGF0ZTtcbnZhciBkZWxldGVPbmUgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCByZWZlcmVuY2UsIHNwZWMsIE1vZGVsLCBleGlzdGluZywgY2hpbGRyZW4sIF9pLCBjaGlsZHJlbl8xLCBjaGlsZCwgY2hpbGREb21haW4sIGZpZWxkLCBjYXNjYWRlRGVsZXRlLCBwYXJlbnRGaWVsZCwgY2hpbGRGaWVsZCwgcGFyZW50VmFsdWUsIENoaWxkTW9kZWwsIGRlcGVuZGVudDtcbiAgICB2YXIgX2IsIF9jO1xuICAgIHZhciBfZDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9lKSB7XG4gICAgICAgIHN3aXRjaCAoX2UubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbiwgcmVmZXJlbmNlID0gX2EucmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIHNwZWMgPSAoMCwgc3BlY1JlZ2lzdHJ5XzEuZ2V0U3BlY0J5TmFtZSkoZG9tYWluKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNwZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIkRvbWFpbiAoXCIuY29uY2F0KGRvbWFpbiwgXCIpIGRvZXMgbm90IGV4aXN0XCIpIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuZmluZE9uZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBleGlzdGluZyA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJOb3QgZm91bmRcIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gKChfZCA9IHNwZWMubWV0YSkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmNoaWxkcmVuKSB8fCBbXTtcbiAgICAgICAgICAgICAgICBfaSA9IDAsIGNoaWxkcmVuXzEgPSBjaGlsZHJlbjtcbiAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDI7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCEoX2kgPCBjaGlsZHJlbl8xLmxlbmd0aCkpIHJldHVybiBbMywgN107XG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjaGlsZHJlbl8xW19pXTtcbiAgICAgICAgICAgICAgICBjaGlsZERvbWFpbiA9IGNoaWxkLmRvbWFpbiwgZmllbGQgPSBjaGlsZC5maWVsZCwgY2FzY2FkZURlbGV0ZSA9IGNoaWxkLmNhc2NhZGVEZWxldGU7XG4gICAgICAgICAgICAgICAgcGFyZW50RmllbGQgPSBmaWVsZC5wYXJlbnQsIGNoaWxkRmllbGQgPSBmaWVsZC5jaGlsZDtcbiAgICAgICAgICAgICAgICBwYXJlbnRWYWx1ZSA9IGV4aXN0aW5nW3BhcmVudEZpZWxkXTtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50VmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgICAgICBDaGlsZE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgY2hpbGREb21haW4pO1xuICAgICAgICAgICAgICAgIGlmICghY2FzY2FkZURlbGV0ZSkgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIENoaWxkTW9kZWwuZGVsZXRlTWFueSgoX2IgPSB7fSwgX2JbY2hpbGRGaWVsZF0gPSBwYXJlbnRWYWx1ZSwgX2IpKV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgNl07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbNCwgQ2hpbGRNb2RlbC5maW5kT25lKChfYyA9IHt9LCBfY1tjaGlsZEZpZWxkXSA9IHBhcmVudFZhbHVlLCBfYykpXTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBkZXBlbmRlbnQgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogXCJDYW5ub3QgZGVsZXRlIFwiLmNvbmNhdChkb21haW4sIFwiLlwiKS5jb25jYXQocmVmZXJlbmNlLCBcIiBiZWNhdXNlIGl0cyB2YWx1ZSAnXCIpLmNvbmNhdChwYXJlbnRWYWx1ZSwgXCInIGluICdcIikuY29uY2F0KHBhcmVudEZpZWxkLCBcIicgaXMgcmVmZXJlbmNlZCBpbiBcIikuY29uY2F0KGNoaWxkRG9tYWluLCBcIi5cIikuY29uY2F0KGNoaWxkRmllbGQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDY7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgX2krKztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDJdO1xuICAgICAgICAgICAgY2FzZSA3OiByZXR1cm4gWzQsIE1vZGVsLmRlbGV0ZU9uZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDQpLnNlbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVsZXRlT25lID0gZGVsZXRlT25lO1xudmFyIGluZmVyVHlwZXMgPSBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZXMgPSAoMCwgdHlwZUluZmVyZW5jZV8xLmdlbmVyYXRlVHlwZXNGcm9tU3BlY3MpKCk7XG4gICAgICAgIHJlcy5oZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L3R5cGVzY3JpcHRcIik7XG4gICAgICAgIHJlcy5zZW5kKHR5cGVzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycm9yIGdlbmVyYXRpbmcgdHlwZXNcIiwgZGV0YWlsczogZXJyLm1lc3NhZ2UgfSk7XG4gICAgfVxufTtcbmV4cG9ydHMuaW5mZXJUeXBlcyA9IGluZmVyVHlwZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZnJhZ21lbnRTcGVjID0gdm9pZCAwO1xudmFyIG5hbm9pZF8xID0gcmVxdWlyZShcIm5hbm9pZFwiKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgc3BlY190eXBlc18xID0gcmVxdWlyZShcIi4uL3NwZWNzL3R5cGVzL3NwZWMudHlwZXNcIik7XG52YXIgYWxwaGFudW1lcmljQWxwaGFiZXQgPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xudmFyIG5hbm9pZCA9ICgwLCBuYW5vaWRfMS5jdXN0b21BbHBoYWJldCkoYWxwaGFudW1lcmljQWxwaGFiZXQsIDgpO1xuZXhwb3J0cy5mcmFnbWVudFNwZWMgPSB7XG4gICAgZmllbGRzOiB7XG4gICAgICAgIFwibmFtZVwiOiB7XG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBkaXNwbGF5T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiaDJcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZW50XCI6IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICBkaXNwbGF5T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwicmljaHRleHRcIixcbiAgICAgICAgICAgICAgICB0b29sYmFyT3B0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICBzcGVjX3R5cGVzXzEuVG9vbGJhck9wdGlvbi5Cb2xkLFxuICAgICAgICAgICAgICAgICAgICBzcGVjX3R5cGVzXzEuVG9vbGJhck9wdGlvbi5JdGFsaWMsXG4gICAgICAgICAgICAgICAgICAgIHNwZWNfdHlwZXNfMS5Ub29sYmFyT3B0aW9uLlVuZGVybGluZSxcbiAgICAgICAgICAgICAgICAgICAgc3BlY190eXBlc18xLlRvb2xiYXJPcHRpb24uQWxpZ25MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBzcGVjX3R5cGVzXzEuVG9vbGJhck9wdGlvbi5BbGlnbkNlbnRlcixcbiAgICAgICAgICAgICAgICAgICAgc3BlY190eXBlc18xLlRvb2xiYXJPcHRpb24uQWxpZ25SaWdodCxcbiAgICAgICAgICAgICAgICAgICAgc3BlY190eXBlc18xLlRvb2xiYXJPcHRpb24uQWxpZ25KdXN0aWZ5LFxuICAgICAgICAgICAgICAgICAgICBzcGVjX3R5cGVzXzEuVG9vbGJhck9wdGlvbi5IZWFkaW5nLFxuICAgICAgICAgICAgICAgICAgICBzcGVjX3R5cGVzXzEuVG9vbGJhck9wdGlvbi5CdWxsZXRMaXN0LFxuICAgICAgICAgICAgICAgICAgICBzcGVjX3R5cGVzXzEuVG9vbGJhck9wdGlvbi5PcmRlcmVkTGlzdCxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibGFiZWxzXCI6IHtcbiAgICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgaXRlbVR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBwYXJlbnQ6IHtcbiAgICAgICAgICAgICAgICBkb21haW46IFwiZnJhZ21lbnRMYWJlbFwiLCBmaWVsZDogXCJyZWZlcmVuY2VcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpc3BsYXlPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJhdXRvY29tcGxldGVcIixcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJMYWJlbHNcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBtZXRhOiB7XG4gICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uIChkb2MsIGNvbnRleHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkb2MsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHsgZG9jOiBkb2MsIGVycm9yczogW10gfV07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTsgfSxcbiAgICAgICAgICAgIGFmdGVyQ3JlYXRlOiBmdW5jdGlvbiAoZG9jLCBjb250ZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBGcmFnbWVudFZlcnNpb24sIHRpbWVzdGFtcDtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGcmFnbWVudFZlcnNpb24gPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKGNvbnRleHQuc3BhY2UsIFwiZnJhZ21lbnRWZXJzaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBGcmFnbWVudFZlcnNpb24uY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmVyZW5jZTogbmFub2lkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFnbWVudFJlZmVyZW5jZTogZG9jLnJlZmVyZW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGRvYy5jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvblRhZzogZ2VuZXJhdGVWZXJzaW9uVGFnKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRBdDogdGltZXN0YW1wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZEJ5OiBjb250ZXh0LnVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRCeTogY29udGV4dC51c2VySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTsgfSxcbiAgICAgICAgICAgIGFmdGVyVXBkYXRlOiBmdW5jdGlvbiAoZG9jLCBjb250ZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIG1heWJlQWRkRnJhZ21lbnRWZXJzaW9uKGRvYywgY29udGV4dCldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTsgfSxcbiAgICAgICAgICAgIGFmdGVyUGF0Y2g6IGZ1bmN0aW9uIChkb2MsIGNvbnRleHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgbWF5YmVBZGRGcmFnbWVudFZlcnNpb24oZG9jLCBjb250ZXh0KV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIG1heWJlQWRkRnJhZ21lbnRWZXJzaW9uID0gZnVuY3Rpb24gKGRvYywgY29udGV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgRnJhZ21lbnRWZXJzaW9uLCBsYXRlc3RWZXJzaW9uLCB0aW1lc3RhbXA7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgRnJhZ21lbnRWZXJzaW9uID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShjb250ZXh0LnNwYWNlLCBcImZyYWdtZW50VmVyc2lvblwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEZyYWdtZW50VmVyc2lvbi5maW5kT25lKHsgZnJhZ21lbnRSZWZlcmVuY2U6IGRvYy5yZWZlcmVuY2UgfSwgbnVsbCwgeyBzb3J0OiB7IGNyZWF0ZWRBdDogLTEgfSB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgbGF0ZXN0VmVyc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhsYXRlc3RWZXJzaW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoISghbGF0ZXN0VmVyc2lvbiB8fCBsYXRlc3RWZXJzaW9uLmNvbnRlbnQgIT09IGRvYy5jb250ZW50KSkgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgRnJhZ21lbnRWZXJzaW9uLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZlcmVuY2U6IG5hbm9pZCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRSZWZlcmVuY2U6IGRvYy5yZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBkb2MuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb25UYWc6IGdlbmVyYXRlVmVyc2lvblRhZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZEF0OiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQXQ6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRCeTogY29udGV4dC51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQnk6IGNvbnRleHQudXNlcklkXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAzO1xuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbnZhciBnZW5lcmF0ZVZlcnNpb25UYWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIFwiXCIuY29uY2F0KG5vdy5nZXRGdWxsWWVhcigpLCBcIi5cIikuY29uY2F0KFN0cmluZyhub3cuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyksIFwiLlwiKS5jb25jYXQoU3RyaW5nKG5vdy5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyksIFwiX1wiKSArXG4gICAgICAgIFwiXCIuY29uY2F0KFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKSwgXCIuXCIpLmNvbmNhdChTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKSwgXCIuXCIpLmNvbmNhdChTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZyYWdtZW50TGFiZWxTcGVjID0gdm9pZCAwO1xudmFyIGRidXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9saWIvZGJ1dGlsc1wiKTtcbnZhciBVdGlsc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2xpYi9VdGlsc1wiKTtcbmV4cG9ydHMuZnJhZ21lbnRMYWJlbFNwZWMgPSB7XG4gICAgZmllbGRzOiB7XG4gICAgICAgIFwibmFtZVwiOiB7XG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0YToge1xuICAgICAgICBob29rczoge1xuICAgICAgICAgICAgYmVmb3JlQ3JlYXRlOiBmdW5jdGlvbiAoZG9jLCBjb250ZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBlcnJvcnMsIE1vZGVsLCBleGlzdGluZywgaXNEdXBsaWNhdGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKGNvbnRleHQuc3BhY2UsIGNvbnRleHQuZG9tYWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIU1vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiSW52YWxpZCBjb2xsZWN0aW9uIGNvbnRleHQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHsgZG9jOiBkb2MsIGVycm9yczogZXJyb3JzIH1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2MubmFtZSA9ICgwLCBVdGlsc18xLm5vcm1hbGl6ZUxhYmVsKShkb2MubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kT25lKHsgbmFtZTogZG9jLm5hbWUgfSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRHVwbGljYXRlID0gZXhpc3RpbmcgJiYgKGNvbnRleHQub3BlcmF0aW9uID09PSBcImNyZWF0ZVwiIHx8IGV4aXN0aW5nLl9pZC50b1N0cmluZygpICE9PSBkb2MuX2lkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIkxhYmVsICdcIi5jb25jYXQoZG9jLm5hbWUsIFwiJyBhbHJlYWR5IGV4aXN0c1wiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBkb2M6IGRvYywgZXJyb3JzOiBlcnJvcnMgfV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZyYWdtZW50VmVyc2lvblNwZWMgPSB2b2lkIDA7XG52YXIgZGJ1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2xpYi9kYnV0aWxzXCIpO1xudmFyIGFwcGx5VmVyc2lvblRhZ0lmTWlzc2luZyA9IGZ1bmN0aW9uIChkb2MpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vdywgdmVyc2lvblRhZztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIGlmICghZG9jLnZlcnNpb25UYWcpIHtcbiAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2ZXJzaW9uVGFnID0gXCJcIi5jb25jYXQobm93LmdldEZ1bGxZZWFyKCksIFwiLlwiKS5jb25jYXQoU3RyaW5nKG5vdy5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKSwgXCIuXCIpLmNvbmNhdChTdHJpbmcobm93LmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKSwgXCJfXCIpICtcbiAgICAgICAgICAgICAgICBcIlwiLmNvbmNhdChTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyksIFwiLlwiKS5jb25jYXQoU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyksIFwiLlwiKS5jb25jYXQoU3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsICcwJykpO1xuICAgICAgICAgICAgZG9jLnZlcnNpb25UYWcgPSB2ZXJzaW9uVGFnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMiwgeyBkb2M6IGRvYywgZXJyb3JzOiBbXSB9XTtcbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5mcmFnbWVudFZlcnNpb25TcGVjID0ge1xuICAgIGZpZWxkczoge1xuICAgICAgICBcImZyYWdtZW50UmVmZXJlbmNlXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgICAgICAgZG9tYWluOiBcImZyYWdtZW50XCIsXG4gICAgICAgICAgICAgICAgZmllbGQ6IFwicmVmZXJlbmNlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZW50XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBcInZlcnNpb25UYWdcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgZGlzcGxheU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJWZXJzaW9uIHRhZ1wiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidXNlck5vdGVcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuICAgICAgICAgICAgZGlzcGxheU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBsYWJlbDogXCJDaGFuZ2Ugbm90ZVwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBtZXRhOiB7XG4gICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uIChkb2MsIGNvbnRleHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGFwcGx5VmVyc2lvblRhZ0lmTWlzc2luZyhkb2MpXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9LFxuICAgICAgICAgICAgYWZ0ZXJDcmVhdGU6IGZ1bmN0aW9uIChkb2MsIGNvbnRleHQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIEZyYWdtZW50LCB1cGRhdGVkRnJhZ21lbnQsIGVycl8xO1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgMiwgLCAzXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhZ21lbnQgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKGNvbnRleHQuc3BhY2UsIFwiZnJhZ21lbnRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBGcmFnbWVudC5maW5kT25lQW5kVXBkYXRlKHsgcmVmZXJlbmNlOiBkb2MuZnJhZ21lbnRSZWZlcmVuY2UgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGRvYy5jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQnk6IGNvbnRleHQudXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHsgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkRnJhZ21lbnQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVkRnJhZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgdXBkYXRpbmcgZnJhZ21lbnQgY29udGVudDpcIiwgZXJyXzEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH0sXG4gICAgICAgICAgICBhZnRlclVwZGF0ZTogZnVuY3Rpb24gKGRvYywgY29udGV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRnJhZ21lbnQgdXBkYXRlZDogXCIuY29uY2F0KGRvYy5yZWZlcmVuY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9LFxuICAgICAgICB9LFxuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnN0b3J5dGhyZWFkU3BlYyA9IHZvaWQgMDtcbmV4cG9ydHMuc3Rvcnl0aHJlYWRTcGVjID0ge1xuICAgIGZpZWxkczoge1xuICAgICAgICBcIm5hbWVcIjoge1xuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGE6IHtcbiAgICAgICAgaG9va3M6IHtcbiAgICAgICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24gKGRvYywgY29udGV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRvYywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBkb2M6IGRvYywgZXJyb3JzOiBbXSB9XTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9LFxuICAgICAgICB9XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zdG9yeXRocmVhZEZyYWdtZW50U3BlYyA9IHZvaWQgMDtcbmV4cG9ydHMuc3Rvcnl0aHJlYWRGcmFnbWVudFNwZWMgPSB7XG4gICAgZmllbGRzOiB7XG4gICAgICAgIFwic3Rvcnl0aHJlYWRSZWZlcmVuY2VcIjoge1xuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZnJhZ21lbnRSZWZlcmVuY2VcIjoge1xuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1ldGE6IHtcbiAgICAgICAgaG9va3M6IHtcbiAgICAgICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24gKGRvYywgY29udGV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRvYywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgeyBkb2M6IGRvYywgZXJyb3JzOiBbXSB9XTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9LFxuICAgICAgICB9LFxuICAgICAgICBvcmRlcmluZzogW1xuICAgICAgICAgICAgXCJzdG9yeXRocmVhZFJlZmVyZW5jZVwiXG4gICAgICAgIF1cbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzID0gZXhwb3J0cy5idWlsZFNvcnRRdWVyeSA9IHZvaWQgMDtcbnZhciBPUF9NQVAgPSB7XG4gICAgZXE6IFwiJGVxXCIsXG4gICAgbmU6IFwiJG5lXCIsXG4gICAgZ3Q6IFwiJGd0XCIsXG4gICAgZ3RlOiBcIiRndGVcIixcbiAgICBsdDogXCIkbHRcIixcbiAgICBsdGU6IFwiJGx0ZVwiLFxuICAgIGluOiBcIiRpblwiLFxuICAgIG5pbjogXCIkbmluXCIsXG4gICAgcmVnZXg6IFwiJHJlZ2V4XCJcbn07XG52YXIgcmVzb2x2ZUZpZWxkU3BlYyA9IGZ1bmN0aW9uIChwYXRoLCBzcGVjKSB7XG4gICAgdmFyIGN1cnJlbnRGaWVsZDtcbiAgICB2YXIgY3VycmVudEZpZWxkcyA9IHNwZWMuZmllbGRzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGFydCA9IHBhdGhbaV07XG4gICAgICAgIGN1cnJlbnRGaWVsZCA9IGN1cnJlbnRGaWVsZHNbcGFydF07XG4gICAgICAgIGlmICghY3VycmVudEZpZWxkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmIChjdXJyZW50RmllbGQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgY3VycmVudEZpZWxkcyA9IGN1cnJlbnRGaWVsZC5maWVsZHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY3VycmVudEZpZWxkLnR5cGUgPT09IFwiYXJyYXlcIikge1xuICAgICAgICAgICAgdmFyIGFycmF5RmllbGQgPSBjdXJyZW50RmllbGQ7XG4gICAgICAgICAgICBpZiAoYXJyYXlGaWVsZC5pdGVtVHlwZSA9PT0gXCJvYmplY3RcIiAmJiBhcnJheUZpZWxkLmZpZWxkcykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRGaWVsZHMgPSBhcnJheUZpZWxkLmZpZWxkcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGkgPCBwYXRoLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpIDwgcGF0aC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN1cnJlbnRGaWVsZCAhPT0gbnVsbCAmJiBjdXJyZW50RmllbGQgIT09IHZvaWQgMCA/IGN1cnJlbnRGaWVsZCA6IG51bGw7XG59O1xudmFyIGJ1aWxkU29ydFF1ZXJ5ID0gZnVuY3Rpb24gKHNvcnQpIHtcbiAgICB2YXIgbW9uZ29Tb3J0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHNvcnQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHNvcnRba2V5XTtcbiAgICAgICAgbW9uZ29Tb3J0W2tleV0gPSBkaXJlY3Rpb24gPT09IFwiZGVzY1wiIHx8IGRpcmVjdGlvbiA9PT0gLTEgPyAtMSA6IDE7XG4gICAgfVxuICAgIHJldHVybiBtb25nb1NvcnQ7XG59O1xuZXhwb3J0cy5idWlsZFNvcnRRdWVyeSA9IGJ1aWxkU29ydFF1ZXJ5O1xudmFyIGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzID0gZnVuY3Rpb24gKGZpbHRlcnMsIHNwZWMpIHtcbiAgICB2YXIgbW9uZ29RdWVyeSA9IHt9O1xuICAgIGZvciAodmFyIHJhd0ZpZWxkIGluIGZpbHRlcnMpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZmlsdGVyc1tyYXdGaWVsZF07XG4gICAgICAgIHZhciBwYXRoID0gcmF3RmllbGQuc3BsaXQoXCIuXCIpO1xuICAgICAgICB2YXIgZmllbGRTcGVjID0gcmVzb2x2ZUZpZWxkU3BlYyhwYXRoLCBzcGVjKTtcbiAgICAgICAgaWYgKCFmaWVsZFNwZWMpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBtb25nb09wcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgb3AgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoT1BfTUFQW29wXSkge1xuICAgICAgICAgICAgICAgICAgICBtb25nb09wc1tPUF9NQVBbb3BdXSA9IG9wID09PSBcInJlZ2V4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gbmV3IFJlZ0V4cCh2YWx1ZVtvcF0sIFwiaVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZVtvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9uZ29RdWVyeVtyYXdGaWVsZF0gPSBtb25nb09wcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1vbmdvUXVlcnlbcmF3RmllbGRdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vbmdvUXVlcnk7XG59O1xuZXhwb3J0cy5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycyA9IGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmxpc3RBbGxTcGVjcyA9IGV4cG9ydHMuZ2V0U3BlY0J5TmFtZSA9IHZvaWQgMDtcbnZhciBmcmFnbWVudF9zcGVjXzEgPSByZXF1aXJlKFwiLi4vZGVmaW5pdGlvbnMvZnJhZ21lbnQuc3BlY1wiKTtcbnZhciBmcmFnbWVudExhYmVsX3NwZWNfMSA9IHJlcXVpcmUoXCIuLi9kZWZpbml0aW9ucy9mcmFnbWVudExhYmVsLnNwZWNcIik7XG52YXIgZnJhZ21lbnRWZXJzaW9uX3NwZWNfMSA9IHJlcXVpcmUoXCIuLi9kZWZpbml0aW9ucy9mcmFnbWVudFZlcnNpb24uc3BlY1wiKTtcbnZhciBzdG9yeXRocmVhZF9zcGVjXzEgPSByZXF1aXJlKFwiLi4vZGVmaW5pdGlvbnMvc3Rvcnl0aHJlYWQuc3BlY1wiKTtcbnZhciBzdG9yeXRocmVhZEZyYWdtZW50X3NwZWNfMSA9IHJlcXVpcmUoXCIuLi9kZWZpbml0aW9ucy9zdG9yeXRocmVhZEZyYWdtZW50LnNwZWNcIik7XG52YXIgc3BlY1JlZ2lzdHJ5ID0ge1xuICAgIHN0b3J5dGhyZWFkOiBzdG9yeXRocmVhZF9zcGVjXzEuc3Rvcnl0aHJlYWRTcGVjLFxuICAgIGZyYWdtZW50OiBmcmFnbWVudF9zcGVjXzEuZnJhZ21lbnRTcGVjLFxuICAgIGZyYWdtZW50VmVyc2lvbjogZnJhZ21lbnRWZXJzaW9uX3NwZWNfMS5mcmFnbWVudFZlcnNpb25TcGVjLFxuICAgIGZyYWdtZW50TGFiZWw6IGZyYWdtZW50TGFiZWxfc3BlY18xLmZyYWdtZW50TGFiZWxTcGVjLFxuICAgIHN0b3J5dGhyZWFkRnJhZ21lbnQ6IHN0b3J5dGhyZWFkRnJhZ21lbnRfc3BlY18xLnN0b3J5dGhyZWFkRnJhZ21lbnRTcGVjXG59O1xudmFyIGdldFNwZWNCeU5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBzcGVjUmVnaXN0cnlbbmFtZV07XG59O1xuZXhwb3J0cy5nZXRTcGVjQnlOYW1lID0gZ2V0U3BlY0J5TmFtZTtcbnZhciBsaXN0QWxsU3BlY3MgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBPYmplY3Qua2V5cyhzcGVjUmVnaXN0cnkpOyB9O1xuZXhwb3J0cy5saXN0QWxsU3BlY3MgPSBsaXN0QWxsU3BlY3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVG9vbGJhck9wdGlvbiA9IHZvaWQgMDtcbnZhciBUb29sYmFyT3B0aW9uO1xuKGZ1bmN0aW9uIChUb29sYmFyT3B0aW9uKSB7XG4gICAgVG9vbGJhck9wdGlvbltcIkJvbGRcIl0gPSBcImJvbGRcIjtcbiAgICBUb29sYmFyT3B0aW9uW1wiSXRhbGljXCJdID0gXCJpdGFsaWNcIjtcbiAgICBUb29sYmFyT3B0aW9uW1wiVW5kZXJsaW5lXCJdID0gXCJ1bmRlcmxpbmVcIjtcbiAgICBUb29sYmFyT3B0aW9uW1wiU3RyaWtldGhyb3VnaFwiXSA9IFwic3RyaWtldGhyb3VnaFwiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJIZWFkaW5nXCJdID0gXCJoZWFkaW5nXCI7XG4gICAgVG9vbGJhck9wdGlvbltcIkFsaWduTGVmdFwiXSA9IFwiYWxpZ25MZWZ0XCI7XG4gICAgVG9vbGJhck9wdGlvbltcIkFsaWduQ2VudGVyXCJdID0gXCJhbGlnbkNlbnRlclwiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJBbGlnblJpZ2h0XCJdID0gXCJhbGlnblJpZ2h0XCI7XG4gICAgVG9vbGJhck9wdGlvbltcIkFsaWduSnVzdGlmeVwiXSA9IFwiYWxpZ25KdXN0aWZ5XCI7XG4gICAgVG9vbGJhck9wdGlvbltcIkJ1bGxldExpc3RcIl0gPSBcImJ1bGxldExpc3RcIjtcbiAgICBUb29sYmFyT3B0aW9uW1wiT3JkZXJlZExpc3RcIl0gPSBcIm9yZGVyZWRMaXN0XCI7XG4gICAgVG9vbGJhck9wdGlvbltcIkJsb2NrUXVvdGVcIl0gPSBcImJsb2NrUXVvdGVcIjtcbiAgICBUb29sYmFyT3B0aW9uW1wiQ29kZVwiXSA9IFwiY29kZVwiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJDb2RlQmxvY2tcIl0gPSBcImNvZGVCbG9ja1wiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJGb250Q29sb3JcIl0gPSBcImZvbnRDb2xvclwiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJIaWdobGlnaHRDb2xvclwiXSA9IFwiaGlnaGxpZ2h0Q29sb3JcIjtcbiAgICBUb29sYmFyT3B0aW9uW1wiTGlua1wiXSA9IFwibGlua1wiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJDbGVhckZvcm1hdHRpbmdcIl0gPSBcImNsZWFyRm9ybWF0dGluZ1wiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJIb3Jpem9udGFsUnVsZVwiXSA9IFwiaG9yaXpvbnRhbFJ1bGVcIjtcbiAgICBUb29sYmFyT3B0aW9uW1wiSW1hZ2VcIl0gPSBcImltYWdlXCI7XG4gICAgVG9vbGJhck9wdGlvbltcIkFkZFRhYmxlXCJdID0gXCJhZGRUYWJsZVwiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJZb3VUdWJlVmlkZW9cIl0gPSBcInlvdVR1YmVWaWRlb1wiO1xuICAgIFRvb2xiYXJPcHRpb25bXCJVbmRvXCJdID0gXCJ1bmRvXCI7XG4gICAgVG9vbGJhck9wdGlvbltcIlJlZG9cIl0gPSBcInJlZG9cIjtcbn0pKFRvb2xiYXJPcHRpb24gfHwgKGV4cG9ydHMuVG9vbGJhck9wdGlvbiA9IFRvb2xiYXJPcHRpb24gPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZpbGxNaXNzaW5nRmllbGRzID0gdm9pZCAwO1xuZXhwb3J0cy52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCA9IHZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkO1xuZnVuY3Rpb24gdmFsaWRhdGVBbmRTaGFwZVBheWxvYWQocGF5bG9hZCwgc3BlYywgcGF0aCwgb3B0aW9ucykge1xuICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mLCBfZztcbiAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSBcIlwiOyB9XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICB2YXIgZXJyb3JzID0gW107XG4gICAgdmFyIHNoYXBlZERhdGEgPSB7fTtcbiAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIGZpZWxkID0gc3BlYy5maWVsZHNba2V5XTtcbiAgICAgICAgdmFyIHZhbHVlID0gcGF5bG9hZCA9PT0gbnVsbCB8fCBwYXlsb2FkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXlsb2FkW2tleV07XG4gICAgICAgIHZhciBmdWxsUGF0aCA9IHBhdGggPyBcIlwiLmNvbmNhdChwYXRoLCBcIi5cIikuY29uY2F0KGtleSkgOiBrZXk7XG4gICAgICAgIHZhciBpc01pc3NpbmcgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsO1xuICAgICAgICB2YXIgaXNSZXF1aXJlZCA9IGZpZWxkLnJlcXVpcmVkID09PSB0cnVlO1xuICAgICAgICBpZiAoaXNNaXNzaW5nKSB7XG4gICAgICAgICAgICBpZiAoaXNSZXF1aXJlZCAmJiAhb3B0aW9ucy5hbGxvd1BhcnRpYWwpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgaXMgcmVxdWlyZWRcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiY29udGludWVcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmFsaWRhdGVCYXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAoKF9hID0gZmllbGQudmFsaWRhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jdXN0b20pID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZWxkLnZhbGlkYXRlLmN1c3RvbSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBmYWlsZWQgY3VzdG9tIHZhbGlkYXRpb25cIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBmYWlsZWQgY3VzdG9tIHZhbGlkYXRpb246IFwiKS5jb25jYXQoZS5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzd2l0Y2ggKGZpZWxkLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBtdXN0IGJlIGEgc3RyaW5nXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoKF9hID0gZmllbGQudmFsaWRhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5taW5MZW5ndGgpICYmIHZhbHVlLmxlbmd0aCA8IGZpZWxkLnZhbGlkYXRlLm1pbkxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIG11c3QgYmUgYXQgbGVhc3QgXCIpLmNvbmNhdChmaWVsZC52YWxpZGF0ZS5taW5MZW5ndGgsIFwiIGNoYXJhY3RlcnNcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgoKF9iID0gZmllbGQudmFsaWRhdGUpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5tYXhMZW5ndGgpICYmIHZhbHVlLmxlbmd0aCA+IGZpZWxkLnZhbGlkYXRlLm1heExlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIG11c3QgYmUgYXQgbW9zdCBcIikuY29uY2F0KGZpZWxkLnZhbGlkYXRlLm1heExlbmd0aCwgXCIgY2hhcmFjdGVyc1wiKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCgoX2MgPSBmaWVsZC52YWxpZGF0ZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnJlZ2V4KSAmJiAhKG5ldyBSZWdFeHAoZmllbGQudmFsaWRhdGUucmVnZXgpLnRlc3QodmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIGRvZXMgbm90IG1hdGNoIHJlcXVpcmVkIHBhdHRlcm5cIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbGlkYXRlQmFzZSgpO1xuICAgICAgICAgICAgICAgIHNoYXBlZERhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIG11c3QgYmUgYSBudW1iZXJcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCgoX2QgPSBmaWVsZC52YWxpZGF0ZSkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLm1pbikgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA8IGZpZWxkLnZhbGlkYXRlLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIG11c3QgYmUgYXQgbGVhc3QgXCIpLmNvbmNhdChmaWVsZC52YWxpZGF0ZS5taW4pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoKChfZSA9IGZpZWxkLnZhbGlkYXRlKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UubWF4KSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlID4gZmllbGQudmFsaWRhdGUubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgbXVzdCBiZSBhdCBtb3N0IFwiKS5jb25jYXQoZmllbGQudmFsaWRhdGUubWF4KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVCYXNlKCk7XG4gICAgICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBtdXN0IGJlIGEgYm9vbGVhblwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZUJhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImVudW1cIjpcbiAgICAgICAgICAgICAgICBpZiAoIWZpZWxkLm9wdGlvbnMubWFwKGZ1bmN0aW9uIChvKSB7IHJldHVybiBvLnZhbHVlOyB9KS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIG11c3QgYmUgb25lIG9mIFwiKS5jb25jYXQoZmllbGQub3B0aW9ucy5tYXAoZnVuY3Rpb24gKG8pIHsgcmV0dXJuIG8udmFsdWU7IH0pLmpvaW4oXCIsIFwiKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUJhc2UoKTtcbiAgICAgICAgICAgICAgICBzaGFwZWREYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBtdXN0IGJlIGFuIG9iamVjdFwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmVzdGVkUmVzdWx0ID0gdmFsaWRhdGVBbmRTaGFwZVBheWxvYWQodmFsdWUsIHsgZmllbGRzOiBmaWVsZC5maWVsZHMgfSwgZnVsbFBhdGgsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW5lc3RlZFJlc3VsdC52YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2guYXBwbHkoZXJyb3JzLCBuZXN0ZWRSZXN1bHQuZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlZERhdGFba2V5XSA9IG5lc3RlZFJlc3VsdC5zaGFwZWREYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImFycmF5XCI6XG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgbXVzdCBiZSBhbiBhcnJheVwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKChfZiA9IGZpZWxkLnZhbGlkYXRlKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2YubWluSXRlbXMpICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoIDwgZmllbGQudmFsaWRhdGUubWluSXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBtdXN0IGhhdmUgYXQgbGVhc3QgXCIpLmNvbmNhdChmaWVsZC52YWxpZGF0ZS5taW5JdGVtcywgXCIgaXRlbXNcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgoKF9nID0gZmllbGQudmFsaWRhdGUpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5tYXhJdGVtcykgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5sZW5ndGggPiBmaWVsZC52YWxpZGF0ZS5tYXhJdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIG11c3QgaGF2ZSBhdCBtb3N0IFwiKS5jb25jYXQoZmllbGQudmFsaWRhdGUubWF4SXRlbXMsIFwiIGl0ZW1zXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbVR5cGUgPSBmaWVsZC5pdGVtVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNoYXBlZEFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdmFsdWVbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbVBhdGggPSBcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCJbXCIpLmNvbmNhdChpLCBcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbVR5cGUgPT09IFwib2JqZWN0XCIgJiYgZmllbGQuZmllbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5lc3RlZCA9IHZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkKGl0ZW0sIHsgZmllbGRzOiBmaWVsZC5maWVsZHMgfSwgaXRlbVBhdGgsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbmVzdGVkLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoLmFwcGx5KGVycm9ycywgbmVzdGVkLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFwZWRBcnJheS5wdXNoKG5lc3RlZC5zaGFwZWREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwZWN0ZWRUeXBlID0gaXRlbVR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoaXRlbVBhdGgsIFwiIG11c3QgYmUgYSBcIikuY29uY2F0KGV4cGVjdGVkVHlwZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGVkQXJyYXkucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gc2hhcGVkQXJyYXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgaGFzIHVuc3VwcG9ydGVkIGZpZWxkIHR5cGVcIikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3BlYy5maWVsZHMpIHtcbiAgICAgICAgX2xvb3BfMShrZXkpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZXJyb3JzLmxlbmd0aCA9PT0gMCxcbiAgICAgICAgc2hhcGVkRGF0YTogc2hhcGVkRGF0YSxcbiAgICAgICAgZXJyb3JzOiBlcnJvcnNcbiAgICB9O1xufVxudmFyIGZpbGxNaXNzaW5nRmllbGRzID0gZnVuY3Rpb24gKGRvYywgc3BlYykge1xuICAgIHZhciBfYTtcbiAgICB2YXIgc2hhcGVkID0ge1xuICAgICAgICBpZDogKF9hID0gZG9jLl9pZCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZG9jLmlkLFxuICAgICAgICByZWZlcmVuY2U6IGRvYy5yZWZlcmVuY2UsXG4gICAgICAgIGNyZWF0ZWRCeTogZG9jLmNyZWF0ZWRCeSxcbiAgICAgICAgY3JlYXRlZEF0OiBkb2MuY3JlYXRlZEF0LFxuICAgICAgICB1cGRhdGVkQnk6IGRvYy51cGRhdGVkQnksXG4gICAgICAgIHVwZGF0ZWRBdDogZG9jLnVwZGF0ZWRBdCxcbiAgICB9O1xuICAgIGZvciAodmFyIGtleSBpbiBzcGVjLmZpZWxkcykge1xuICAgICAgICB2YXIgZmllbGQgPSBzcGVjLmZpZWxkc1trZXldO1xuICAgICAgICB2YXIgdmFsdWUgPSBkb2Nba2V5XTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHNoYXBlZFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaGFwZWRba2V5XSA9IGdldERlZmF1bHRWYWx1ZUZvckZpZWxkKGZpZWxkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2hhcGVkO1xufTtcbmV4cG9ydHMuZmlsbE1pc3NpbmdGaWVsZHMgPSBmaWxsTWlzc2luZ0ZpZWxkcztcbnZhciBnZXREZWZhdWx0VmFsdWVGb3JGaWVsZCA9IGZ1bmN0aW9uIChmaWVsZCkge1xuICAgIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgY2FzZSBcImVudW1cIjpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICB2YXIgbmVzdGVkID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBzdWJGaWVsZCBpbiBmaWVsZC5maWVsZHMpIHtcbiAgICAgICAgICAgICAgICBuZXN0ZWRbc3ViRmllbGRdID0gZ2V0RGVmYXVsdFZhbHVlRm9yRmllbGQoZmllbGQuZmllbGRzW3N1YkZpZWxkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmVzdGVkO1xuICAgICAgICBjYXNlIFwiYXJyYXlcIjpcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3NwcmVhZEFycmF5ID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5KSB8fCBmdW5jdGlvbiAodG8sIGZyb20sIHBhY2spIHtcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2VuZXJhdGVUeXBlc0Zyb21TcGVjcyA9IHZvaWQgMDtcbnZhciBzcGVjUmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuLi9zcGVjcy9zcGVjUmVnaXN0cnlcIik7XG52YXIgY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTsgfTtcbnZhciB0b1Bhc2NhbENhc2UgPSBmdW5jdGlvbiAocGFydHMpIHsgcmV0dXJuIHBhcnRzLm1hcChjYXBpdGFsaXplKS5qb2luKCcnKTsgfTtcbnZhciBuZXN0ZWRJbnRlcmZhY2VzID0gW107XG52YXIgaW5mZXJGaWVsZFR5cGUgPSBmdW5jdGlvbiAoZmllbGQsIGRvbWFpbk5hbWUsIHBhdGhQYXJ0cykge1xuICAgIGlmIChwYXRoUGFydHMgPT09IHZvaWQgMCkgeyBwYXRoUGFydHMgPSBbXTsgfVxuICAgIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC50eXBlO1xuICAgICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgICAgIHJldHVybiBmaWVsZC5vcHRpb25zLm1hcChmdW5jdGlvbiAob3B0KSB7IHJldHVybiBcIlxcXCJcIi5jb25jYXQob3B0LnZhbHVlLCBcIlxcXCJcIik7IH0pLmpvaW4oJyB8ICcpO1xuICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgdmFyIG9iamVjdE5hbWUgPSB0b1Bhc2NhbENhc2UoX19zcHJlYWRBcnJheShbZG9tYWluTmFtZV0sIHBhdGhQYXJ0cywgdHJ1ZSkpO1xuICAgICAgICAgICAgbmVzdGVkSW50ZXJmYWNlcy5wdXNoKGdlbmVyYXRlSW50ZXJmYWNlRnJvbUZpZWxkcyhvYmplY3ROYW1lLCBmaWVsZC5maWVsZHMsIGRvbWFpbk5hbWUsIHBhdGhQYXJ0cykpO1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdE5hbWU7XG4gICAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgICAgIHZhciBpdGVtVHlwZSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pdGVtVHlwZSA9PT0gJ29iamVjdCcgJiYgZmllbGQuZmllbGRzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFycmF5TmFtZSA9IHRvUGFzY2FsQ2FzZShfX3NwcmVhZEFycmF5KFtkb21haW5OYW1lXSwgcGF0aFBhcnRzLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgbmVzdGVkSW50ZXJmYWNlcy5wdXNoKGdlbmVyYXRlSW50ZXJmYWNlRnJvbUZpZWxkcyhhcnJheU5hbWUsIGZpZWxkLmZpZWxkcywgZG9tYWluTmFtZSwgcGF0aFBhcnRzKSk7XG4gICAgICAgICAgICAgICAgaXRlbVR5cGUgPSBhcnJheU5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtVHlwZSA9IGZpZWxkLml0ZW1UeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiXCIuY29uY2F0KGl0ZW1UeXBlLCBcIltdXCIpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuICdhbnknO1xuICAgIH1cbn07XG52YXIgZ2VuZXJhdGVJbnRlcmZhY2VGcm9tRmllbGRzID0gZnVuY3Rpb24gKGludGVyZmFjZU5hbWUsIGZpZWxkcywgZG9tYWluTmFtZSwgcGF0aFBhcnRzKSB7XG4gICAgaWYgKHBhdGhQYXJ0cyA9PT0gdm9pZCAwKSB7IHBhdGhQYXJ0cyA9IFtdOyB9XG4gICAgdmFyIG91dHB1dCA9IFwiZXhwb3J0IGludGVyZmFjZSBcIi5jb25jYXQoaW50ZXJmYWNlTmFtZSwgXCIge1wiKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gZmllbGRzKSB7XG4gICAgICAgIHZhciBmaWVsZCA9IGZpZWxkc1trZXldO1xuICAgICAgICB2YXIgdHNUeXBlID0gaW5mZXJGaWVsZFR5cGUoZmllbGQsIGRvbWFpbk5hbWUsIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgcGF0aFBhcnRzLCB0cnVlKSwgW2tleV0sIGZhbHNlKSk7XG4gICAgICAgIHZhciBvcHRpb25hbCA9IGZpZWxkLnJlcXVpcmVkID8gJycgOiAnPyc7XG4gICAgICAgIG91dHB1dCArPSBcIlxcbiAgXCIuY29uY2F0KGtleSkuY29uY2F0KG9wdGlvbmFsLCBcIjogXCIpLmNvbmNhdCh0c1R5cGUsIFwiO1wiKTtcbiAgICB9XG4gICAgb3V0cHV0ICs9IFwiXFxuICBpZDogc3RyaW5nO1wiO1xuICAgIG91dHB1dCArPSBcIlxcbiAgcmVmZXJlbmNlOiBzdHJpbmc7XCI7XG4gICAgb3V0cHV0ICs9IFwiXFxuICBjcmVhdGVkQnk6IHN0cmluZztcIjtcbiAgICBvdXRwdXQgKz0gXCJcXG4gIGNyZWF0ZWRBdDogc3RyaW5nO1wiO1xuICAgIG91dHB1dCArPSBcIlxcbiAgdXBkYXRlZEJ5OiBzdHJpbmc7XCI7XG4gICAgb3V0cHV0ICs9IFwiXFxuICB1cGRhdGVkQXQ6IHN0cmluZztcIjtcbiAgICBvdXRwdXQgKz0gXCJcXG59XCI7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG52YXIgZ2VuZXJhdGVUeXBlc0Zyb21TcGVjcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBuZXN0ZWRJbnRlcmZhY2VzLmxlbmd0aCA9IDA7XG4gICAgdmFyIG1haW5JbnRlcmZhY2VzID0gW107XG4gICAgdmFyIGRvbWFpbnMgPSAoMCwgc3BlY1JlZ2lzdHJ5XzEubGlzdEFsbFNwZWNzKSgpO1xuICAgIGZvciAodmFyIF9pID0gMCwgZG9tYWluc18xID0gZG9tYWluczsgX2kgPCBkb21haW5zXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkb21haW4gPSBkb21haW5zXzFbX2ldO1xuICAgICAgICB2YXIgc3BlYyA9ICgwLCBzcGVjUmVnaXN0cnlfMS5nZXRTcGVjQnlOYW1lKShkb21haW4pO1xuICAgICAgICBpZiAoIXNwZWMpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgdmFyIGRvbWFpbkludGVyZmFjZU5hbWUgPSBjYXBpdGFsaXplKGRvbWFpbik7XG4gICAgICAgIHZhciBtYWluSW50ZXJmYWNlID0gZ2VuZXJhdGVJbnRlcmZhY2VGcm9tRmllbGRzKGRvbWFpbkludGVyZmFjZU5hbWUsIHNwZWMuZmllbGRzLCBkb21haW4pO1xuICAgICAgICBtYWluSW50ZXJmYWNlcy5wdXNoKG1haW5JbnRlcmZhY2UpO1xuICAgIH1cbiAgICByZXR1cm4gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBtYWluSW50ZXJmYWNlcywgdHJ1ZSksIG5lc3RlZEludGVyZmFjZXMsIHRydWUpLmpvaW4oJ1xcblxcbicpO1xufTtcbmV4cG9ydHMuZ2VuZXJhdGVUeXBlc0Zyb21TcGVjcyA9IGdlbmVyYXRlVHlwZXNGcm9tU3BlY3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudHJhaW5fc2ltaWxhcml0eV9tb2RlbCA9IHZvaWQgMDtcbnZhciBheGlvcyA9IHJlcXVpcmUoXCJheGlvc1wiKTtcbnZhciBPTkVBVVRIX0FQSSA9IHByb2Nlc3MuZW52Lk9ORUFVVEhfQVBJIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo0MDEwL2FwaVwiO1xudmFyIEFJX0FQSSA9IHByb2Nlc3MuZW52LkFJX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMy9hcGlcIjtcbnZhciB0cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gZnVuY3Rpb24gKHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgcmV0dXJuIFsyLCB7IFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiIH1dO1xuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwgPSB0cmFpbl9zaW1pbGFyaXR5X21vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgaGFuZGxlcl8xID0gcmVxdWlyZShcIi4uLy4uL2hhbmRsZXJcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHJvdXRlci5nZXQoXCIvYWRtaW5cIiwgZnVuY3Rpb24gKF8sIHJlcykge1xuICAgICAgICByZXMuc2VuZChcImJhc2ljIGNvbm5lY3Rpb24gdG8gc2VydmVyIHdvcmtzLiBkYXRhYmFzZSBjb25uZWN0aW9uIGlzIG5vdCB2YWxpZGF0ZWRcIik7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICB9KTtcbiAgICByb3V0ZXIuZ2V0KFwiL2FkbWluLzpzcGFjZS90cmFpblwiLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwpKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gdm9pZCAwO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciB0cmFpbl9zaW1pbGFyaXR5X21vZGVsID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBub3RlO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci50cmFpbl9zaW1pbGFyaXR5X21vZGVsKHJlcS5wYXJhbXMuc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBub3RlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChub3RlKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnRyYWluX3NpbWlsYXJpdHlfbW9kZWwgPSB0cmFpbl9zaW1pbGFyaXR5X21vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZFJvbGUgPSB2b2lkIDA7XG52YXIgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG52YXIgT05FQVVUSF9BUEkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAxMC9hcGlcIjtcbnZhciBPTkVBVVRIX0FQSV9TUEFDRSA9IHByb2Nlc3MuZW52Lk9ORUFVVEhfQVBJX1NQQUNFIHx8IFwiMjEyXCI7XG52YXIgT05FQVVUSF9BUElfS0VZID0gcHJvY2Vzcy5lbnYuT05FQVVUSF9BUElfS0VZIHx8IFwiMWQ5NTI0YTYtMzBkZi00YjNjLTk0MDItNTAzZjQwMTE4OTZjXCI7XG52YXIgYWRkUm9sZSA9IGZ1bmN0aW9uIChlbWFpbCwgY29tcGFueUlkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXNwb25zZSwgZXJyXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgYXhpb3MucG9zdChcIlwiLmNvbmNhdChPTkVBVVRIX0FQSSwgXCIvXCIpLmNvbmNhdChPTkVBVVRIX0FQSV9TUEFDRSwgXCIvYWRtaW4vcGVybWlzc2lvblwiKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBcIkFERFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGVOYW1lOiBcIkNPTVBBTllfQURNSU5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlOiBjb21wYW55SWRcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb246IE9ORUFVVEhfQVBJX0tFWSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwge31dO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlc3BvbnNlLmRhdGEgfHwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5hZGRSb2xlID0gYWRkUm9sZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZXNldHZhbCA9IGV4cG9ydHMubmV4dHZhbCA9IGV4cG9ydHMuY3JlYXRlX3NlcXVlbmNlID0gdm9pZCAwO1xudmFyIF9hID0gcmVxdWlyZSgnLi9tb2RlbCcpLCBzZXF1ZW5jZUNvbGxlY3Rpb24gPSBfYS5zZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hID0gX2Euc2VxdWVuY2VTY2hlbWE7XG52YXIgX2IgPSByZXF1aXJlKCcuLi8uLi9saWIvZGJ1dGlscycpLCBnZXRHbG9iYWxDb2xsZWN0aW9uID0gX2IuZ2V0R2xvYmFsQ29sbGVjdGlvbiwgZ2V0Q29sbGVjdGlvbiA9IF9iLmdldENvbGxlY3Rpb247XG52YXIgY3JlYXRlX3NlcXVlbmNlID0gZnVuY3Rpb24gKGZpZWxkLCBjb250ZXh0LCBmYWN0b3IsIHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgZXhpc3Rpbmdfc2VxdWVuY2U7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZXhpc3Rpbmdfc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nX3NlcXVlbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgZXhpc3Rpbmdfc2VxdWVuY2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQgfSwgeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQsIGZhY3RvcjogZmFjdG9yLCBuZXh0dmFsOiAxIH0sIHsgdXBzZXJ0OiB0cnVlLCBuZXc6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5jcmVhdGVfc2VxdWVuY2UgPSBjcmVhdGVfc2VxdWVuY2U7XG52YXIgbmV4dHZhbCA9IGZ1bmN0aW9uIChmaWVsZCwgY29udGV4dCwgc3BhY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsLCBzZXF1ZW5jZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBpZiAoc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBnZXRDb2xsZWN0aW9uKHNwYWNlLCBzZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0R2xvYmFsQ29sbGVjdGlvbihzZXF1ZW5jZUNvbGxlY3Rpb24sIHNlcXVlbmNlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgZmllbGQ6IGZpZWxkLCBjb250ZXh0OiBjb250ZXh0IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoISFzZXF1ZW5jZSkgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsICgwLCBleHBvcnRzLmNyZWF0ZV9zZXF1ZW5jZSkoZmllbGQsIGNvbnRleHQgfHwgbnVsbCwgMSwgc3BhY2UpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kT25lKHsgZmllbGQ6IGZpZWxkLCBjb250ZXh0OiBjb250ZXh0IH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBzZXF1ZW5jZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbNCwgbW9kZWwuZmluZE9uZUFuZFVwZGF0ZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9LCB7IG5leHR2YWw6IHNlcXVlbmNlLm5leHR2YWwgKyBzZXF1ZW5jZS5mYWN0b3IgfSwgeyB1cHNlcnQ6IHRydWUsIG5ldzogdHJ1ZSB9KV07XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgc2VxdWVuY2UubmV4dHZhbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5uZXh0dmFsID0gbmV4dHZhbDtcbnZhciByZXNldHZhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZmllbGQsIGNvbnRleHQsIHNwYWNlKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbCwgc2VxdWVuY2U7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gZ2V0Q29sbGVjdGlvbihzcGFjZSwgc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IGdldEdsb2JhbENvbGxlY3Rpb24oc2VxdWVuY2VDb2xsZWN0aW9uLCBzZXF1ZW5jZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCEhc2VxdWVuY2UpIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgZXhwb3J0cy5jcmVhdGVfc2VxdWVuY2UpKGZpZWxkLCBjb250ZXh0IHx8IG51bGwsIDEsIHNwYWNlKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGZpZWxkOiBmaWVsZCwgY29udGV4dDogY29udGV4dCB9KV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgc2VxdWVuY2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSA0O1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzQsIG1vZGVsLmZpbmRPbmVBbmRVcGRhdGUoeyBmaWVsZDogZmllbGQsIGNvbnRleHQ6IGNvbnRleHQgfSwgeyBuZXh0dmFsOiB2YWx1ZSB9LCB7IHVwc2VydDogdHJ1ZSwgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnJlc2V0dmFsID0gcmVzZXR2YWw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc2Vzc2lvbkNvbGxlY3Rpb24gPSBleHBvcnRzLnNlc3Npb25TY2hlbWEgPSB2b2lkIDA7XG52YXIgbW9uZ29vc2UgPSByZXF1aXJlKFwibW9uZ29vc2VcIik7XG52YXIgU2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hO1xudmFyIHNlc3Npb25TY2hlbWEgPSBuZXcgU2NoZW1hKHtcbiAgICBzZXNzaW9uSWQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgdG9rZW46IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgdHlwZTogeyB0eXBlOiBTdHJpbmcgfSxcbn0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcbmV4cG9ydHMuc2Vzc2lvblNjaGVtYSA9IHNlc3Npb25TY2hlbWE7XG52YXIgc2Vzc2lvbkNvbGxlY3Rpb24gPSBcInNlc3Npb25cIjtcbmV4cG9ydHMuc2Vzc2lvbkNvbGxlY3Rpb24gPSBzZXNzaW9uQ29sbGVjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycyA9IGV4cG9ydHMuYnVpbGRRdWVyeUZyb21GaWx0ZXJzID0gdm9pZCAwO1xudmFyIGJ1aWxkUXVlcnlGcm9tRmlsdGVycyA9IGZ1bmN0aW9uIChxdWVyeVBhcmFtcywgc3BlYykge1xuICAgIHZhciBtb25nb1F1ZXJ5ID0ge307XG4gICAgZm9yICh2YXIgZmllbGQgaW4gcXVlcnlQYXJhbXMpIHtcbiAgICAgICAgdmFyIGZpbHRlclZhbHVlID0gcXVlcnlQYXJhbXNbZmllbGRdO1xuICAgICAgICB2YXIgZmllbGRTcGVjID0gc3BlY1tmaWVsZF07XG4gICAgICAgIGlmICghZmllbGRTcGVjKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIHN3aXRjaCAoZmllbGRTcGVjLmZpbHRlcikge1xuICAgICAgICAgICAgY2FzZSBcImxpa2VcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJHJlZ2V4OiBuZXcgUmVnRXhwKGZpbHRlclZhbHVlLCBcImlcIikgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJpblwiOlxuICAgICAgICAgICAgICAgIG1vbmdvUXVlcnlbZmllbGRdID0geyAkaW46IEFycmF5LmlzQXJyYXkoZmlsdGVyVmFsdWUpID8gZmlsdGVyVmFsdWUgOiBbZmlsdGVyVmFsdWVdIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZ3RcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGd0OiBmaWx0ZXJWYWx1ZSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImx0XCI6XG4gICAgICAgICAgICAgICAgbW9uZ29RdWVyeVtmaWVsZF0gPSB7ICRsdDogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJndGVcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGd0ZTogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJsdGVcIjpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IHsgJGx0ZTogZmlsdGVyVmFsdWUgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJleGFjdFwiOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtb25nb1F1ZXJ5W2ZpZWxkXSA9IGZpbHRlclZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb25nb1F1ZXJ5O1xufTtcbmV4cG9ydHMuYnVpbGRRdWVyeUZyb21GaWx0ZXJzID0gYnVpbGRRdWVyeUZyb21GaWx0ZXJzO1xudmFyIGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzID0gZnVuY3Rpb24gKGZpbHRlcnMsIHNwZWMpIHtcbiAgICB2YXIgbW9uZ29RdWVyeSA9IHt9O1xuICAgIGZvciAodmFyIGZpZWxkIGluIGZpbHRlcnMpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZmlsdGVyc1tmaWVsZF07XG4gICAgICAgIHZhciBmaWVsZFNwZWMgPSBzcGVjW2ZpZWxkXTtcbiAgICAgICAgaWYgKCFmaWVsZFNwZWMpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBvcGVyYXRvcnMgPSB7XG4gICAgICAgICAgICAgICAgZXE6IFwiJGVxXCIsXG4gICAgICAgICAgICAgICAgbmU6IFwiJG5lXCIsXG4gICAgICAgICAgICAgICAgZ3Q6IFwiJGd0XCIsXG4gICAgICAgICAgICAgICAgZ3RlOiBcIiRndGVcIixcbiAgICAgICAgICAgICAgICBsdDogXCIkbHRcIixcbiAgICAgICAgICAgICAgICBsdGU6IFwiJGx0ZVwiLFxuICAgICAgICAgICAgICAgIGluOiBcIiRpblwiLFxuICAgICAgICAgICAgICAgIG5pbjogXCIkbmluXCIsXG4gICAgICAgICAgICAgICAgcmVnZXg6IFwiJHJlZ2V4XCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgbW9uZ29PcHMgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIG9wIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdG9yc1tvcF0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9uZ29PcHNbb3BlcmF0b3JzW29wXV0gPSB2YWx1ZVtvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9uZ29RdWVyeVtmaWVsZF0gPSBtb25nb09wcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1vbmdvUXVlcnlbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vbmdvUXVlcnk7XG59O1xuZXhwb3J0cy5idWlsZFF1ZXJ5RnJvbUFkdmFuY2VkRmlsdGVycyA9IGJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZXhwcmVzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzXCIpKTtcbnZhciBzZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zZXJ2aWNlXCIpO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgcm91dGVyID0gZXhwcmVzc18xLmRlZmF1bHQuUm91dGVyKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICByb3V0ZXJcbiAgICAgICAgLnJvdXRlKFwiL3Jlc291cmNlcy1kZXAvOnNwYWNlLzpkb21haW5cIilcbiAgICAgICAgLmdldChtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLmdldEFsbClcbiAgICAgICAgLnBvc3QobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS5jcmVhdGVPbmUpO1xuICAgIHJvdXRlclxuICAgICAgICAucm91dGUoXCIvcmVzb3VyY2VzLWRlcC86c3BhY2UvOmRvbWFpbi86cmVmZXJlbmNlXCIpXG4gICAgICAgIC5nZXQobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS5nZXRCeVJlZmVyZW5jZSlcbiAgICAgICAgLnB1dChtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLnVwZGF0ZU9uZSlcbiAgICAgICAgLnBhdGNoKG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEucGF0Y2hPbmUpXG4gICAgICAgIC5kZWxldGUobWlkZGxld2FyZXNfMS5hdXRob3JpemVBcGksIHNlcnZpY2VfMS5kZWxldGVPbmUpO1xuICAgIHJvdXRlci5wb3N0KFwiL3Jlc291cmNlcy1kZXAvOnNwYWNlLzpkb21haW4vc2VhcmNoXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuc2VhcmNoKTtcbiAgICByb3V0ZXIuZ2V0KFwiL2luZmVyZW5jZS9yZXNvdXJjZXMtZGVwXCIsIHNlcnZpY2VfMS5pbmZlclR5cGVzKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNPcGVyYXRpb25BbGxvd2VkID0gZXhwb3J0cy5maWxsTWlzc2luZ0ZpZWxkcyA9IGV4cG9ydHMudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQgPSBleHBvcnRzLmxvYWRDaGlsZHJlbiA9IGV4cG9ydHMubG9hZFNwZWMgPSB2b2lkIDA7XG52YXIgZnNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZnNcIikpO1xudmFyIHBhdGhfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicGF0aFwiKSk7XG52YXIgZG9tYWluc18xID0gcmVxdWlyZShcIi4uLy4uL3NwZWNzL2RvbWFpbnNcIik7XG52YXIgbG9hZFNwZWMgPSBmdW5jdGlvbiAoZG9tYWluKSB7XG4gICAgdmFyIHNwZWMgPSBkb21haW5zXzEuc3BlY3NNYXBbZG9tYWluXTtcbiAgICBpZiAoIXNwZWMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc2NoZW1hIHNwZWMgZm91bmQgZm9yIGRvbWFpbiAnXCIuY29uY2F0KGRvbWFpbiwgXCInXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNwZWM7XG59O1xuZXhwb3J0cy5sb2FkU3BlYyA9IGxvYWRTcGVjO1xudmFyIGxvYWRDaGlsZHJlbiA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICByZXR1cm4gZG9tYWluc18xLmNoaWxkcmVuTWFwW2RvbWFpbl0gfHwgW107XG59O1xuZXhwb3J0cy5sb2FkQ2hpbGRyZW4gPSBsb2FkQ2hpbGRyZW47XG52YXIgdmFsaWRhdGVBbmRTaGFwZVBheWxvYWQgPSBmdW5jdGlvbiAocGF5bG9hZCwgc3BlYywgcGF0aCwgb3B0aW9ucykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgaWYgKHBhdGggPT09IHZvaWQgMCkgeyBwYXRoID0gXCJcIjsgfVxuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgdmFyIGVycm9ycyA9IFtdO1xuICAgIHZhciBzaGFwZWREYXRhID0ge307XG4gICAgdmFyIGFsbG93UGFydGlhbCA9IChfYSA9IG9wdGlvbnMuYWxsb3dQYXJ0aWFsKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBmYWxzZTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3BlYy5maWVsZHMpIHtcbiAgICAgICAgdmFyIGZpZWxkU3BlYyA9IHNwZWMuZmllbGRzW2tleV07XG4gICAgICAgIHZhciBmdWxsUGF0aCA9IHBhdGggPyBcIlwiLmNvbmNhdChwYXRoLCBcIi5cIikuY29uY2F0KGtleSkgOiBrZXk7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBheWxvYWQgPT09IG51bGwgfHwgcGF5bG9hZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGF5bG9hZFtrZXldO1xuICAgICAgICB2YXIgaXNWYWx1ZVByZXNlbnQgPSB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICAgICAgICBpZiAoIWFsbG93UGFydGlhbCAmJiBmaWVsZFNwZWMucmVxdWlyZWQgJiYgIWlzVmFsdWVQcmVzZW50KSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgaXMgcmVxdWlyZWRcIikpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1ZhbHVlUHJlc2VudCkge1xuICAgICAgICAgICAgaWYgKCFhbGxvd1BhcnRpYWwpIHtcbiAgICAgICAgICAgICAgICBzaGFwZWREYXRhW2tleV0gPSBnZXREZWZhdWx0Rm9yVHlwZShmaWVsZFNwZWMudHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGRTcGVjLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCIgc2hvdWxkIGJlIGFuIG9iamVjdFwiKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmVzdGVkID0gKDAsIGV4cG9ydHMudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQpKHZhbHVlLCBmaWVsZFNwZWMuc2NoZW1hIHx8IHt9LCBmdWxsUGF0aCwgb3B0aW9ucyk7XG4gICAgICAgICAgICBlcnJvcnMucHVzaC5hcHBseShlcnJvcnMsIG5lc3RlZC5lcnJvcnMpO1xuICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gbmVzdGVkLnNoYXBlZERhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmllbGRTcGVjLnR5cGUgPT09IFwiYXJyYXlcIikge1xuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIiBzaG91bGQgYmUgYW4gYXJyYXlcIikpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hhcGVkRGF0YVtrZXldID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVBhdGggPSBcIlwiLmNvbmNhdChmdWxsUGF0aCwgXCJbXCIpLmNvbmNhdChpLCBcIl1cIik7XG4gICAgICAgICAgICAgICAgaWYgKCgoX2IgPSBmaWVsZFNwZWMuc2NoZW1hKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IudHlwZSkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5lc3RlZCA9ICgwLCBleHBvcnRzLnZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkKShpdGVtLCBmaWVsZFNwZWMuc2NoZW1hLnNjaGVtYSB8fCB7fSwgaXRlbVBhdGgsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaC5hcHBseShlcnJvcnMsIG5lc3RlZC5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZWREYXRhW2tleV0ucHVzaChuZXN0ZWQuc2hhcGVkRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gIT09IGZpZWxkU3BlYy5zY2hlbWEudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoaXRlbVBhdGgsIFwiIHNob3VsZCBiZSBvZiB0eXBlIFwiKS5jb25jYXQoZmllbGRTcGVjLnNjaGVtYS50eXBlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZWREYXRhW2tleV0ucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IGZpZWxkU3BlYy50eXBlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJcIi5jb25jYXQoZnVsbFBhdGgsIFwiIHNob3VsZCBiZSBvZiB0eXBlIFwiKS5jb25jYXQoZmllbGRTcGVjLnR5cGUpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoYXBlZERhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiBlcnJvcnMubGVuZ3RoID09PSAwLCBlcnJvcnM6IGVycm9ycywgc2hhcGVkRGF0YTogc2hhcGVkRGF0YSB9O1xufTtcbmV4cG9ydHMudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQgPSB2YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZDtcbnZhciBnZXREZWZhdWx0Rm9yVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOiByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjYXNlIFwiYXJyYXlcIjogcmV0dXJuIFtdO1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6IHJldHVybiB7fTtcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59O1xudmFyIGZpbGxNaXNzaW5nRmllbGRzID0gZnVuY3Rpb24gKGRvYywgc3BlYykge1xuICAgIHZhciBzaGFwZWQgPSB7IGlkOiBkb2MuX2lkLCByZWZlcmVuY2U6IGRvYy5yZWZlcmVuY2UsIGNyZWF0ZWRCeTogZG9jLmNyZWF0ZWRCeSwgY3JlYXRlZEF0OiBkb2MuY3JlYXRlZEF0LCB1cGRhdGVkQnk6IGRvYy51cGRhdGVkQnksIHVwZGF0ZWRBdDogZG9jLnVwZGF0ZWRBdCB9O1xuICAgIGZvciAodmFyIGZpZWxkIGluIHNwZWMuZmllbGRzKSB7XG4gICAgICAgIGlmIChkb2MuaGFzT3duUHJvcGVydHkoZmllbGQpKSB7XG4gICAgICAgICAgICBzaGFwZWRbZmllbGRdID0gZG9jW2ZpZWxkXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNoYXBlZFtmaWVsZF0gPSBzcGVjLmZpZWxkc1tmaWVsZF0udHlwZSA9PT0gXCJhcnJheVwiID8gW10gOiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzaGFwZWQ7XG59O1xuZXhwb3J0cy5maWxsTWlzc2luZ0ZpZWxkcyA9IGZpbGxNaXNzaW5nRmllbGRzO1xudmFyIGlzT3BlcmF0aW9uQWxsb3dlZCA9IGZ1bmN0aW9uIChkb21haW4sIG9wZXJhdGlvbikge1xuICAgIHZhciBmaWxlUGF0aCA9IHBhdGhfMS5kZWZhdWx0LmpvaW4oX19kaXJuYW1lLCBcIi4vc3BlY3MvZG9tYWlucy9cIiwgXCJcIi5jb25jYXQoZG9tYWluLCBcIi5leGNsdWRlLmpzb25cIikpO1xuICAgIGlmICghZnNfMS5kZWZhdWx0LmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgZXhjbHVkZWRPcHMgPSBKU09OLnBhcnNlKGZzXzEuZGVmYXVsdC5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIFwidXRmLThcIikpO1xuICAgIHJldHVybiAhZXhjbHVkZWRPcHMuaW5jbHVkZXMoXCIqXCIpICYmICFleGNsdWRlZE9wcy5pbmNsdWRlcyhvcGVyYXRpb24pO1xufTtcbmV4cG9ydHMuaXNPcGVyYXRpb25BbGxvd2VkID0gaXNPcGVyYXRpb25BbGxvd2VkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChnICYmIChnID0gMCwgb3BbMF0gJiYgKF8gPSAwKSksIF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSwgcGFjaykge1xuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbmZlclR5cGVzID0gZXhwb3J0cy5kZWxldGVPbmUgPSBleHBvcnRzLnBhdGNoT25lID0gZXhwb3J0cy51cGRhdGVPbmUgPSBleHBvcnRzLmNyZWF0ZU9uZSA9IGV4cG9ydHMuZ2V0QnlSZWZlcmVuY2UgPSBleHBvcnRzLnNlYXJjaCA9IGV4cG9ydHMuZ2V0QWxsID0gdm9pZCAwO1xudmFyIG5hbm9pZF8xID0gcmVxdWlyZShcIm5hbm9pZFwiKTtcbnZhciBzY2hlbWFWYWxpZGF0b3JfMSA9IHJlcXVpcmUoXCIuL3NjaGVtYVZhbGlkYXRvclwiKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgZmlsdGVyQnVpbGRlcl8xID0gcmVxdWlyZShcIi4vZmlsdGVyQnVpbGRlclwiKTtcbnZhciB0eXBlSW5mZXJlbmNlXzEgPSByZXF1aXJlKFwiLi90eXBlSW5mZXJlbmNlXCIpO1xudmFyIGFscGhhbnVtZXJpY0FscGhhYmV0ID0gJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbnZhciBuYW5vaWQgPSAoMCwgbmFub2lkXzEuY3VzdG9tQWxwaGFiZXQpKGFscGhhbnVtZXJpY0FscGhhYmV0LCA4KTtcbnZhciBjaGVja1BhcmVudFJlZmVyZW5jZXMgPSBmdW5jdGlvbiAoc2hhcGVkRGF0YV8xLCBzcGVjXzEsIHNwYWNlXzEsIHJlc18xKSB7XG4gICAgdmFyIGFyZ3NfMSA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gNDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NfMVtfaSAtIDRdID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW3NoYXBlZERhdGFfMSwgc3BlY18xLCBzcGFjZV8xLCByZXNfMV0sIGFyZ3NfMSwgdHJ1ZSksIHZvaWQgMCwgZnVuY3Rpb24gKHNoYXBlZERhdGEsIHNwZWMsIHNwYWNlLCByZXMsIHBhdGgpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBmaWVsZE5hbWUsIGZpZWxkU3BlYywgdmFsdWUsIGZ1bGxQYXRoLCBwYXJlbnRNb2RlbCwgZm91bmQsIG9rLCBpdGVtU2NoZW1hLCBpLCBpdGVtLCBpdGVtUGF0aCwgb2ssIHBhcmVudE1vZGVsLCBmb3VuZDtcbiAgICAgICAgaWYgKHBhdGggPT09IHZvaWQgMCkgeyBwYXRoID0gXCJcIjsgfVxuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9lKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9lLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfYSA9IHNwZWMuZmllbGRzO1xuICAgICAgICAgICAgICAgICAgICBfYiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKF9jIGluIF9hKVxuICAgICAgICAgICAgICAgICAgICAgICAgX2IucHVzaChfYyk7XG4gICAgICAgICAgICAgICAgICAgIF9kID0gMDtcbiAgICAgICAgICAgICAgICAgICAgX2UubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2QgPCBfYi5sZW5ndGgpKSByZXR1cm4gWzMsIDEyXTtcbiAgICAgICAgICAgICAgICAgICAgX2MgPSBfYltfZF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghKF9jIGluIF9hKSkgcmV0dXJuIFszLCAxMV07XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZSA9IF9jO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZFNwZWMgPSBzcGVjLmZpZWxkc1tmaWVsZE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHNoYXBlZERhdGEgPT09IG51bGwgfHwgc2hhcGVkRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2hhcGVkRGF0YVtmaWVsZE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBmdWxsUGF0aCA9IHBhdGggPyBcIlwiLmNvbmNhdChwYXRoLCBcIi5cIikuY29uY2F0KGZpZWxkTmFtZSkgOiBmaWVsZE5hbWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGZpZWxkU3BlYy50eXBlID09PSBcInN0cmluZ1wiIHx8IGZpZWxkU3BlYy50eXBlID09PSBcIm51bWJlclwiIHx8IGZpZWxkU3BlYy50eXBlID09PSBcImJvb2xlYW5cIikpIHJldHVybiBbMywgM107XG4gICAgICAgICAgICAgICAgICAgIGlmICghKFwicGFyZW50XCIgaW4gZmllbGRTcGVjICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiBmaWVsZFNwZWMucGFyZW50KSkgcmV0dXJuIFszLCAzXTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50TW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBmaWVsZFNwZWMucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBwYXJlbnRNb2RlbC5maW5kT25lKHsgcmVmZXJlbmNlOiB2YWx1ZSB9KV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBcIkludmFsaWQgcGFyZW50IHJlZmVyZW5jZSAnXCIuY29uY2F0KHZhbHVlLCBcIicgZm9yICdcIikuY29uY2F0KGZ1bGxQYXRoLCBcIicgaW4gZG9tYWluICdcIikuY29uY2F0KGZpZWxkU3BlYy5wYXJlbnQsIFwiJ1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBmYWxzZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2UubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZmllbGRTcGVjLnR5cGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkpIHJldHVybiBbMywgNV07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgY2hlY2tQYXJlbnRSZWZlcmVuY2VzKHZhbHVlLCBmaWVsZFNwZWMuc2NoZW1hLCBzcGFjZSwgcmVzLCBmdWxsUGF0aCldO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgb2sgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb2spXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgX2UubGFiZWwgPSA1O1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoZmllbGRTcGVjLnR5cGUgPT09IFwiYXJyYXlcIiAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkpIHJldHVybiBbMywgMTFdO1xuICAgICAgICAgICAgICAgICAgICBpdGVtU2NoZW1hID0gZmllbGRTcGVjLnNjaGVtYTtcbiAgICAgICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIF9lLmxhYmVsID0gNjtcbiAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGkgPCB2YWx1ZS5sZW5ndGgpKSByZXR1cm4gWzMsIDExXTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHZhbHVlW2ldO1xuICAgICAgICAgICAgICAgICAgICBpdGVtUGF0aCA9IFwiXCIuY29uY2F0KGZ1bGxQYXRoLCBcIltcIikuY29uY2F0KGksIFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoaXRlbVNjaGVtYS50eXBlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSkgcmV0dXJuIFszLCA4XTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBjaGVja1BhcmVudFJlZmVyZW5jZXMoaXRlbSwgaXRlbVNjaGVtYS5zY2hlbWEsIHNwYWNlLCByZXMsIGl0ZW1QYXRoKV07XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICBvayA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvaylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgZmFsc2VdO1xuICAgICAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDg7XG4gICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISgoaXRlbVNjaGVtYS50eXBlID09PSBcInN0cmluZ1wiIHx8IGl0ZW1TY2hlbWEudHlwZSA9PT0gXCJudW1iZXJcIikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyZW50XCIgaW4gaXRlbVNjaGVtYSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGl0ZW0gPT09IFwic3RyaW5nXCIgJiYgaXRlbVNjaGVtYS5wYXJlbnQpKSByZXR1cm4gWzMsIDEwXTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50TW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBpdGVtU2NoZW1hLnBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgcGFyZW50TW9kZWwuZmluZE9uZSh7IHJlZmVyZW5jZTogaXRlbSB9KV07XG4gICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBcIkludmFsaWQgcGFyZW50IHJlZmVyZW5jZSAnXCIuY29uY2F0KGl0ZW0sIFwiJyBmb3IgJ1wiKS5jb25jYXQoaXRlbVBhdGgsIFwiJyBpbiBkb21haW4gJ1wiKS5jb25jYXQoaXRlbVNjaGVtYS5wYXJlbnQsIFwiJ1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBmYWxzZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2UubGFiZWwgPSAxMDtcbiAgICAgICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMywgNl07XG4gICAgICAgICAgICAgICAgY2FzZSAxMTpcbiAgICAgICAgICAgICAgICAgICAgX2QrKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCAxXTtcbiAgICAgICAgICAgICAgICBjYXNlIDEyOiByZXR1cm4gWzIsIHRydWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG52YXIgZGVsZXRlQ2hpbGRSZWNvcmRzID0gZnVuY3Rpb24gKHJlZmVyZW5jZSwgY2hpbGRyZW4sIGRvbWFpbiwgc3BhY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9pLCBjaGlsZHJlbl8xLCBjaGlsZERvbWFpbiwgY2hpbGRNb2RlbCwgcmVmRmllbGQ7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIGlmICghY2hpbGRyZW4gfHwgIUFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIF9pID0gMCwgY2hpbGRyZW5fMSA9IGNoaWxkcmVuO1xuICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBpZiAoIShfaSA8IGNoaWxkcmVuXzEubGVuZ3RoKSkgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICBjaGlsZERvbWFpbiA9IGNoaWxkcmVuXzFbX2ldO1xuICAgICAgICAgICAgICAgIGNoaWxkTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBjaGlsZERvbWFpbik7XG4gICAgICAgICAgICAgICAgcmVmRmllbGQgPSBcIlwiLmNvbmNhdChkb21haW4sIFwiUmVmZXJlbmNlXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgY2hpbGRNb2RlbC5kZWxldGVNYW55KChfYSA9IHt9LCBfYVtyZWZGaWVsZF0gPSByZWZlcmVuY2UsIF9hKSldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDM7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgX2krKztcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDFdO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbnZhciBnZXRBbGwgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCBfYiwgX2MsIHBhZ2UsIF9kLCBsaW1pdCwgcmF3RmlsdGVycywgTW9kZWwsIHNwZWNfMSwgZmlsdGVycywgZG9jcywgdG90YWwsIHNoYXBlZCwgZXJyXzE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZSkge1xuICAgICAgICBzd2l0Y2ggKF9lLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW47XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgc2NoZW1hVmFsaWRhdG9yXzEuaXNPcGVyYXRpb25BbGxvd2VkKShkb21haW4sIFwic2VhcmNoXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJPcGVyYXRpb24gJ3NlYXJjaCcgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhpcyBkb21haW5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9iID0gcmVxLnF1ZXJ5LCBfYyA9IF9iLnBhZ2UsIHBhZ2UgPSBfYyA9PT0gdm9pZCAwID8gMSA6IF9jLCBfZCA9IF9iLmxpbWl0LCBsaW1pdCA9IF9kID09PSB2b2lkIDAgPyAxMCA6IF9kLCByYXdGaWx0ZXJzID0gX19yZXN0KF9iLCBbXCJwYWdlXCIsIFwibGltaXRcIl0pO1xuICAgICAgICAgICAgICAgIGlmICgrcGFnZSA8IDEgfHwgK2xpbWl0IDwgMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiUGFnZSBhbmQgbGltaXQgbXVzdCBiZSA+PSAxLlwiIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2UubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9lLnRyeXMucHVzaChbMSwgNCwgLCA1XSk7XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHNwZWNfMSA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5sb2FkU3BlYykoZG9tYWluKTtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0gKDAsIGZpbHRlckJ1aWxkZXJfMS5idWlsZFF1ZXJ5RnJvbUZpbHRlcnMpKHJhd0ZpbHRlcnMsIHNwZWNfMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kKGZpbHRlcnMpLnNraXAoKCtwYWdlIC0gMSkgKiArbGltaXQpLmxpbWl0KCtsaW1pdCldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGRvY3MgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5jb3VudERvY3VtZW50cyhmaWx0ZXJzKV07XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgdG90YWwgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgc2hhcGVkID0gZG9jcy5tYXAoZnVuY3Rpb24gKGRvYykgeyByZXR1cm4gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmZpbGxNaXNzaW5nRmllbGRzKShkb2MudG9PYmplY3QoKSwgc3BlY18xKTsgfSk7XG4gICAgICAgICAgICAgICAgcmVzLmpzb24oe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBzaGFwZWQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiB0b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogK3BhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGxpbWl0OiArbGltaXQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM6IE1hdGguY2VpbCh0b3RhbCAvICtsaW1pdClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDVdO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGVycl8xID0gX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiRmFpbGVkIHRvIGZldGNoIHJlY29yZHNcIiwgZGV0YWlsczogZXJyXzEubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDVdO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0QWxsID0gZ2V0QWxsO1xudmFyIHNlYXJjaCA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIF9iLCBfYywgZmlsdGVycywgX2QsIHBhZ2luYXRpb24sIF9lLCBwYWdlLCBfZiwgbGltaXQsIE1vZGVsLCBzcGVjXzIsIG1vbmdvUXVlcnksIGRvY3MsIHRvdGFsLCBzaGFwZWQsIGVycl8yO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2cpIHtcbiAgICAgICAgc3dpdGNoIChfZy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcInNlYXJjaFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiT3BlcmF0aW9uICdzZWFyY2gnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYiA9IHJlcS5ib2R5LCBfYyA9IF9iLmZpbHRlcnMsIGZpbHRlcnMgPSBfYyA9PT0gdm9pZCAwID8ge30gOiBfYywgX2QgPSBfYi5wYWdpbmF0aW9uLCBwYWdpbmF0aW9uID0gX2QgPT09IHZvaWQgMCA/IHt9IDogX2Q7XG4gICAgICAgICAgICAgICAgX2UgPSBwYWdpbmF0aW9uLnBhZ2UsIHBhZ2UgPSBfZSA9PT0gdm9pZCAwID8gMSA6IF9lLCBfZiA9IHBhZ2luYXRpb24ubGltaXQsIGxpbWl0ID0gX2YgPT09IHZvaWQgMCA/IDEwIDogX2Y7XG4gICAgICAgICAgICAgICAgaWYgKCtwYWdlIDwgMSB8fCArbGltaXQgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJQYWdlIGFuZCBsaW1pdCBtdXN0IGJlID49IDEuXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfZy5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2cudHJ5cy5wdXNoKFsxLCA0LCAsIDVdKTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgc3BlY18yID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmxvYWRTcGVjKShkb21haW4pO1xuICAgICAgICAgICAgICAgIG1vbmdvUXVlcnkgPSAoMCwgZmlsdGVyQnVpbGRlcl8xLmJ1aWxkUXVlcnlGcm9tQWR2YW5jZWRGaWx0ZXJzKShmaWx0ZXJzLCBzcGVjXzIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZpbHRlcnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuZmluZChtb25nb1F1ZXJ5KS5za2lwKCgrcGFnZSAtIDEpICogK2xpbWl0KS5saW1pdCgrbGltaXQpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkb2NzID0gX2cuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuY291bnREb2N1bWVudHMobW9uZ29RdWVyeSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHRvdGFsID0gX2cuc2VudCgpO1xuICAgICAgICAgICAgICAgIHNoYXBlZCA9IGRvY3MubWFwKGZ1bmN0aW9uIChkb2MpIHsgcmV0dXJuICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5maWxsTWlzc2luZ0ZpZWxkcykoZG9jLnRvT2JqZWN0KCksIHNwZWNfMik7IH0pO1xuICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogc2hhcGVkLFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogdG90YWwsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6ICtwYWdlLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogK2xpbWl0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFBhZ2VzOiBNYXRoLmNlaWwodG90YWwgLyArbGltaXQpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBlcnJfMiA9IF9nLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIlNlYXJjaCBmYWlsZWRcIiwgZGV0YWlsczogZXJyXzIubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDVdO1xuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuc2VhcmNoID0gc2VhcmNoO1xudmFyIGdldEJ5UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgcmVmZXJlbmNlLCBNb2RlbCwgc3BlYywgZG9jLCBlcnJfMztcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgIHN3aXRjaCAoX2IubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBfYSA9IHJlcS5wYXJhbXMsIHNwYWNlID0gX2Euc3BhY2UsIGRvbWFpbiA9IF9hLmRvbWFpbiwgcmVmZXJlbmNlID0gX2EucmVmZXJlbmNlO1xuICAgICAgICAgICAgICAgIGlmICghKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmlzT3BlcmF0aW9uQWxsb3dlZCkoZG9tYWluLCBcImdldFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiT3BlcmF0aW9uICdnZXQnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2IudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgc3BlYyA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5sb2FkU3BlYykoZG9tYWluKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmZpbmRPbmUoeyByZWZlcmVuY2U6IHJlZmVyZW5jZSB9KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZG9jID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghZG9jKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgZXJyb3I6IFwiTm90IGZvdW5kXCIgfSldO1xuICAgICAgICAgICAgICAgIHJlcy5qc29uKCgwLCBzY2hlbWFWYWxpZGF0b3JfMS5maWxsTWlzc2luZ0ZpZWxkcykoZG9jLnRvT2JqZWN0KCksIHNwZWMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGVycl8zID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiRXJyb3IgZmV0Y2hpbmcgZG9jdW1lbnRcIiwgZGV0YWlsczogZXJyXzMubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDRdO1xuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0QnlSZWZlcmVuY2UgPSBnZXRCeVJlZmVyZW5jZTtcbnZhciBjcmVhdGVPbmUgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCB1c2VySWQsIHNwZWMsIHJlc3VsdCwgaG9va3MsIF9iLCBNb2RlbCwgdGltZXN0YW1wLCBkb2MsIGVycl80O1xuICAgIHZhciBfYywgX2Q7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfZSkge1xuICAgICAgICBzd2l0Y2ggKF9lLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW47XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgc2NoZW1hVmFsaWRhdG9yXzEuaXNPcGVyYXRpb25BbGxvd2VkKShkb21haW4sIFwiY3JlYXRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJPcGVyYXRpb24gJ2NyZWF0ZScgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhpcyBkb21haW5cIiB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVzZXJJZCA9IChfYyA9IHJlcS51c2VyKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MudXNlcl9pZDtcbiAgICAgICAgICAgICAgICBfZS5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2UudHJ5cy5wdXNoKFsxLCA2LCAsIDddKTtcbiAgICAgICAgICAgICAgICBzcGVjID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLmxvYWRTcGVjKShkb21haW4pO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS52YWxpZGF0ZUFuZFNoYXBlUGF5bG9hZCkocmVxLmJvZHksIHNwZWMpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnZhbGlkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVmFsaWRhdGlvbiBmYWlsZWRcIiwgZGV0YWlsczogcmVzdWx0LmVycm9ycyB9KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBjaGVja1BhcmVudFJlZmVyZW5jZXMocmVzdWx0LnNoYXBlZERhdGEsIHNwZWMsIHNwYWNlLCByZXMpXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBpZiAoIShfZS5zZW50KCkpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICAgICAgICAgIGhvb2tzID0gKF9kID0gc3BlYy5tZXRhKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuaG9va3M7XG4gICAgICAgICAgICAgICAgaWYgKCEoaG9va3MgPT09IG51bGwgfHwgaG9va3MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGhvb2tzLmJlZm9yZUNyZWF0ZSkpIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICAgICAgX2IgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBob29rcy5iZWZvcmVDcmVhdGUocmVzdWx0LnNoYXBlZERhdGEsIHsgc3BhY2U6IHNwYWNlLCBkb21haW46IGRvbWFpbiwgdXNlcklkOiB1c2VySWQgfSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIF9iLnNoYXBlZERhdGEgPSBfZS5zZW50KCk7XG4gICAgICAgICAgICAgICAgX2UubGFiZWwgPSA0O1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIE1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRDb2xsZWN0aW9uQnlOYW1lKShzcGFjZSwgZG9tYWluKTtcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIGRvYyA9IG5ldyBNb2RlbChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmVzdWx0LnNoYXBlZERhdGEpLCB7IHJlZmVyZW5jZTogbmFub2lkKCksIGNyZWF0ZWRBdDogdGltZXN0YW1wLCB1cGRhdGVkQXQ6IHRpbWVzdGFtcCwgY3JlYXRlZEJ5OiB1c2VySWQsIHVwZGF0ZWRCeTogdXNlcklkIH0pKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGRvYy5zYXZlKCldO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbigoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjKSk7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2tzID09PSBudWxsIHx8IGhvb2tzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBob29rcy5hZnRlckNyZWF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBob29rcy5hZnRlckNyZWF0ZShkb2MudG9PYmplY3QoKSwgeyBzcGFjZTogc3BhY2UsIGRvbWFpbjogZG9tYWluLCB1c2VySWQ6IHVzZXJJZCB9KS5jYXRjaChjb25zb2xlLmVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA3XTtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBlcnJfNCA9IF9lLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycm9yIGNyZWF0aW5nIGRvY3VtZW50XCIsIGRldGFpbHM6IGVycl80Lm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA3XTtcbiAgICAgICAgICAgIGNhc2UgNzogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmNyZWF0ZU9uZSA9IGNyZWF0ZU9uZTtcbnZhciB1cGRhdGVPbmUgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hLCBzcGFjZSwgZG9tYWluLCByZWZlcmVuY2UsIHVzZXJJZCwgc3BlYywgcmVzdWx0LCBNb2RlbCwgdXBkYXRlRGF0YSwgZG9jLCBlcnJfNTtcbiAgICB2YXIgX2I7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW4sIHJlZmVyZW5jZSA9IF9hLnJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICBpZiAoISgwLCBzY2hlbWFWYWxpZGF0b3JfMS5pc09wZXJhdGlvbkFsbG93ZWQpKGRvbWFpbiwgXCJ1cGRhdGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk9wZXJhdGlvbiAndXBkYXRlJyBpcyBub3Qgc3VwcG9ydGVkIGZvciB0aGlzIGRvbWFpblwiIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXNlcklkID0gKF9iID0gcmVxLnVzZXIpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi51c2VyX2lkO1xuICAgICAgICAgICAgICAgIF9jLmxhYmVsID0gMTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBfYy50cnlzLnB1c2goWzEsIDQsICwgNV0pO1xuICAgICAgICAgICAgICAgIHNwZWMgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEubG9hZFNwZWMpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKDAsIHNjaGVtYVZhbGlkYXRvcl8xLnZhbGlkYXRlQW5kU2hhcGVQYXlsb2FkKShyZXEuYm9keSwgc3BlYyk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQudmFsaWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJWYWxpZGF0aW9uIGZhaWxlZFwiLCBkZXRhaWxzOiByZXN1bHQuZXJyb3JzIH0pXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGNoZWNrUGFyZW50UmVmZXJlbmNlcyhyZXN1bHQuc2hhcGVkRGF0YSwgc3BlYywgc3BhY2UsIHJlcyldO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGlmICghKF9jLnNlbnQoKSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHVwZGF0ZURhdGEgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmVzdWx0LnNoYXBlZERhdGEpLCB7IHVwZGF0ZWRBdDogbmV3IERhdGUoKSwgdXBkYXRlZEJ5OiB1c2VySWQgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBNb2RlbC5maW5kT25lQW5kVXBkYXRlKHsgcmVmZXJlbmNlOiByZWZlcmVuY2UgfSwgdXBkYXRlRGF0YSwgeyBuZXc6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGRvYyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk5vdCBmb3VuZFwiIH0pXTtcbiAgICAgICAgICAgICAgICByZXMuanNvbigoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBlcnJfNSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycm9yIHVwZGF0aW5nIGRvY3VtZW50XCIsIGRldGFpbHM6IGVycl81Lm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnVwZGF0ZU9uZSA9IHVwZGF0ZU9uZTtcbnZhciBwYXRjaE9uZSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EsIHNwYWNlLCBkb21haW4sIHJlZmVyZW5jZSwgdXNlcklkLCBzcGVjLCByZXN1bHQsIE1vZGVsLCBwYXRjaERhdGEsIGRvYywgZXJyXzY7XG4gICAgdmFyIF9iO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgc3dpdGNoIChfYy5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIF9hID0gcmVxLnBhcmFtcywgc3BhY2UgPSBfYS5zcGFjZSwgZG9tYWluID0gX2EuZG9tYWluLCByZWZlcmVuY2UgPSBfYS5yZWZlcmVuY2U7XG4gICAgICAgICAgICAgICAgaWYgKCEoMCwgc2NoZW1hVmFsaWRhdG9yXzEuaXNPcGVyYXRpb25BbGxvd2VkKShkb21haW4sIFwicGF0Y2hcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk9wZXJhdGlvbiAncGF0Y2gnIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZG9tYWluXCIgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1c2VySWQgPSAoX2IgPSByZXEudXNlcikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnVzZXJfaWQ7XG4gICAgICAgICAgICAgICAgX2MubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9jLnRyeXMucHVzaChbMSwgNCwgLCA1XSk7XG4gICAgICAgICAgICAgICAgc3BlYyA9ICgwLCBzY2hlbWFWYWxpZGF0b3JfMS5sb2FkU3BlYykoZG9tYWluKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEudmFsaWRhdGVBbmRTaGFwZVBheWxvYWQpKHJlcS5ib2R5LCBzcGVjLCBcIlwiLCB7IGFsbG93UGFydGlhbDogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC52YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiVmFsaWRhdGlvbiBmYWlsZWRcIiwgZGV0YWlsczogcmVzdWx0LmVycm9ycyB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgY2hlY2tQYXJlbnRSZWZlcmVuY2VzKHJlc3VsdC5zaGFwZWREYXRhLCBzcGVjLCBzcGFjZSwgcmVzKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgaWYgKCEoX2Muc2VudCgpKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICBNb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0Q29sbGVjdGlvbkJ5TmFtZSkoc3BhY2UsIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgcGF0Y2hEYXRhID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlc3VsdC5zaGFwZWREYXRhKSwgeyB1cGRhdGVkQXQ6IG5ldyBEYXRlKCksIHVwZGF0ZWRCeTogdXNlcklkIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuZmluZE9uZUFuZFVwZGF0ZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0sIHBhdGNoRGF0YSwgeyBuZXc6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIGRvYyA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk5vdCBmb3VuZFwiIH0pXTtcbiAgICAgICAgICAgICAgICByZXMuanNvbigoMCwgc2NoZW1hVmFsaWRhdG9yXzEuZmlsbE1pc3NpbmdGaWVsZHMpKGRvYy50b09iamVjdCgpLCBzcGVjKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBlcnJfNiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBcIkVycm9yIHBhdGNoaW5nIGRvY3VtZW50XCIsIGRldGFpbHM6IGVycl82Lm1lc3NhZ2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA1XTtcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnBhdGNoT25lID0gcGF0Y2hPbmU7XG52YXIgZGVsZXRlT25lID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSwgc3BhY2UsIGRvbWFpbiwgcmVmZXJlbmNlLCBNb2RlbCwgc3BlYywgY2hpbGRyZW4sIGRvYywgZXJyXzc7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICBzd2l0Y2ggKF9iLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgX2EgPSByZXEucGFyYW1zLCBzcGFjZSA9IF9hLnNwYWNlLCBkb21haW4gPSBfYS5kb21haW4sIHJlZmVyZW5jZSA9IF9hLnJlZmVyZW5jZTtcbiAgICAgICAgICAgICAgICBpZiAoISgwLCBzY2hlbWFWYWxpZGF0b3JfMS5pc09wZXJhdGlvbkFsbG93ZWQpKGRvbWFpbiwgXCJkZWxldGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXMuc3RhdHVzKDQwNCkuanNvbih7IGVycm9yOiBcIk9wZXJhdGlvbiAnZGVsZXRlJyBpcyBub3Qgc3VwcG9ydGVkIGZvciB0aGlzIGRvbWFpblwiIH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX2IubGFiZWwgPSAxO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIF9iLnRyeXMucHVzaChbMSwgNSwgLCA2XSk7XG4gICAgICAgICAgICAgICAgTW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKHNwYWNlLCBkb21haW4pO1xuICAgICAgICAgICAgICAgIHNwZWMgPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEubG9hZFNwZWMpKGRvbWFpbik7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4gPSAoMCwgc2NoZW1hVmFsaWRhdG9yXzEubG9hZENoaWxkcmVuKShkb21haW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgTW9kZWwuZmluZE9uZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkb2MgPSBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFkb2MpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogXCJOb3QgZm91bmRcIiB9KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBkZWxldGVDaGlsZFJlY29yZHMocmVmZXJlbmNlLCBjaGlsZHJlbiwgZG9tYWluLCBzcGFjZSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIE1vZGVsLmRlbGV0ZU9uZSh7IHJlZmVyZW5jZTogcmVmZXJlbmNlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBfYi5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDQpLnNlbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDZdO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGVycl83ID0gX2Iuc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IFwiRXJyb3IgZGVsZXRpbmcgZG9jdW1lbnRcIiwgZGV0YWlsczogZXJyXzcubWVzc2FnZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDZdO1xuICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZGVsZXRlT25lID0gZGVsZXRlT25lO1xudmFyIGluZmVyVHlwZXMgPSBmdW5jdGlvbiAocmVxLCByZXMpIHtcbiAgICB2YXIgc3BhY2UgPSByZXEucGFyYW1zLnNwYWNlO1xuICAgIHRyeSB7XG4gICAgICAgIHZhciB0eXBlcyA9ICgwLCB0eXBlSW5mZXJlbmNlXzEuZ2VuZXJhdGVUeXBlcykoc3BhY2UpO1xuICAgICAgICByZXMuaGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwidGV4dC90eXBlc2NyaXB0XCIpO1xuICAgICAgICByZXMuc2VuZCh0eXBlcyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJFcnJvciBnZW5lcmF0aW5nIHR5cGVzXCIsIGRldGFpbHM6IGVyci5tZXNzYWdlIH0pO1xuICAgIH1cbn07XG5leHBvcnRzLmluZmVyVHlwZXMgPSBpbmZlclR5cGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdlbmVyYXRlVHlwZXMgPSB2b2lkIDA7XG52YXIgZG9tYWluc18xID0gcmVxdWlyZShcIi4uLy4uL3NwZWNzL2RvbWFpbnNcIik7XG52YXIgY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTsgfTtcbnZhciB0b1Bhc2NhbENhc2UgPSBmdW5jdGlvbiAocGFydHMpIHtcbiAgICByZXR1cm4gcGFydHMubWFwKGNhcGl0YWxpemUpLmpvaW4oXCJcIik7XG59O1xudmFyIG5lc3RlZEludGVyZmFjZXMgPSBbXTtcbnZhciBpbmZlclRzVHlwZSA9IGZ1bmN0aW9uIChmaWVsZCwgZG9tYWluTmFtZSwgcGF0aFBhcnRzKSB7XG4gICAgaWYgKHBhdGhQYXJ0cyA9PT0gdm9pZCAwKSB7IHBhdGhQYXJ0cyA9IFtdOyB9XG4gICAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICBjYXNlIFwiYW55XCI6XG4gICAgICAgICAgICByZXR1cm4gZmllbGQudHlwZTtcbiAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgaWYgKCFmaWVsZC5zY2hlbWEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiUmVjb3JkPHN0cmluZywgYW55PlwiO1xuICAgICAgICAgICAgdmFyIGludGVyZmFjZU5hbWUgPSB0b1Bhc2NhbENhc2UoX19zcHJlYWRBcnJheShbZG9tYWluTmFtZV0sIHBhdGhQYXJ0cywgdHJ1ZSkpO1xuICAgICAgICAgICAgbmVzdGVkSW50ZXJmYWNlcy5wdXNoKGdlbmVyYXRlTmVzdGVkSW50ZXJmYWNlKGludGVyZmFjZU5hbWUsIGZpZWxkLnNjaGVtYSwgZG9tYWluTmFtZSwgcGF0aFBhcnRzKSk7XG4gICAgICAgICAgICByZXR1cm4gaW50ZXJmYWNlTmFtZTtcbiAgICAgICAgY2FzZSBcImFycmF5XCI6XG4gICAgICAgICAgICB2YXIgaXRlbVR5cGUgPSBpbmZlclRzVHlwZShmaWVsZC5zY2hlbWEsIGRvbWFpbk5hbWUsIHBhdGhQYXJ0cyk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIi5jb25jYXQoaXRlbVR5cGUsIFwiW11cIik7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gXCJhbnlcIjtcbiAgICB9XG59O1xudmFyIGdlbmVyYXRlTmVzdGVkSW50ZXJmYWNlID0gZnVuY3Rpb24gKGludGVyZmFjZU5hbWUsIHNwZWMsIGRvbWFpbk5hbWUsIHBhdGhQYXJ0cykge1xuICAgIGlmIChwYXRoUGFydHMgPT09IHZvaWQgMCkgeyBwYXRoUGFydHMgPSBbXTsgfVxuICAgIHZhciBmaWVsZHMgPSBcIlwiO1xuICAgIGZvciAodmFyIGZpZWxkIGluIHNwZWMpIHtcbiAgICAgICAgdmFyIGZpZWxkRGVmID0gc3BlY1tmaWVsZF07XG4gICAgICAgIHZhciB0c1R5cGUgPSBpbmZlclRzVHlwZShmaWVsZERlZiwgZG9tYWluTmFtZSwgX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBwYXRoUGFydHMsIHRydWUpLCBbZmllbGRdLCBmYWxzZSkpO1xuICAgICAgICBmaWVsZHMgKz0gXCJcXG4gIFwiLmNvbmNhdChmaWVsZCkuY29uY2F0KGZpZWxkRGVmLnJlcXVpcmVkID8gXCJcIiA6IFwiP1wiLCBcIjogXCIpLmNvbmNhdCh0c1R5cGUsIFwiO1wiKTtcbiAgICB9XG4gICAgZmllbGRzICs9IFwiXFxuICBpZDogc3RyaW5nO1wiO1xuICAgIGZpZWxkcyArPSBcIlxcbiAgcmVmZXJlbmNlOiBzdHJpbmc7XCI7XG4gICAgZmllbGRzICs9IFwiXFxuICBjcmVhdGVkQnk6IHN0cmluZztcIjtcbiAgICBmaWVsZHMgKz0gXCJcXG4gIGNyZWF0ZWRBdDogc3RyaW5nO1wiO1xuICAgIGZpZWxkcyArPSBcIlxcbiAgdXBkYXRlZEJ5OiBzdHJpbmc7XCI7XG4gICAgZmllbGRzICs9IFwiXFxuICB1cGRhdGVkQXQ6IHN0cmluZztcIjtcbiAgICByZXR1cm4gXCJleHBvcnQgaW50ZXJmYWNlIFwiLmNvbmNhdChpbnRlcmZhY2VOYW1lLCBcIiB7XCIpLmNvbmNhdChmaWVsZHMsIFwiXFxufVwiKTtcbn07XG52YXIgZ2VuZXJhdGVUeXBlcyA9IGZ1bmN0aW9uIChzcGFjZSkge1xuICAgIHZhciB0eXBlcyA9IFtdO1xuICAgIE9iamVjdC5rZXlzKGRvbWFpbnNfMS5zcGVjc01hcCkuZm9yRWFjaChmdW5jdGlvbiAoc3BlY05hbWUpIHtcbiAgICAgICAgdmFyIHNwZWMgPSBkb21haW5zXzEuc3BlY3NNYXBbc3BlY05hbWVdO1xuICAgICAgICB2YXIgZG9tYWluSW50ZXJmYWNlTmFtZSA9IGNhcGl0YWxpemUoc3BlY05hbWUpO1xuICAgICAgICB2YXIgbWFpbkludGVyZmFjZSA9IGdlbmVyYXRlTmVzdGVkSW50ZXJmYWNlKGRvbWFpbkludGVyZmFjZU5hbWUsIHNwZWMuZmllbGRzLCBzcGVjTmFtZSk7XG4gICAgICAgIHR5cGVzLnB1c2gobWFpbkludGVyZmFjZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgdHlwZXMsIHRydWUpLCBuZXN0ZWRJbnRlcmZhY2VzLCB0cnVlKS5qb2luKFwiXFxuXFxuXCIpO1xufTtcbmV4cG9ydHMuZ2VuZXJhdGVUeXBlcyA9IGdlbmVyYXRlVHlwZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgICB0W3BdID0gc1twXTtcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgICAgfVxuICAgIHJldHVybiB0O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0VXNlckJ5SWQgPSBleHBvcnRzLmdldFVzZXJCeUVtYWlsID0gZXhwb3J0cy5nZXRVc2VycyA9IGV4cG9ydHMudmFsaWRhdGVTZXNzaW9uID0gZXhwb3J0cy5nZXROZXdBY2Nlc3NUb2tlbiA9IGV4cG9ydHMuZGVjb2RlQWNjZXNzVG9rZW4gPSB2b2lkIDA7XG52YXIgYXhpb3MgPSByZXF1aXJlKFwiYXhpb3NcIik7XG52YXIgT05FQVVUSF9BUEkgPSBwcm9jZXNzLmVudi5PTkVBVVRIX0FQSSB8fCBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAxMC9hcGlcIjtcbnZhciBtb2RlbF8xID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG52YXIgbW9kZWxfMiA9IHJlcXVpcmUoXCIuLi91c2VyL2ludml0ZS9tb2RlbFwiKTtcbnZhciBIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vaGVscGVyXCIpKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgaGVscGVyXzEgPSByZXF1aXJlKFwiLi4vYXV0aC9oZWxwZXJcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbnZhciBkZWNvZGVBY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uIChzcGFjZSwgYWNjZXNzVG9rZW4pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlY29kZWRSZXNwb25zZSwgZXJyXzEsIG1vZGVsLCBleGlzdGluZ1VzZXJSZWNvcmQsIGRhdGE7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgZGVjb2RlZFJlc3BvbnNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDE7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIGF4aW9zLmdldChcIlwiLmNvbmNhdChPTkVBVVRIX0FQSSwgXCIvYXV0aC90b2tlbi9kZWNvZGVcIiksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkZWNvZGVkUmVzcG9uc2UgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBlcnJfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZXJyXzEucmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBcImV4cGlyZWRcIl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgXCJleHBpcmVkXCJdO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIGlmICghKGRlY29kZWRSZXNwb25zZS5zdGF0dXMgPT09IDIwMCkpIHJldHVybiBbMywgOV07XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBkZWNvZGVkUmVzcG9uc2UuZGF0YS5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nVXNlclJlY29yZCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmRCeUlkQW5kVXBkYXRlKGRlY29kZWRSZXNwb25zZS5kYXRhLnVzZXJfaWQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWNvZGVkUmVzcG9uc2UuZGF0YSksIHsgcmVzb2x2ZXI6IFwib25lYXV0aF9zcGFjZVwiIH0pLCB7IG5ldzogdHJ1ZSwgdXBzZXJ0OiB0cnVlIH0pXTtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBkYXRhID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICghKGV4aXN0aW5nVXNlclJlY29yZC5sZW5ndGggPT09IDApKSByZXR1cm4gWzMsIDhdO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgYXV0b0FjY2VwdEludml0ZXMoZGF0YSldO1xuICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDg7XG4gICAgICAgICAgICBjYXNlIDg6IHJldHVybiBbMiwgZGVjb2RlZFJlc3BvbnNlLmRhdGEgfHwgbnVsbF07XG4gICAgICAgICAgICBjYXNlIDk6IHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5kZWNvZGVBY2Nlc3NUb2tlbiA9IGRlY29kZUFjY2Vzc1Rva2VuO1xudmFyIGF1dG9BY2NlcHRJbnZpdGVzID0gZnVuY3Rpb24gKHVzZXIpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsLCBwZW5kaW5nSW52aXRlTGlzdCwgaSwgcmVzO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8yLnVzZXJJbnZpdGVDb2xsZWN0aW9uLCBtb2RlbF8yLnVzZXJJbnZpdGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZCh7IGVtYWlsOiB1c2VyLmVtYWlsIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBwZW5kaW5nSW52aXRlTGlzdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwZW5kaW5nSW52aXRlTGlzdCk7XG4gICAgICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGlmICghKGkgPCBwZW5kaW5nSW52aXRlTGlzdC5sZW5ndGgpKSByZXR1cm4gWzMsIDVdO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZEJ5SWRBbmRVcGRhdGUocGVuZGluZ0ludml0ZUxpc3RbaV0uX2lkLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcGVuZGluZ0ludml0ZUxpc3RbaV0uX2RvYyksIHsgdXNlcklkOiB1c2VyLl9pZCwgYWNjZXB0ZWQ6IHRydWUgfSksIHsgbmV3OiB0cnVlLCB1cHNlcnQ6IHRydWUgfSldO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHJlcyA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcGVuZGluZ0ludml0ZUxpc3RbaV0pLCB7IHVzZXJJZDogdXNlci5faWQsIGFjY2VwdGVkOiB0cnVlIH0pKTtcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDQ7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMywgMl07XG4gICAgICAgICAgICBjYXNlIDU6IHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xudmFyIGdldE5ld0FjY2Vzc1Rva2VuID0gZnVuY3Rpb24gKHNwYWNlLCByZWZyZXNoVG9rZW4pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlZnJlc2hUb2tlblJlc3BvbnNlO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIGF4aW9zLnBvc3QoXCJcIi5jb25jYXQoT05FQVVUSF9BUEksIFwiL2F1dGgvdG9rZW5cIiksIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogXCJyZWZyZXNoX3Rva2VuXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlYWxtOiBzcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZWZyZXNoVG9rZW5SZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAocmVmcmVzaFRva2VuUmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZWZyZXNoVG9rZW5SZXNwb25zZS5kYXRhXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldE5ld0FjY2Vzc1Rva2VuID0gZ2V0TmV3QWNjZXNzVG9rZW47XG52YXIgdmFsaWRhdGVTZXNzaW9uID0gZnVuY3Rpb24gKGxvY2FsQWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbiwgYXBwUmVhbG0pIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsLCBsb2NhbFRva2VuUmVzcG9uc2UsIGFjY2Vzc1Rva2VuLCBsb2NhbENsYWltcywgX2EsIF9hY2Nlc3NUb2tlbiwgX2xvY2FsQ2xhaW1zLCBhY2Nlc3NUb2tlblJlc3BvbnNlLCBuZXdBY2Nlc3NUb2tlbiwgbmV3QWNjZXNzVG9rZW5SZXNwb25zZTtcbiAgICB2YXIgX2I7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYykge1xuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCAoMCwgaGVscGVyXzEuZGVjb2RlQXBwVG9rZW4pKGxvY2FsQWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBsb2NhbFRva2VuUmVzcG9uc2UgPSBfYy5zZW50KCk7XG4gICAgICAgICAgICAgICAgYWNjZXNzVG9rZW4gPSBcIlwiO1xuICAgICAgICAgICAgICAgIGxvY2FsQ2xhaW1zID0ge307XG4gICAgICAgICAgICAgICAgaWYgKCFsb2NhbFRva2VuUmVzcG9uc2Uub3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYSA9IGxvY2FsVG9rZW5SZXNwb25zZS5jbGFpbXMsIF9hY2Nlc3NUb2tlbiA9IF9hLmFjY2Vzc1Rva2VuLCBfbG9jYWxDbGFpbXMgPSBfX3Jlc3QoX2EsIFtcImFjY2Vzc1Rva2VuXCJdKTtcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbiA9IF9hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgICAgICBsb2NhbENsYWltcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3BhY2U6IF9sb2NhbENsYWltcy5zcGFjZSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueUlkOiBfbG9jYWxDbGFpbXMuY29tcGFueUlkLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBIZWxwZXIuZGVjb2RlQWNjZXNzVG9rZW4oTnVtYmVyKGFwcFJlYWxtKSwgYWNjZXNzVG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlblJlc3BvbnNlID0gX2Muc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChhY2Nlc3NUb2tlblJlc3BvbnNlICE9PSBcImV4cGlyZWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFpbXM6IGFjY2Vzc1Rva2VuUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2U6IGxvY2FsQ2xhaW1zLnNwYWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmdldE5ld0FjY2Vzc1Rva2VuKGFwcFJlYWxtLCByZWZyZXNoVG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBuZXdBY2Nlc3NUb2tlbiA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIShuZXdBY2Nlc3NUb2tlbiA9PT0gbnVsbCB8fCBuZXdBY2Nlc3NUb2tlbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmV3QWNjZXNzVG9rZW4uYWNjZXNzX3Rva2VuKSkgcmV0dXJuIFszLCA2XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIEhlbHBlci5kZWNvZGVBY2Nlc3NUb2tlbihhcHBSZWFsbSwgbmV3QWNjZXNzVG9rZW4uYWNjZXNzX3Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgbmV3QWNjZXNzVG9rZW5SZXNwb25zZSA9IF9jLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBfYiA9IHt9O1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgKDAsIHNlcnZpY2VfMS5nZXRMb2NhbFRva2VuSW1wbCkobmV3QWNjZXNzVG9rZW5SZXNwb25zZS51c2VyX2lkLCBuZXdBY2Nlc3NUb2tlbi5hY2Nlc3NfdG9rZW4pXTtcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyLCAoX2IuYWNjZXNzVG9rZW4gPSBfYy5zZW50KCksXG4gICAgICAgICAgICAgICAgICAgIF9iLmNsYWltcyA9IG5ld0FjY2Vzc1Rva2VuUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgIF9iLnNwYWNlID0gbG9jYWxDbGFpbXMuc3BhY2UsXG4gICAgICAgICAgICAgICAgICAgIF9iKV07XG4gICAgICAgICAgICBjYXNlIDY6IHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy52YWxpZGF0ZVNlc3Npb24gPSB2YWxpZGF0ZVNlc3Npb247XG52YXIgZ2V0VXNlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VyQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VyU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJzID0gZ2V0VXNlcnM7XG52YXIgZ2V0VXNlckJ5RW1haWwgPSBmdW5jdGlvbiAoZW1haWwpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIG1vZGVsID0gKDAsIGRidXRpbHNfMS5nZXRHbG9iYWxDb2xsZWN0aW9uKShtb2RlbF8xLnVzZXJDb2xsZWN0aW9uLCBtb2RlbF8xLnVzZXJTY2hlbWEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuZmluZE9uZSh7IGVtYWlsOiBlbWFpbC50b0xvd2VyQ2FzZSgpIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlckJ5RW1haWwgPSBnZXRVc2VyQnlFbWFpbDtcbnZhciBnZXRVc2VyQnlJZCA9IGZ1bmN0aW9uIChpZCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9kZWw7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEudXNlckNvbGxlY3Rpb24sIG1vZGVsXzEudXNlclNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBtb2RlbC5maW5kQnlJZChpZCldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VyQnlJZCA9IGdldFVzZXJCeUlkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFVzZXJJbnZpdGVCeVVzZXJJZCA9IGV4cG9ydHMucmVnaXN0ZXJVc2VySW52aXRlID0gZXhwb3J0cy5nZXRVc2VySW52aXRlID0gZXhwb3J0cy51cGRhdGVVc2VySW52aXRlID0gdm9pZCAwO1xudmFyIGF4aW9zID0gcmVxdWlyZShcImF4aW9zXCIpO1xudmFyIE9ORUFVVEhfQVBJID0gcHJvY2Vzcy5lbnYuT05FQVVUSF9BUEkgfHwgXCJodHRwOi8vbG9jYWxob3N0OjQwMTAvYXBpXCI7XG52YXIgbW9kZWxfMSA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xudmFyIGNvbXBhbnlTZXJ2aWNlID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi8uLi9jb21wYW55L3NlcnZpY2VcIikpO1xudmFyIHVzZXJTZXJ2aWNlID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi9zZXJ2aWNlXCIpKTtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vbGliL2RidXRpbHNcIik7XG52YXIgdXBkYXRlVXNlckludml0ZSA9IGZ1bmN0aW9uIChzcGFjZSwgZGF0YSwgdXNlcklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb21wYW55LCBtb2RlbCwgdXNlciwgcGF5bG9hZCwgZXhpc3RpbmdSZWNvcmQ7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgY29tcGFueVNlcnZpY2UuZ2V0Q29tcGFueUJ5UmVmZXJlbmNlKHNwYWNlKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgY29tcGFueSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBudWxsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kZWwgPSAoMCwgZGJ1dGlsc18xLmdldEdsb2JhbENvbGxlY3Rpb24pKG1vZGVsXzEudXNlckludml0ZUNvbGxlY3Rpb24sIG1vZGVsXzEudXNlckludml0ZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCB1c2VyU2VydmljZS5nZXRVc2VyQnlFbWFpbChkYXRhLmVtYWlsKV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdXNlciA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRhdGEpLCB7IGVtYWlsOiBkYXRhLmVtYWlsLnRvTG93ZXJDYXNlKCksIGNvbXBhbnlJZDogY29tcGFueS5faWQsIGFjY2VwdGVkOiAhIXVzZXIsIHVzZXJJZDogdXNlciA/IHVzZXIuX2lkIDogbnVsbCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHBheWxvYWQuZW1haWwudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogY29tcGFueS5faWQsXG4gICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBleGlzdGluZ1JlY29yZCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoKGV4aXN0aW5nUmVjb3JkID09PSBudWxsIHx8IGV4aXN0aW5nUmVjb3JkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBleGlzdGluZ1JlY29yZC5sZW5ndGgpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIG51bGxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmNyZWF0ZShwYXlsb2FkKV07XG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnVwZGF0ZVVzZXJJbnZpdGUgPSB1cGRhdGVVc2VySW52aXRlO1xudmFyIGdldFVzZXJJbnZpdGUgPSBmdW5jdGlvbiAoc3BhY2UpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbXBhbnksIG1vZGVsO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIGNvbXBhbnlTZXJ2aWNlLmdldENvbXBhbnlCeVJlZmVyZW5jZShzcGFjZSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGNvbXBhbnkgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjb21wYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgW11dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoeyBjb21wYW55SWQ6IGNvbXBhbnkuX2lkIH0pXTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFsyLCBfYS5zZW50KCldO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0VXNlckludml0ZSA9IGdldFVzZXJJbnZpdGU7XG52YXIgcmVnaXN0ZXJVc2VySW52aXRlID0gZnVuY3Rpb24gKHNwYWNlLCBjb21wYW55SWQsIHVzZXJJZCwgZW1haWwpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGVsLCBleGlzdGluZ1JlY29yZDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55SWQ6IGNvbXBhbnlJZCxcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIGV4aXN0aW5nUmVjb3JkID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGlmICgoZXhpc3RpbmdSZWNvcmQgPT09IG51bGwgfHwgZXhpc3RpbmdSZWNvcmQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGV4aXN0aW5nUmVjb3JkLmxlbmd0aCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbnVsbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgbW9kZWwuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogY29tcGFueUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VwdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnJlZ2lzdGVyVXNlckludml0ZSA9IHJlZ2lzdGVyVXNlckludml0ZTtcbnZhciBnZXRVc2VySW52aXRlQnlVc2VySWQgPSBmdW5jdGlvbiAodXNlcklkKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBtb2RlbCA9ICgwLCBkYnV0aWxzXzEuZ2V0R2xvYmFsQ29sbGVjdGlvbikobW9kZWxfMS51c2VySW52aXRlQ29sbGVjdGlvbiwgbW9kZWxfMS51c2VySW52aXRlU2NoZW1hKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQsIG1vZGVsLmZpbmQoeyB1c2VySWQ6IHVzZXJJZCB9KV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJJbnZpdGVCeVVzZXJJZCA9IGdldFVzZXJJbnZpdGVCeVVzZXJJZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VySW52aXRlQ29sbGVjdGlvbiA9IGV4cG9ydHMudXNlckludml0ZVNjaGVtYSA9IHZvaWQgMDtcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTtcbnZhciBTY2hlbWEgPSBtb25nb29zZS5TY2hlbWE7XG52YXIgdXNlckludml0ZVNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgIHVzZXJJZDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBjb21wYW55SWQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgYWNjZXB0ZWQ6IHsgdHlwZTogQm9vbGVhbiB9LFxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VySW52aXRlU2NoZW1hID0gdXNlckludml0ZVNjaGVtYTtcbnZhciB1c2VySW52aXRlQ29sbGVjdGlvbiA9IFwidXNlci5wZXJtaXNzaW9uXCI7XG5leHBvcnRzLnVzZXJJbnZpdGVDb2xsZWN0aW9uID0gdXNlckludml0ZUNvbGxlY3Rpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBtaWRkbGV3YXJlc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL21pZGRsZXdhcmVzXCIpO1xudmFyIHNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL3NlcnZpY2VcIik7XG52YXIgc2VsZlJlYWxtID0gMTAwO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgcm91dGVyLnBvc3QoXCIvdXNlci9pbnZpdGUvOnNwYWNlXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCBzZXJ2aWNlXzEuY3JlYXRlVXNlckludml0ZUVuZHBvaW50KTtcbiAgICByb3V0ZXIuZ2V0KFwiL3VzZXIvaW52aXRlLzpzcGFjZVwiLCBtaWRkbGV3YXJlc18xLmF1dGhvcml6ZUFwaSwgc2VydmljZV8xLmdldFVzZXJJbnZpdGUpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFVzZXJJbnZpdGUgPSBleHBvcnRzLnJlZ2lzdGVyVXNlckludml0ZSA9IGV4cG9ydHMuY3JlYXRlVXNlckludml0ZUVuZHBvaW50ID0gdm9pZCAwO1xudmFyIEhlbHBlciA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9oZWxwZXJcIikpO1xudmFyIHNlbGZSZWFsbSA9IDEwMDtcbnZhciBjcmVhdGVVc2VySW52aXRlRW5kcG9pbnQgPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVzZXJJZCwgdXNlckludml0ZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB1c2VySWQgPSByZXEudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLnVwZGF0ZVVzZXJJbnZpdGUocmVxLnBhcmFtcy5zcGFjZSwgcmVxLmJvZHksIHVzZXJJZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHVzZXJJbnZpdGUpO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuY3JlYXRlVXNlckludml0ZUVuZHBvaW50ID0gY3JlYXRlVXNlckludml0ZUVuZHBvaW50O1xudmFyIHJlZ2lzdGVyVXNlckludml0ZSA9IGZ1bmN0aW9uIChzcGFjZSwgY29tcGFueUlkLCB1c2VySWQsIGVtYWlsKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci5yZWdpc3RlclVzZXJJbnZpdGUoc3BhY2UsIGNvbXBhbnlJZCwgdXNlcklkLCBlbWFpbCldO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gWzIsIF9hLnNlbnQoKV07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5yZWdpc3RlclVzZXJJbnZpdGUgPSByZWdpc3RlclVzZXJJbnZpdGU7XG52YXIgZ2V0VXNlckludml0ZSA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlcklkLCB1c2VySW52aXRlTGlzdDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB1c2VySWQgPSByZXEudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJJbnZpdGUocmVxLnBhcmFtcy5zcGFjZSldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGVMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh1c2VySW52aXRlTGlzdCk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VySW52aXRlID0gZ2V0VXNlckludml0ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51c2VyQ29sbGVjdGlvbiA9IGV4cG9ydHMudXNlclNjaGVtYSA9IHZvaWQgMDtcbnZhciBtb25nb29zZSA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTtcbnZhciBTY2hlbWEgPSBtb25nb29zZS5TY2hlbWE7XG52YXIgdXNlclNjaGVtYSA9IG5ldyBTY2hlbWEoe1xuICAgIGdpdmVuX25hbWU6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgZmFtaWx5X25hbWU6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBuaWNrbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICByZXNvbHZlcjogeyB0eXBlOiBTdHJpbmcgfSxcbn0sIHsgdGltZXN0YW1wczogdHJ1ZSB9KTtcbmV4cG9ydHMudXNlclNjaGVtYSA9IHVzZXJTY2hlbWE7XG52YXIgdXNlckNvbGxlY3Rpb24gPSBcInVzZXJcIjtcbmV4cG9ydHMudXNlckNvbGxlY3Rpb24gPSB1c2VyQ29sbGVjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGhhbmRsZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9oYW5kbGVyXCIpO1xudmFyIG1pZGRsZXdhcmVzXzEgPSByZXF1aXJlKFwiLi4vLi4vbWlkZGxld2FyZXNcIik7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vc2VydmljZVwiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICByb3V0ZXIucG9zdChcIi91c2VyLzpyZWFsbUlkL2F1dGhvcml6ZV91c2VyXCIsICgwLCBoYW5kbGVyXzEuYXN5bmNIYW5kbGVyKShzZXJ2aWNlXzEudmFsaWRhdGVTZXNzaW9uKSk7XG4gICAgcm91dGVyLmdldChcIi91c2VyLzpyZWFsbUlkXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpLCAoMCwgaGFuZGxlcl8xLmFzeW5jSGFuZGxlcikoc2VydmljZV8xLmdldFVzZXJzKSk7XG4gICAgcm91dGVyLmdldChcIi91c2VyL3Rva2VuL2xvY2FsXCIsIG1pZGRsZXdhcmVzXzEuYXV0aG9yaXplQXBpT25lYXV0aCwgKDAsIGhhbmRsZXJfMS5hc3luY0hhbmRsZXIpKHNlcnZpY2VfMS5nZXRMb2NhbFRva2VuKSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0VXNlckJ5SWQgPSBleHBvcnRzLmdldFVzZXJCeUVtYWlsID0gZXhwb3J0cy5nZXRMb2NhbFRva2VuSW1wbCA9IGV4cG9ydHMuZ2V0TG9jYWxUb2tlbiA9IGV4cG9ydHMuZ2V0VXNlcnMgPSBleHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZvaWQgMDtcbnZhciBIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vaGVscGVyXCIpKTtcbnZhciB1c2VySW52aXRlSGVscGVyID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi91c2VyL2ludml0ZS9oZWxwZXJcIikpO1xudmFyIGNvbXBhbnlIZWxwZXIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uL2NvbXBhbnkvaGVscGVyXCIpKTtcbnZhciBoZWxwZXJfMSA9IHJlcXVpcmUoXCIuLi9hdXRoL2hlbHBlclwiKTtcbnZhciBzZWxmUmVhbG0gPSAxMDA7XG52YXIgdmFsaWRhdGVTZXNzaW9uID0gZnVuY3Rpb24gKHJlcSwgcmVzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZXNzaW9uO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIEhlbHBlci52YWxpZGF0ZVNlc3Npb24ocmVxLmJvZHkuYWNjZXNzVG9rZW4sIHJlcS5ib2R5LnJlZnJlc2hUb2tlbiwgcmVxLnBhcmFtcy5yZWFsbUlkKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgc2Vzc2lvbiA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpO1xuICAgICAgICAgICAgICAgICAgICByZXMuc2VuZChcIlNlc3Npb24gbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZChzZXNzaW9uKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLnZhbGlkYXRlU2Vzc2lvbiA9IHZhbGlkYXRlU2Vzc2lvbjtcbnZhciBnZXRVc2VycyA9IGZ1bmN0aW9uIChyZXEsIHJlcykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlcklkLCB1c2VyTGlzdDtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICB1c2VySWQgPSByZXEudXNlci51c2VyX2lkO1xuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJzKCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh1c2VyTGlzdCk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMl07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pOyB9O1xuZXhwb3J0cy5nZXRVc2VycyA9IGdldFVzZXJzO1xudmFyIGdldExvY2FsVG9rZW4gPSBmdW5jdGlvbiAocmVxLCByZXMpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuLCBhcHBUb2tlbjtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbiA9IHJlcS5oZWFkZXJzW1wiYXV0aG9yaXphdGlvblwiXTtcbiAgICAgICAgICAgICAgICBpZiAoIWFjY2Vzc1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgcmVzLnNlbmRTdGF0dXMoNDAxKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbNCwgKDAsIGV4cG9ydHMuZ2V0TG9jYWxUb2tlbkltcGwpKHJlcS51c2VyLnVzZXJfaWQsIGFjY2Vzc1Rva2VuKV07XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgYXBwVG9rZW4gPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHsgdG9rZW46IGFwcFRva2VuIH0pO1xuICAgICAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xuICAgICAgICB9XG4gICAgfSk7XG59KTsgfTtcbmV4cG9ydHMuZ2V0TG9jYWxUb2tlbiA9IGdldExvY2FsVG9rZW47XG52YXIgZ2V0TG9jYWxUb2tlbkltcGwgPSBmdW5jdGlvbiAodXNlcklkLCBhY2Nlc3NUb2tlbikgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdXNlckludml0ZUxpc3QsIGNvbXBhbnlJZExpc3QsIGNvbXBhbnlMaXN0LCBjb21wYW55UmVmZXJlbmNlTGlzdCwgY2xhaW1zO1xuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIHVzZXJJbnZpdGVIZWxwZXIuZ2V0VXNlckludml0ZUJ5VXNlcklkKHVzZXJJZCldO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHVzZXJJbnZpdGVMaXN0ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgIGNvbXBhbnlJZExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICB1c2VySW52aXRlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZExpc3QucHVzaChpdGVtLmNvbXBhbnlJZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBjb21wYW55SGVscGVyLmdldENvbXBhbnlCeUlkTGlzdChjb21wYW55SWRMaXN0KV07XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY29tcGFueUxpc3QgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgY29tcGFueVJlZmVyZW5jZUxpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICBjb21wYW55TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlSZWZlcmVuY2VMaXN0LnB1c2goaXRlbS5yZWZlcmVuY2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNsYWltcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZTogY29tcGFueVJlZmVyZW5jZUxpc3QsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlJZDogY29tcGFueUlkTGlzdCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgKDAsIGhlbHBlcl8xLmVuY29kZUFwcFRva2VuKShjbGFpbXMpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldExvY2FsVG9rZW5JbXBsID0gZ2V0TG9jYWxUb2tlbkltcGw7XG52YXIgZ2V0VXNlckJ5RW1haWwgPSBmdW5jdGlvbiAoZW1haWwpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJCeUVtYWlsKGVtYWlsKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJCeUVtYWlsID0gZ2V0VXNlckJ5RW1haWw7XG52YXIgZ2V0VXNlckJ5SWQgPSBmdW5jdGlvbiAoaWQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCwgSGVscGVyLmdldFVzZXJCeUlkKGlkKV07XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBbMiwgX2Euc2VudCgpXTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7IH07XG5leHBvcnRzLmdldFVzZXJCeUlkID0gZ2V0VXNlckJ5SWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBleHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG52YXIgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbnJvdXRlci5nZXQoXCIvXCIsIGZ1bmN0aW9uIChfLCByZXMpIHtcbiAgICByZXMuc2VuZChcInYxLjAuMFwiKTtcbiAgICByZXMuZW5kKCk7XG59KTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvaGVsbG8vcm91dGVcIikocm91dGVyKTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvYXV0aC9yb3V0ZVwiKShyb3V0ZXIpO1xucmVxdWlyZShcIi4vbW9kdWxlcy91c2VyL3JvdXRlXCIpKHJvdXRlcik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL3VzZXIvaW52aXRlL3JvdXRlXCIpKHJvdXRlcik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL2NvbXBhbnkvcm91dGVcIikocm91dGVyKTtcbnJlcXVpcmUoXCIuL21vZHVsZXMvdW5pdmVyc2FsL3JvdXRlXCIpKHJvdXRlcik7XG5yZXF1aXJlKFwiLi9tb2R1bGVzL2RvbWFpbi9hcGkvcm91dGVcIikocm91dGVyKTtcbm1vZHVsZS5leHBvcnRzID0gcm91dGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvdXJzZVNwZWMgPSB2b2lkIDA7XG52YXIgcXVlc3Rpb25GaWVsZCA9IHtcbiAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgIHNjaGVtYToge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHF1ZXN0aW9uSWQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb21wdDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICAgICAgICBzY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvcnJlY3RBbnN3ZXI6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcbnZhciBxdWl6RmllbGQgPSB7XG4gICAgdHlwZTogXCJvYmplY3RcIixcbiAgICBzY2hlbWE6IHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBxdWl6SWQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWVzdGlvbnM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgc2NoZW1hOiBxdWVzdGlvbkZpZWxkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIH0sXG59O1xudmFyIGxlc3NvbkZpZWxkID0ge1xuICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgc2NoZW1hOiB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbGVzc29uSWQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBxdWl6emVzOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgICAgICAgICAgIHNjaGVtYTogcXVpekZpZWxkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgIH0sXG59O1xuZXhwb3J0cy5jb3Vyc2VTcGVjID0ge1xuICAgIGZpZWxkczoge1xuICAgICAgICBjb3Vyc2VJZDoge1xuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgfSxcbiAgICAgICAgbGVzc29uczoge1xuICAgICAgICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBzY2hlbWE6IGxlc3NvbkZpZWxkLFxuICAgICAgICB9LFxuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKGcgJiYgKGcgPSAwLCBvcFswXSAmJiAoXyA9IDApKSwgXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmZyYWdtZW50Q2hpbGRyZW4gPSBleHBvcnRzLmZyYWdtZW50U3BlYyA9IHZvaWQgMDtcbnZhciBsYWJlbFNjaGVtYSA9IHtcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy5mcmFnbWVudFNwZWMgPSB7XG4gICAgZmllbGRzOiB7XG4gICAgICAgIFwibmFtZVwiOiB7XG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZW50XCI6IHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgXCJzdG9yeXRocmVhZFJlZmVyZW5jZVwiOiB7XG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICBwYXJlbnQ6IFwic3Rvcnl0aHJlYWRcIlxuICAgICAgICB9LFxuICAgICAgICBcImxhYmVsc1wiOiB7XG4gICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgc2NoZW1hOiBsYWJlbFNjaGVtYSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0YToge1xuICAgICAgICBob29rczoge1xuICAgICAgICAgICAgYmVmb3JlQ3JlYXRlOiBmdW5jdGlvbiAoZG9jLCBjb250ZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBkb2NdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLmZyYWdtZW50Q2hpbGRyZW4gPSBbXCJmcmFnbWVudENvbW1lbnRcIiwgXCJmcmFnbWVudFZlcnNpb25cIl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZnJhZ21lbnRDb21tZW50U3BlYyA9IHZvaWQgMDtcbmV4cG9ydHMuZnJhZ21lbnRDb21tZW50U3BlYyA9IHtcbiAgICBmaWVsZHM6IHtcbiAgICAgICAgXCJmcmFnbWVudFJlZmVyZW5jZVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBcImZyYWdtZW50VmVyc2lvbklkXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiY29udGVudFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZnJhZ21lbnRWZXJzaW9uU3BlYyA9IHZvaWQgMDtcbnZhciBkYnV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vbGliL2RidXRpbHNcIik7XG5leHBvcnRzLmZyYWdtZW50VmVyc2lvblNwZWMgPSB7XG4gICAgZmllbGRzOiB7XG4gICAgICAgIFwiZnJhZ21lbnRSZWZlcmVuY2VcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZW50XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwidmVyc2lvblRhZ1wiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgXCJ1c2VyTm90ZVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWV0YToge1xuICAgICAgICBob29rczoge1xuICAgICAgICAgICAgYmVmb3JlQ3JlYXRlOiBmdW5jdGlvbiAoZG9jLCBjb250ZXh0KSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBub3csIHZlcnNpb25UYWc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJlZm9yZSBjcmVhdGluZyBmcmFnbWVudCB2ZXJzaW9uIGZvciBmcmFnbWVudElkOiBcIi5jb25jYXQoZG9jLmZyYWdtZW50SWQpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkb2MudmVyc2lvblRhZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb25UYWcgPSBcIlwiLmNvbmNhdChub3cuZ2V0RnVsbFllYXIoKSwgXCIuXCIpLmNvbmNhdChTdHJpbmcobm93LmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpLCBcIi5cIikuY29uY2F0KFN0cmluZyhub3cuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpLCBcIl9cIikuY29uY2F0KFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKSwgXCIuXCIpLmNvbmNhdChTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MudmVyc2lvblRhZyA9IHZlcnNpb25UYWc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBkb2NdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH0sXG4gICAgICAgICAgICBhZnRlckNyZWF0ZTogZnVuY3Rpb24gKGRvYywgY29udGV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgRnJhZ21lbnQsIHVwZGF0ZWRGcmFnbWVudCwgZXJyXzE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOZXcgZnJhZ21lbnQgdmVyc2lvbiBjcmVhdGVkIGluIFwiLmNvbmNhdChjb250ZXh0LnNwYWNlLCBcIi9cIikuY29uY2F0KGNvbnRleHQuZG9tYWluLCBcIjpcIiksIGRvYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhZ21lbnQgPSAoMCwgZGJ1dGlsc18xLmdldENvbGxlY3Rpb25CeU5hbWUpKGNvbnRleHQuc3BhY2UsIFwiZnJhZ21lbnRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCBGcmFnbWVudC5maW5kT25lQW5kVXBkYXRlKHsgcmVmZXJlbmNlOiBkb2MuZnJhZ21lbnRSZWZlcmVuY2UgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGRvYy5jb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkQnk6IGNvbnRleHQudXNlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHsgbmV3OiB0cnVlIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVkRnJhZ21lbnQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1cGRhdGVkRnJhZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJfMSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgdXBkYXRpbmcgZnJhZ21lbnQgY29udGVudDpcIiwgZXJyXzEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7IH0sXG4gICAgICAgICAgICBhZnRlclVwZGF0ZTogZnVuY3Rpb24gKGRvYywgY29udGV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRnJhZ21lbnQgdXBkYXRlZDogXCIuY29uY2F0KGRvYy5yZWZlcmVuY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pOyB9LFxuICAgICAgICB9LFxuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNoaWxkcmVuTWFwID0gZXhwb3J0cy5zcGVjc01hcCA9IHZvaWQgMDtcbnZhciBjb3Vyc2Vfc3BlY18xID0gcmVxdWlyZShcIi4vY291cnNlLnNwZWNcIik7XG52YXIgZnJhZ21lbnRfc3BlY18xID0gcmVxdWlyZShcIi4vZnJhZ21lbnQuc3BlY1wiKTtcbnZhciBmcmFnbWVudENvbW1lbnRfc3BlY18xID0gcmVxdWlyZShcIi4vZnJhZ21lbnRDb21tZW50LnNwZWNcIik7XG52YXIgZnJhZ21lbnRWZXJzaW9uX3NwZWNfMSA9IHJlcXVpcmUoXCIuL2ZyYWdtZW50VmVyc2lvbi5zcGVjXCIpO1xudmFyIHN0b3J5dGhyZWFkX3NwZWNfMSA9IHJlcXVpcmUoXCIuL3N0b3J5dGhyZWFkLnNwZWNcIik7XG52YXIgdXNlcl9zcGVjXzEgPSByZXF1aXJlKFwiLi91c2VyLnNwZWNcIik7XG5leHBvcnRzLnNwZWNzTWFwID0ge1xuICAgIHVzZXI6IHVzZXJfc3BlY18xLnVzZXJTcGVjLFxuICAgIGZyYWdtZW50OiBmcmFnbWVudF9zcGVjXzEuZnJhZ21lbnRTcGVjLFxuICAgIGZyYWdtZW50Q29tbWVudDogZnJhZ21lbnRDb21tZW50X3NwZWNfMS5mcmFnbWVudENvbW1lbnRTcGVjLFxuICAgIGZyYWdtZW50VmVyc2lvbjogZnJhZ21lbnRWZXJzaW9uX3NwZWNfMS5mcmFnbWVudFZlcnNpb25TcGVjLFxuICAgIHN0b3J5dGhyZWFkOiBzdG9yeXRocmVhZF9zcGVjXzEuc3Rvcnl0aHJlYWRTcGVjLFxuICAgIGNvdXJzZTogY291cnNlX3NwZWNfMS5jb3Vyc2VTcGVjXG59O1xuZXhwb3J0cy5jaGlsZHJlbk1hcCA9IHtcbiAgICBmcmFnbWVudDogZnJhZ21lbnRfc3BlY18xLmZyYWdtZW50Q2hpbGRyZW4sXG4gICAgc3Rvcnl0aHJlYWQ6IHN0b3J5dGhyZWFkX3NwZWNfMS5zdG9yeXRocmVhZENoaWxkcmVuXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnN0b3J5dGhyZWFkQ2hpbGRyZW4gPSBleHBvcnRzLnN0b3J5dGhyZWFkU3BlYyA9IHZvaWQgMDtcbmV4cG9ydHMuc3Rvcnl0aHJlYWRTcGVjID0ge1xuICAgIGZpZWxkczoge1xuICAgICAgICBcInRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0cy5zdG9yeXRocmVhZENoaWxkcmVuID0gW1wiZnJhZ21lbnRcIl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXNlclNwZWMgPSB2b2lkIDA7XG5leHBvcnRzLnVzZXJTcGVjID0ge1xuICAgIGZpZWxkczoge1xuICAgICAgICBcIm5hbWVcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgXCJwcm9maWxlXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiYmlvXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiYWRkcmVzc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2l0eVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6aXBcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidGFnc1wiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJhcnJheVwiLFxuICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJzY2hlbWFcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgIFwic2NoZW1hXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJsYWJlbFwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluaXRpYWxpemVTZXF1ZW5jZXMgPSB2b2lkIDA7XG52YXIgc2VydmljZV8xID0gcmVxdWlyZShcIi4vbW9kdWxlcy9zZXF1ZW5jZS9zZXJ2aWNlXCIpO1xudmFyIGluaXRpYWxpemVTZXF1ZW5jZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgKDAsIHNlcnZpY2VfMS5jcmVhdGVfc2VxdWVuY2UpKFwiYXNzZXRJZFwiLCBudWxsLCAxKTtcbiAgICAoMCwgc2VydmljZV8xLmNyZWF0ZV9zZXF1ZW5jZSkoXCJjb21wYW55SWRcIiwgbnVsbCwgMSk7XG59O1xuZXhwb3J0cy5pbml0aWFsaXplU2VxdWVuY2VzID0gaW5pdGlhbGl6ZVNlcXVlbmNlcztcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbi8qKlxuICogQHBhcmFtIHsoc3RyaW5nIHwgbnVtYmVyKVtdfSB1cGRhdGVkTW9kdWxlcyB1cGRhdGVkIG1vZHVsZXNcbiAqIEBwYXJhbSB7KHN0cmluZyB8IG51bWJlcilbXSB8IG51bGx9IHJlbmV3ZWRNb2R1bGVzIHJlbmV3ZWQgbW9kdWxlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG5cdH0pO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdGlmICh1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0bG9nKFxuXHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogKFRoZXkgd291bGQgbmVlZCBhIGZ1bGwgcmVsb2FkISlcIlxuXHRcdCk7XG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1vZHVsZUlkID09PSBcInN0cmluZ1wiICYmIG1vZHVsZUlkLmluZGV4T2YoXCIhXCIpICE9PSAtMSkge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBtb2R1bGVJZC5zcGxpdChcIiFcIik7XG5cdFx0XHRcdGxvZy5ncm91cENvbGxhcHNlZChcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIHBhcnRzLnBvcCgpKTtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0XHRsb2cuZ3JvdXBFbmQoXCJpbmZvXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBudW1iZXJJZHMgPSByZW5ld2VkTW9kdWxlcy5ldmVyeShmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XG5cdFx0fSk7XG5cdFx0aWYgKG51bWJlcklkcylcblx0XHRcdGxvZyhcblx0XHRcdFx0XCJpbmZvXCIsXG5cdFx0XHRcdCdbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgb3B0aW1pemF0aW9uLm1vZHVsZUlkczogXCJuYW1lZFwiIGZvciBtb2R1bGUgbmFtZXMuJ1xuXHRcdFx0KTtcblx0fVxufTtcbiIsIi8qKiBAdHlwZWRlZiB7XCJpbmZvXCIgfCBcIndhcm5pbmdcIiB8IFwiZXJyb3JcIn0gTG9nTGV2ZWwgKi9cblxuLyoqIEB0eXBlIHtMb2dMZXZlbH0gKi9cbnZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbi8qKlxuICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgbG9nIGxldmVsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSwgaWYgc2hvdWxkIGxvZ1xuICovXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbi8qKlxuICogQHBhcmFtIHsobXNnPzogc3RyaW5nKSA9PiB2b2lkfSBsb2dGbiBsb2cgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsobGV2ZWw6IExvZ0xldmVsLCBtc2c/OiBzdHJpbmcpID0+IHZvaWR9IGZ1bmN0aW9uIHRoYXQgbG9ncyB3aGVuIGxvZyBsZXZlbCBpcyBzdWZmaWNpZW50XG4gKi9cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge0xvZ0xldmVsfSBsZXZlbCBsb2cgbGV2ZWxcbiAqIEBwYXJhbSB7c3RyaW5nfEVycm9yfSBtc2cgbWVzc2FnZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbi8qKlxuICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgbG9nIGxldmVsXG4gKi9cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7RXJyb3J9IGVyciBlcnJvclxuICogQHJldHVybnMge3N0cmluZ30gZm9ybWF0dGVkIGVycm9yXG4gKi9cbm1vZHVsZS5leHBvcnRzLmZvcm1hdEVycm9yID0gZnVuY3Rpb24gKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9XG5cdHJldHVybiBzdGFjaztcbn07XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLyogZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnNsaWNlKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBmcm9tVXBkYXRlIHRydWUgd2hlbiBjYWxsZWQgZnJvbSB1cGRhdGVcblx0ICovXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uICh1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdGlmICghdXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRcdGlmIChmcm9tVXBkYXRlKSBsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlIGFwcGxpZWQuXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9sb2ctYXBwbHktcmVzdWx0XCIpKHVwZGF0ZWRNb2R1bGVzLCB1cGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdFx0Y2hlY2tGb3JVcGRhdGUodHJ1ZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdFx0aWYgKFtcImFib3J0XCIsIFwiZmFpbFwiXS5pbmRleE9mKHN0YXR1cykgPj0gMCkge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFlvdSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcGxpY2F0aW9uIVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuIiwidmFyIG1vbmdvb3NlID0gcmVxdWlyZSgnbW9uZ29vc2UnKTtcblxuY29uc3QgU2NoZW1hID0gbW9uZ29vc2UuU2NoZW1hO1xuY29uc3Qgc2VxdWVuY2VTY2hlbWEgPSBuZXcgU2NoZW1hKFxuICB7XG4gICAgZmllbGQ6IHsgdHlwZTogU3RyaW5nIH0sXG4gICAgY29udGV4dDogeyB0eXBlOiBTdHJpbmcgfSxcbiAgICBuZXh0dmFsOiB7IHR5cGU6IE51bWJlciB9LFxuICAgIGZhY3RvcjogeyB0eXBlOiBOdW1iZXIgfSxcbiAgfSxcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cbik7XG5cbmNvbnN0IHNlcXVlbmNlQ29sbGVjdGlvbiA9ICdzZXF1ZW5jZSc7XG5cbm1vZHVsZS5leHBvcnRzID0geyBzZXF1ZW5jZVNjaGVtYSwgc2VxdWVuY2VDb2xsZWN0aW9uIH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkYXRlLWZuc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb25nb29zZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuYW5vaWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRpZiAoY2FjaGVkTW9kdWxlLmVycm9yICE9PSB1bmRlZmluZWQpIHRocm93IGNhY2hlZE1vZHVsZS5lcnJvcjtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0dHJ5IHtcblx0XHR2YXIgZXhlY09wdGlvbnMgPSB7IGlkOiBtb2R1bGVJZCwgbW9kdWxlOiBtb2R1bGUsIGZhY3Rvcnk6IF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLCByZXF1aXJlOiBfX3dlYnBhY2tfcmVxdWlyZV9fIH07XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikgeyBoYW5kbGVyKGV4ZWNPcHRpb25zKTsgfSk7XG5cdFx0bW9kdWxlID0gZXhlY09wdGlvbnMubW9kdWxlO1xuXHRcdGV4ZWNPcHRpb25zLmZhY3RvcnkuY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgZXhlY09wdGlvbnMucmVxdWlyZSk7XG5cdH0gY2F0Y2goZSkge1xuXHRcdG1vZHVsZS5lcnJvciA9IGU7XG5cdFx0dGhyb3cgZTtcblx0fVxuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX187XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlIGV4ZWN1dGlvbiBpbnRlcmNlcHRvclxuX193ZWJwYWNrX3JlcXVpcmVfXy5pID0gW107XG5cbiIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFsbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uaHUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBfX3dlYnBhY2tfcmVxdWlyZV9fLmgoKSArIFwiLmhvdC11cGRhdGUuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5obXJGID0gKCkgPT4gKFwibWFpbi5cIiArIF9fd2VicGFja19yZXF1aXJlX18uaCgpICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpOyIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcIjVkZjVjYjE0MzJmZGUzOThjYWEzXCIpIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsInZhciBjdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xudmFyIGluc3RhbGxlZE1vZHVsZXMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmM7XG5cbi8vIG1vZHVsZSBhbmQgcmVxdWlyZSBjcmVhdGlvblxudmFyIGN1cnJlbnRDaGlsZE1vZHVsZTtcbnZhciBjdXJyZW50UGFyZW50cyA9IFtdO1xuXG4vLyBzdGF0dXNcbnZhciByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMgPSBbXTtcbnZhciBjdXJyZW50U3RhdHVzID0gXCJpZGxlXCI7XG5cbi8vIHdoaWxlIGRvd25sb2FkaW5nXG52YXIgYmxvY2tpbmdQcm9taXNlcyA9IDA7XG52YXIgYmxvY2tpbmdQcm9taXNlc1dhaXRpbmcgPSBbXTtcblxuLy8gVGhlIHVwZGF0ZSBpbmZvXG52YXIgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnM7XG52YXIgcXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzO1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckQgPSBjdXJyZW50TW9kdWxlRGF0YTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5pLnB1c2goZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0dmFyIG1vZHVsZSA9IG9wdGlvbnMubW9kdWxlO1xuXHR2YXIgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUob3B0aW9ucy5yZXF1aXJlLCBvcHRpb25zLmlkKTtcblx0bW9kdWxlLmhvdCA9IGNyZWF0ZU1vZHVsZUhvdE9iamVjdChvcHRpb25zLmlkLCBtb2R1bGUpO1xuXHRtb2R1bGUucGFyZW50cyA9IGN1cnJlbnRQYXJlbnRzO1xuXHRtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0Y3VycmVudFBhcmVudHMgPSBbXTtcblx0b3B0aW9ucy5yZXF1aXJlID0gcmVxdWlyZTtcbn0pO1xuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmhtckMgPSB7fTtcbl9fd2VicGFja19yZXF1aXJlX18uaG1ySSA9IHt9O1xuXG5mdW5jdGlvbiBjcmVhdGVSZXF1aXJlKHJlcXVpcmUsIG1vZHVsZUlkKSB7XG5cdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXHRpZiAoIW1lKSByZXR1cm4gcmVxdWlyZTtcblx0dmFyIGZuID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcblx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuXHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcblx0XHRcdFx0dmFyIHBhcmVudHMgPSBpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHM7XG5cdFx0XHRcdGlmIChwYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuXHRcdFx0XHRcdHBhcmVudHMucHVzaChtb2R1bGVJZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcblx0XHRcdFx0Y3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcblx0XHRcdH1cblx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuXHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcblx0XHRcdFx0XHRyZXF1ZXN0ICtcblx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuXHRcdFx0XHRcdG1vZHVsZUlkXG5cdFx0XHQpO1xuXHRcdFx0Y3VycmVudFBhcmVudHMgPSBbXTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlcXVpcmUocmVxdWVzdCk7XG5cdH07XG5cdHZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiAobmFtZSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiByZXF1aXJlW25hbWVdO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRcdHJlcXVpcmVbbmFtZV0gPSB2YWx1ZTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXHRmb3IgKHZhciBuYW1lIGluIHJlcXVpcmUpIHtcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlcXVpcmUsIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcihuYW1lKSk7XG5cdFx0fVxuXHR9XG5cdGZuLmUgPSBmdW5jdGlvbiAoY2h1bmtJZCwgZmV0Y2hQcmlvcml0eSkge1xuXHRcdHJldHVybiB0cmFja0Jsb2NraW5nUHJvbWlzZShyZXF1aXJlLmUoY2h1bmtJZCwgZmV0Y2hQcmlvcml0eSkpO1xuXHR9O1xuXHRyZXR1cm4gZm47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZHVsZUhvdE9iamVjdChtb2R1bGVJZCwgbWUpIHtcblx0dmFyIF9tYWluID0gY3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZDtcblx0dmFyIGhvdCA9IHtcblx0XHQvLyBwcml2YXRlIHN0dWZmXG5cdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcblx0XHRfYWNjZXB0ZWRFcnJvckhhbmRsZXJzOiB7fSxcblx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuXHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuXHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuXHRcdF9zZWxmSW52YWxpZGF0ZWQ6IGZhbHNlLFxuXHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuXHRcdF9tYWluOiBfbWFpbixcblx0XHRfcmVxdWlyZVNlbGY6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGN1cnJlbnRQYXJlbnRzID0gbWUucGFyZW50cy5zbGljZSgpO1xuXHRcdFx0Y3VycmVudENoaWxkTW9kdWxlID0gX21haW4gPyB1bmRlZmluZWQgOiBtb2R1bGVJZDtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuXHRcdH0sXG5cblx0XHQvLyBNb2R1bGUgQVBJXG5cdFx0YWN0aXZlOiB0cnVlLFxuXHRcdGFjY2VwdDogZnVuY3Rpb24gKGRlcCwgY2FsbGJhY2ssIGVycm9ySGFuZGxlcikge1xuXHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIiAmJiBkZXAgIT09IG51bGwpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRXJyb3JIYW5kbGVyc1tkZXBbaV1dID0gZXJyb3JIYW5kbGVyO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdFx0aG90Ll9hY2NlcHRlZEVycm9ySGFuZGxlcnNbZGVwXSA9IGVycm9ySGFuZGxlcjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRlY2xpbmU6IGZ1bmN0aW9uIChkZXApIHtcblx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIiAmJiBkZXAgIT09IG51bGwpXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG5cdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG5cdFx0fSxcblx0XHRkaXNwb3NlOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuXHRcdH0sXG5cdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG5cdFx0fSxcblx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG5cdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuXHRcdH0sXG5cdFx0aW52YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fc2VsZkludmFsaWRhdGVkID0gdHJ1ZTtcblx0XHRcdHN3aXRjaCAoY3VycmVudFN0YXR1cykge1xuXHRcdFx0XHRjYXNlIFwiaWRsZVwiOlxuXHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzID0gW107XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJJKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKFxuXHRcdFx0XHRcdFx0XHRtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnNcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0c2V0U3RhdHVzKFwicmVhZHlcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJyZWFkeVwiOlxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uaG1ySSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtcklba2V5XShcblx0XHRcdFx0XHRcdFx0bW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicHJlcGFyZVwiOlxuXHRcdFx0XHRjYXNlIFwiY2hlY2tcIjpcblx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VcIjpcblx0XHRcdFx0Y2FzZSBcImFwcGx5XCI6XG5cdFx0XHRcdFx0KHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyA9IHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcyB8fCBbXSkucHVzaChcblx0XHRcdFx0XHRcdG1vZHVsZUlkXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvLyBpZ25vcmUgcmVxdWVzdHMgaW4gZXJyb3Igc3RhdGVzXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIE1hbmFnZW1lbnQgQVBJXG5cdFx0Y2hlY2s6IGhvdENoZWNrLFxuXHRcdGFwcGx5OiBob3RBcHBseSxcblx0XHRzdGF0dXM6IGZ1bmN0aW9uIChsKSB7XG5cdFx0XHRpZiAoIWwpIHJldHVybiBjdXJyZW50U3RhdHVzO1xuXHRcdFx0cmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG5cdFx0fSxcblx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0cmVnaXN0ZXJlZFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG5cdFx0fSxcblx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbiAobCkge1xuXHRcdFx0dmFyIGlkeCA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuXHRcdFx0aWYgKGlkeCA+PSAwKSByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG5cdFx0fSxcblxuXHRcdC8vIGluaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcblx0XHRkYXRhOiBjdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cblx0fTtcblx0Y3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuXHRyZXR1cm4gaG90O1xufVxuXG5mdW5jdGlvbiBzZXRTdGF0dXMobmV3U3RhdHVzKSB7XG5cdGN1cnJlbnRTdGF0dXMgPSBuZXdTdGF0dXM7XG5cdHZhciByZXN1bHRzID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZWdpc3RlcmVkU3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG5cdFx0cmVzdWx0c1tpXSA9IHJlZ2lzdGVyZWRTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG5cblx0cmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdHMpLnRoZW4oZnVuY3Rpb24gKCkge30pO1xufVxuXG5mdW5jdGlvbiB1bmJsb2NrKCkge1xuXHRpZiAoLS1ibG9ja2luZ1Byb21pc2VzID09PSAwKSB7XG5cdFx0c2V0U3RhdHVzKFwicmVhZHlcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoYmxvY2tpbmdQcm9taXNlcyA9PT0gMCkge1xuXHRcdFx0XHR2YXIgbGlzdCA9IGJsb2NraW5nUHJvbWlzZXNXYWl0aW5nO1xuXHRcdFx0XHRibG9ja2luZ1Byb21pc2VzV2FpdGluZyA9IFtdO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRsaXN0W2ldKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFja0Jsb2NraW5nUHJvbWlzZShwcm9taXNlKSB7XG5cdHN3aXRjaCAoY3VycmVudFN0YXR1cykge1xuXHRcdGNhc2UgXCJyZWFkeVwiOlxuXHRcdFx0c2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcblx0XHQvKiBmYWxsdGhyb3VnaCAqL1xuXHRcdGNhc2UgXCJwcmVwYXJlXCI6XG5cdFx0XHRibG9ja2luZ1Byb21pc2VzKys7XG5cdFx0XHRwcm9taXNlLnRoZW4odW5ibG9jaywgdW5ibG9jayk7XG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdH1cbn1cblxuZnVuY3Rpb24gd2FpdEZvckJsb2NraW5nUHJvbWlzZXMoZm4pIHtcblx0aWYgKGJsb2NraW5nUHJvbWlzZXMgPT09IDApIHJldHVybiBmbigpO1xuXHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRibG9ja2luZ1Byb21pc2VzV2FpdGluZy5wdXNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlc29sdmUoZm4oKSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBob3RDaGVjayhhcHBseU9uVXBkYXRlKSB7XG5cdGlmIChjdXJyZW50U3RhdHVzICE9PSBcImlkbGVcIikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuXHR9XG5cdHJldHVybiBzZXRTdGF0dXMoXCJjaGVja1wiKVxuXHRcdC50aGVuKF9fd2VicGFja19yZXF1aXJlX18uaG1yTSlcblx0XHQudGhlbihmdW5jdGlvbiAodXBkYXRlKSB7XG5cdFx0XHRpZiAoIXVwZGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gc2V0U3RhdHVzKGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkgPyBcInJlYWR5XCIgOiBcImlkbGVcIikudGhlbihcblx0XHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJwcmVwYXJlXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgdXBkYXRlZE1vZHVsZXMgPSBbXTtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcblxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoXG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDKS5yZWR1Y2UoZnVuY3Rpb24gKFxuXHRcdFx0XHRcdFx0cHJvbWlzZXMsXG5cdFx0XHRcdFx0XHRrZXlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1yQ1trZXldKFxuXHRcdFx0XHRcdFx0XHR1cGRhdGUuYyxcblx0XHRcdFx0XHRcdFx0dXBkYXRlLnIsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZS5tLFxuXHRcdFx0XHRcdFx0XHRwcm9taXNlcyxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMsXG5cdFx0XHRcdFx0XHRcdHVwZGF0ZWRNb2R1bGVzXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHByb21pc2VzO1xuXHRcdFx0XHRcdH0sIFtdKVxuXHRcdFx0XHQpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHJldHVybiB3YWl0Rm9yQmxvY2tpbmdQcm9taXNlcyhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRpZiAoYXBwbHlPblVwZGF0ZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaW50ZXJuYWxBcHBseShhcHBseU9uVXBkYXRlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiBzZXRTdGF0dXMoXCJyZWFkeVwiKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHVwZGF0ZWRNb2R1bGVzO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcblx0aWYgKGN1cnJlbnRTdGF0dXMgIT09IFwicmVhZHlcIikge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXMgKHN0YXRlOiBcIiArXG5cdFx0XHRcdFx0Y3VycmVudFN0YXR1cyArXG5cdFx0XHRcdFx0XCIpXCJcblx0XHRcdCk7XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGludGVybmFsQXBwbHkob3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGludGVybmFsQXBwbHkob3B0aW9ucykge1xuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRhcHBseUludmFsaWRhdGVkTW9kdWxlcygpO1xuXG5cdHZhciByZXN1bHRzID0gY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMubWFwKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG5cdFx0cmV0dXJuIGhhbmRsZXIob3B0aW9ucyk7XG5cdH0pO1xuXHRjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycyA9IHVuZGVmaW5lZDtcblxuXHR2YXIgZXJyb3JzID0gcmVzdWx0c1xuXHRcdC5tYXAoZnVuY3Rpb24gKHIpIHtcblx0XHRcdHJldHVybiByLmVycm9yO1xuXHRcdH0pXG5cdFx0LmZpbHRlcihCb29sZWFuKTtcblxuXHRpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcblx0XHRyZXR1cm4gc2V0U3RhdHVzKFwiYWJvcnRcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aHJvdyBlcnJvcnNbMF07XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2Vcblx0dmFyIGRpc3Bvc2VQcm9taXNlID0gc2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcblxuXHRyZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdGlmIChyZXN1bHQuZGlzcG9zZSkgcmVzdWx0LmRpc3Bvc2UoKTtcblx0fSk7XG5cblx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuXHR2YXIgYXBwbHlQcm9taXNlID0gc2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cblx0dmFyIGVycm9yO1xuXHR2YXIgcmVwb3J0RXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG5cdH07XG5cblx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuXHRyZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdGlmIChyZXN1bHQuYXBwbHkpIHtcblx0XHRcdHZhciBtb2R1bGVzID0gcmVzdWx0LmFwcGx5KHJlcG9ydEVycm9yKTtcblx0XHRcdGlmIChtb2R1bGVzKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKG1vZHVsZXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gUHJvbWlzZS5hbGwoW2Rpc3Bvc2VQcm9taXNlLCBhcHBseVByb21pc2VdKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0cmV0dXJuIHNldFN0YXR1cyhcImZhaWxcIikudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRocm93IGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKHF1ZXVlZEludmFsaWRhdGVkTW9kdWxlcykge1xuXHRcdFx0cmV0dXJuIGludGVybmFsQXBwbHkob3B0aW9ucykudGhlbihmdW5jdGlvbiAobGlzdCkge1xuXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRcdFx0XHRpZiAobGlzdC5pbmRleE9mKG1vZHVsZUlkKSA8IDApIGxpc3QucHVzaChtb2R1bGVJZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gbGlzdDtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBzZXRTdGF0dXMoXCJpZGxlXCIpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG91dGRhdGVkTW9kdWxlcztcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFwcGx5SW52YWxpZGF0ZWRNb2R1bGVzKCkge1xuXHRpZiAocXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzKSB7XG5cdFx0aWYgKCFjdXJyZW50VXBkYXRlQXBwbHlIYW5kbGVycykgY3VycmVudFVwZGF0ZUFwcGx5SGFuZGxlcnMgPSBbXTtcblx0XHRPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cXVldWVkSW52YWxpZGF0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18uaG1ySVtrZXldKFxuXHRcdFx0XHRcdG1vZHVsZUlkLFxuXHRcdFx0XHRcdGN1cnJlbnRVcGRhdGVBcHBseUhhbmRsZXJzXG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0XHRxdWV1ZWRJbnZhbGlkYXRlZE1vZHVsZXMgPSB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn0iLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4vLyBcIjFcIiBtZWFucyBcImxvYWRlZFwiLCBvdGhlcndpc2Ugbm90IGxvYWRlZCB5ZXRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmhtclNfcmVxdWlyZSA9IF9fd2VicGFja19yZXF1aXJlX18uaG1yU19yZXF1aXJlIHx8IHtcblx0XCJtYWluXCI6IDFcbn07XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8gY2h1bmsgaW5zdGFsbCBmdW5jdGlvbiBuZWVkZWRcblxuLy8gbm8gY2h1bmsgbG9hZGluZ1xuXG4vLyBubyBleHRlcm5hbCBpbnN0YWxsIGNodW5rXG5cbmZ1bmN0aW9uIGxvYWRVcGRhdGVDaHVuayhjaHVua0lkLCB1cGRhdGVkTW9kdWxlc0xpc3QpIHtcblx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy5odShjaHVua0lkKSk7XG5cdHZhciB1cGRhdGVkTW9kdWxlcyA9IHVwZGF0ZS5tb2R1bGVzO1xuXHR2YXIgcnVudGltZSA9IHVwZGF0ZS5ydW50aW1lO1xuXHRmb3IodmFyIG1vZHVsZUlkIGluIHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKHVwZGF0ZWRNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdGN1cnJlbnRVcGRhdGVbbW9kdWxlSWRdID0gdXBkYXRlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0aWYodXBkYXRlZE1vZHVsZXNMaXN0KSB1cGRhdGVkTW9kdWxlc0xpc3QucHVzaChtb2R1bGVJZCk7XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIGN1cnJlbnRVcGRhdGVSdW50aW1lLnB1c2gocnVudGltZSk7XG59XG5cbnZhciBjdXJyZW50VXBkYXRlQ2h1bmtzO1xudmFyIGN1cnJlbnRVcGRhdGU7XG52YXIgY3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3M7XG52YXIgY3VycmVudFVwZGF0ZVJ1bnRpbWU7XG5mdW5jdGlvbiBhcHBseUhhbmRsZXIob3B0aW9ucykge1xuXHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5mKSBkZWxldGUgX193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmVIbXI7XG5cdGN1cnJlbnRVcGRhdGVDaHVua3MgPSB1bmRlZmluZWQ7XG5cdGZ1bmN0aW9uIGdldEFmZmVjdGVkTW9kdWxlRWZmZWN0cyh1cGRhdGVNb2R1bGVJZCkge1xuXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG5cdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbiAoaWQpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGNoYWluOiBbaWRdLFxuXHRcdFx0XHRpZDogaWRcblx0XHRcdH07XG5cdFx0fSk7XG5cdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcblx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcblx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcblx0XHRcdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmNbbW9kdWxlSWRdO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQhbW9kdWxlIHx8XG5cdFx0XHRcdChtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQgJiYgIW1vZHVsZS5ob3QuX3NlbGZJbnZhbGlkYXRlZClcblx0XHRcdClcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG5cdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuXHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcblx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG5cdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW3BhcmVudElkXTtcblx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcblx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG5cdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcblx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuXHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuXHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG5cdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG5cdFx0XHRcdHF1ZXVlLnB1c2goe1xuXHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG5cdFx0XHRcdFx0aWQ6IHBhcmVudElkXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG5cdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG5cdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcblx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IGJbaV07XG5cdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuXHRcdH1cblx0fVxuXG5cdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG5cdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cblx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcblx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuXHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKG1vZHVsZSkge1xuXHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgbW9kdWxlLmlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG5cdFx0KTtcblx0fTtcblxuXHRmb3IgKHZhciBtb2R1bGVJZCBpbiBjdXJyZW50VXBkYXRlKSB7XG5cdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlLCBtb2R1bGVJZCkpIHtcblx0XHRcdHZhciBuZXdNb2R1bGVGYWN0b3J5ID0gY3VycmVudFVwZGF0ZVttb2R1bGVJZF07XG5cdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG5cdFx0XHR2YXIgcmVzdWx0ID0gbmV3TW9kdWxlRmFjdG9yeVxuXHRcdFx0XHQ/IGdldEFmZmVjdGVkTW9kdWxlRWZmZWN0cyhtb2R1bGVJZClcblx0XHRcdFx0OiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG5cdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcblx0XHRcdFx0XHR9O1xuXHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cblx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG5cdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuXHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuXHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG5cdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG5cdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcblx0XHRcdH1cblx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcblx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcblx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG5cdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuXHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuXHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuXHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcblx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG5cdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG5cdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcblx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcblx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG5cdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuXHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcblx0XHRcdH1cblx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0ZXJyb3I6IGFib3J0RXJyb3Jcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGlmIChkb0FwcGx5KSB7XG5cdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gbmV3TW9kdWxlRmFjdG9yeTtcblx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcblx0XHRcdFx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5vKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG5cdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuXHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuXHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcblx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGN1cnJlbnRVcGRhdGUgPSB1bmRlZmluZWQ7XG5cblx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuXHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG5cdGZvciAodmFyIGogPSAwOyBqIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaisrKSB7XG5cdFx0dmFyIG91dGRhdGVkTW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbal07XG5cdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRpZiAoXG5cdFx0XHRtb2R1bGUgJiZcblx0XHRcdChtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQgfHwgbW9kdWxlLmhvdC5fbWFpbikgJiZcblx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcblx0XHRcdGFwcGxpZWRVcGRhdGVbb3V0ZGF0ZWRNb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZSAmJlxuXHRcdFx0Ly8gd2hlbiBjYWxsZWQgaW52YWxpZGF0ZSBzZWxmLWFjY2VwdGluZyBpcyBub3QgcG9zc2libGVcblx0XHRcdCFtb2R1bGUuaG90Ll9zZWxmSW52YWxpZGF0ZWRcblx0XHQpIHtcblx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcblx0XHRcdFx0bW9kdWxlOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRyZXF1aXJlOiBtb2R1bGUuaG90Ll9yZXF1aXJlU2VsZixcblx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWRcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcblxuXHRyZXR1cm4ge1xuXHRcdGRpc3Bvc2U6IGZ1bmN0aW9uICgpIHtcblx0XHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzLmZvckVhY2goZnVuY3Rpb24gKGNodW5rSWQpIHtcblx0XHRcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcblx0XHRcdH0pO1xuXHRcdFx0Y3VycmVudFVwZGF0ZVJlbW92ZWRDaHVua3MgPSB1bmRlZmluZWQ7XG5cblx0XHRcdHZhciBpZHg7XG5cdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcblx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuXHRcdFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblx0XHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG5cdFx0XHRcdHZhciBkYXRhID0ge307XG5cblx0XHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG5cdFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG5cdFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRkaXNwb3NlSGFuZGxlcnNbal0uY2FsbChudWxsLCBkYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmhtckRbbW9kdWxlSWRdID0gZGF0YTtcblxuXHRcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuXHRcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG5cdFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuXHRcdFx0XHRkZWxldGUgX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXTtcblxuXHRcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG5cdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cblx0XHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cblx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdHZhciBjaGlsZCA9IF9fd2VicGFja19yZXF1aXJlX18uY1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuXHRcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG5cdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG5cdFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuXHRcdFx0dmFyIGRlcGVuZGVuY3k7XG5cdFx0XHRmb3IgKHZhciBvdXRkYXRlZE1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG91dGRhdGVkTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0bW9kdWxlID0gX193ZWJwYWNrX3JlcXVpcmVfXy5jW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdGlmIChtb2R1bGUpIHtcblx0XHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID1cblx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbb3V0ZGF0ZWRNb2R1bGVJZF07XG5cdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuXHRcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcblx0XHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhcHBseTogZnVuY3Rpb24gKHJlcG9ydEVycm9yKSB7XG5cdFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcblx0XHRcdGZvciAodmFyIHVwZGF0ZU1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcblx0XHRcdFx0aWYgKF9fd2VicGFja19yZXF1aXJlX18ubyhhcHBsaWVkVXBkYXRlLCB1cGRhdGVNb2R1bGVJZCkpIHtcblx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bdXBkYXRlTW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVt1cGRhdGVNb2R1bGVJZF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcnVuIG5ldyBydW50aW1lIG1vZHVsZXNcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY3VycmVudFVwZGF0ZVJ1bnRpbWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZVJ1bnRpbWVbaV0oX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG5cdFx0XHRmb3IgKHZhciBvdXRkYXRlZE1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG5cdFx0XHRcdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLm8ob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG91dGRhdGVkTW9kdWxlSWQpKSB7XG5cdFx0XHRcdFx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19yZXF1aXJlX18uY1tvdXRkYXRlZE1vZHVsZUlkXTtcblx0XHRcdFx0XHRpZiAobW9kdWxlKSB7XG5cdFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9XG5cdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW291dGRhdGVkTW9kdWxlSWRdO1xuXHRcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuXHRcdFx0XHRcdFx0dmFyIGVycm9ySGFuZGxlcnMgPSBbXTtcblx0XHRcdFx0XHRcdHZhciBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3MgPSBbXTtcblx0XHRcdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHRcdFx0dmFyIGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcblx0XHRcdFx0XHRcdFx0dmFyIGFjY2VwdENhbGxiYWNrID1cblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcblx0XHRcdFx0XHRcdFx0dmFyIGVycm9ySGFuZGxlciA9XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmhvdC5fYWNjZXB0ZWRFcnJvckhhbmRsZXJzW2RlcGVuZGVuY3ldO1xuXHRcdFx0XHRcdFx0XHRpZiAoYWNjZXB0Q2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoYWNjZXB0Q2FsbGJhY2spICE9PSAtMSkgY29udGludWU7XG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goYWNjZXB0Q2FsbGJhY2spO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9ySGFuZGxlcnMucHVzaChlcnJvckhhbmRsZXIpO1xuXHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrcy5wdXNoKGRlcGVuZGVuY3kpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IGNhbGxiYWNrcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrc1trXS5jYWxsKG51bGwsIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcblx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBlcnJvckhhbmRsZXJzW2tdID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9ySGFuZGxlcnNba10oZXJyLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBkZXBlbmRlbmNpZXNGb3JDYWxsYmFja3Nba11cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG91dGRhdGVkTW9kdWxlSWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IGRlcGVuZGVuY2llc0ZvckNhbGxiYWNrc1trXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIyKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBvdXRkYXRlZE1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogZGVwZW5kZW5jaWVzRm9yQ2FsbGJhY2tzW2tdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuXHRcdFx0Zm9yICh2YXIgbyA9IDA7IG8gPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBvKyspIHtcblx0XHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbb107XG5cdFx0XHRcdHZhciBtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGl0ZW0ucmVxdWlyZShtb2R1bGVJZCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyLCB7XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZTogX193ZWJwYWNrX3JlcXVpcmVfXy5jW21vZHVsZUlkXVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycjEpIHtcblx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcblx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcblx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIxLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIxKTtcblx0XHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuXHRcdFx0XHRcdFx0XHRyZXBvcnRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb3V0ZGF0ZWRNb2R1bGVzO1xuXHRcdH1cblx0fTtcbn1cbl9fd2VicGFja19yZXF1aXJlX18uaG1ySS5yZXF1aXJlID0gZnVuY3Rpb24gKG1vZHVsZUlkLCBhcHBseUhhbmRsZXJzKSB7XG5cdGlmICghY3VycmVudFVwZGF0ZSkge1xuXHRcdGN1cnJlbnRVcGRhdGUgPSB7fTtcblx0XHRjdXJyZW50VXBkYXRlUnVudGltZSA9IFtdO1xuXHRcdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gW107XG5cdFx0YXBwbHlIYW5kbGVycy5wdXNoKGFwcGx5SGFuZGxlcik7XG5cdH1cblx0aWYgKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oY3VycmVudFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG5cdFx0Y3VycmVudFVwZGF0ZVttb2R1bGVJZF0gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdO1xuXHR9XG59O1xuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJDLnJlcXVpcmUgPSBmdW5jdGlvbiAoXG5cdGNodW5rSWRzLFxuXHRyZW1vdmVkQ2h1bmtzLFxuXHRyZW1vdmVkTW9kdWxlcyxcblx0cHJvbWlzZXMsXG5cdGFwcGx5SGFuZGxlcnMsXG5cdHVwZGF0ZWRNb2R1bGVzTGlzdFxuKSB7XG5cdGFwcGx5SGFuZGxlcnMucHVzaChhcHBseUhhbmRsZXIpO1xuXHRjdXJyZW50VXBkYXRlQ2h1bmtzID0ge307XG5cdGN1cnJlbnRVcGRhdGVSZW1vdmVkQ2h1bmtzID0gcmVtb3ZlZENodW5rcztcblx0Y3VycmVudFVwZGF0ZSA9IHJlbW92ZWRNb2R1bGVzLnJlZHVjZShmdW5jdGlvbiAob2JqLCBrZXkpIHtcblx0XHRvYmpba2V5XSA9IGZhbHNlO1xuXHRcdHJldHVybiBvYmo7XG5cdH0sIHt9KTtcblx0Y3VycmVudFVwZGF0ZVJ1bnRpbWUgPSBbXTtcblx0Y2h1bmtJZHMuZm9yRWFjaChmdW5jdGlvbiAoY2h1bmtJZCkge1xuXHRcdGlmIChcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmXG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gIT09IHVuZGVmaW5lZFxuXHRcdCkge1xuXHRcdFx0cHJvbWlzZXMucHVzaChsb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgdXBkYXRlZE1vZHVsZXNMaXN0KSk7XG5cdFx0XHRjdXJyZW50VXBkYXRlQ2h1bmtzW2NodW5rSWRdID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9IGZhbHNlO1xuXHRcdH1cblx0fSk7XG5cdGlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmYpIHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmYucmVxdWlyZUhtciA9IGZ1bmN0aW9uIChjaHVua0lkLCBwcm9taXNlcykge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRjdXJyZW50VXBkYXRlQ2h1bmtzICYmXG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubyhjdXJyZW50VXBkYXRlQ2h1bmtzLCBjaHVua0lkKSAmJlxuXHRcdFx0XHQhY3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXVxuXHRcdFx0KSB7XG5cdFx0XHRcdHByb21pc2VzLnB1c2gobG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpKTtcblx0XHRcdFx0Y3VycmVudFVwZGF0ZUNodW5rc1tjaHVua0lkXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxufTtcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5obXJNID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiByZXF1aXJlKFwiLi9cIiArIF9fd2VicGFja19yZXF1aXJlX18uaG1yRigpKTtcblx0fSlbJ2NhdGNoJ10oZnVuY3Rpb24oZXJyKSB7IGlmKGVyci5jb2RlICE9PSAnTU9EVUxFX05PVF9GT1VORCcpIHRocm93IGVycjsgfSk7XG59IiwiIiwiLy8gbW9kdWxlIGNhY2hlIGFyZSB1c2VkIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2hvdC9wb2xsLmpzPzEwMDBcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tYWluLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9