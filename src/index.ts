import fastify from 'fastify'
import cors from '@fastify/cors'
import { insertLink, getLink, getAllLinks } from './database/queries'
import { LoginBody, handlelogin } from './endpoints/login'
import { CreateAccountBody, handleCreateAccount } from './endpoints/createAccount'
import request from '@fastify/session'
const dotenv = require('dotenv')
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie')


dotenv.config()


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

// setup cors, allow credientials for session management
server.register(cors, {
    origin: "http://localhost:3000",
    credentials: true
})


server.register(fastifyCookie);
server.register(fastifySession, {
    secret: 'djiajidwannjeq2319daweqiundaoiw7@*#)(*dawo',
    cookie: {
        secure: false,
        maxAge: 1800000
    }
});

declare module "fastify" {
    interface Session {
        user: string
    }
}

//gets cookies for a user. this is a test endpoint
server.get('/getcookies', async (request, response) => {
    return {session: request.session, user: {loggedIn: request.session.get("loggedIn"), user: request.session.get("user")}}
})

server.get('/ping', async (request, response) => {
    return request.session.get("user") || "pog"
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


server.post<{Body: LoginBody}>('/login', async (request, response) => {
    // call handle login with request information
    const loginResult = await handlelogin(request.body)
    // if login result is true, set cookies
    if (loginResult) {
        console.log(0)
        request.session.set("loggedIn", true)
        request.session.set("user", request.body.username)
    }
    request.session.save()
    console.log(request.session.sessionId)
})

server.post<{Body: CreateAccountBody}>('/createaccount', async (request, response) => {
    //set email and username to lower
    const email = request.body.email.toLowerCase()
    const username = request.body.username.toLowerCase()


    await handleCreateAccount({email: email, username: username, password: request.body.password})
    .then(res => {
        response.code(res.statusCode)
        response.send({statusMessage: res.statusMessage})
    })
    
})


server.listen({host:'0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    server.close()
    console.error(err)
  }
  console.log(`Server listening at ${address}`)
})