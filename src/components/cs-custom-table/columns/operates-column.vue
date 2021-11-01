/**
 * @Description:
 * @author Roman
 * @date 2020/5/20
*/
<template>
  <div v-if="editType==='inline'">
    <div v-if="!scope.row.edit">
      <span class="eidt" @click="inlineEdit">修改</span>
      <el-divider direction="vertical" />
      <span class="del" @click="del">删除</span>
    </div>
    <div v-else>
      <span class="edit" @click="inlineSave">保存</span>
      <el-divider direction="vertical" />
      <span class="del" @click="inlineCancel">取消</span>
    </div>
  </div>
  <div v-else>
    <span class="edit" @click="popEdit">修改</span>
    <el-divider direction="vertical" />
    <span class="del" @click="del">删除</span>
  </div>
</template>

<script>
export default {
  name: 'StateColumn',
  inheritAttrs: false,
  props: {
    scope: {
      type: Object
    },
    editType: {
      type: String
    },
    form: {
      type: Object
    },
    formDatas: {
      type: Object
    },
    setFormDatas: {
      type: Function
    },
    dialog: {
      type: Object
    }
  },
  data() {
    return {

    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    inlineEdit() {
      this.scope.row.edit = !this.scope.row.edit
      this.setFormDatas({ [this.scope.$index]: this.scope.row })
    },
    inlineSave() {
      this.form.validate((valid) => {
        if (valid) {
          this.scope.row.edit = !this.scope.row.edit
          for (const i in this.formDatas[this.scope.$index]) {
            if (i !== 'edit') {
              this.scope.row[i] = this.formDatas[this.scope.$index][i]
            }
          }
        } else {
          return false
        }
      })
    },
    inlineCancel() {
      this.scope.row.edit = !this.scope.row.edit
    },
    popEdit() {
      if (this.editType === 'pop') {
        this.dialog.getRowDatas({ ...this.scope.row })
        this.dialog.popDialogHandle()
      } else if (this.scope.row.editRowType === 'jump') {
        this.$router.push('/')
      }
    },
    del() {
      console.log(this.scope.$index)
    }
  }
}
</script>

<style lang="scss" scoped>
    span{
        color: rgb(24, 144, 255);
        cursor: pointer;
    }

</style>
