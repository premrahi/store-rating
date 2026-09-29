export type Role = 'ADMIN' | 'USER' | 'OWNER' ;

export interface PublicUser {
    id : number ;
    name : string ; 
    email :string ;
    address : string ;
    role : Role ;
}

