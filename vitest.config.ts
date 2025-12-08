import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',

        include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        exclude: ['node_modules', 'dist', 'migrations-folder'],

        testTimeout: 10000,

        // 每個測試檔案運行前後的設定
        setupFiles: ['./vitest.setup.ts'],
    },

    // 解析路徑別名 -> package.json imports
    resolve: {
        alias: {
            '#index': path.resolve(__dirname, './src/index.ts'),
            '#db': path.resolve(__dirname, './src/db/drizzleORM.export.ts'),
            '#route': path.resolve(__dirname, './src/route'),
            '#middleware': path.resolve(__dirname, './src/utils/middleware/index.ts'),
            '#types': path.resolve(__dirname, './src/utils/types.ts'),
            '#factory': path.resolve(__dirname, './src/utils/factory.ts'),
            '#helpers': path.resolve(__dirname, './src/utils/helpers'),
            '#root': path.resolve(__dirname, './src'),
        },
    },
})