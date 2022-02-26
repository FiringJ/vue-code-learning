import Dep from "./dep";

export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.cb = cb;
        this.getter = parsePath(expOrFn)
        this.value = this.get()
    }
    get() {
        window.target = this;
        const vm = this.vm
        let value = this.getter.call(vm, vm)
        window.target = undefined;
        return value
    }
    update() {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
}