class Block {
  constructor(params) {
    this.siteSize = params.siteSize;
    this.arr = params.arr;
    this.BLOCK_SIZE = params.BLOCK_SIZE;
    this.curLeft = params.curLeft;
    this.curTop = params.curTop;
    this.movtion = 20;
  }
  init() {
    this.checkArrWith1(this.arr, this.draw);
    let activeModel = document.querySelectorAll(".activityModel");
    const fallDown = setTimeout(
      function loop() {
        let { canMoveDown } = this.canMove(this.arr);
        if (canMoveDown) {
          for (let v of activeModel) {
            v.style.top = `${parseInt(v.style.top) + this.BLOCK_SIZE}px`;
          }
          this.curTop++;
          setTimeout(loop.bind(this), 600);
        } else {
          for (let i = 0; i <= activeModel.length - 1; i++) {
            activeModel[i].className = "inactiveModel";
          }
          init();
          clearTimeout(fallDown);
        }
      }.bind(this),
      600
    );
  }
  /**
   * 判断二维数组为1的下标
   * @param arr 需要判断的数组矩阵
   * @param callback
   */
  checkArrWith1(arr, callback) {
    for (let i = 0; i <= arr.length - 1; i++) {
      for (let j = 0; j <= arr.length - 1; j++) {
        if (arr[i][j] === 1) {
          callback.call(this, i + this.curTop, j + this.curLeft);
        }
      }
    }
  }
  /**
   * 根据数组矩阵画出当前方块
   * @param i
   * @param j
   */
  draw(i, j) {
    let activeModel = document.createElement("div");
    activeModel.className = "activityModel";
    //控制方块出现在画布顶端中间
    activeModel.style.top = `${i * this.BLOCK_SIZE}px`;
    activeModel.style.left = `${j * this.BLOCK_SIZE}px`;
    //添加方块
    document.body.appendChild(activeModel);
  }
  /**
   * 数组矩阵顺时针旋转
   * @param arr 需要旋转的数组矩阵
   * @returns {{newArr: Array, lefts: Array, tops: Array}} 返回旋转后的数组矩阵&左偏移量&上偏移量
   */
  clockwise(arr) {
    let newArr = [];
    for (let i = 0; i <= arr.length - 1; i++) {
      let temArr = [];
      for (let j = arr.length - 1; j >= 0; j--) {
        temArr.push(arr[j][i]);
      }
      newArr.push(temArr);
    }
    let lefts = [],
      tops = [];
    this.checkArrWith1(newArr, function(i, j) {
      lefts.push(j * this.BLOCK_SIZE);
      tops.push(i * this.BLOCK_SIZE);
    });
    return {
      newArr: newArr,
      lefts: lefts,
      tops: tops
    };
  }

  move() {
    document.onkeydown = e => {
      let activeModel = document.querySelectorAll(".activityModel");
      const key = e.keyCode;
      const {
        canMoveRight,
        canMoveLeft,
        canMoveTop,
        canMoveDown
      } = this.canMove(this.arr);
      switch (key) {
        case 37:
          // left
          if (!canMoveLeft) return;
          for (let v of activeModel) {
            v.style.left = `${parseInt(v.style.left) - 20}px`;
          }
          this.curLeft--;
          break;
        case 38:
          // up
          let { newArr, lefts, tops } = this.clockwise(this.arr);
          this.arr = newArr;
          for (let i in lefts) {
            activeModel[i].style.left = `${lefts[i]}px`;
            activeModel[i].style.top = `${tops[i]}px`;
          }
          break;
        case 39:
          // right
          if (!canMoveRight) return;
          for (let v of activeModel) {
            v.style.left = `${parseInt(v.style.left) + 20}px`;
          }
          this.curLeft++;
          break;
        case 40:
          // down
          if (!canMoveDown) return;
          for (let v of activeModel) {
            v.style.top = `${parseInt(v.style.top) + 20}px`;
          }
          this.curTop++;
          break;
        default:
          break;
      }
    };
  }
  /**
   * 判断是否可以移动
   * @param arr 需要判断的矩阵数组
   *  @param deform 是否需要形变
   * @returns {{canMoveRight: boolean, canMoveLeft: boolean, canMoveTop: boolean, canMoveDown: boolean}}
   */
  canMove(
    arr,
    deform = false,
    move = {
      canMoveRight: true,
      canMoveDown: true,
      canMoveLeft: true
    }
  ) {
    this.checkArrWith1(arr, function(i, j) {
      let { highest, leftmost, rightmost } = this.getInterval(
        j * this.BLOCK_SIZE,
        i * this.BLOCK_SIZE
      );
      //   if (deform) {
      //     if (this.BLOCK_SIZE * (j + 1) > rightmost) {
      //       move.canMoveRight = false;
      //     }
      //     if (this.BLOCK_SIZE * (i + 1) > highest) {
      //       move.canMoveDown = false;
      //     }
      //     if (this.BLOCK_SIZE * (j - 1) < leftmost) {
      //       move.canMoveLeft = false;
      //     }
      //   } else {
      if (this.BLOCK_SIZE * (j + 1) >= rightmost) {
        move.canMoveRight = false;
      }
      if (this.BLOCK_SIZE * (i + 1) >= highest) {
        move.canMoveDown = false;
      }
      if (this.BLOCK_SIZE * (j - 1) <= leftmost) {
        move.canMoveLeft = false;
      }
      //   }
    });
    return move;
  }

