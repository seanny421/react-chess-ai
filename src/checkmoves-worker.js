// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = (message) => {
    console.log(message.data.test)
    getNextNumber()
  }

  let counter = 0;
  function getNextNumber(){
    setTimeout(() => {
      postMessage(counter)
      counter++;
      getNextNumber()
    }, 1000)
  }
}
