const currentYear = new Date().getFullYear()
const year = [
    {
      value: currentYear - 1 + '',
      label: currentYear - 1 + ''
    },
    {
      value: currentYear + '',
      label: currentYear + ''
    },
    {
      value: currentYear + 1 + '',
      label: currentYear + 1 + ''
    },
    {
      value: currentYear + 2 + '',
      label: currentYear + 2 + ''
    }
  ]
  
    export default year