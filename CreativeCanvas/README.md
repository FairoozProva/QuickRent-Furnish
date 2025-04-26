# QuickRent Furnish

A sustainable furniture rental platform designed to simplify eco-friendly home furnishing through an intuitive digital marketplace.

## Technologies

- TypeScript
- MongoDB
- Express.js
- React
- Tailwind CSS
- Firebase Authentication

## MongoDB Setup

This application uses MongoDB as its database. To set up MongoDB locally:

### Windows

1. Download and install MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. During installation, choose "Complete" setup and install MongoDB Compass
3. MongoDB should start automatically as a Windows service
4. Open MongoDB Compass and connect to `mongodb://localhost:27017/`
5. Create a new database named `quickrent_furnish`

### macOS

1. Install MongoDB using Homebrew:
   ```
   brew tap mongodb/brew
   brew install mongodb-community
   ```
2. Start MongoDB service:
   ```
   brew services start mongodb-community
   ```
3. Download and install MongoDB Compass from [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
4. Open MongoDB Compass and connect to `mongodb://localhost:27017/`
5. Create a new database named `quickrent_furnish`

### Linux

1. Install MongoDB following the instructions for your distribution: [https://docs.mongodb.com/manual/administration/install-on-linux/](https://docs.mongodb.com/manual/administration/install-on-linux/)
2. Start MongoDB service:
   ```
   sudo systemctl start mongod
   ```
3. Download and install MongoDB Compass from [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
4. Open MongoDB Compass and connect to `mongodb://localhost:27017/`
5. Create a new database named `quickrent_furnish`

## Seeding the Database

After MongoDB is installed and running, seed the database with initial data:

```
npx tsx scripts/seed-mongodb.ts
```

This will create sample users, categories, and products for development.

## Firebase Setup

For authentication, this application uses Firebase:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Add a web app to your Firebase project
3. Enable Google authentication in the Authentication section
4. Add your application domain to the authorized domains list
5. Create a `.env` file in the root directory with the following Firebase config variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. The application will be available at `http://localhost:5000`

## Development Notes

- MongoDB connection is configured for local development in `server/mongodb.ts`
- The application will run in development mode even if MongoDB is not available, but with limited functionality
- Firebase authentication can be set up later if needed
- User schema includes `firebaseId` field for Firebase authentication integration