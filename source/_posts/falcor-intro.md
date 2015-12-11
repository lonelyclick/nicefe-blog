title: Falcor 介绍
tags: []
categories: []
date: 2015-12-11 14:10:00
---
# 什么是 Falcor

Falcor 是一个由 Netflix 提供的新颖的数据平台。它可以把你后台的数据通过一个虚拟的 JSON 数据提供给前端。在前端，你可以像操作本地 JSON 一样操作异步数据。**如果你知道了数据的格式，你就知道了 API 该怎么写了。**

Falcor 是一个中间件。它不是一个应用服务器、数据库、MVC 框架，它经常用来优化前后端的通信。

## 一个数据模型，随处运行（One Model Everywhere）

Falcor 可以把所有的后台数据作为一个 JSON 资源运行在 server 上

![](https://netflix.github.io/falcor/documentation/network-diagram.png)

前端请求一个 JSON 资源的子集，就像从内存中拿到一个 JSON Object。通过 URL 来检索服务器端的 JSON 资源，服务器端会返回你想要的那部分数据子集。

```
/model.json?paths=["user.name", "user.surname", "user.address"]

GET /model.json?paths=["user.name", "user.surname", "user.address"]
{
  user: {
    name: "Frank",
    surname: "Underwood",
    address: "1600 Pennsylvania Avenue, Washington, DC"
  }
}
```

通过一个 URL 暴露所有的数据并且允许前端可以通过一个请求访问，这就大大的减少了顺序的服务器数据往返。
为了确保服务器的是无状态的，Falcor 提供了一个特殊的 `Router`，以便于前端可以从不同的服务中取数据。

Falcor 的 `Router` 是通过一个或多个 Javascript paths 实现路由功能，而不是匹配 URL。

```
var router = new Router([
  {
    // matches user.name or user.surname or user.address
    route: "user['name','surname','address']",
    get(pathSet) {
      // pathSet could be ["user", ["name"]], ["user", ["name", "surname"]], ["user", ["surname", "address"]] and so on...
      userService.
        getUser(getUserID()).
        then(function(user) {
          return pathSet[1].
            map(function(userKey) {
              // return response for each individual requested path
              return {
                path: ["user", userKey],
                value: user[userKey]
              };
            });
         });
    }
  }
]);
```


可以用 Falcor `Router` 从灵活的数据源导出一个 JSON model 到前端。

![](https://netflix.github.io/falcor/images/services-diagram.png)

## 数据就是 API

用 Falcor，你不需要学一个复杂的中间层来操作数据，如果你知道了你要操作的数据，就可以相应的推导出 API。Falcor 可以让你像使用本地数据一样使用 Javascript 操作远程数据。其中，最重要的不同点就是：** Falcor 本地的 API 是异步的**。

下面是原生 JSON 的写法：

```
var model = {
  user: {
    name: "Frank",
    surname: "Underwood",
    address: "1600 Pennsylvania Avenue, Washington, DC"
  }
};

// prints “Underwood”
console.log(model.user.surname);
```

使用 Falcor，需要用 Falcor Modal 包一层。Falcor Model 可以使用 Javascript 中的路径找寻和操作符。注意，原生 JSON 和 Falcor Model 有个最大的不同点：**Falcor Model 是异步的**。

下面用 Falcor Model 改写：

```
var model = new falcor.Model({
  source: new falcor.HttpDataSource(“/model.json”)
});

// prints “Underwood” eventually
model.
  getValue(“user.surname”).
  then(function(surname) {
    console.log(surname);
  });
```

如果不使用内存中的数据，Falcor 可以远程请求服务器端的 虚拟 JSON 对象。Falcor Router 接受传过来的信息，返回你想要的那部分字段。

![](https://netflix.github.io/falcor/images/falcor-end-to-end.png)

使用异步的 API 的好处在于你可以用一样的 Model，而不用管数据是本地的还是远程的。最开始使用 Falcor 的时候，最好先模拟服务器端的 JSON 对象，然后可以使用 `HttpDataSource` 进行转换，除了这个，服务器端就不需要再做什么了。这对于解耦前后端的开发大有脾益。

## Bind to the Cloud

在大部分的 MVC 架构里， 接收数据都是 `Controller` 的职责，用 Falcor 的一个最佳实践就是直接在 `View` 层来直接接受数据，并且像操作内存中的数据一样进行操作。因为 View 和 Modal 之间的通信是异步的，有些时间需要异步的 MVC。

![](https://netflix.github.io/falcor/images/async-mvc.png)
