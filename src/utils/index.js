export const sumObjectsByKey = (...objs) => {
  const res = objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k) && typeof b[k] === 'number')
        a[k] = (a[k] || 0) + b[k]
    }
    return a
  }, {})
  return res
}

export const sumObjectsByKeyInclusive = (...objs) => {
  const res = objs.reduce((a, b) => {
    for (const k in b) {
      if (b.hasOwnProperty(k) && typeof b[k] === 'number')
        a[k] = (a[k] || 0) + b[k]
      else if (!a[k]) a[k] = b[k]
    }
    return a
  }, {})
  return res
}

export const sumObjectsByKeySelective = (keys, ...objs) => {
  const res = objs.reduce((a, b) => {
    for (const k in b) {
      if (b.hasOwnProperty(k) && typeof b[k] === 'number' && keys.includes(k))
        a[k] = (a[k] || 0) + b[k]
      else if (typeof b[k] === 'string' && keys.includes(k))
        if (!a[k]) a[k] = b[k]
    }
    return a
  }, {})
  return res
}
