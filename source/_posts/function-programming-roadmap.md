title: 函数式编程深入路线
tags: []
categories: []
date: 2015-12-09 10:34:25
---

- 函数式思维
- 定义函数输入与输出
- 内部实现（遵循纯度与不可变性理论）
- 基础组合子

## 函数式思维

我们惯常的思维都是面向过程式的，比如：
```
const array = [1, 2, 3, 4, 5, 6]
console.log(array[1])
```
相当于我从 `array` 中拿第几个的值，而函数式思维是：我先做一个工具，我给这个工具输入 `array` 与 `index` ，这个工具负责给我返回我想要的值

```
function nth(array, index) {
  return array[index]
}

const array = [1, 2, 3, 4, 5]
console.log(nth(array, 1))
```
也就说，面向过程的思维的最小原子是一个个命令，而函数式思维的最小原子是一个个的**函数**，所以函数式思维的优点在于：
- 代码层面，最小原子是函数，高一个维度
- 思维层面，使用函数式来思考及设计，就是要使用『上帝』的视角了。

## 定义函数输入与输出

### 高阶函数

所谓高阶函数，首要条件是函数必须为一等公民，也就是说，函数必须可以想其他原生数据类型一样作为值进行传递，可分为三种：

- 函数作为参数传入

```
function fp1(callback) {
  callback()
}
```

- 函数作为返回值返回

```
function fp2() {
  return function callback() {}
}
```
- 函数作为参数传入，并且函数作为返回值

```
function fp3(callback1) {
  return function callback2() {
    return callback1()
  }
}
```

### 难度

其中，第一二种，比较简单，第三种，困难

## 内部实现

### 纯度
也就是说，每个函数尽量要写成纯函数(pure function)
- 结果只能从他的参数值来计算
- 不能依赖被外部改变的数据
- 不能改变外部的状态

### 不可变数据结构

```
const set = new Set()
set.add(1)
console.log(set) // mutable
```
如上代码，es6 的 `Set` 就是一个可变数据结构，而不可变数据结构如下：

```
const set = new Set()
const set2 = set.add(1)
console.log(set.size) // 0
console.log(set2.size) // 1
```
这里推荐优秀的 [Immutablejs](https://facebook.github.io/immutable-js/)

### 范例
`redux` 的 `reducer` 是一个很好的范例

```
import Immutable from 'immutable'
import { createReducer } from 'redux-immutablejs'

import { common as actionType } from '../lib/actionType'

export default createReducer(Immutable.fromJS({}), {
  [actionType.requestFail](state, action) {
    return state.merge({
      theme: 'error',
      message: action.error,
      time: String(Date.now())
    })
  },

  [actionType.auditResourceSuccess](state, action) {
    return state.merge({
      theme: 'success',
      message: action.message,
      title: action.title,
      time: String(Date.now())
    })
  }
})
```

## 基础组合子推荐

### es5 & es6

es5 和 es6 的出现，让 javascript 更加容易实现函数式

```
[1, 2, 3, 4, 5, 6].map(index => index + 2) // [3, 4, 5, 6, 7, 8]
['a', 'b', 'c', 'd'].reduce((result, current) => {
	return Object.assign(result, {
  	[current]: null
  })
}, {}) // { a: null, b: null, c: null, d: null }
```

### underscore && lodash

```
_.findWhere(publicServicePulitzers, {newsroom: "The New York Times"})
```

### Immutablejs

```
var map1 = Immutable.Map({ a:1, b:2, c:3 })
var map2 = map1.set('b', 50)
map1.get('b') // 2
map2.get('b') // 50
```
