import { observable, action, autorun, runInAction } from 'mobx';

export default class Test {
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
            });
        }, 300);
    }
}
