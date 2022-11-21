import db, {links} from './database'
import { sql } from './database'

export const insertLink = async (shortened_link: string, original_link: string) => {
    const original_link_lower = original_link.toLowerCase()
    console.log(0)
    await links(db).insert({shortened_link, original_link: original_link_lower})
    console.log(1)
}


export const getLink = async (shortened_link: string) => {
    return await links(db).findOne({shortened_link: shortened_link})
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