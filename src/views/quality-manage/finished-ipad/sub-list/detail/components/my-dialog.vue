<template>
  <div v-if="dialogVisible" class="sub-list-dialog">
    <div class="mask-box" @click="dialogVisible=false" />
    <div v-if="dialogType===1" class="main-cont" :class="dialogVisible?'show':''">
      <div v-for="(item,index) in addList" :key="index" class="add-item" @click="boxClick(index)">
        <div class="max-text" :style="{color: index===0||index===3?'#4B81EF':'#2CAF7B'}">{{ index + 1 }}</div>
        <div class="min-text">
          <span>{{ index + 1 }}</span>
          <span>*</span>
          <span>{{ item.num }}</span>
        </div>
      </div>
      <div class="add-btn">
        <i v-if="addType" class="el-icon-plus" />
        <i v-else class="el-icon-minus" />
      </div>
    </div>

    <div v-if="dialogType===2" class="main-cont" :class="dialogVisible?'show1':''">
      <div v-for="(item,index) in textList" :key="index" class="text-item" :class="defectVal===item?'active':''" @click="choiceOperation(item, index)">{{ item }}</div>
      <div v-if="isDelete" class="text-item delete" @click="choiceOperation('删除')">删除</div>
      <div v-else class="text-item no-choice" @click="choiceOperation('不选')">不选</div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'MyDialog',

  data() {
    return {
      dialogVisible: false,
      addType: false,
      addList: [
        { num: 0, allNum: 0 },
        { num: 0, allNum: 0 },
        { num: 0, allNum: 0 },
        { num: 0, allNum: 0 }
      ],
      textList: [
        'A', 'B', 'C'
      ],
      addIndex: 0,
      dialogType: 0,
      textIndex: null,
      isDelete: false,
      defectVal: '',
      checkedIndex: null
    }
  },
  methods: {
    boxClick(index) {
      this.addNum(index)
      this.handle()
      this.changeVal()
    },
    addNum(index) {
      // this.$message.success('添加成功')
      const obj = this.addList[index]
      if (this.addType) {
        obj.num++
      } else {
        if (this.addList[index].num) {
          this.addList[index].num--
        } else {
          this.$message.warning('不可再减')
        }
      }
      obj.allNum = obj.num * (index + 1)
    },
    async choiceOperation(type, index) {
      if (type === '删除') {
        const res = await this.$uiUtils.confirmMsg()
        if (res) {
          this.handle()
        }
      } else if (type === '不选') {
        this.handle()
        this.defectVal = ''
        this.changeVal()
      } else {
        this.handle()
        this.defectVal = type
        this.changeVal()
      }
    },

    open(show, type, data, index) {
      this.addType = show
      this.dialogType = type
      this.checkedIndex = index
      if (type === 1) {
        let arr = (data || '0/0/0/0').split('/')
        arr = arr.map((y, i) => {
          return {
            allNum: y,
            num: y / (i + 1)
          }
        })
        this.addList = arr
      } else {
        this.defectVal = data || ''
      }
      this.dialogVisible = true
    },
    handle() {
      this.dialogVisible = false
    },
    changeVal() {
      let str = ''
      if (this.dialogType === 1) {
        const arr = this.addList.map(item => {
          return item.allNum
        })
        str = arr.join('/')
      } else {
        str = this.defectVal
      }
      this.$emit('change', {
        val: str,
        type: this.dialogType,
        index: this.checkedIndex
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .sub-list-dialog{
    .mask-box{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 2005;
      opacity: 0.6;
    }
    .main-cont{
      position: fixed;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%,-50%);
      z-index: 2005;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 0;
      height: 0;
      opacity: 0;
      transition: 1s;
      .add-item{
        width: 100px;
        height: 100px;
        // background: linear-gradient(36deg, #ECF0F9 0%, #FFFFFF 100%);
        background-color: #FFFFFF;
        box-shadow: 0px 8px 13px 0px rgba(87,90,119,0.5);
        border-radius: 10px;
        margin: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        .max-text{
          font-size: 48px;
          color: #4B81EF;
          font-weight: 500;
        }
        .min-text{
          font-size: 18px;
          color: #888E9E;
          font-weight: 400;
        }
        &.active{
          background-color: #c9e7ff;
        }
      }
      .text-item{
        width: 80px;
        height: 50px;
        // background-image: linear-gradient(36deg, #ECF0F9 0%, #FFFFFF 100%);
        background-color: #ECF0F9;
        box-shadow: 0px 8px 13px 0px rgba(87,90,119,0.5);
        border-radius: 6px;
        margin: 0 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        color: #4B81EF;
        font-weight: 500;
        cursor: pointer;
        &.active{
          background-color: #4B81EF;
          color: #FFFFFF;
        }
      }
      .delete{
        font-size: 18px;
        color: #FF4444;
        font-weight: 500;
      }
      .no-choice{
        font-size: 18px;
        color: #888E9E;
        font-weight: 500;
      }
      .add-btn{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: linear-gradient(36deg, #ECF0F9 0%, #FFFFFF 100%);
        box-shadow: 0px 14px 29px 0px rgba(87,90,119,0.5);
        border-radius: 30px;
        position: absolute;
        left: 50%;
        top: 50%;
        cursor: pointer;
        transform: translate(-50%,-50%);
        .el-icon-plus{
          font-size: 32px;
          font-weight: 500;
          color: #888E9E;
        }
      }
    }
    .show{
      opacity: 1;
      width: 240px;
      height: 240px;
      transition: 1s;
    }
    .show1{
      opacity: 1;
      width: 400px;
      height: 80px;
      transition: 1s;
    }
  }
</style>
