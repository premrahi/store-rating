import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../src/db/db.ts';
import { users } from '../src/db/schema.js';

const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);
await db
  .insert(users)
  .values({
    name: 'System Administrator Account',
    email: process.env.ADMIN_EMAIL as string,
    passwordHash,
    address: 'Head Office',
    role: 'ADMIN',
  })
  .onConflictDoNothing({ target: users.email });

console.log('Admin ready:', process.env.ADMIN_EMAIL);
process.exit(0);
