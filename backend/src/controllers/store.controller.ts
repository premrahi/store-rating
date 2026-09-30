import { NextFunction, Request, Response } from "express";
import { ratings, stores, users } from "../db/schema.ts";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/db.ts";
import { likeFilters, sortColumn } from "./helper.ts";

export const listStores = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = req.query as Record<string, unknown>;
    const conditions = likeFilters(query, {
      name: stores.name,
      address: stores.address,
    });

    const order = sortColumn(
      req.query.sortBy as string,
      req.query.order as string,

      {
        name: stores.name,
        address: stores.address,
        overallRating: sql`"overallRating"`,
        myRating: sql`"myRating"`,
      },
      "name",
    );

    const rows = await db
      .select({
        id: stores.id,
        name: stores.name,
        address: stores.address,
        overallRating: sql<number | null>`round(avg(${ratings.rating}) , 1)`.as(
          "overallRating",
        ),
        myRating: sql<
          number | null
        >`max(case when ${ratings.userId} = ${req.user!.id} then ${ratings.rating} end)`.as(
          "myRating",
        ),
      })
      .from(stores)
      .leftJoin(ratings, eq(ratings.storeId, stores.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .groupBy(stores.id)
      .orderBy(sql`${order} nulls last`);

    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const rateStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = Number(req.params.id);
    if (!Number.isInteger(storeId) || storeId < 1)
      return res.status(400).json({ message: "invalid store id" });
    const [store] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(eq(stores.id, storeId));

    if (!store) return res.status(404).json({ message: "store not found!" });

    await db
      .insert(ratings)
      .values({
        userId: req.user!.id,
        storeId: store.id,
        rating: req.body.rating,
      })
      .onConflictDoUpdate({
        target: [ratings.userId, ratings.storeId],
        set: { rating: req.body.rating, updatedAt: new Date() },
      });

    res.json({ message: "rating saved!" });
  } catch (e) {
    next(e);
  }
};


export const ownerDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [store] = await db
      .select({ id: stores.id, name: stores.name })
      .from(stores)
      .where(eq(stores.ownerId, req.user!.id));

    if (!store)
      return res
        .status(404)
        .json({ message: "no store assigned to this owner!" });

    const order = sortColumn(
      req.query.sortBy as string,
      req.query.order as string,
      {
        name: users.name,
        email: users.email,
        rating: ratings.rating,
        date: ratings.updatedAt,
      },
      "date,",
    );

    const raters = await db
      .select({
        id: users.id,
        nmae: users.name,
        email: users.email,
        rating: ratings.rating,
        date: ratings.updatedAt,
      })
      .from(ratings)
      .innerJoin(users, eq(users.id, ratings.userId))
      .where(eq(ratings.storeId, store.id))
      .orderBy(order);

    const [{ avg }] = await db
      .select({ avg: sql<number | null>`round(avg(${ratings.rating}), 1)` })
      .from(ratings)
      .where(eq(ratings.storeId, store.id));

    res.json({ store, averageRating: avg, raters });
  } catch (e) {
    next(e);
  }
};


