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


--------------------------------------------

来自 Nadia 的猜测


1. mapPropsToFields 和 onFieldsChange 类似于 get 和 set，map 完了 onFieldsChange 也要进行 dispatch，第一个问题就是开发者没有 dispatch，可参考 [redux 的用法](http://react-component.github.io/form/examples/redux.html)

2. 即便做了第一步，会发现案例在初始化时仍然是异常的，这是因为 Mobx 为了把性能搞上去，重新写了componentWillReceiveProps 函数，所以被 observe 的组件，props 变了，并不会重新触发componentWillReceiveProps (除非是 observe 的整个 object 而不是 object 的某个属性变了)，但是rc-form的mapPropsToField 是写在 componentWillReceiveProps 里的, 这造成了某些时候（就是只有属性变了的时候），rc-form 无法从 componentWillReceiveProps 读取到 props 的更新。这或许是两者设计理念上的偏差。

关于 Mobx 的这一点，可查看 [mobx issue](https://github.com/mobxjs/mobx-react/issues/281)


**解决方案：**

细粒化使其触发 componentWillReceiveProps 方法。
