(() => {
  class YoutubeObserver {
    constructor (notifyFunc) {
      this.limit = 7200; // 2時間 = 7200
      this.snooze = 1800; // 30分 = 1800
      this.resetHour = 5; // 5時 (0-23時表記)
      // spent って言ってるけど、滞在しているという意味合いに変わった
      this._spentTime = 0;
      this.isLeft = false;
      this.intervalId = null;
      this.TIME_ZONE_DIFF = 32400000; // 時差9時間
    }

    measure() {
      this.isLeft = false;
      this.resetIfNeeded();
    }
    unmeasure() {
      this.isLeft = true;
      this.writeIfNeeded();
    }
    observe() {
      this.measure();
      // そんなに厳密ではない
      this.intervalId = setInterval(() => {
        this._updateTime();
        if (this._mustNotify()) {
          this._notify();
        }
      }, 1000);
    }
    writeIfNeeded() {
      this._writeCookie(this._spentTime + this._readSpentTime());
      this._spentTime = 0;
    }
    _writeCookie(time)
    {
      document.cookie = `youtubeObserverTime=${time}`
      document.cookie = `youtubeObserverDate=${(new Date()).getTime()}`
    }
    resetIfNeeded() {
      const nowGMT = new Date();
      const now = new Date(nowGMT.getTime() - this.TIME_ZONE_DIFF);
      const previousGMT = this._readRecordDate();
      const previous = new Date(previousGMT.getTime() - this.TIME_ZONE_DIFF);
      // 月はまたいでない
      if (now.getMonth() == previous.getMonth()) {
        // 日またぎ
        if (now.getDate() > previous.getDate()) {
          if (now.getHours() >= this.resetHour) {
            this._writeCookie(0);
            this._spentTime = 0;
          }
        }
      }
      // 月跨ぎ
      else if (now.getMonth() > previous.getMonth()) {
        if (now.getHours() >= this.resetHour) {
          this._writeCookie(0);
          this._spentTime = 0;
        }
      }
      // 年越し
      else if (now.getMonth() < previous.getMonth()) {
        if (now.getHours() >= this.resetHour) {
          this._writeCookie(0);
          this._spentTime = 0;
        }
      }
    }
    _readRecordDate() {
      if (document.cookie.split('; ').find(row => row.startsWith('youtubeObserverDate')) === undefined) {
        this._writeCookie(0);
        return new Date();
      }
      return new Date(parseInt(document.cookie.split('; ').find(row => row.startsWith('youtubeObserverDate')).split('=')[1]));
    }
    _readSpentTime() {
      if (document.cookie.split('; ').find(row => row.startsWith('youtubeObserverTime')) === undefined) {
        this._writeCookie(0);
        return 0;
      }
      return parseInt(document.cookie.split('; ').find(row => row.startsWith('youtubeObserverTime')).split('=')[1], 10);
    }
    _updateTime() {
      if (this.isLeft) { return; }
      this._spentTime += 1;
    }
    _mustNotify() {
      return this.limit < this._readSpentTime();
    }
    _notify() {
      let inputResult = confirm("時間になりました！\n即座にリセットしてやめるならOK\nスヌーズするならキャンセル");
      if (inputResult) {
        alert("ちゃんと閉じよう！");
        clearInterval(this.intervalId);
        return;
      }
      alert(`${this.snooze / 60}分延長したよ！`);
      this.limit = this.limit + this.snooze;
    }
  }

  const observeYoutubeWatch = () => {
    var observer = new YoutubeObserver();
    observer.observe();
    window.addEventListener('focus', () => { observer.measure() }, false);
    window.addEventListener('blur', () => { observer.unmeasure() }, false);
  };

  // DOMContentLoaded だとなぜか発火しないのでやむなく load で実施
  window.addEventListener('load', () => {
    observeYoutubeWatch();
  });
})();
