import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import bcrypt from "bcrypt"
import { Drinks } from "../entity/Drinks";
const jwt = require('jsonwebtoken');

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private drinkRepository = AppDataSource.getRepository(Drinks)
    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id =request.params.id

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }
        let drinks = await this.drinkRepository.find({where:{
            added_by:userToRemove.email
        }})

        for(let drink of drinks){
            await this.drinkRepository.remove(drink)
        }
        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }



    async signUp(request: Request, response: Response, next: NextFunction) {
        const { name, email,password } = request.body;
        const passwordHash = await bcrypt.hash(password, 14);
        const token = generateAccessToken(email)
        const user = Object.assign(new User(), {
            name,
            email,
            passwordHash,
            token
        })

        return this.userRepository.save(user)
    }

    async login(request: Request, response: Response, next: NextFunction) {
        const { email,password } = request.body;

        const token = jwt.verify(password,process.env.TOKEN_SECRET)
        const user = await this.userRepository.findOne({
            where: { email }
        })
        if (!user) {
            return "User not found!"
        }

        const passwordMatch =  await bcrypt.compare(password,user.passwordHash)
      
        if (passwordMatch) {
            const aToken = generateAccessToken(email);
            request.json({ AccessToken: aToken , message: 'You are logged-in'});
            
        } else {
            
            request.json({ message: 'Invalid email or password'});
        }
    }

    async resetPassword(request: Request, response: Response, next: NextFunction) {
        const { email, password, newPassword } = request.body;
        const oldUser = await this.userRepository.findOne({
            where: { email }
        })

        const passwordMatch =  await bcrypt.compare(password,oldUser.passwordHash)
      
        if (passwordMatch) { //e prima data cand scriu asa cod normal as face update unde userId cu parola noua dupa ce as verifica sa fie totul bine
            const passwordHash = await bcrypt.hash(newPassword, 14);
            const user = Object.assign(new User(), {
                name:oldUser.name,
                email,
                passwordHash,
            })
            return this.userRepository.save(user)
        } else {
            request.json({ message: 'Invalid email or password'});
        }
    }


}

function generateAccessToken(password) {
    return jwt.sign(password, process.env.TOKEN_SECRET);
  }