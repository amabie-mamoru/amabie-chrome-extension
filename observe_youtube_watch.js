(() => {
  class YoutubeObserver {
    constructor (notifyFunc) {
      this.limit = 7200; // 2時間 = 7200
      this.snooze = 1800; // 30分 = 1800
      this.resetHour = 5; // 5時 (0-23時表記)
      // 直接操作せず _readIfNeeded() 経由で呼び出す
      this._spentTime = 0;
      this.isLeft = false;
      this.intervalId = null;
    }

    measure() {
      this.isLeft = false;
      this.resetIfNeeded();
      this.updateSpentTimeIfNeeded();
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
      if (this._spentTime > this._readSpentTime()) {
        this._writeCookie(this._spentTime);
      }
    }
    _writeCookie(time)
    {
      document.cookie = `youtubeObserverTime=${time}`
      document.cookie = `youtubeObserverDate=${Date.now}`
    }
    updateSpentTimeIfNeeded() {
      if (this._readCookie > this._spentTime) {
        this._spentTime = this._readCookie();
      }
    }
    resetIfNeeded() {
      const now = new Date();
      const previous = new Date(this._readRecordDate() * 1000);
      // 月はまたいでない
      if (now.getMonth() == previous.getMonth()) {
        // 日またぎ
        if (now.getDate() > previous.getDate()) {
          if (now.getHours() >= this.resetHour) {
            this._writeCookie(0);
          }
        }
      }
      // 月跨ぎ
      else if (now.getMonth() > previous.getMonth()) {
        if (now.getHours() >= this.resetHour) {
          this._writeCookie(0);
        }
      }
      // 年越し
      else if (now.getMonth() < previous.getMonth()) {
        if (now.getHours() >= this.resetHour) {
          this._writeCookie(0);
        }
      }
    }
    _readRecordDate() {
      if (document.cookie.split('; ').find(row => row.startsWith('youtubeObserverDate')) === undefined) { return; }
      return document.cookie.split('; ').find(row => row.startsWith('youtubeObserverDate')).split('=')[1];
    }
    _readSpentTime() {
      if (document.cookie.split('; ').find(row => row.startsWith('youtubeObserverTime')) === undefined) { return; }
      return document.cookie.split('; ').find(row => row.startsWith('youtubeObserverTime')).split('=')[1];
    }
    _updateTime() {
      if (this.isLeft) { return; }
      this._spentTime += 1;
    }
    _mustNotify() {
      return this.limit < this._spentTime;
    }
    _notify() {
      let inputResult = confirm("時間になりました！\n即座にリセットしてやめるならOK\nスヌーズするならキャンセル");
      if (inputResult) {
        alert("ちゃんと閉じよう！");
        clearInterval(this.intervalId);
        return;
      }
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
