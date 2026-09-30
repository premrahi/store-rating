import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../db/db.ts';
import { ratings, stores, users } from '../db/schema.js';
import { likeFilters, sortColumn } from './helper.ts';

export const dashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [{ count: userCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);
    const [{ count: storeCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(stores);
    const [{ count: ratingCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(ratings);
    res.json({ users: userCount, stores: storeCount, ratings: ratingCount });
  } catch (e) {
    next(e);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, address, password, role } = req.body;
    const [created] = await db
      .insert(users)
      .values({ name, email, address, passwordHash: await bcrypt.hash(password, 10), role })
      .returning({ id: users.id });
    res.status(201).json({ id: created.id });
  } catch (e) {
    next(e);
  }
};

export const createStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (ownerId) {
      const [owner] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.id, ownerId), eq(users.role, 'OWNER')));
      if (!owner) return res.status(400).json({ message: 'ownerId must be an existing Store Owner' });
    }
    const [created] = await db
      .insert(stores)
      .values({ name, email, address, ownerId: ownerId ?? null })
      .returning({ id: stores.id });
    res.status(201).json({ id: created.id });
  } catch (e) {
    next(e);
  }
};

// Filters: name, email, address, role | Sort: sortBy, order
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as Record<string, unknown>;
    const conditions = likeFilters(query, {
      name: users.name,
      email: users.email,
      address: users.address,
    });
    if (query.role) conditions.push(eq(users.role, query.role as 'ADMIN' | 'USER' | 'OWNER'));

    const order = sortColumn(
      req.query.sortBy as string,
      req.query.order as string,
      { name: users.name, email: users.email, address: users.address, role: users.role },
      'name',
    );

    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email, address: users.address, role: users.role })
      .from(users)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(order);
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const listStores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as Record<string, unknown>;
    const conditions = likeFilters(query, {
      name: stores.name,
      email: stores.email,
      address: stores.address,
    });

    const order = sortColumn(
      req.query.sortBy as string,
      req.query.order as string,
      { name: stores.name, email: stores.email, address: stores.address, rating: sql`rating` },
      'name',
    );

    const rows = await db
      .select({
        id: stores.id,
        name: stores.name,
        email: stores.email,
        address: stores.address,
        rating: sql<number | null>`round(avg(${ratings.rating}), 1)`,
      })
      .from(stores)
      .leftJoin(ratings, eq(ratings.storeId, stores.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .groupBy(stores.id)
      .orderBy(order);
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, address: users.address, role: users.role })
      .from(users)
      .where(eq(users.id, Number(req.params.id)));
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'OWNER') {
      const [row] = await db
        .select({ rating: sql<number | null>`round(avg(${ratings.rating}), 1)` })
        .from(stores)
        .leftJoin(ratings, eq(ratings.storeId, stores.id))
        .where(eq(stores.ownerId, user.id));
      return res.json({ ...user, rating: row?.rating ?? null });
    }
    res.json(user);
  } catch (e) {
    next(e);
  }
};
