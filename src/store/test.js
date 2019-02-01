import { observable, action, autorun, runInAction } from 'mobx';
// import { debounce } from 'loadash';

export default class Test {
    // 针对数据的所有操作都会被处理掉
    @observable.shallow shallowArray = [];
    // 只是处理引用，类似一般的 redux 的概念
    @observable.ref refArray = [];
    // 比较的时候，会做值比较
    @observable.struct structArray = [];
    
    @observable.shallow person = { name: 'LiLei' };

    @action.bound
    updatePersonName(name) {
        this.person.name = name;
    }
    
    @action
    updatePersonNameAsync() {
        setTimeout(() => {
            runInAction(() => {
                this.person.name = 'Xiaoming 1000';
            })
        }, 300);
    }

    @action.bound
    pushArray() {
        let item = { name: 'LiLei' };
        let ref = this.structArray;
        // if(this.structArray.length) {
            this.structArray = [item];
        // } else {
        //     this.structArray = \
        // }
        // this.refArray.push(item);
        // this.structArray.push(item);
        console.log('after push Array', this.structArray === this.ref);
    }
    @action.bound
    spreadArray() {
        this.shallowArray = [...this.shallowArray];
        this.refArray = [...this.refArray];
        this.structArray = [...[{ name: 'LiLei' }]];
    }
    @action.bound
    spliceArray() {
        this.shallowArray = this.shallowArray.splice(0, 1, { name: 'XiaoMing' });
        this.refArray = this.refArray.splice(0, 1, { name: 'XiaoMing' });
        this.structArray = this.structArray.splice(0, 1, { name: 'XiaoMing' });
    }
    @action.bound
    replaceArray() {
        this.shallowArray[0] = { name: 'XiaoMing' };
        this.refArray[0] = { name: 'XiaoMing' };
        this.structArray[0] = { name: 'XiaoMing' };
    }
}
