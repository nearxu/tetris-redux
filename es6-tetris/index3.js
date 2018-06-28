class Block {
  constructor(params) {
    this.siteSize = params.siteSize;
    this.arr = params.arr;
    this.BLOCK_SIZE = params.BLOCK_SIZE;
    this.movtion = 20;
  }
  init() {
    // let activeModel = document.createElement("div");
    // activeModel.className = "activityModel";
    // activeModel.style.top = `${this.siteSize.top}px`;
    // activeModel.style.left = `${this.siteSize.left +
    //   this.siteSize.width / 2}px`;
    // document.body.appendChild(activeModel);
    this.checkArrWith1(this.arr, this.draw);
  }
  /**
   * 判断二维数组为1的下标
   * @param arr 需要判断的数组矩阵
   * @param callback
   */
  checkArrWith1(arr, callback) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1; j++) {
        if (arr[i][j] === 1) {
          callback.call(this, i, j);
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
    activeModel.style.top = `${this.siteSize.top + i * this.BLOCK_SIZE}px`;
    activeModel.style.left = `${this.siteSize.left +
      this.siteSize.width / 2 +
      j * this.BLOCK_SIZE}px`;
    //添加方块
    document.body.appendChild(activeModel);
  }

  move() {
    document.onkeydown = e => {
      let activeModel = document.querySelector(".activityModel");
      let left = parseInt(activeModel.style.left)
        ? parseInt(activeModel.style.left)
        : 0;
      let top = parseInt(activeModel.style.top)
        ? parseInt(activeModel.style.top)
        : 0;
      const key = e.keyCode;
      const {
        canMoveRight,
        canMoveLeft,
        canMoveTop,
        canMoveDown
      } = this.canMove();
      switch (key) {
        case 37:
          // left
          if (!canMoveLeft) return;
          activeModel.style.left = `${left - this.movtion}px`;
          break;
        case 38:
          // up
          if (!canMoveTop) return;
          activeModel.style.top = `${top - this.movtion}px`;
          break;
        case 39:
          // right
          if (!canMoveRight) return;
          activeModel.style.left = `${left + this.movtion}px`;
          break;
        case 40:
          // down
          if (!canMoveDown) return;
          activeModel.style.top = `${top + this.movtion}px`;
          break;
        default:
          break;
      }
    };
  }
  /**
   * 判断是否可以移动
   * @returns {{canMoveRight: boolean, canMoveLeft: boolean, canMoveTop: boolean, canMoveDown: boolean}}
   */
  canMove() {
    let activeModel = document.querySelector(".activityModel");
    let top = parseInt(activeModel.style.top);
    let left = parseInt(activeModel.style.left);
    let canMoveRight = true,
      canMoveTop = true,
      canMoveDown = true,
      canMoveLeft = true;
    if (left + 20 >= this.siteSize.left + this.siteSize.width) {
      canMoveRight = false;
    }
    if (left - 20 < this.siteSize.left) {
      canMoveLeft = false;
    }
    if (top + 20 >= this.siteSize.top + this.siteSize.height) {
      canMoveDown = false;
    }
    if (top - 20 < this.siteSize.top) {
      canMoveTop = false;
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
  //传入Block的变量
  const params = {
    arr: arr,
    siteSize: siteSize,
    BLOCK_SIZE: BLOCK_SIZE
  };
  let block = new Block(params);
  block.init();
  block.move();
};
