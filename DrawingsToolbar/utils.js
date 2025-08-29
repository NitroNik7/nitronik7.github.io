
export const demo = function demo() {

    const svg = d3.select("#tsrchart")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);

    const path = d3.path();
    path.moveTo(10, 10);
    path.lineTo(500, 300);

    svg.append("g")
        .attr("id", "line")
        .append("path")
        .attr("d", path)
        .attr("style", "stroke: green; stroke-width: 2");

        return document.getElementById("line");

}