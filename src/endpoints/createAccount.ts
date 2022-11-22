import { insertUser, getUser, getUserByEmail } from "../database/queries"
const bcrypt = require('bcrypt')

const hashPassword = async (password: string, saltRounds: number = 10) => {
    //hash pw
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    return hashedPassword
    
}


export interface CreateAccountBody {
    email: string,
    username: string,
    password: string
}

interface createAccountResponse {
    statusCode: number,
    statusMessage: string
}
export const handleCreateAccount = async (createAccountInfo: CreateAccountBody) => {
    var response = {statusCode: 400, statusMessage: "Unknown Error"}
    //first verify username is unique
    const userNameCheck = await getUser(createAccountInfo.username)
    if (userNameCheck !== null) {
        return {statusCode: 422, statusMessage: "Username already taken"}
    }
    const emailCheck = await getUserByEmail(createAccountInfo.email)
    if (emailCheck !== null) {
        return {statusCode: 422, statusMessage: "Email already in use"}
    }

    const hashedPassword = await hashPassword(createAccountInfo.password)
    await insertUser({email: createAccountInfo.email, username: createAccountInfo.username, password: hashedPassword})
    .then(res => {
        response = {statusCode: 200, statusMessage: "Success"}
    })
    .catch(err => {
        console.log(err)
        response = {statusCode: 400, statusMessage: "Error adding user"} 
    })
    
    return response
    
}