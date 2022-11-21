import fastify from 'fastify'
import cors from '@fastify/cors'
import { insertLink, getLink, getAllLinks } from './database/queries'

const dotenv = require('dotenv')

dotenv.config()

console.log(process.env.TEST)

const BASEURL = 'http://20.115.121.2:3000/'
interface IShortenUrl {
    url: string
  }

interface IRequestUrl {
    shortened_url: string
}


// generates a random string for shortening the url
const generateRandomString = (length: number) => {
    return new Array(length).fill(0).map(() => Math.floor(Math.random() * 36).toString(36)).join('')
}


const server = fastify({
    logger: true
})

server.register(cors, {})

server.get('/ping', async (request, response) => {
    return 'pog\n'
})

//redirect to shortened url
server.get<{Querystring: IRequestUrl}>('/url/:shortened_url', async (request, response) => {
    //strip input
    const strippedShortenedUrl = request.url.substring(5)
    console.log(strippedShortenedUrl)

    // get the link from db
    const redirect = await getLink(strippedShortenedUrl)
    
    // if invalid don't redirect, otherwise redirect
    if (redirect === null) {
        console.log("Invalid Link")
    }
    else {
        const originalURL = redirect.original_link
        console.log(originalURL)
        response.redirect(originalURL!)
    }
})

//gets all inputs, be careful with this
server.get('/getall', async () => {
    const result = await getAllLinks()
    
    return {links: result}
})

// method that takes a url and returns the shortened link
server.post<{Querystring: IShortenUrl}>('/shorten', async (request, response) => {
    //generate random string and add to db
    const random_string = generateRandomString(7)
    await insertLink(random_string, request.query.url)

    return BASEURL + random_string
})




server.listen({host:'0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    server.close()
    console.error(err)
  }
  console.log(`Server listening at ${address}`)
})