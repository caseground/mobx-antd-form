# 工程配置来自 [webpack_template](https://github.com/devtemplate/webpack_template)

# 问题描述

store 更新的时候， input 的 value 无法联动更新。

# fix 方式
### 1. store 采用细粒度的方式来做

```
@inject(({ test }) => ({ 
    person: test.person
}))
```

### 2. 不使用getFieldDecorator，不采用 mapPropsToFields 方法，直接采用原始 Input

# 导致出问题的原因猜测

getFieldDecorator 重新包装 Input 实例的时候，出现了问题，导致无法被 mobx trace 到，因此无法被更新到位

