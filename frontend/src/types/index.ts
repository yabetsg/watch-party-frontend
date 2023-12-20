export enum Status {
    Playing = 1,
    Paused,
  }
export interface SignUp{
    username:string,
    password:string,
    confirm:string,
}

export interface Login{
    username:string,
    password:string,
}

