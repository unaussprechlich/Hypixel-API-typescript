import Axios from "axios"

import * as MinecraftAPI from "minecraft-api";

import UUID from "./UUID";
import AbstractResponse from "./response/AbstractResponse";
import Exceptions from "./Exceptions";

import {Player, PlayerResponse} from "./response/PlayerResponse";
import {FindGuildResponse} from "./response/FindGuildResponse";
import {Guild, GuildResponse} from "./response/GuildResponse";
import {Booster, BoostersResponse} from "./response/BoostersResponse";
import {Leaderboards, LeaderboardsResponse} from "./response/LeaderboardsResponse";
import {KeyInfo, KeyRespond} from "./response/KeyResponse";

//CONST ################################################################################################################

const baseURL = 'https://api.hypixel.net/';

const HypixelAxios = Axios.create({
    baseURL : baseURL
})

//PLAYER ###############################################################################################################

/**
 * Does return a parsed {@link Player} for a given UUID
 * Number of requests: 1
 *
 * @param {UUID} uuid
 * @param {UUID} apiKey
 *
 * @returns {Promise<Player>}
 */
export async function getPlayerByUuid(uuid : UUID, apiKey : UUID) : Promise<Player>{
    const response = await _simpleGet<PlayerResponse>(baseURL + 'player?uuid=' + uuid.toString() + '&key=' + apiKey.toString());
    if(response.player == null) throw Exceptions.NOT_FOUND;
    return response.player;
}

/**
 * Does return a parsed {@link Player} for a given NAME
 * Number of requests: 1
 *
 * @param {string} name
 * @param {UUID} apiKey
 *
 * @returns {Promise<Player>}
 */
export async function getPlayerByName(name : string, apiKey : UUID) : Promise<Player>{
    const uuid = await MinecraftAPI.uuidForName(name);
    if(!uuid) throw Exceptions.NO_UUID_FOR_NAME;
    return getPlayerByUuid(UUID.fromString(uuid), apiKey)
}

//FINDGUILD ############################################################################################################

/**
 * Does return the GuildID as {@link string} for a given NAME
 * @throws {Exceptions.NOT_FOUND} when the given user is not in a guild
 * Number of requests: 1
 *
 * @param {string} name
 * @param {UUID} apiKey
 *
 * @returns {Promise<string>}
 */
export async function findGuildIdByPlayerName(name : string, apiKey : UUID)  : Promise<string>{
    const uuid = await MinecraftAPI.uuidForName(name);
    if(!uuid) throw Exceptions.NO_UUID_FOR_NAME;
    return findGuildIdByPlayerUuid(UUID.fromShortString(uuid), apiKey)
}

/**
 * Does return the GuildID as {@link string} for a given UUID
 * @throws {Exceptions.NOT_FOUND} when the given user is not in a guild
 * Number of requests: 1
 *
 * @param {UUID} uuid
 * @param {UUID} apiKey
 *
 * @returns {Promise<string>}
 */
export async function findGuildIdByPlayerUuid(uuid : UUID, apiKey : UUID) : Promise<string>{
    const response = await _simpleGet<FindGuildResponse>(baseURL + 'findGuild?byUuid=' + uuid.toString() + '&key=' + apiKey.toString());
    if(response.guild == null) throw Exceptions.NOT_FOUND;
    return response.guild;
}

//GUILD ################################################################################################################

/**
 * Does return a parsed {@link Guild} for a given GuildID
 * Number of requests: 1
 * @throws {Exceptions.NOT_FOUND} when no guild for the ID is found
 *
 * @param {string} id
 * @param {UUID} apiKey
 *
 * @returns {Promise<Guild>}
 */
export async function getGuildById(id : string, apiKey : UUID) : Promise<Guild>{
    const response = await _simpleGet<GuildResponse>(baseURL + 'guild?id=' + id + '&key=' + apiKey.toString());
    if(response.guild == null) throw Exceptions.NOT_FOUND;
    return response.guild;
}

