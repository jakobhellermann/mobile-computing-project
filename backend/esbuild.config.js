require('esbuild').build({
    bundle: true,
    entryPoints: ['src/main.ts'],
    platform: 'node',
    target: 'node21',
    outdir: 'dist',

    external: [
        // https://github.com/knex/knex/issues/5234
        'better-sqlite3', 'sqlite3', 'mysql2', 'oracledb', 'pg', 'pg-query-stream', 'tedious', 'mysql',

        '@fastify/swagger-ui', // logo.svg
        "@node-rs/argon2", // .node files
    ],
}).then(console.log).catch(console.error);
