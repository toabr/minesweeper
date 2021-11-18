// Tile Object
// ================================================

export default function Tile(x, y, clickHandler) {
  this.x = x;
  this.y = y;
  this.danger = 0;
  this.bomb = false;
  this.flag = false;
  this.revealed = false;
  this.clickHandler = clickHandler

  var btn = document.createElement('div');
  btn.className = 'btn btn-tile';
  btn.dataset.x = this.x
  btn.dataset.y = this.y
  btn.addEventListener('click', this, false);
  var icon = document.createElement('span');
  // icon.className = 'glyphicon glyphicon-plus';
  icon.innerHTML = '';
  this.icon = icon;
  this.btn = btn;
  this.btn.appendChild(this.icon);

  this.addEvents();
}

Tile.prototype.addEvents = function () {
  this.btn.addEventListener('click', this);
}

Tile.prototype.removeEvents = function () {
  this.btn.removeEventListener('click', this);
}

Tile.prototype.handleEvent = function(e) {
  switch (e.type) {
    case 'click': this.clickHandler();
  }
}

Tile.prototype.setBomb = function() {
  this.bomb = true;
}

Tile.prototype.addDanger = function() {
  this.danger++;
}

Tile.prototype.toggleFlag = function() {
  this.flag = !this.flag;
  this.btn.classList.toggle('btn-tile');
  this.btn.classList.toggle('btn-flag-active');
}

Tile.prototype.render = function() {
  // console.log('render ' + this.x + ':' + this.y);
  this.revealed = true;
  this.removeEvents();
  if(this.bomb) {
    this.btn.className = 'btn btn-bomb';
  }else {
    this.btn.className = 'btn btn-revealed';
    this.icon.className = '';
    this.icon.innerHTML = this.danger;
  }
}

Tile.prototype.blink = function() {
  this.btn.classList.add('blinking');
}
