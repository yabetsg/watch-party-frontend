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

export interface Participants {
    _id: string;
    username: string;
  }

