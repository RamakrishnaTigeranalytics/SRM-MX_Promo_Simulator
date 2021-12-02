export interface Group{
  name :string
}
export interface UserDetail{
  id : number,
  name : string
  email : string,
  groups : Group[]

}

export interface User {
    
    token: string;
     user : UserDetail
  }