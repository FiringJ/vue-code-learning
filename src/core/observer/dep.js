export default class Dep {
    constructor() {
        this.subs = []      // 依赖数组
    }

    addSub(sub: Watcher) {
        this.subs.push(sub)
    }

    removeSub(sub: Watcher) {
        remove(this.subs, sub)
    }

    depend() {  // 在getter中调用，收集依赖
        if (window.target) {
            this.addSub(window.target)
        }
    }

    notify() {  // 在setter中调用，通知依赖更新
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}