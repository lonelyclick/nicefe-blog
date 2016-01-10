title: redux 进阶之 actionType
date: 2016-01-04 14:04:58
tags:
---

## 问题

actions/actionTypes.js

```
export const ADD_TODO = 'ADD_TODO'
export const DELETE_TOTO = 'DELETE_TODO'
```

actions/todo.js

```
import { ADD_TODO, DELETE_TODO } from './actionTypes'

export function addTodo() {
  return {
    type: ADD_TODO
  }
}

export function deleteTodo() {
  return {
    type: DELETE_TODO
  }
}
```

reducers/todo.js

```
import { ADD_TODO, DELETE_TODO } from '../actions/actionTypes'

function todo(state, action) {
  switch(action.type) {
    case ADD_TODO:
      return state
    case DELETE_TODO:
      return state.xxx
    default:
      return state
  }
}
```

这样写如下缺点：

- 大写 actionType 名字，难于拼写，并且要写两遍
- 不能分业务逻辑进行分类，难于管理，只能这样进行分模块

```
export const TODO_ADD = 'TODO_ADD'
export const TODO_DELETE = 'TODO_DELETE'
export const MODULEA_ADD = 'MODULEA_ADD'
export const MODULEB_ADD = 'MODULEB_ADD'
```

## 引入 keyMirror

```
npm install keymirror --save
```

actions/actionTypes.js

```
export default keyMirror({
  ADD_TODO: null,
  DELETE_TODO: null
})
```

其它文件不变，这样就可以少写一遍了，差强人意。

顺便看下 keyMirror 的实现：

```
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = key;
    }
  }
  return ret;
};
```
是啊，只改变了一下数据结构。

## 蜕变

### 确保 actionType 全局唯一
其实，在 redux 内部，每触发一次 actionType ，就会走完全部的 reducer， 所以，这个 actionType 必须是**全局唯一的**，这就好办了，我们可以自己定义一个结构，对 actionType 进行再次封装：

```
function keyMirror(object) {
  // 自己实现
}

export default keyMirror({
  todo: {
    add: null,
    del: null,
    update: null,
    clear: null
  },

  modulea: {
    add: null,
    loadChart: null
  },

  moduleb: {
    // ....
  }
})

```

### 期望值

```
{
  todo: {
    add: 'todo_add',
    del: 'todo_del',
    update: 'todo_update',
    clear: 'todo_clear'
  },

  modulea: {
    add: 'modulea_add',
    loadChart: 'modulea_loadChart'
  },

  moduleb: {
    // ....
  }
}
```

### 使用

actions/todo.js

```
import actionTypes from './actionTypes'

export function addTodo() {
  return {
    type: actionTypes.todo.add
  }
}

export function deleteTodo() {
  return {
    type: actionTypes.todo.del
  }
}
```

reducers/todo.js

```
import actionTypes from './actionTypes'

function todo(state, action) {
  switch(action.type) {
    case actionTypes.todo.add:
      return state
    case actionTypes.todo.del:
      return state.xxx
    default:
      return state
  }
}
```

### 优点

- 省去了大写拼写
- 分模块管理，易于分辨与管理

## 改进版 keyMirror 实现

```
const ret = {}

for (const module in object) {
  if (object.hasOwnProperty(module)) {
    const value = object[module]
    const pair = {}
    for (const actionType in value) {
      if (value.hasOwnProperty(actionType)) {
        pair[actionType] = `${module}_${actionType}`
      }
    }
    ret[module] = pair
  }
}

return ret
```

## 尾巴

另外，有一个将 reducer, action, actionType 全部写在一块的解决方案 [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux)
