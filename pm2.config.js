/*
 * @Author: lwp 
 * @Date: 2017-10-25 18:39:36 
 * @Last Modified by: lwp
 * @Last Modified time: 2017-10-30 18:04:21
 */

module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name          : "hyb-api",
            script        : "server.js",
            cwd           : "/data/api/",// 当前工作路径
            watch         : true,
            instances     : 1,
            exec_mode     : "cluster",
            interpreter   : "node",
            env_devlopment: {
                NODE_ENV: "dev",
                NODE_ROUTER: "cms"
            },
            env_production: {
                NODE_ENV: "pro",
                NODE_ROUTER: "web"
            },
            ignore_watch  : [// 从监控目录中排除
                "\.git",
                "node_modules",
                "public",
                "public/files",
                "logs",
                "README.md"
            ],
        },

    ],
};
