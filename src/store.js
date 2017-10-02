let store = {}

export function set(obj) {
  store = {...store, ...obj}
}

export function get(key) {
  return store[key]
}

export function getAll() {
  return store
}
