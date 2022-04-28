import React from 'react';
import {
    SmileOutlined,
    CrownOutlined,
    TabletOutlined,
    AntDesignOutlined,
} from '@ant-design/icons';

export default {
    path: '/',
    //子级的路由
    //ProLayout使用前缀匹配的原则来匹配哪个菜单
    routes: [
        {
            path: '/iots',
            name: 'iots转换',
            icon: <SmileOutlined />, //定义图标
        },
        {
            path: '/analyse',
            name: '在线数据分析',
            icon: <SmileOutlined />, //定义图标
        },
    ],
};
