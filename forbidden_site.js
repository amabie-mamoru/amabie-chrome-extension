(() => {
  // DOMContentLoaded だとなぜか発火しないのでやむなく load で実施
  window.addEventListener('load', () => {
    setInterval(() => {
      // alert を表示すると閉じるまで操作できなくなるが1秒おきに表示されるので実質操作できない
      alert("実質使用禁止");
    }, 1000);
  });
})();

