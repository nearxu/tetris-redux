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
  canMove(arr, deform = false) {
    let tops = [],
      lefts = [];
    this.checkArrWith1(arr, function(i, j) {
      tops.push(parseInt(i * this.BLOCK_SIZE));
      lefts.push(parseInt(j * this.BLOCK_SIZE));
    });
    let top = Math.min(...tops),
      left = Math.min(...lefts),
      right = Math.max(...lefts),
      down = Math.max(...tops);
    let canMoveRight = true,
      canMoveTop = true,
      canMoveDown = true,
      canMoveLeft = true;
    if (deform) {
      // if (top - 20 < this.siteSize.top) {
      //   canMoveTop = false;
      // }
      canMoveTop = false;
    }
    if (left + 20 >= this.siteSize.left + this.siteSize.width) {
      canMoveRight = false;
    }
    if (left - 20 < this.siteSize.left) {
      canMoveLeft = false;
    }
    if (top + 20 >= this.siteSize.top + this.siteSize.height) {
      canMoveDown = false;
    }
    return {
      canMoveRight,
      canMoveLeft,
      canMoveTop,
      canMoveDown
    };
  }
}

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

  //传入Block的变量
  const params = {
    arr: arr,
    siteSize: siteSize,
    BLOCK_SIZE: BLOCK_SIZE,
    curLeft: curLeft,
    curTop: curTop
  };
  let block = new Block(params);
  block.init();
  block.move();
};
