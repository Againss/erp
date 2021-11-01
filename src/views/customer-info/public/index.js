import * as api from './api/index'

export const PublicCustomer = {
  methods: {
    async getOptionConfig (params = {}) {
      const res = await api.optionConfigSelect(params)
      let formatterList = []

      if (this.$pub.responseValidate(res)) {
        const list = res.data
        if (list && list.length > 0) {
          formatterList = list.map(item => ({ value: '' + item.fieldValueId, label: item.fieldValue }))
        }
      }
      return formatterList
    }

  }
}
