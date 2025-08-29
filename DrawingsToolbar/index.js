import { demo } from "./utils.js";
demo().addEventListener("click", showDrawingsToolbar);

let parentDiv = document.getElementById("tsrchart");

function showDrawingsToolbar(e) {

    let prevToolbar = document.getElementById("drawingsToolbar");
    if (prevToolbar != null && prevToolbar.isConnected) {
        document.getElementById("drawingsToolbar").remove();
    }

    document.body.appendChild(createToolbar());
}

function createToolbar() {
    let toolbar = document.createElement("div");

    toolbar.id = "drawingsToolbar";
    toolbar.classList.add("ch_toolbar");

    let dragger = document.createElement("div");
    dragger.innerHTML = `
        <svg viewBox="0 0 6 12" fill="currentColor" stroke="none" stroke-width="1" height="20" width="20">
            <path fill-rule="evenodd" d="M0 0h2v2H0V0zm4 0h2v2H4V0zM0 5h2v2H0V5zm4 0h2v2H4V5zm-4 5h2v2H0v-2zm4 0h2v2H4v-2z"></path>
            <title></title>
        </svg>
    `;

    dragger.classList.add("ch_toolbarBox");

    document.onmousedown = function (e) {
        if (!toolbar.contains(e.target)) {
            toolbar.remove();
        }
    };
    dragger.onmousedown = mousedown;
    dragger.style.cursor = "grab";

    let x1, y1, x2, y2;

    function mousedown(e) {
        e.preventDefault();

        x1 = e.clientX;
        y1 = e.clientY;

        document.onmouseup = mouseup;
        document.body.onmousemove = moveToolbar;
    }

    function moveToolbar(e) {
        e.preventDefault();

        x2 = x1 - e.clientX;
        y2 = y1 - e.clientY;

        let boundingRect = parentDiv.getBoundingClientRect();

        dragger.style.cursor = "grabbing";
        let leftBound = boundingRect.left + dragger.offsetWidth;
        let rightBound = boundingRect.right - toolbar.offsetWidth;

        if (e.clientX > leftBound && e.clientX < rightBound) {
            let offsetLeft = (toolbar.offsetLeft - x2) < 0 ? 0 : (toolbar.offsetLeft - x2);
            toolbar.style.left = offsetLeft + 'px';
        }

        let topBound = boundingRect.top + toolbar.offsetHeight;
        let bottomBound = boundingRect.bottom - toolbar.offsetHeight;

        if (e.clientY > topBound && e.clientY < bottomBound) {
            let offsetTop = (toolbar.offsetTop - y2) < 0 ? 0 : (toolbar.offsetTop - y2);
            toolbar.style.top = offsetTop + 'px';
        }

        x1 = e.clientX;
        y1 = e.clientY;
    }

    function mouseup(e) {

        dragger.style.cursor = "grab";

        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.body.onmousemove = null;
    }

    toolbar.appendChild(dragger);
    let toolboxDivider = document.createElement("div");
    toolboxDivider.style.borderLeft = "1px solid lightgray";
    toolboxDivider.style.marginLeft = "3px";
    toolboxDivider.style.marginRight = "3px";
    toolbar.appendChild(toolboxDivider);
    toolbar.appendChild(getToolContainer());

    return toolbar;
}

function getToolContainer() {

    let toolsContainer = document.createElement("div");
    toolsContainer.style.display = "flex";

    let editBtn = document.createElement("button");
    editBtn.innerHTML = `<i class="fa-solid fa-pencil" style="font-size: 16px"></i>`;

    let colorPicker = document.createElement("div");
    colorPicker.innerHTML = `<span class="fa fa-chevron-down"></span>`;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"  style="font-size: 16px"></i>`;


    let lineThickness = document.createElement("button");
    lineThickness.innerHTML = `
    <div style="display: flex; align-items: center;">
        <svg height="20" width="40" background-color="white">  <line x1="0" y1="10" x2="250" y2="10" style="stroke:black;stroke-width:1.5"></line> </svg>
        <span class="fa fa-chevron-down"></span>
    </div>
    `;

    // createToolBox(toolsContainer, colorPicker);
    createToolBox(toolsContainer, lineThickness);
    createToolBox(toolsContainer, deleteBtn);
    createToolBox(toolsContainer, editBtn);

    return toolsContainer;
}

function createToolBox(toolsContainer, ele) {
    let div = document.createElement("div");
    div.classList.add("ch_toolbarBox");
    div.appendChild(ele);

    toolsContainer.appendChild(div);
}

