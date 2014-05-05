var pages = [
    "01introduction.html",
    "02a_few_2d_primitives.html",
    "03transformations.html",
    "04distance_operations.html",
    "05distance_deformations.html",
    "06raymarching_in_3d.html",
    "07adding_light.html"
];

var pageTitles = [
    "Introduction to rendering with distance functions",
    "A few 2D primitives",
    "2D transformations",
    "2D distance operations",
    "2D distance deformations",
    "Raymarching in 3D",
    "Adding light"
];

function insertNavigator(){
    var loc = location.href.toString();
    var filename = loc.substring(loc.lastIndexOf('/')+1);
    var index = pages.indexOf(filename);
    if (index==0){
        document.write("<button class='yui3-button' onclick='document.location.href=\"index.html\";'>Index &lt;</button>");
    }
    if (index>0){
        document.write("<button class='yui3-button' onclick='document.location.href=\""+pages[index-1]+"\";'>"+pageTitles[index-1]+" &lt;</button>");
    }
    if (index < pages.length-1){
        document.write("<button class='yui3-button' onclick='document.location.href=\""+pages[index+1]+"\";'>&gt; "+pageTitles[index+1]+"</button>");
    }
}

// from http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
function hasWebGLSupport(){
    if (!window.WebGLRenderingContext) {
        // Browser has no idea what WebGL is. Suggest they
        // get a new browser by presenting the user with link to
        // http://get.webgl.org
        return false;
    }
    document.write("<canvas id='webgl-test' width='1' height='1'></canvas>");
    var canvas = document.getElementById('webgl-test');
    var gl = canvas.getContext("webgl");
    if (!gl) {
        // Browser could not initialize WebGL. User probably needs to
        // update their drivers or get a new browser. Present a link to
        // http://get.webgl.org/troubleshooting
        return false;
    }
    return true;
}

function insertPageTitle(){
    document.write("<h1>Rendering with distance functions</h1>");

    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") == -1 && userAgent.indexOf("Firefox")==-1){
        document.write("<p class='warning'>Please use Google Chrome or Mozilla Firefox as webbrowser. Code examples may not run as intended in your browser.</p>");
    }
    if (!hasWebGLSupport()) {
        document.write("<p class='warning'>Your browser does not seem to support WebGL. Try upgrading your webbrowser and/or your graphics card driver.</p>");
    }
    var loc = location.href.toString();
    var filename = loc.substring(loc.lastIndexOf('/')+1);
    var index = pages.indexOf(filename);
    if (index>=0){
        document.write('<h2>'+pageTitles[index]+'</h2>');
    }
}

function insertMenu(){
    document.write("<ul>");
    for (var i=0;i<pages.length;i++){
        document.write('<li><a href="'+pages[i]+'">'+pageTitles[i]+'</a></li>');
    }
    document.write("</ul>");
}