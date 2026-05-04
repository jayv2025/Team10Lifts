# Team10Lifts

AI-powered fitness planning and workout tracking built with Expo React Native, Supabase, and AI Edge Functions.

## 1. Project Overview

Team10Lifts is a fitness app designed to make training more organized, more beginner-friendly, and more interactive.

The app focuses on three main goals:

- Give users structured workouts and programs
- Help users manage their own workout split
- Add AI support for coaching and workout generation

## 2. Core Features

- Public home page with project overview and AI coach
- Programs page with built-in workout templates
- Recipes and meals pages
- Private `My Workouts` page for creating, editing, favoriting, and deleting workouts
- AI-generated workout programs
- Supabase authentication with login, signup, and logout

## 3. Major Codebase Sections

### Screens

The `screens/` folder contains the app UI and user flows.

- `HomeScreen.tsx`
  - Landing page
  - `Ask Jake` AI coach
- `Team10Programs.tsx`
  - Built-in training programs
  - Import programs into `My Workouts`
- `Team10Workouts.tsx`
  - Main workout management page
  - AI workout generation
- `Team10Recipes.tsx`
  - Recipe browsing
- `Team10Meals.tsx`
  - Meal browsing
- `LogIn.tsx`, `SignUp.tsx`, `LogOut.tsx`
  - Authentication flow
- `ViewProfile.tsx`
  - Profile placeholder screen

### Shared Logic

The `lib/` folder holds shared data and helpers.

- `supabase.ts`
  - Creates the Supabase client
- `demoAuth.ts`
  - Handles demo-admin session state
- `workoutData.ts`
  - Shared workout storage and persistence
- `programData.ts`
  - Built-in workout program templates
- `recipeData.ts`
  - Shared recipe and meal content

### Supabase

The `supabase/functions/` folder contains serverless backend logic.

- `ask-jake`
  - AI coach for homepage questions
- `generate-workout-program`
  - Creates structured workout splits from user prompts
- `progression-suggestion`
  - Reads workout history for progression-related logic

## 4. App Architecture

The project is split into three layers:

### Frontend

- Built with Expo, React Native, and TypeScript
- Uses drawer navigation
- Handles public and private screen flows

### Backend

- Uses Supabase for authentication
- Uses Supabase Edge Functions for AI features

### Local Persistence

- Uses AsyncStorage for saved workouts and demo-admin state

## 5. AI Features

The app currently has two AI experiences:

### Ask Jake

- Found on the home screen
- Lets the user ask fitness questions
- Returns short coaching responses

### Workout Generator

- Found on `My Workouts`
- Lets the user type prompts like:
  - “Build me a 3 day full body split”
- Returns a structured program that can be imported directly into the workout list

## 6. Demo Flow

Recommended order for the final presentation:

1. Start on the `Home` screen
2. Show the homepage sections and custom program images
3. Demo `Ask Jake`
4. Open `Programs`
5. Show a built-in program and import it into `My Workouts`
6. Open `My Workouts`
7. Edit, favorite, or delete a workout
8. Generate a new workout plan with AI
9. Import the generated plan
10. Briefly show login/signup/logout and explain Supabase Auth

## 7. Tech Stack

- Expo
- React Native
- TypeScript
- React Navigation
- Supabase
- Groq via Supabase Edge Functions
- AsyncStorage

## 8. Key Files

- `App.tsx`
- `screens/HomeScreen.tsx`
- `screens/Team10Programs.tsx`
- `screens/Team10Workouts.tsx`
- `lib/workoutData.ts`
- `lib/programData.ts`
- `lib/recipeData.ts`
- `supabase/functions/ask-jake/index.ts`
- `supabase/functions/generate-workout-program/index.ts`

## 9. How to Run

Install dependencies:

```bash
npm install
```

Start the web demo:

```bash
npm run web
```

Optional type check:

```bash
npx tsc --noEmit
```
