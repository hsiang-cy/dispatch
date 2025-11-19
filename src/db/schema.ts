import {
    pgTable,
    integer,
    serial,
    text,
    timestamp,
    jsonb,
    boolean,
    pgEnum,
    index
} from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';

export const statusEnum = pgEnum('status', ['inactive', 'active', 'deleted']);
export const vehicleTypeEnum = pgEnum('vehicle_type', ['truck', 'car', 'scooter', 'big_truck']);

// 使用者
export const user = pgTable('user', {
    id: serial('id').primaryKey(),
    status: statusEnum('status').notNull().default('active'), // inactive, active, deleted

    account: text('account').notNull(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
}, (table) => ([
    index().on(table.account),
    index().using('gin', sql`to_tsvector('english', ${table.account})`)
]))

// 地點
export const destination = pgTable('destination', {
    user_id: integer('users_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    status: statusEnum('status').notNull().default('active'), // inactive, active, deleted

    name: text('name').notNull(), // 地點名稱
    is_depot: boolean('is_depot').notNull().default(false), // 是否為倉庫(出發點)
    comment: text('comment'), // 備註
    time_window: jsonb('time_window').$type<timeWindow>().notNull(), // json 形式, 以分鐘紀錄, [{start: 480, end: 720}, {start: 780, end: 1020}] 表示 08:00-12:00, 13:00-17:00
    address: text('address').notNull(),         // 詳細地址
    location: jsonb('latitude').notNull(),      // 經緯度 json 形式, {lat: 25.0330, lng: 121.5654, geohash: 'wsqqs'} 
    operation_time: text('operation_time'),     // 預計停留時間(作業時間、卸貨時間等), 以分鐘為單位
    demand: integer('demand').notNull().default(0), // 需求量
    priority: integer('priority').notNull().default(0), // 優先順序, 數字越大優先順序越高


    createdAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
}, (table) => ([
    index().on(table.user_id),
    index().on(table.name),
    index().on(table.address),
]))

// 車輛
export const vehicle = pgTable('vehicle', {
    user_id: integer('users_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    status: statusEnum('status').notNull().default('active'), // inactive, active, deleted

    code: text('code').notNull(), // 車牌(或代號)
    vehicle_type: vehicleTypeEnum('vehicle_type').notNull().default('truck'),
    vehicle_number: text('vehicle_number').notNull(),
    capacity: integer('capacity').notNull().default(0), // 容量(單位不定)
    max_distance: integer('max_distance').notNull().default(0), // 最大行駛距離(公尺)
    max_working_time: integer('max_working_time').notNull().default(0), // 最長工時(分)，0表無限
    depot_id: integer('depot_id').notNull().references(() => destination.id), // 預設出發位置(通常是倉庫)

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
});

// 一筆訂單(一筆訂單可以多次計算)
export const orders = pgTable('orders', {
    user_id: integer('users_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    status: statusEnum('status').notNull().default('active'), // inactive, active, deleted

    order_number: text('order_number').notNull(),
    scheduled_time: timestamp('scheduled_time').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
});

// 一次計算任務
export const compute = pgTable('compute', {
    user_id: integer('users_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    status: statusEnum('status').notNull().default('active'), // inactive, active, deleted

    order_id: integer('order_id').notNull().references(() => orders.id), // 對應的訂單
    matrix: jsonb('matrix').notNull(), // 距離或者時間矩陣

    compute_status: text('compute_status').notNull().default('initial'), // initial, computing, completed, failed, timeout
    start_time: timestamp('start_time').defaultNow().notNull(),
    end_time: timestamp('end_time'),
    compute_policy: text('compute_policy').notNull(), // 計算策略描述
    destination_snapshot: jsonb('destination_snapshot').notNull(), // 下訂單時地點的快照
    vehicle_snapshot: jsonb('vehicle_snapshot').notNull(), // 下訂單時車輛的快照

    result: jsonb('result').$type<computeResult>(), // 計算結果

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
});

// 一次訂單中的多個地點
export const order_destinations = pgTable('order_destinations', {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    destination_id: integer('destination_id').notNull().references(() => destination.id),
    // sequence: integer('sequence'), // 順序?
    demand: integer('demand').notNull().default(1), // 每個地點的需求量

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
});


// 一次訂單中的多個車輛
export const order_vehicles = pgTable('order_vehicles', {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    vehicle_id: integer('vehicle_id').notNull().references(() => vehicle.id),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
});

export interface computeResult {
    total_distance: number,
    total_time: number,
    routes: [
        {
            vehicle_id: number,
            route: number[], // 位置順序
            distance: number,
            time: number,
            load: number // 載貨量
        }
    ],
    unassigned_orders: [] // 未分配的訂單
}

export type timeWindow = Array<{
    start: number;
    end: number;
}>;