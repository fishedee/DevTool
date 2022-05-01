import { defineConfig } from 'umi';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    title: 'fish开发工具',
    //hash路由
    history: {
        type: 'hash',
    },
    //打开locale
    locale: { antd: true },

    //https://umijs.org/zh-CN/plugins/plugin-antd
    //紧凑主题，或者暗黑主题
    antd: {
        //dark: true,
        //compact: true,
    },
    proxy: {
        '/api/': {
            target: 'http://localhost:9192',
            changeOrigin: true,
        },
    },
    fastRefresh: {},

    chainWebpack: (memo) => {
        // 更多配置 https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        memo.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
            // 按需配置
            { languages: ['javascript'] },
        ]);
        return memo;
    },
});
