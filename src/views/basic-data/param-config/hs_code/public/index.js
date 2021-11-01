/*
 * @Descripttion: 
 * @version: 
 * @Author: shujing
 * @Date: 2020-10-27 18:40:58
 * @LastEditors: shujing
 * @LastEditTime: 2020-10-28 09:24:20
 */
export default function  dataComparision (oldData,newData,type='edit') {
      // console.log('111');
      let hadInput = false
      if(type==='edit'||!Object.keys(oldData).length){
        for (const i in newData) {
          if (newData[i] !== oldData[i]) {
            hadInput = true
            break
          }
        } 
      }else if(Object.keys(oldData).length>0){
        hadInput = true
      }
      return hadInput
}