// our server stored db records
export interface PwdDb {
    name: string,
    pwdDb: string, // cipher text
    salt: string,
    iv: string,
}
