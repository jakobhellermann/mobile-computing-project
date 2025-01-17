import { FastifyPluginAsync } from "fastify";

import { fastifySchedule } from "@fastify/schedule";
import { SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import SubscriptionService from "../services/subscription";
import { runUpdateMatches } from "./updateMatches";
import { runNotify } from "./notify";
import UpcomingEventService from "../services/upcomingEvent";


export function notificationsPlugin(subscriptionService: SubscriptionService, upcomingEventService: UpcomingEventService): FastifyPluginAsync {
    const updateMatchesTask = new AsyncTask('keep subscription updated', () => runUpdateMatches(subscriptionService, upcomingEventService), console.error);
    const updateMatchesJob = new SimpleIntervalJob({ seconds: 500, runImmediately: true }, updateMatchesTask);

    const notifyTask = new AsyncTask('device notification job', () => runNotify(), console.error);
    const notifyJob = new SimpleIntervalJob({ minutes: 1 }, notifyTask);

    return async (fastify) => {
        fastify.register(fastifySchedule);
        fastify.ready().then(() => {
            fastify.scheduler.addSimpleIntervalJob(updateMatchesJob);
            fastify.scheduler.addSimpleIntervalJob(notifyJob);
        });
    };
}
