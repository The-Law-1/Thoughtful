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

# Features

## Create, edit, delete notes
## Search notes
## Create a thought and add it to a note
