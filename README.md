# mobile-computing-project

Code for the E-Sports App frontend.
The associated backend can be found at [./backend](./backend).

## Development setup

```sh
npm install
```

```sh
npm run start
```

Press `w` to open the app in a browser, or `a` to load it onto a connected android device.

### File Structure
- `app` contains the UI code for the frontend
- `components` contains reusable UI components
- `src` contains supporting frontend code, from
 - `src/api` - communication with the backend
 - `src/hooks` - reusable hooks for various scenarios
 - `src/modules/auth` - global authentication context
 - `src/push_notifications` - registration for push notifications
- `backend` - see `backend/REAMDE.md`

## Documentation

The project report can be found at [./docs/projektbericht](./docs/projektbericht/main.pdf) and compiled using
```sh
typst compile main.typ
```