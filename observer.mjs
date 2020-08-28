let current = null

const dependencies = new WeakMap()

const isPrimitiveValue = val => {
  if (val === null) return true
  return ['string', 'number', 'undefined', 'symbol', 'boolean'].indexOf(typeof val) !== -1
}

const push = (list, item) => {
  const index = list.indexOf(item)
  if (index === -1) {
    list.push(item)
  }
}

const rememberDeps = (obj, prop) => {
  if (typeof current !== 'function') return
  const depsMap = dependencies.get(obj) || {}
  const depsList = (depsMap[prop] = (depsMap[prop] || []))
  push(depsList, current)
  dependencies.set(obj, depsMap)
}

const get = (target, prop) => {
  const value = Reflect.get(target, prop)
  if (isPrimitiveValue(value)) {
    rememberDeps(target, prop)
    return value
  }
  return observable(value)
}

const set = (target, prop, nextValue) => {
  const value = Reflect.get(target, prop)
  if (value === nextValue) return
  Reflect.set(target, prop, nextValue)
  const targetDependenciesMap = dependencies.get(target) || {}
  const targetDependencies = targetDependenciesMap[prop] || []
  targetDependencies.forEach(callback => {
    callback()
  })
}

export const observable = (obj) => {
  return new Proxy(obj, {
    get,
    set,
  })
}

export const observer = (callback) => {
  current = callback
  callback()
}
