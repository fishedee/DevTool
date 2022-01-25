import { defineConfig } from 'umi';

export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    title: '个人管理系统',
    //hash路由
    history: {
        type: 'hash',
    },
    //打开locale
    locale: { antd: true },
    publicPath: '/static/',
    mfsu: {},

    //https://umijs.org/zh-CN/plugins/plugin-antd
    //紧凑主题，或者暗黑主题
    antd: {
        //dark: true,
        //compact: true,
    },
    proxy: {
        '/api/': {
            target: 'http://localhost:9191',
            changeOrigin: true,
        },
    },
    fastRefresh: {},
});
