/**
 * @Description: 下一节点属性
 * @author Roman
 * @date 2021-03-12 11:55:30
 * @edit 2021-03-12 11:55:30
*/
export class NextNode {
  constructor({ id, prevId, type, isRow, title }) {
    this.id = id
    this.prevId = prevId
    this.type = type
    this.isRow = isRow
    this.title = title
  }
}
