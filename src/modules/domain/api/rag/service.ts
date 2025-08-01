import mongoose from "mongoose";
import { Request, Response } from "express";
import { getCollectionByName } from "../../../../lib/dbutils";
import { transformToRAGChunks } from "./main";
import { customerSupportSpec, fragmentRag, fragmentRAGSchema, salesReportingSpec } from "./test";

export async function populateDummyData(realm: string) {
    const db = {
        customers: getCollectionByName(realm, 'customers'),
        products: getCollectionByName(realm, 'products'),
        orders: getCollectionByName(realm, 'orders'),
        order_items: getCollectionByName(realm, 'order_items'),
        support_tickets: getCollectionByName(realm, 'support_tickets'),
    };

    const customers = [
        { reference: 'cust1', name: 'Alice', email: 'alice@example.com' },
        { reference: 'cust2', name: 'Bob', email: 'bob@example.com' },
    ];

    const products = [
        { reference: 'prod1', name: 'Laptop', description: '16-inch retina display' },
        { reference: 'prod2', name: 'Mouse', description: 'Wireless ergonomic mouse' },
    ];

    const orders = [
        { reference: 'order1', customer_id: 'cust1', order_date: '2024-07-01', status: 'delivered' },
        { reference: 'order2', customer_id: 'cust2', order_date: '2024-07-02', status: 'pending' },
    ];

    const orderItems = [
        { reference: 'oi1', order_id: 'order1', product_id: 'prod1', quantity: 1, price: 1500, object: { fieldone: "lorem ipsum", fieldtwo: "dolor sit", fieldthree: [{test: "qwerty", west: 12, quest: ["q", "w"]}] } },
        { reference: 'oi2', order_id: 'order1', product_id: 'prod2', quantity: 2, price: 50, object: { fieldone: "version control", fieldtwo: "electron proton" } },
        { reference: 'oi3', order_id: 'order2', product_id: 'prod2', quantity: 1, price: 50, object: { fieldone: "anonymous survey", fieldtwo: "neutrino constellation" } },
    ];

    const supportTickets = [
        { reference: 'ticket1', customer_id: 'cust1', issue: 'Laptop not turning on', created_at: '2024-07-05', status: 'open' },
        { reference: 'ticket2', customer_id: 'cust2', issue: 'Mouse battery issues', created_at: '2024-07-06', status: 'resolved' },
    ];

    await Promise.all([
        db.customers.deleteMany(),
        db.products.deleteMany(),
        db.orders.deleteMany(),
        db.order_items.deleteMany(),
        db.support_tickets.deleteMany(),
    ]);

    await Promise.all([
        db.customers.insertMany(customers),
        db.products.insertMany(products),
        db.orders.insertMany(orders),
        db.order_items.insertMany(orderItems),
        db.support_tickets.insertMany(supportTickets),
    ]);
}


export const ragTest = async (req: Request, res: Response) => {
    const { space } = req.params;

    await populateDummyData(space);

    const supportChunks = await transformToRAGChunks(customerSupportSpec, space);

    // const salesChunks = await transformToRAGChunks(salesReportingSpec, space);

    // const fragmentChunks = await transformToRAGChunks(fragmentRAGSchema, space);

    // const fragmentRagHandwritten = await transformToRAGChunks(fragmentRag, space);

    // res.status(200).json({ supportChunks, salesChunks, fragmentChunks });
    // res.status(200).json({ fragmentChunks });
    // res.status(200).json(fragmentRagHandwritten);
    res.status(200).json(supportChunks);
};