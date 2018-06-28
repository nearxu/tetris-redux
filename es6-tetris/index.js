class Block {
  constructor() {
    this.movtion = 20;
  }
  init() {
    let activeModel = document.createElement("div");
    activeModel.className = "activityModel";
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
      switch (key) {
        case 37:
          // left
          activeModel.style.left = `${left - this.movtion}px`;
          break;
        case 38:
          // up
          activeModel.style.top = `${top - this.movtion}px`;
          break;
        case 39:
          // right
          activeModel.style.left = `${left + this.movtion}px`;
          break;
        case 40:
          // down
          activeModel.style.top = `${top + this.movtion}px`;
          break;
        default:
          break;
      }
    };
  }
}

window.onload = () => {
  let block = new Block();
  block.init();
  block.move();
};
