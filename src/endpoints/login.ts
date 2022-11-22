import { getUser } from "../database/queries"

const bcrypt = require('bcrypt')

//login interface
export interface LoginBody {
    username: string
    password: string
}

const checkPassword = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

export const handlelogin = async (loginInfo: LoginBody) => {
    const userAccount = await getUser(loginInfo.username)
    if (userAccount === null) {
        return 0
    }
    const validLogin = await checkPassword(loginInfo.password, userAccount.password)

    console.log(validLogin)
}