import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { authenticated } from '../../prehandler/authenticated';
import UpcomingEventService from '../../../services/upcomingEvent';

export function getUpcomingEvents(
    upcomingEventService: UpcomingEventService,
): FastifyPluginAsyncJsonSchemaToTs {
    return async (fastify) => {
        fastify.get(
            '/upcomingevents',
            {
                schema: {
                    description: 'List the upcoming events; filtered to the user\'s subscriptions',
                    tags: ['upcomingevents'],
                    response: {
                        200: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    matchId: { type: 'string' },
                                    tournament: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    timestamp: { type: 'number' },
                                },
                            },
                        }
                    },
                } as const,
                preHandler: authenticated(fastify),
            },
            async (request, reply) => {
                const upcomingEvents = await upcomingEventService.getSubscribedUpcomingEvents(request.user);
                return reply.send(upcomingEvents);
            },
        );
    };
}