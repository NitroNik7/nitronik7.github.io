let chart = document.getElementById("tsrchart");


function showDrawingsToolbar(e) {
    // console.log(e);
    let prevToolbar = document.getElementById("drawingsToolbar");
    if (prevToolbar != null && prevToolbar.isConnected) {
        document.getElementById("drawingsToolbar").remove();
    }

    document.body.append(createToolbar());
}

function createToolbar() {
    let toolbar = document.createElement("div");

    toolbar.id = "drawingsToolbar";
    toolbar.style.display = "flex";
    toolbar.style.zIndex = "999";
    toolbar.style.position = "absolute";
    toolbar.style.top = "10vh";
    toolbar.style.left = "50vw";
    toolbar.style.backgroundColor = "white";
    toolbar.style.border = "1px solid lightgray";
    toolbar.style.borderRadius = "5px";
    toolbar.style.padding = "5px";
    toolbar.style.boxShadow = "0px 3px 5px 0px #888888"

    let dragDiv = document.createElement("div");
    dragDiv.innerHTML = `
        <svg viewBox="0 0 6 12" fill="currentColor" stroke="none" stroke-width="1" height="20" width="20">
            <path fill-rule="evenodd" d="M0 0h2v2H0V0zm4 0h2v2H4V0zM0 5h2v2H0V5zm4 0h2v2H4V5zm-4 5h2v2H0v-2zm4 0h2v2H4v-2z"></path>
            <title></title>
        </svg>
    `;

    dragDiv.onmousedown = dragToolbar;
    dragDiv.style.cursor = "grab";

    let x1, y1, x2, y2;

    function dragToolbar(e) {
        e.preventDefault();

        x1 = e.clientX;
        y1 = e.clientY;

        document.body.onmouseup = endDragToolbar;
        document.body.onmousemove = moveToolbar;
    }

    function moveToolbar(e) {
        e.preventDefault();

        x2 = x1 - e.clientX;
        y2 = y1 - e.clientY;


        dragDiv.style.cursor = "grabbing";
        if (e.clientX < chart.offsetWidth - toolbar.offsetWidth) {
            let offsetLeft = (toolbar.offsetLeft - x2) < 0 ? 0 : (toolbar.offsetLeft - x2);
            toolbar.style.left = offsetLeft + 'px';
        }

        if (e.clientY < chart.offsetHeight - toolbar.offsetHeight) {
            let offsetTop = (toolbar.offsetTop - y2) < 0 ? 0 : (toolbar.offsetTop - y2);
            toolbar.style.top = offsetTop + 'px';
        }


        x1 = e.clientX;
        y1 = e.clientY;
    }

    function endDragToolbar(e) {
        dragDiv.style.cursor = "grab";
        // stop moving when mouse button is released:
        document.body.onmouseup = null;
        document.body.onmousemove = null;
    }

    toolbar.appendChild(dragDiv);


    let toolbarContent = document.createElement("div");
    toolbarContent.style.backgroundColor = "white";
    toolbarContent.style.display = "flex";

    let colorPicker = document.createElement("div");
    colorPicker.innerHTML = `<span class="fa  fa-chevron-down"></span>`;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    toolbarContent.appendChild(colorPicker);
    toolbarContent.appendChild(deleteBtn);
    toolbar.appendChild(toolbarContent);

    return toolbar;
}