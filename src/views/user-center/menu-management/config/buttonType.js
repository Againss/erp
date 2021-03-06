const config = [
  { label: '新增', value: 'store' },
  { label: '查看', value: 'index' },
  { label: '编辑', value: 'update' },
  { label: '删除', value: 'destory' },
  { label: '审核', value: 'approve' },
  { label: '反审核', value: 'disapprove' },
  { label: '提交审核', value: 'submit_approve' },
  { label: '撤回审核', value: 'withdraw_approve' },
  { label: '审批', value: 'check' },
  { label: '提交审批', value: 'sumit_check' },
  { label: '转交审批', value: 'transmit_check' },
  { label: '作废', value: 'invalid_check' },
  { label: '驳回', value: 'disagree' },
  { label: '完结', value: 'finish' },
  { label: '确认', value: 'affirm' },
  { label: '反确认', value: 'disaffirm' },
  { label: '取消', value: 'cancel' },
  { label: '恢复', value: 'discancel' },
  { label: '复制', value: 'copy' },
  { label: '变更', value: 'change' },
  { label: '补料', value: 'complement' },
  { label: 'Hold单', value: 'hold' },
  { label: '关联单据', value: 'relation' },
  { label: '导入', value: 'import' },
  { label: '日报表导出', value: 'dailyexport' },
  { label: '日报表查看', value: 'dailyindex' },
  { label: '打印', value: 'print' },
  { label: '生产要素查看', value: 'elementindex' },
  { label: '生产要素编辑', value: 'elementedit' },
  { label: '生产要素审核', value: 'elementapprove' },
  { label: '生产要素反审核', value: 'elementdisapprove' },
  { label: '排产计划查看', value: 'planshow' },
  { label: '排产计划编辑', value: 'planupdate' },
  { label: '供纱交期审核', value: 'schedule_plan_yarn_approve' },
  { label: '供纱交期反审核', value: 'schedule_plan_yarn_disapprove' },
  { label: '染纱纱交期审核', value: 'schedule_plan_dyeing_disapprove' },
  { label: '染交期审核', value: 'schedule_plan_knit_approve' },
  { label: '染交期反审核', value: 'schedule_plan_knit_disapprove' },
  { label: '织交期审核', value: 'schedule_plan_dye_approve' },
  { label: '织交期反审核', value: 'schedule_plan_dye_disapprove' },
  { label: '印花交期审核', value: 'schedule_plan_printing_approve' },
  { label: '印花交期反审核', value: 'schedule_plan_printing_disapprove' },
  { label: '排产计划报表审核', value: 'approve_report' },
  { label: '排产计划报表反审核', value: 'disapprove_report' },
  { label: '生产领料', value: 'picklists' },
  { label: '指派', value: 'assign' },
  { label: '批量指派', value: 'bathassign' },
  { label: '转派', value: 'transfer' },
  { label: '列表底部汇总栏', value: 'summary' },
  { label: '重置密码', value: 'resetpwd' },
  { label: '启用', value: 'start' },
  { label: '禁用', value: 'disable' },
  { label: '生成订单', value: 'createorder' },
  { label: '纱清单', value: 'yarnlists' },
  { label: '织订单', value: 'knitorder' },
  { label: '染订单', value: 'dyeorder' },
  { label: '染纱单', value: 'dyeingorder' },
  { label: '印花单', value: 'printorder' },
  { label: '采购单', value: 'purchaseorder' },
  { label: '销售订单', value: 'salesorder' },
  { label: '补布单', value: 'patchorder' },
  { label: '船唛单', value: 'shipping_mark' },
  { label: '生成CAR报告', value: 'create_car' },
  { label: '寄板记录', value: 'sendplate' },
  { label: '寄板记录新增', value: 'sendstore' },
  { label: '寄板记录查看', value: 'sendindex' },
  { label: '寄板记录编辑', value: 'sendupdate' },
  { label: '寄板记录删除', value: 'senddestory' },
  { label: '保存为产品', value: 'newaddproduct' },
  { label: '最终报价', value: 'getofferprice' },
  { label: '纱报价', value: 'getyarn' },
  { label: '染报价', value: 'getprice' },
  { label: '综合成本', value: 'getdata' },
  { label: '长纤', value: 'longfiberoffer' },
  { label: '短纤', value: 'spunoffer' },
  { label: '染色', value: 'dyeoffer' },
  { label: '织布', value: 'weavingoffer' },
  { label: '坯纱采购入库', value: 'yarnpurchase' },
  { label: '色纱采购入库', value: 'dyeingpurchase' },
  { label: '坯纱调拨入库', value: 'yarnallot' },
  { label: '色纱调拨入库', value: 'dyeingallot' },
  { label: '坯布调拨入库', value: 'knitallot' },
  { label: '色布调拨入库', value: 'dyeallot' },
  { label: '印花调拨入库', value: 'printallot' },
  { label: '坯纱调拨出库', value: 'yarnoutallot' },
  { label: '色纱调拨出库', value: 'dyeingoutallot' },
  { label: '坯布调拨出库', value: 'knitoutallot' },
  { label: '色布调拨出库', value: 'dyeoutallot' },
  { label: '印花调拨出库', value: 'printoutallot' },
  { label: '上移', value: 'rasieup' },
  { label: '下移', value: 'downward' },
  { label: '布票打印', value: 'clothprint' },
  { label: '复审', value: 'recheck' },
  { label: '评论', value: 'comment' },
  { label: '扫码', value: 'processing_clothing' },
  { label: '付款确定', value: 'payment_request' },
  { label: '染/印验布表待验', value: 'index_quarantine' },
  { label: '染/印验布表草稿', value: 'index_draft' },
  { label: '染/印验布表待审核', value: 'index_to_be_tested' },
  { label: '染/印验布表待复核', value: 'index_review' },
  { label: '染/印验布表完结', value: 'index_end' },
  { label: '染/印撤回按钮', value: 'return' },
  { label: '染/印复核按钮', value: 'review' },
  { label: '染/印反馈上级按钮', value: 'feedback' },
  { label: '细码详情导出', value: 'export_picode_details' },
  { label: '关账', value: 'close' },
  { label: '反关账', value: 'disclose' },
  { label: '进度更新', value: 'schedule_update' },
  { label: '进度反馈', value: 'schedule_feedback' }
]
export default config
