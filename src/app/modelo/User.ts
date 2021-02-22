export class User{
    constructor(
        public email:string,
        public password: string
    ){}
    public static createFromJsonObject(jsonObject: any):User{
        let user:User=new User(
            jsonObject['email'],
            jsonObject['password']
        );
        return user;
    }
    public getJsonObject():any{
        let jsonObject:any={};
        jsonObject['email']=this.email;
        jsonObject['password']=this.password;
        return jsonObject;
    }
}