  /**
   * 获取当前方块能到达的边界
   * @param curLeft 当前方块left
   * @param curTop 当前方块top
   * @returns {*} 返回左右下边界
   */
  getInterval(curLeft, curTop) {
    let inactiveModel = document.querySelectorAll(".inactiveModel"),
      highest = null,
      leftmost = null,
      rightmost = null;
    if (inactiveModel.length === 0) {
      highest = this.siteSize.top + this.siteSize.height;
      leftmost = this.siteSize.left - this.BLOCK_SIZE;
      rightmost = this.siteSize.left + this.siteSize.width;
    } else {
      let tops = [],
        lefts = [],
        rights = [];
      for (let v of inactiveModel) {
        let left = parseInt(v.style.left);
        let top = parseInt(v.style.top);
        if (left === curLeft) {
          tops.push(top);
        }
        if (top === curTop) {
          if (left < curLeft) {
            lefts.push(left);
          } else if (left > curLeft) {
            rights.push(left);
          }
        }
      }
      if (tops.length === 0) {
        highest = this.siteSize.top + this.siteSize.height;
      } else {
        highest = Math.min(...tops);
      }
      if (lefts.length === 0) {
        leftmost = this.siteSize.left - this.BLOCK_SIZE;
      } else {
        leftmost = Math.max(...lefts);
      }
      if (rights.length === 0) {
        rightmost = this.siteSize.left + this.siteSize.width;
      } else {
        rightmost = Math.min(...rights);
      }
    }
    return {
      highest: highest,
      leftmost: leftmost,
      rightmost: rightmost
    };
  }
}

const init = () => {
  const params = {
    arr: __arr__,
    siteSize: __siteSize__,
    BLOCK_SIZE: __BLOCK_SIZE__,
    curLeft: __curLeft__,
    curTop: __curTop__
  };
  let block = new Block(params);
  block.init();
  block.move();
};

window.onload = () => {
  //获取画布大小&位置
  let site = document.querySelector(".site");
  let { width, height, left, top } = window.getComputedStyle(site);
  let siteSize = {
    width: parseInt(width),
    height: parseInt(height),
    left: parseInt(left),
    top: parseInt(top)
  };
  //方块矩阵数组
  const arr = [[1, 0], [1, 0], [1, 1]];
  //方块大小
  const BLOCK_SIZE = 20;
  //俄罗斯方块初始位置
  let curLeft = parseInt((siteSize.left + siteSize.width / 2) / BLOCK_SIZE);
  let curTop = parseInt(siteSize.top / BLOCK_SIZE);
  window.__arr__ = arr;
  window.__siteSize__ = siteSize;
  window.__BLOCK_SIZE__ = BLOCK_SIZE;
  window.__curLeft__ = curLeft;
  window.__curTop__ = curTop;
  init();
};
