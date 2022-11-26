import fastify from 'fastify'
import cors from '@fastify/cors'
import { insertLink, getLink, getAllLinks, getUserLinks, incrementVisits } from './database/queries'
import { LoginBody, handlelogin } from './endpoints/login'
import { CreateAccountBody, handleCreateAccount } from './endpoints/createAccount'
import request from '@fastify/session'
import { isConstructorDeclaration } from 'typescript'
const dotenv = require('dotenv')
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie')


dotenv.config()


const BASEURL = 'http://20.115.121.2:3000/'
interface IShortenUrl {
    url: string
}


interface IRequestUrl {
    key: string
}

interface IRequestUserLinks {
    user: string
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

//setup sessions
server.register(fastifyCookie);
server.register(fastifySession, {
    secret: 'djiajidwannjeq2319daweqiundaoiw7@*#)(*dawo',
    cookie: {
        secure: false,
        maxAge: 1800000
    }
});


server.get('/',async () => {
    return "Welcome to the root. ( ͡° ͜ʖ ͡°)"
})

//gets cookies for a user. this is a test endpoint
server.get('/getcookies', async (request, response) => {
    console.log(request.session.sessionId)
    return {session: request.session, user: {loggedIn: request.session.get("loggedIn"), user: request.session.get("user")}}
})

server.get('/ping', async (request, response) => {
    return request.session.get("user") || "pog"
})

//redirect to shortened url
server.get<{Params: IRequestUrl}>('/url/:key', async (request, response) => {
    //strip input
    const strippedShortenedUrl = request.params.key
    console.log(strippedShortenedUrl)

    // get the link from db
    const redirect = await incrementVisits(strippedShortenedUrl)
    
    // if invalid don't redirect, otherwise redirect
    if (!redirect) {
        console.log("Invalid Link")
    }
    else {
        const originalURL = redirect.original_url
        console.log(originalURL)
        response.redirect(originalURL)
    }
})

//gets links for a specific user
server.get('/getlinks', async (request, response) => {
    //read link params
    const user: string = request.session.get("user")

    if (!user) {
        return 400
    }
    // verify user is valid and that user matches session user
    console.log(user)
    if (!user) {
        return {error: "Invalid user"}
    } 
    else if (user !== request.session.get("user") || !request.session.get("loggedIn")) {
        return {error: "Unauthorized access"}
    }
    console.log(request.session.get("user"))

    const links = await getUserLinks(user)
    
    return links
})

//gets all inputs, be careful with this
server.get('/getall', async () => {
    const result = await getAllLinks()
    console.log(result)
    return {links: result}
})

// method that takes a url and returns the shortened link
server.post<{Querystring: IShortenUrl}>('/shorten', async (request, response) => {
    //pre process data
    const urlToShorten = request.query.url
    var user = request.session.get("user") as string || ""
    
    //generate random string and add to db
    const key = generateRandomString(7)
    
    //insert link and return result
    const insertResult = await insertLink(user, key, urlToShorten)
    
    return insertResult[0]
    
})


server.post<{Body: LoginBody}>('/login', async (request, response) => {
    // call handle login with request information
    const loginResult = await handlelogin(request.body)
    // if login result is true, set cookies
    if (loginResult) {
        request.session.set("loggedIn", true)
        request.session.set("user", request.body.username)
        request.session.save()
        return {username: request.body.username}
    } else {
        response.statusCode = 401
    }
})

//handles creating an account
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
//simply checks if a user is logged in
server.get('/auth', async (request, response) => {
    return {loggedIn: request.session.get("loggedIn") || false, username: request.session.get("user")}  
})

server.get('/logout', async (request, response) => {
    request.session.destroy()
})


server.listen({host:'0.0.0.0', port: 8080 }, (err, address) => {
  if (err) {
    server.close()
    console.error(err)
  }
  console.log(`Server listening at ${address}`)
})