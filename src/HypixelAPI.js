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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const MinecraftAPI = require("minecraft-api");
const UUID_1 = require("./UUID");
const Exceptions_1 = require("./Exceptions");
const baseURL = 'https://api.hypixel.net/';
const HypixelAxios = axios_1.default.create({
    baseURL: baseURL
});
function getPlayerByUuid(uuid, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield _simpleGet(baseURL + 'player?uuid=' + uuid.toString() + '&key=' + apiKey.toString());
        if (response.player == null)
            throw Exceptions_1.default.NOT_FOUND;
        return response.player;
    });
}
exports.getPlayerByUuid = getPlayerByUuid;
function getPlayerByName(name, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuid = yield MinecraftAPI.uuidForName(name);
        if (!uuid)
            throw Exceptions_1.default.NO_UUID_FOR_NAME;
        return getPlayerByUuid(UUID_1.default.fromString(uuid), apiKey);
    });
}
exports.getPlayerByName = getPlayerByName;
function findGuildIdByPlayerName(name, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuid = yield MinecraftAPI.uuidForName(name);
        if (!uuid)
            throw Exceptions_1.default.NO_UUID_FOR_NAME;
        return findGuildIdByPlayerUuid(UUID_1.default.fromShortString(uuid), apiKey);
    });
}
exports.findGuildIdByPlayerName = findGuildIdByPlayerName;
function findGuildIdByPlayerUuid(uuid, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield _simpleGet(baseURL + 'findGuild?byUuid=' + uuid.toString() + '&key=' + apiKey.toString());
        if (response.guild == null)
            throw Exceptions_1.default.NOT_FOUND;
        return response.guild;
    });
}
exports.findGuildIdByPlayerUuid = findGuildIdByPlayerUuid;
function getGuildById(id, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield _simpleGet(baseURL + 'guild?id=' + id + '&key=' + apiKey.toString());
        if (response.guild == null)
            throw Exceptions_1.default.NOT_FOUND;
        return response.guild;
    });
}
exports.getGuildById = getGuildById;
function getGuildByPlayerName(name, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = yield findGuildIdByPlayerName(name, apiKey);
        return getGuildById(id, apiKey);
    });
}
exports.getGuildByPlayerName = getGuildByPlayerName;
function getGuildByPlayerUuid(uuid, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = yield findGuildIdByPlayerUuid(uuid, apiKey);
        return getGuildById(id, apiKey);
    });
}
exports.getGuildByPlayerUuid = getGuildByPlayerUuid;
function getBoosters(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield _simpleGet(baseURL + 'boosters?key=' + apiKey.toString());
        if (response.boosters == null)
            throw Exceptions_1.default.NOT_FOUND;
        return response.boosters;
    });
}
exports.getBoosters = getBoosters;
function getBoostersIsDecrementing(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield _simpleGet(baseURL + 'boosters?key=' + apiKey.toString());
        if (response.boosterState == null)
            throw Exceptions_1.default.NOT_FOUND;
        return response.boosterState.decrementing;
    });
}
exports.getBoostersIsDecrementing = getBoostersIsDecrementing;
function getLeaderboards(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield _simpleGet(baseURL + 'leaderboards?key=' + apiKey.toString());
        if (response.leaderboards == null)
            throw Exceptions_1.default.NOT_FOUND;
        return response.leaderboards;
    });
}
exports.getLeaderboards = getLeaderboards;
function getKey(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield _simpleGet(baseURL + 'key?key=' + apiKey.toString());
        if (response.record == null)
            throw Exceptions_1.default.NOT_FOUND;
        return response.record;
    });
}
exports.getKey = getKey;
function _simpleGet(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield HypixelAxios.get(url);
        if (!response.data)
            throw Exceptions_1.default.NOT_FOUND;
        if (response.data.cause === "Invalid API key")
            throw Exceptions_1.default.API_KEY_INVALID;
        if (response.data.throttle)
            throw Exceptions_1.default.API_KEY_THROTTLE;
        if (!response.data.success)
            throw (response.data.cause | response.status);
        return response.data;
    });
}
//# sourceMappingURL=HypixelAPI.js.map