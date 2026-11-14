# SUSBRO

Ionic Angular pass-the-phone social deduction game for 4–10 players.

## Run locally

1. Install Node.js supported by the Angular CLI in `package.json`.
2. Run `npm ci` from the project folder.
3. Run `npm start` and open `http://localhost:4200/setup`.
4. Enter a theme and start a round. The app uses the public Datamuse Words API.

## Build and checks

- `npm run build` builds the Ionic web app into `www/`.
- `npm run test:unit` runs the unit tests.

The Capacitor Android platform scaffold is included. For an APK, install Android Studio / Android SDK and a current JDK compatible with the installed Capacitor version, run `npm run build`, `npx cap sync android`, then open `android/` in Android Studio and build the app.

## Project notes

- Routes: `/welcome`, `/setup`, `/game`, `/results`, `/about`.
- Local-only state is held in `GameSessionService` during a pass-around round.
- Related words use `GET https://api.datamuse.com/words` with `ml`, `topics`, and `max` query parameters.