const intervalForEach = (callback: (item: any, index: number) => void, array: any[], intervalTime: number) => {
  const length: number = array.length;

  let index: number = 0;
  const intervalId: number = window.setInterval(() => {
    if (index > length - 1) {
      clearInterval(intervalId);
    } else {
      callback(array[index], index);
      index += 1;
    }
  }, intervalTime);
};
export { intervalForEach };