/**
 * Does return a parsed {@link Guild} for a given NAME
 * Number of requests: 2
 *
 * @param {string} name
 * @param {UUID} apiKey
 *
 * @returns {Promise<Guild>}
 */
export async function getGuildByPlayerName(name : string, apiKey : UUID) : Promise<Guild>{
    const id = await findGuildIdByPlayerName(name, apiKey);
    return getGuildById(id, apiKey);
}

/**
 * Does return a parsed {@link Guild} for a given UUID
 * Number of requests: 2
 *
 * @param {UUID} uuid
 * @param {UUID} apiKey
 *
 * @returns {Promise<Guild>}
 */
export async function getGuildByPlayerUuid(uuid : UUID, apiKey : UUID) : Promise<Guild>{
    const id = await findGuildIdByPlayerUuid(uuid, apiKey);
    return getGuildById(id, apiKey);
}

//BOOSTERS #############################################################################################################

/**
 * Does return a parsed {@link Booster}-Array containing all active and queued Boosters
 * Number of requests: 1
 *
 * @param {UUID} apiKey
 *
 * @returns {Promise<Booster[]>}
 */
export async function getBoosters(apiKey : UUID) : Promise<Booster[]>{
    const response = await _simpleGet<BoostersResponse>(baseURL + 'boosters?key=' + apiKey.toString());
    if(response.boosters == null) throw Exceptions.NOT_FOUND;
    return response.boosters;
}

/**
 * Check if the Hypixel Booster-Queue got paused.
 * Number of requests: 1
 *
 * @param {UUID} apiKey
 *
 * @returns {Promise<boolean>} false if paused
 */
export async function getBoostersIsDecrementing(apiKey : UUID) : Promise<boolean>{
    const response = await _simpleGet<BoostersResponse>(baseURL + 'boosters?key=' + apiKey.toString());
    if(response.boosterState == null) throw Exceptions.NOT_FOUND;
    return response.boosterState.decrementing;
}

//LEADERBOARDS #########################################################################################################

/**
 * Does return a parsed {@link Leaderboards}-Object containing all Leaderboards visible in the Lobbies.
 * Number of requests: 1
 *
 * @param {UUID} apiKey
 *
 * @returns {Promise<Leaderboards>}
 */
export async function getLeaderboards(apiKey : UUID) : Promise<Leaderboards>{
    const response = await _simpleGet<LeaderboardsResponse>(baseURL + 'leaderboards?key=' + apiKey.toString());
    if(response.leaderboards == null) throw Exceptions.NOT_FOUND;
    return response.leaderboards;
}

//KEY ##################################################################################################################

/**
 * Does return all information about your API-Key parsed as {@link KeyInfo}
 *
 * @param {UUID} apiKey
 * @returns {Promise<KeyInfo>}
 */
export async function getKey(apiKey : UUID) : Promise<KeyInfo>{
    const response = await _simpleGet<KeyRespond>(baseURL + 'key?key=' + apiKey.toString());
    if(response.record == null) throw Exceptions.NOT_FOUND;
    return response.record;
}

//FUN ##################################################################################################################

/**
 * This function does all the requests. The magic behind this is the "request" npm package.
 * If you need something more light, then I recomend using the "hypixel-api" npm package.
 *
 * @param {string} url
 * @returns {Promise<T extends AbstractResponse>}
 * @private
 */
async function _simpleGet<T extends AbstractResponse>(url: string): Promise<T> {
    const response = await HypixelAxios.get(url);
    if(!response.data) throw Exceptions.NOT_FOUND;
    if(response.data.cause === "Invalid API key") throw Exceptions.API_KEY_INVALID;
    if(response.data.throttle) throw Exceptions.API_KEY_THROTTLE;
    if(!response.data.success) throw (response.data.cause | response.status )
    return response.data;
}
