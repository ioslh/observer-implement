import('./observer.mjs').then(({ observable, observer }) => {
  const value = observable({
    name: 'Sheldon',
    age: 25
  })
  
  observer(() => {
    console.log('---name changed')
    console.log(value.name)
  })

  value.name = 'Sheldon Cooper'
})
