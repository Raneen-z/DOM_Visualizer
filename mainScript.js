let canvas = document.getElementById("tree");
let context = canvas.getContext("2d");
let body = document.querySelector("body");
var radius = 20;
var maxDepth = 0;
var nodes = []
var circle;
var currentTree;

const createTree = (node, parentNode, start, end, depth) => {
    if (depth > maxDepth) {
        maxDepth = depth;
    }
    var newNode = {
        DOMNode: node,
        parentNode: parentNode,
        children: [],
        start: start,
        end: end,
        depth: depth,
        x: 0,
        y: 0
    };
    var childDepth = depth + 1;
    var childCount = newNode.DOMNode.childElementCount;
    var width = (end - start) / childCount;
    var child;
    var childStart;
    for (let i = 0; i < childCount; i++) {
        childStart = start + i * width;
        child = createTree(
            node.children[i],
            newNode,
            childStart,
            childStart + width,
            childDepth
        );
        newNode.children.push(child);
    }
    return newNode;
};
const drawNodes = (node, height) => {

    var x = node.start + (node.end - node.start) / 2;
    var y = node.depth * height + 20;

    node.x = x
    node.y = y
    nodes.push(node)
    var tagName = node.DOMNode.tagName.toLowerCase();


    // draw line from parent to child
    node.children.forEach((child) => {
        var childX = child.start + (child.end - child.start) / 2;
        var childY = child.depth * height + 20;
        context.fillStyle = " BLACK";
        //context.fillText(child.DOMNode.innerHTML.trim(), childX, childY + 20);
        context.beginPath();
        context.moveTo(x, y + 20);
        context.lineTo(childX, childY - 20);
        context.stroke();
        context.closePath();
        drawNodes(child, height);
    });
    // draw cicle
    context.beginPath();
    // start angle = 0 end angle Math.PI * 2
    circle = new Path2D();
    circle.arc(x, y, radius, 0, Math.PI * 2, false);
    context.stroke(circle);
    context.font = "bold 13px Monaco";
    context.fillStyle = "#b5003c";
    context.fillText(tagName, x - 14, y);
    context.closePath();

    //draw rectangle for attribute 
    context.fillStyle = "grey"
    context.fillRect(x - radius - 15, y - radius - 10, 20, 20)
    context.fillStyle = "black"
    context.fillText("...", x - radius - 10, y - radius);
};
//initial depth 0 start with 0 and end: canvas.width start with body tag
var doc = createTree(body, null, 0, canvas.width, 0.2);
//var doc = createTree(body, 0, canvas.width);
currentTree = doc;
levelHeight = (canvas.height / 2) / (maxDepth + 1);
drawNodes(doc, levelHeight);


// ------- screenshot ----------
var snap = document.querySelector("#snap")
var linkDiv = document.querySelector("#img")
snap.addEventListener("click", () => {
    var dataURL = canvas.toDataURL();
    var temp = document.querySelector(".snapImg")
    var imgLink = null
    if (temp == null) {
        imgLink = document.createElement("a")
        imgLink.className = "snapImg"
    }
    else {
        imgLink = temp
    }
    imgLink.href = dataURL
    Canvas2Image.saveAsImage(canvas, canvas.width, canvas.height, "png", "canvas_screenshot");
    imgLink.innerText = "Image Link (open in it in new tap)"
    linkDiv.appendChild(imgLink)
})


// ------- canvas on click functions -------
function validHTML(element) {
    return document.createElement(element.toUpperCase()).toString() != "[object HTMLUnknownElement]";
}


canvas.addEventListener("click", (e) => {
    let pos = {
        x: e.clientX - canvas.getBoundingClientRect().left,
        y: e.clientY - canvas.getBoundingClientRect().top,
    };

    nodes.forEach(node => {
        if (Math.sqrt((pos.x - node.x) * (pos.x - node.x) + (pos.y - node.y) * (pos.y - node.y)) < 20) {
            var tag = prompt("Please enter a tag name", "div");
            tag = tag.trim()
            if (tag != null && validHTML(tag)) {
                var newTag = document.createElement(tag)
                node.DOMNode.appendChild(newTag)
                radius = 20;
                maxDepth = 0;
                nodes = []
                circle;
                currentTree;
                //initial depth 0 start with 0 and end: canvas.width start with body tag
                doc = createTree(body, null, 0, canvas.width, 0.2);
                //var doc = createTree(body, 0, canvas.width);
                currentTree = doc;
                levelHeight = (canvas.height / 2) / (maxDepth + 1);
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawNodes(doc, levelHeight);
            }

        }
    });

    for (let i = 0; i < nodes.length; i++) {
        let left = nodes[i].x - 20 - 15
        let top = nodes[i].y - 20 - 10
        let size = 20

        if (pos.y > top && pos.y < top + size
            && pos.x > left && pos.x < left + size) {
            let attributes = (nodes[i].DOMNode.attributes);
            let temp = ""
            for (var j = 0; j < attributes.length; j++) {
                var attribute = attributes[j];
                temp += attribute.name + " : " + attribute.value + "\n";
            }
            if (temp.length) {
                let htmlBox = document.querySelector("#htmlContent")
                htmlBox.style.display = "block"
                htmlBox.style.backgroundColor="black"
                htmlBox.innerText = `Node Attributes:\n\n${temp}`
                // context.font = "bold 12px Monaco";
                // context.fillText(temp, left, top, 300);
            }
            else {
                let htmlBox = document.querySelector("#htmlContent")
                htmlBox.style.display = "block"
                htmlBox.style.backgroundColor="black"
                htmlBox.innerText = "Node Attributes:\n\nNo attributes"
                // context.font = "bold 12px Monaco";
                // context.fillText("N/A", left, top, 300);
            }
            break;

        }

    }

})


// ------- on hover -------
canvas.addEventListener("mousemove", (e) => {
    let pos = {
        x: e.clientX - canvas.getBoundingClientRect().left,
        y: e.clientY - canvas.getBoundingClientRect().top,
    };


    let htmlBox = document.querySelector("#htmlContent")
    for (let i = 0; i < nodes.length; i++) {

        if (Math.sqrt((pos.x - nodes[i].x) * (pos.x - nodes[i].x) + (pos.y - nodes[i].y) * (pos.y - nodes[i].y)) < 20) {

            htmlBox.style.display = "block"
            htmlBox.style.backgroundColor="blue"
            htmlBox.innerText = nodes[i].DOMNode.outerHTML
            break
        }
        else {
            htmlBox.style.display = "none"
        }

    }

})

