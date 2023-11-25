const randomNumber = (maximumNumber:number):number => {
  return Math.floor((Math.random() * maximumNumber) + 1)
}


export {
  randomNumber
}