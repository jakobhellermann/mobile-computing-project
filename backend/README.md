# backend

## Development setup

```sh
npm install
```

### Run Server

The database is automatically migrated and seeded when the server is started.

```sh
npm run start # in watch mode
```

### File Structure
- `shared` - a npm package containing type definitions shared with the frontend
- `src/`
    - `src/main.ts` - entrypoint
    - `src/api` - API routes and fastify configuration
    - `src/services` - domain specific services, abstracting over the database and external services
    - `src/services/leaguepedia.ts` - the most important service, used for talking to the `lol.fandom.com` mediawiki / cargo sql
    - `src/database/migration` - sql init scripts
- `db.sqlite` - the backing database (automatically created, in .gitignore)


### Test HTTP

There's a swagger UI available at `/api/docs`.
