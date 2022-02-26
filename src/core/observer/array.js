const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]

methodsToPatch.forEach((method) => {
    const original = arrayProto[method]
    Object.defineProperty(arrayMethods, method, function mutator(...args) {
        // 这里的...args和args具体的使用
        const result = original.apply(this, args)
        // ob具体指代什么？observer吗
        const ob = this.__ob__
        let inserted
        switch(method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        if (inserted) {
            ob.observeArray(inserted)
        }
        ob.dep.notify() // 调用了修改数组的方法后，通知依赖更新
        return result
    })
})