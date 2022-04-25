import client from "../database";
import bcrypt from "bcrypt";


export type Users = {
    id?: number;
    firstname: string;
    lastname: string;
    password: string;
};

const pepper = process.env.BCRYPT_PASSWORD;
const salt_rounds = process.env.SALT_ROUNDS;

export class UserModel {
   async index(): Promise<Users[]> {
       try {
           const connect = await client.connect();
           const sql = "SELECT * FROM users";
           const result = await connect.query(sql);
           connect.release();
           return result.rows;
       } catch (err) {
           throw new Error(`not get any user ${err}`);
       }
   }

   async show(id: number): Promise<Users> {
       try {
        const connect = await client.connect();
        const sql = "SELECT * FROM users WHERE id=($1)";
        const result = await connect.query(sql, [id]);
        connect.release();
        return result.rows[0];
       } catch (err) {
           throw new Error(`not get this user ${id}, ${err}`);
       }
   }

   async create(u: Users): Promise<Users> {
       try {
        const connect = await client.connect();
        const sql = "INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *";
        const hash = bcrypt.hashSync(u.password + pepper, parseInt(String(salt_rounds)));
        const result = await connect.query(sql, [u.firstname, u.lastname, hash]);
        const user = result.rows[0];
        connect.release();
        return user;
       } catch (err) {
           throw new Error(`failed create user (${(u.firstname, u.lastname)}): ${err}`);
       }
   }

   async authenticate(firstname:string, lastname:string, password:string): Promise<Users | null>{
       const connect = await client.connect();
       const sql = "SELECT * FROM users WHERE firstname=$(1) AND lastName=$(2)";
       const result = await connect.query(sql, [firstname, lastname]);
       if (result.rows.length){
           const user = result.rows[0];
           if(bcrypt.compareSync(password + pepper, user.password)){
               return user;
           }
       }
       return null;
   }
}


