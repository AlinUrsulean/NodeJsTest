import { DrinksController } from "./controller/DrinksController"
import { UserController } from "./controller/UserController"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
},
{
    method: "post",
    route: "/sign-up",
    controller: UserController,
    action: "signUp"
},{
    method: "post",
    route: "/sign-in",
    controller: UserController,
    action: "login",
    
},
{
    method: "post",
    route: "/drinks",
    controller: DrinksController,
    action: "save"
},
{
    method: "post",
    route: "/drinks/:id",
    controller: DrinksController,
    action: "one"
},
{
    method: "get",
    route: "/drinks",
    controller: DrinksController,
    action: "all"
},
{
    method: "get",
    route: "/drinks/filter",
    controller: DrinksController,
    action: "filter"
}]