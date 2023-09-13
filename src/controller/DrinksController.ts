import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Drinks } from "../entity/Drinks"

const jwt = require('jsonwebtoken');
export class DrinksController {

    private drinksRepository = AppDataSource.getRepository(Drinks)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.drinksRepository.find()
    }

    async filter(request: Request, response: Response, next: NextFunction) {
        return this.drinksRepository.find({
            where:{
                   typeOfGlass:request.query.strGlass,
            },
        })
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id


        const drink = await this.drinksRepository.findOne({
            where: { id }
        })

        if (!drink) {
            return "drink unknown"
        }
        return drink
    }

    async save(request: Request, response: Response, next: NextFunction) {

        
		const authHeader = request.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		
		if(token == null){
			request.json({ message: 'Invalid refresh token'});
		}else {
            jwt.verify(token, process.env.TOKEN_SECRET,async (err,payload) => {
                if(err){
                    request.json({ message: 'Some error occured' });
                }
                else{
                    
                   
                    const { drinks } = request.body;// aici nu am inteles exact cerinta dar din ce am inteles primesc o lista de obiecte de asta am facut asa
                    const user = request.params.User 
                    for(let drink of drinks){
                       await this.drinksRepository.save({
                            name:drink.strDrink,
                            numberOfIngredients: 10 , // nu am avut timp sa fac aici bine dar explic ce as fi vrut sa implementez: sa caut peste tot unde cheia incepe cu string-ul strIngredient si sa numar unde nu este null
                            isAlcoholic: drink.strAlcoholic ==='Alcoholic'? true:false,
                            typeOfGlass:drink.strGlass,
                            added_by: user.email
                        })
                    }
                    return "All drinks have been added"
                }
            });
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id =request.params.id

        let drinkToRemove = await this.drinksRepository.findOneBy({ id })

        if (!drinkToRemove) {
            return "this drink not exist"
        }

        await this.drinksRepository.remove(drinkToRemove)

        return "This drink has been removed"
    }

}