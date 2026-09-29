import {z} from 'zod' ;

const name = z
    .string()
    .trim()
    .min(3,'Name must be at least 3 characters')
    .max(60,'Name must be at least 3 characters') ;

const email = z.string().trim().email('Invalid Email'); 

const address = z
    .string()
    .trim()
    .min(1, 'address is required')
    .max(400 , 'address must be at most 400 characters')

const password = z 
    .string()
    .min(8,'Password must be at least 8 character long')
    .max(16,'Password must be at most 16 character long')
    .regex(/[A-Z]/ , 'Password needs at least one Uppercase character')
    .regex(/[^A-Za-z0-9]/ , 'password needs at least one special character')

export const signupSchema = z.object({name , email, address, password});
export const loginSchema = z.object({email , password : z.string().min(1)})

export const changePasswordSchema = z.object({
    currentPassword : z.string().min(1),
    newPassword : password ,
}) ;
