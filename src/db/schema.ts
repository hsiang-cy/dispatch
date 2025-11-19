import {
    pgTable,
    integer,
    serial,
    text,
    timestamp,
    jsonb,
    boolean,
    pgEnum
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['inactive', 'active', 'deleted']);
export const vehicleTypeEnum = pgEnum('vehicle_type', ['truck', 'car', 'scooter', 'big_truck']);

// 使用者
export const user = pgTable('user', {
    id: serial('id').primaryKey(),
    status: statusEnum('status').notNull().default('active'), // inactive, active, deleted

    account: text('account').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
})

// 地點
export const destination = pgTable('destination', {
    user_id: integer('users_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    status: statusEnum('status').notNull().default('active'), // inactive, active, deleted

    name: text('name').notNull(), // 地點名稱
    is_depot: boolean('is_depot').notNull().default(false), // 是否為倉庫(出發點)
    comment: text('comment'), // 備註
    time_window: jsonb('time_window').notNull(), // json 形式, 以分鐘紀錄, [{start: 480, end: 720}, {start: 780, end: 1020}] 表示 08:00-12:00, 13:00-17:00
    address: text('address').notNull(),         // 詳細地址
    location: jsonb('latitude').notNull(),      // 經緯度 json 形式, {lat: 25.0330, lng: 121.5654, geohash: 'wsqqs'} 
    operation_time: text('operation_time'),     // 預計停留時間(作業時間、卸貨時間等), 以分鐘為單位
    demand: integer('demand').notNull().default(0), // 需求量
    priority: integer('priority').notNull().default(0), // 優先順序, 數字越大優先順序越高


    createdAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
})

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
    destination_id: integer('destination_id').notNull().references(() => destination.id), // 不關聯刪除
    matrix: jsonb('matrix').notNull(), // 距離時間矩陣
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

    vehicle_id: integer('vehicle_id').notNull().references(() => vehicle.id), // 有哪幾台車參與此次計算

    compute_status: text('compute_status').notNull().default('initial'), // initial, computing, completed, failed, timeout
    order_id: integer('order_id').notNull().references(() => orders.id), // 不關聯刪除
    start_time: timestamp('start_time').defaultNow().notNull(),
    end_time: timestamp('end_time'),
    compute_policy: text('compute_policy').notNull(), // 計算策略描述
    result: jsonb('result').$type<computeResult>(), // 計算結果


    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    info: jsonb('info'),
});

export interface computeResult {
    total_distance: Number,
    total_time: Number,
    routes: [
        {
            vehicle_id: Number,
            route: Number[], // 位置順序
            distance: Number,
            time: Number,
            load: Number // 載貨量
        }
    ],
    unassigned_orders: [] // 未分配的訂單
}