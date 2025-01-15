import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import LeagueService from '../../../services/leaguepedia';


export function searchTournament(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/tournament/search',
            {
                schema: {
                    description: 'List tournaments matching the search term',
                    tags: ['league'],
                    querystring: {
                        type: "object",
                        required: ["term"],
                        properties: {
                            term: { type: "string" }
                        }
                    },
                    response: {
                        200: {
                            type: 'array',
                        },
                    },
                } as const
            },
            async (request, reply) => {
                let response = await leagueService.fetchTournamentData(request.query.term);
                reply.send(response);
            },
        );
    };
}

export function getTournamentTeams(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/tournament/:id/teams',
            {
                schema: {
                    description: 'List teams for the given tournament',
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
                let response = await leagueService.fetchTournamentTeams(request.params.id);
                reply.send(response);
            },
        );
    };
}

export function getTournamentMatches(
    leagueService: LeagueService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/league/tournament/:id/matches',
            {
                schema: {
                    description: 'List matches for the given tournament',
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
                let response = await leagueService.fetchTournamentMatches(request.params.id);
                reply.send(response);
            },
        );
    };
}