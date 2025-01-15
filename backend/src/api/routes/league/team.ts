import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import LeagueService from '../../../services/leaguepedia';
import { defaultLeagueAPIExpiration } from './common';

export function getTeam(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/team/:id',
            {
                schema: {
                    description: 'Get a team by id',
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
                let response = await leagueService.fetchTeamData(request.params.id);
                defaultLeagueAPIExpiration(reply);
                reply.send(response);
            },
        );
    };
}

export function getLatestMatches(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/team/:id/matches/latest',
            {
                schema: {
                    description: 'Get lastest matches for the team',
                    tags: ['league'],
                    params: {
                        type: 'object',
                        properties: { id: { type: 'string' } },
                        required: ['id'],
                    },
                    response: {
                        200: {
                            type: 'array',
                        },
                    },
                } as const
            },
            async (request, reply) => {
                let response = await leagueService.fetchLatestTeamMatches(request.params.id);
                defaultLeagueAPIExpiration(reply);
                reply.send(response);
            },
        );
    };
}
export function getUpcomingMatches(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/team/:id/matches/upcoming',
            {
                schema: {
                    description: 'Get upcoming matches for the team',
                    tags: ['league'],
                    params: {
                        type: 'object',
                        properties: { id: { type: 'string' } },
                        required: ['id'],
                    },
                    response: {
                        200: {
                            type: 'array',
                        },
                    },
                } as const
            },
            async (request, reply) => {
                let response = await leagueService.fetchUpcomingTeamMatches(request.params.id);
                defaultLeagueAPIExpiration(reply);
                reply.send(response);
            },
        );
    };
}