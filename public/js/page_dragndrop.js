var circles = document.querySelectorAll('.dragdrop');
  for(var i=0;i<circles.length;i++){
  circles[i].addEventListener('dragstart', startDrag, false);
  circles[i].addEventListener('dragend', endDrag, false);
}

function startDrag(event) {
  this.style.border = '5px solid blue';
  event.dataTransfer.setData("text", this.id);
  
}
function endDrag(event) {
  this.style.border = '';
}

function dropit(event){
  //debugger;
  event.preventDefault();
  //inside my mouse events handler: http://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
  var anOffsetX = (event.offsetX !== undefined) ? event.offsetX : (event.layerX - event.target.offsetLeft);
  var anOffsetY = (event.offsetY !== undefined) ? event.offsetY : (event.layerY - event.target.offsetTop);
  var myElement = document.querySelector('#'
    + event.dataTransfer.getData('text'));
  this.appendChild(myElement, false);
  myElement.style.left = anOffsetX + 'px';
  myElement.style.top = anOffsetY + 'px';
};

var dragTarg = document.querySelector('.dragTarg');
dragTarg.addEventListener('dragenter', function(e){
  this.style.border = '3px #aaa dashed'});
dragTarg.addEventListener('dragleave', function(e){
  this.style.border = '3px solid black'});
dragTarg.addEventListener('dragover', function(e){
  e.preventDefault();
});
dragTarg.addEventListener('drop', dropit, false);
