# 工程配置来自 [webpack_template](https://github.com/devtemplate/webpack_template)

clone 下来安装好后，`npm start` 然后访问 `http://localhost:8000/pages`即可

# 问题描述

store 更新的时候， input 的 value 无法联动更新。

# fix 方式
### 1. store 采用细粒度的方式来做
```
@inject(({ test }) => ({ 
    test
}))
```
变成
```
@inject(({ test }) => ({ 
    person: test.person
}))
```
如此，两次值发生变化的时候，会触发 componentWillReceiveProps，然后触发更新updateField

### 2. 不使用getFieldDecorator，不采用 mapPropsToFields 方法，直接采用原始 Input

# 导致出问题的原因猜测
参考 [issue](https://github.com/mobxjs/mobx-react/issues/281)

getFieldDecorator 重新包装 Input 实例的时候，出现了问题，导致无法被 mobx trace 到，因此无法被更新到位。

本质原因应该是 rc-form 的设计哲学和 mobx 的设计哲学不太一样导致的问题。这点待求证。




