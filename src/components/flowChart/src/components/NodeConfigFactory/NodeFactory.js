/* eslint-disable no-unused-vars */
/**
 * @author
 * @time 2020-9-10
 * @dec 各种节点类
 */
import { HashCode } from '../../utils'
export class Node {
  nodeId;
  type;
  childNode;
  title = 'title';
  content = '请选择';
  conditionNodes;
  constructor({ id, type, isRow, title }) {
    this.groupId = id
    this.id = HashCode()
    this.type = type
    this.title = title
    // this.content += this.id
    this.isRow = isRow
  }
}
export class ConditionNode {
  title = 'title';
  content = '请选择';
  data = {};
  constructor({ groupId, type, id, isRow, title }) {
    console.log(this.content)
    this.id = HashCode()
    this.groupId = groupId
    this.title = title
    this.type = type
    // this.content += this.id
    this.groupPid = id
    this.isRow = isRow
  }
}
export class RowNode extends Node {
  data = {};
  constructor({ id, type, isRow, title }) {
    super({ id, type, isRow, title })
  }
}
export class CopyNode {
  title = '条件分支';
  id = HashCode();
  content = '请选择';
  data = {};
  constructor({ id, childNode, ...node }) {
    return Object.assign(node, this)
  }
}
