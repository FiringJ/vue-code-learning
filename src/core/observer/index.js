import Dep from "./dep"

export class Observer {
    constructor(value) {
        this.value = value  // 需要改造成响应式对象的普通对象
        this.dep = new Dep()    // 实例化依赖数组，getter时收集依赖，setter时通知依赖更新
        def(value, '__ob__', this)  // 为这个对象打上标记，防止被重复的转化
        if (Array.isArray(value)) {     // 对数组对象做响应式处理

        } else {    // 对普通对象做响应式处理
            this.walk(value)
        }
    }

    walk(obj) {     // 遍历对象obj的所有属性，转换成可观测对象
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}

export function defineReactive(obj, key, val, customSetter, shallow) {
    const dep = new Dep()   // 实例化一个依赖管理器，生成一个依赖管理数组dep
    const property = Object.getOwnPropertyDescriptor(obj, key)    // 获取对象的自有属性描述符

    if (property && property.configurable === false) {      // 该属性描述不可改变，返回
        return
    }

    const getter = property && property.get
    const setter = property && property.set
    // (!getter || setter)判断的意义
    if((!getter || setter) && arguments.length === 2) {     // 只传入了obj和key时，属性值取obj[key]
        val = obj[key]
    }

    // 递归遍历子节点
    let childOb = !shallow && observe(val)

    // 通过Object.defineProperty进行属性劫持，在getter中收集依赖，在setter中通知依赖更新
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            dep.depend()    // 收集依赖
            return val
        },
        set(newVal) {
            if(val === newVal){
                return
            }
            val = newVal;
            dep.notify()    // 通知依赖更新

        }
    })

}