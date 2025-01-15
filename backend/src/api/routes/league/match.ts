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
