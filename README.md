# Thoughtful

A simple note-taking app to satisfy my list-making needs.

Still very much a work in progress, but it's usable.

Nest is probably overkill also for this project, but I wanted to try it out. 

# Tech stack

## Back-end

I used NestJS to make a simple API to store the notes. Handy because it comes with typescript and swagger documentation. Initially I wanted Mongo to store the notes, but I switched to Firebase because it's free to host.

Firebase doesn't allow searching so I sort it server-side, I store the thoughts as encrypted which makes searching even more difficult. But it's easy and free. So if I were to host it properly, I would use mongoDB.

## Front-end

I used Vue3 and TailwindCSS to make the front-end. Initially I tried Nuxt3 but Vite is more established, so it has more compatibility and documentation.

## Installation

### Front-end

At the root of the Web directory, create a .env file:
```bash
VITE_BACKEND_URL= ... # The URL to your backend sever where you are doubtlessly running the backend files
```

Then to run the Front-end:
```bash
npm run dev
```

### Back-end

At the root of the Backend directory, create a .env file:
```bash
PASSWORD= ... # Instead of creating a whole account system, I just made a password system to generate a JWT and access the API
USERNAME= ... # Will just be used to generate the JWT
USER_ID= ... # Also used to generate the JWT...
JWT_SECRET= ... # You might have guessed this also helps generate the JWT
ENCRYPTION_PASSWORD= ... # Thoughts are stored encrypted
ENCRYPTION_IV= ... # As the password, used for encryption
PORT= ... # The port the server will run on
FIREBASE_PROJECT_ID= ... # Your firebase project ID
FIREBASE_CLIENT_EMAIL= ... # Firebase client email
FIREBASE_PRIVATE_KEY= ... # Firebase private key
```

To run the Back-end:
```bash
npm run start:dev
```


# Features

## Create, edit, delete notes
## Search notes
## Create a thought and add it to a note
