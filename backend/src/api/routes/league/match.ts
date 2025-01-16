import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import LeagueService from '../../../services/leaguepedia';
import { defaultLeagueAPIExpiration } from './common';


export function getMatch(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/match/:id',
            {
                schema: {
                    description: 'Get a match by id',
                    tags: ['league'],
                    params: {
                        type: 'object',
                        properties: { id: { type: 'string' } },
                        required: ['id'],
                    },
                    response: {
                        200: {
                        },
                    },
                } as const
            },
            async (request, reply) => {
                let response = await leagueService.fetchMatch(request.params.id);
                defaultLeagueAPIExpiration(reply);
                reply.send(response);
            },
        );
    };
}

export function getMatchRoster(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/match/:id/:team/roster',
            {
                schema: {
                    description: 'Get the roster of a match by matchId and Team',
                    tags: ['league'],
                    params: {
                        type: 'object',
                        properties: { id: { type: 'string' }, team: { type: 'string' } },
                        required: ['id', 'team'],
                    },
                    response: {
                        200: {
                        },
                    },
                } as const
            },
            async (request, reply) => {
                let response = await leagueService.fetchMatchRoster(request.params.id, request.params.team);
                defaultLeagueAPIExpiration(reply);
                reply.send(response);
            },
        );
    };
}

export function getHtHMatches(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/match/:team1/:team2/matches/hth',
            {
                schema: {
                    description: 'Get a match by teams',
                    tags: ['league'],
                    params: {
                        type: 'object',
                        properties: { team1: { type: 'string' }, team2: { type: 'string' } },
                        required: ['team1', 'team2'],
                    },
                    response: {
                        200: {
                        },
                    },
                } as const
            },
            async (request, reply) => {
                let response = await leagueService.fetchHtHMatches(request.params.team1, request.params.team2);
                defaultLeagueAPIExpiration(reply);
                reply.send(response);
            },
        );
    };
}
