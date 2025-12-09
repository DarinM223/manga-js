import express from 'express'

export const app = express()

app.use(express.static('ubunchu'))

// api:
// manga -> JSON for manga
// chapter -> JSON with image link and page links