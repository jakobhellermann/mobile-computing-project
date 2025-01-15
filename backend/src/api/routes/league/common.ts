import { FastifyReply } from "fastify";

export function expireInMinutes(reply: FastifyReply, minutes: number) {
    let expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    reply.expires(expiry);
}

const DEFAULT_LEAGUE_EXPIRY_MINUTES = 30;

export function defaultLeagueAPIExpiration(reply: FastifyReply) {
    expireInMinutes(reply, DEFAULT_LEAGUE_EXPIRY_MINUTES);
}