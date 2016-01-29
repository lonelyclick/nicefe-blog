title: Node.js 分布式架构
date: 2016-01-29 12:25:41
tags:
---

### 1.单台服务器上，如何让 Node.js 充分利用多核心 cpu

可以使用 Node.js 的 Cluster 功能

```
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);
}
```

![](/images/node_multi_cpu.png)

PM2 内置

```
pm2 start app.js -i max // 支持最多 cpu 核心数运行
pm2 start app.js -i 2 // 支持最多 2 个 cpu 核心运行
```

另外，**使用 docker 容器，能更好的解决该问题**，可以考虑弃用 pm2

### 2.多台服务器上，负载均衡怎么部署

![](/images/node_lb.png)

负载均衡实现选型比较：[balancerbattle](https://github.com/observing/balancerbattle)

比较的结论：nginx 和 haproxy 更加成熟，速度更快

## 3.多个 Node Web Server 之间，如何进行状态共享

- 对事务要求较高 - 数据库存储 - mysql
- session，配置项 - 缓存 - redis
- 图片，二进制文件等 - 文件系统

**如果只做一个 Node.js 中间层，后台服务还是 Java 的话，Node.js 最好做成无状态的**
