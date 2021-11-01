/**
 * @Description: 公共方法
 * @author Roman
 * @date 2021-03-12 11:58:01
 * @edit 2021-03-12 11:58:01
*/

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/**
 * 转化为el-tree树形结构数据
 */
export function transToTreeDat(arr) {
  const list = JSON.parse(JSON.stringify(arr))
  const colNodes = list.filter(i => !i.isRow)
  const colNodesGroup = getColNode(colNodes)
  const allNodes = list.concat(colNodesGroup)
  const tree = transTree(allNodes)
  return tree
}
export function getColNode(colNodeArrs) {
  const colNodes = colNodeArrs
  const map = {}
  colNodes.forEach(i => {
    if (!map[i.groupId]) {
      map[i.groupId] = []
    }
    map[i.groupId].push(i)
  })
  const colNodesArr = []
  for (const groupId in map) {
    const obj = {
      id: groupId,
      groupId: map[groupId][0].groupPid,
      type: 'route',
      isRow: true,
      isFlowTo: map[groupId][0].type === '6',
      conditionNodes: map[groupId]
    }
    colNodesArr.push(obj)
  }

  return colNodesArr
}
/**
 *
 * @param {allNodes} arr 所有的整行元素
 * @param {*} list  所有的节点元素
 */
export function getPidArr(list) {
  const colNodes = list.filter(i => !i.isRow)
  const rowNodes = list.filter(i => i.isRow)
  const colNodesGroup = getColNode(colNodes, list)
  const arr = colNodesGroup.concat(rowNodes)
  const map = {} // 所有整行元素的字典对象
  for (const item of arr) {
    map[item.id] = item
  }
  // 获取节点所在行
  for (const lis of list) {
    lis.pids = []
    if (!lis.isRow) {
      const p = map[lis.groupPid]
      if (lis.groupPid === 'root') {
        lis.pids.push(p.id)
        continue
      }
      // 当上一层为rowNode
      getColPid(p, lis)
    } else {
      const p = map[lis.groupId]
      getRowPid(p, lis)
    }
  }
}
// 获取row的父节点id
function getRowPid(p, lis) {
  if (!p) {
    lis.pids.push(lis.groupId)
  } else {
    if (p.conditionNodes) {
      p.conditionNodes.forEach(i => {
        loopGetPid(i, lis)
      })
    } else {
      lis.pids.push(p.id)
    }
  }
}
/**
 * 获取col节点的父节点
 */
function getColPid(p, lis) {
  if (!p) {
    // 当上一层为条件框元素
    lis.pids.push(lis.groupPid)
  } else {
    // 当上一层为整行元素
    loopGetPidCol(p, lis)
  }
}
/**
 *
 * @param {*} parentRow
 * @param {*} lis
 * 单独处理一下col节点
 */
export function loopGetPidCol(parentRow, lis) {
  if (parentRow.conditionNodes) {
    parentRow.conditionNodes.forEach(i => {
      loopGetPid(i, lis)
    })
  } else {
    lis.pids.push(parentRow.id)
  }
}
/**
 *  轮询节点获取pid
 * @param {*} node
 * @param {*} lis
 */
export function loopGetPid(node, lis) {
  if (node.childNode) {
    loopGetPid(node.childNode, lis)
  } else if (node.conditionNodes) {
    node.conditionNodes.forEach(i => {
      loopGetPid(i, lis)
    })
  } else {
    lis.pids.push(node.id)
  }
}
/**
 * 转化为el-tree树形结构数据
 */
export function transTree(arr) {
  const list = arr
  if (!list || !list.length) return []
  const map = {}
  for (const item of list) {
    map[item.id] = item
  }
  const nodes = []
  for (const lis of list) {
    if (!lis.isRow) {
      continue
    }
    const p = map[lis.groupId]
    if (!p) {
      nodes.push(lis)
      continue
    }
    p.isParent = true
    p.childNode || (p.childNode = {})
    p.childNode = lis
    if (
      p.childNode.conditionNodes &&
      p.childNode.conditionNodes[0].type === '6'
    ) {
      p.isFlowTo = true
    }
  }
  return nodes
}
/**
 * Hash 哈希值
 */
export function HashCode(hashLength) {
  // 默认长度 24
  return (
    's' +
    Array.from(Array(Number(hashLength) || 15), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join('')
  )
}
/**
 * 树结构转化为扁平化结构
 */
export function deepTraversal(tree) {
  const list = []
  tree.forEach(item => {
    const loop = data => {
      list.push(data)
      const children = data.children
      children &&
        children.length &&
        children.forEach(child => {
          loop(child)
        })
    }
    loop(item)
  })
  return list
}
