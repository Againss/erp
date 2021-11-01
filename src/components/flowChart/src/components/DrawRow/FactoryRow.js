/**
 * @Description: row节点包裹框
 * @author Roman
 * @date 2021-03-12 11:55:49
 * @edit 2021-03-12 11:55:49
*/
import './row.scss'
import drawFlow from '../factory'
export default {
  /**
   *
   * @param {creatElement} h
   * @param {Object} nodeConfig
   */
  nodeWrapRender(h, nodeConfig) {
    const tep = []
    tep.push(
      <div class='node-wrap'>
        <flow-node
          {...{
            props: { nodeConfig },
            on: {
              clickNode: this.clickNode,
              closeNode: this.closeNode
            }
          }}
        ></flow-node>
        <add-node-btn
          {...{
            props: { belongToNode: nodeConfig },
            on: {
              clickSelectBox: this.clickSelectBox
            }
          }}
        ></add-node-btn>
      </div>
    )
    if (nodeConfig.isRoot) {
      return tep
    }
    if (nodeConfig.childNode) {
      const el = drawFlow.getFactory.bind(this, h, nodeConfig.childNode)()
      tep.push(el)
    }
    return tep
  }
}
