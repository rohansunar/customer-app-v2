# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

You must run Razorpay inside a custom native build, not Expo Go.

1. Prebuild native project (this is what enables native modules)

```
   npx expo prebuild
```

2. Rebuild the app on device (mandatory)
   This is not the same as expo start
   This installs a custom dev client containing Razorpay’s native SDK.

```
   npx expo run:android
```

3. ALWAYS start Metro separately

```
npx expo start --dev-client
```

4. Build a development build using EAS:

```
eas build --profile development --platform android
```

https://expo.dev/blog/how-to-increase-mobile-app-downloads-and-retention

I want to implement custom splash screen

1. Remove the previous native splash screen that shows "customer-app" as text and loads native icon
2. When app loads user must see the custom splash first for 3 to 5 sec screen should auto redirect login screen
3. I will provide custom splash screen codes modified it according to existing files and folders and where, how and on which files it should implemented and it should production grade.
4. Create a doc inside plans doc stating what , how to implement dont code yet
5. When splash loads app shouldn't lag, animation should glitch free , codes should be maintainable , scaleble, testable and with proper comments what codes does

Implement a custom splash screen for the application following these specifications:

Remove all existing native splash screen configurations that currently display "customer-app" text and load the native icon, ensuring complete removal from all configuration files and resources where native splash screen settings are defined.

Design and implement a custom splash screen that displays immediately when the application launches, remaining visible for a duration of 3 to 5 seconds before automatically redirecting users to the login screen with smooth transition handling.

Integrate the provided custom splash screen code by adapting it to match the existing project structure, file organization, and naming conventions, while providing detailed implementation instructions that specify exactly which files require modification, where new files should be placed, how each component connects to the existing codebase, and which files depend on the new splash screen implementation, all written at production-grade quality standards.

Create comprehensive documentation inside the plans document that outlines what needs to be implemented and how each component should be integrated without including any actual code implementation, serving as a blueprint for the development process.

Ensure the implementation meets production-grade performance and quality standards including zero application lag or stuttering during the splash screen display, glitch-free and smooth animations with proper frame rate optimization, clean and modular code architecture that supports future enhancements and feature additions, comprehensive testability with unit tests and integration tests covering all splash screen functionality, fully maintainable code with descriptive variable and function names following established coding conventions, proper inline and block comments explaining the purpose and behavior of each code section, and scalable design patterns that accommodate potential future requirements such as themed splash screens, animated logos, or conditional display logic based on user authentication state or first-time launch detection.
