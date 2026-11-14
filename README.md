# SUSBRO

SUSBRO is a pass-the-phone game for 4–10 players. Everyone gets a secret role. The citizens know the secret word; the spy only knows the theme and tries to blend in.

## Run the app

You need Node.js installed. Open Command Prompt in the project folder and run:

```cmd
npm.cmd install
npm.cmd start
```

Open `http://localhost:4200`. The welcome screen has a **Start Game** button. An internet connection is needed to get a word from the Datamuse public API.

If you use PowerShell and `npm` or `npx` is blocked by the script execution policy, use the `.cmd` versions shown below.

## Build the Android APK

The Android project is already included, so you do not need to run `cap add android` again. Install Android Studio and a JDK first. The project has been built with JDK 24. In Command Prompt, run these commands from the project folder:

```cmd
npm.cmd install
npm.cmd run build
npx.cmd cap sync android
cd android
set "JAVA_HOME=C:\Program Files\Java\jdk-24"
set "PATH=%JAVA_HOME%\bin;%PATH%"
gradlew.bat --no-daemon --max-workers=1 assembleDebug
```

If your JDK is installed in a different folder, change the `JAVA_HOME` path. It should point to the JDK folder, not its `bin` folder.

The debug APK is created here:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

You can also open the `android` folder in Android Studio and choose **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

## Project files

| Course requirement | SUSBRO files |
| --- | --- |
| Pages | `src/app/welcome`, `home` (game setup), `game`, `results`, and `about` |
| Routing and navigation | `src/app/app.routes.ts`; pages use `routerLink` and Angular Router |
| Public API with GET | `src/app/core/services/word.service.ts` requests related words from Datamuse. The browser uses Angular `HttpClient`; Android uses Capacitor HTTP. |
| Types and interfaces | `src/app/core/models/game.models.ts` |
| Reusable component | `src/app/shared/page-header.component.ts` provides a page header with a configurable title. |
| Data binding and events | Page templates use `[(ngModel)]`, `(click)`, `@if`, and `@for`. |
| Ionic components | The pages use components such as `ion-header`, `ion-card`, `ion-button`, `ion-segment`, and `ion-accordion`. |
| Unit test example | `src/app/core/services/game-session.service.spec.ts` |

## Basic test log

Run through these steps on the device or browser you plan to demonstrate. Fill in the result column after testing.

| Check | Result |
| --- | --- |
| Open the welcome screen and go to game setup | Not tested yet |
| Add players, choose a timer, and start a game | Not tested yet |
| Pass the phone and check each private role reveal | Not tested yet |
| Confirm the timer counts down and makes a tick sound | Not tested yet |
| Complete a round, view the results, return to setup, and start again | Not tested yet |

To run the unit tests from Command Prompt:

```cmd
npm.cmd run test:unit
```
