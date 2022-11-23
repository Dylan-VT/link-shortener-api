import db, {links, users} from './database'
import { sql } from './database'

export const insertLink = async (owner: string, key: string, originalUrl: string) => {
    const originalUrlLower = originalUrl.toLowerCase()
    const linkEntry = await links(db).insert({owner: owner, key: key, original_url: originalUrlLower})
    return linkEntry
}


export const getLink = async (key: string) => {
    return await links(db).findOne({key: key})
}

export const getAllLinks = async () => {
    var res = {}
    await links(db).untypedQuery(sql`SELECT * FROM links;`)
    .then((response: any) => {
        res = response
    })
    .catch((err: any) => console.log(err))

    return res
}

export const getUserLinks = async (user: string) => {
    return await links(db).find({owner: user}).all()
} 

//increments num_visits by 1
export const incrementVisits = async (key: string) => {
    //first get num_visits for link we're updating
    const link = await getLink(key)
    if (!link) {
        return link
    }
    const originalVisits = link.num_visits
    //originalVisits force casted to number since there is a default value in PG
    const updatedLink = await links(db).update({key: key}, {num_visits: originalVisits! + 1})
    //return first (hopefully only) updatedLink
    return updatedLink[0]
}

interface user {
    email: string,
    username: string,
    password: string
}

export const insertUser = async (newUser: user) => {
    return await users(db).insert(newUser)
}

export const getUser = async (username: string) => {
    return await users(db).findOne({username: username})
}

export const getUserByEmail = async (email: string) => {
    return await users(db).findOne({email: email})
}