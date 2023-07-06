const kDebugMode = true;
const SHOW_MOUSE_COORDS_ON_CLICK = kDebugMode && true;
const SHOW_VIEW_COORDS_ON_CLICK = kDebugMode && true;

/* URL RESOLVERS */
const scenesPath = `./assets/scenes`;

/* URL PARAMS */
const urlParams = new URLSearchParams(window.location.search);
const firstScene = urlParams.get('firstScene');
const useDoubleEncodeForFileNames = urlParams.get('useDoubleEncodeForFileNames') === 'true';
// example: 1920x1080
const windowSize = urlParams.get('windowSize');

function resolveHostUrl(subUrl) {
    return `./${subUrl}`;
}

function getJsonFileUrl() {
    return `./config.json`;
}

/* WINDOW */
function getWindowSize() {
    // use windowWidth and windowHeight if they are set
    if (windowSize) {
        const [width, height] = windowSize.split('x');
        return { width, height };
    }
    const height = window.innerHeight;
    const width = window.innerWidth;
    return { width, height };
}

function onResize() {
    const panorama = document.getElementById('panorama');
    const { width, height } = getWindowSize();
    panorama.style.height = height + 'px';
    panorama.style.width = width + 'px';
}


/* JSON */
function loadJsonFromUrl(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        console.error("Error loading JSON from url: " + url);
        return null;
    }
}

/* HOTSPOTS */
function createGoogleIcon(parent, iconName) {
    var icon = document.createElement('span');
    icon.className = "material-symbols-outlined";
    icon.innerHTML = iconName;
    icon.style.color = "#fff";
    icon.style.width = icon.scrollWidth - 20 + 'px';
    icon.style.marginLeft = -(icon.scrollWidth - parent.offsetWidth) / 2 + 'px';
    icon.style.marginTop = -icon.scrollHeight - 12 + 'px';
    //text align center
    icon.style.textAlign = "center";
    return icon;
}

function createText(text) {
    const textDiv = document.createElement('div');
    textDiv.classList.add('custom-info-hotspot');
    textDiv.innerHTML = text;
    return textDiv;
}

function getImage(imageName, type) {
    path = type == 'info' ? 'info' : 'scenes';
    if (!useDoubleEncodeForFileNames) {
        return resolveHostUrl(`assets/board/${imageName}.png`);
    }
    const imageNameEconded = encodeURIComponent(encodeURIComponent(imageName));
    console.log(resolveHostUrl(`assets/board/${imageNameEconded}.png`));
    return resolveHostUrl(`assets/board/${imageNameEconded}.png`);
}


function createHotSpots(config) {
    if (firstScene) {
        config.default.firstScene = firstScene;
    }
    config.default.basePath = `${scenesPath}/`;
    for (const scene in config.scenes) {
        for (const _hotspot in config.scenes[scene].hotSpots) {
            const hotspot = config.scenes[scene].hotSpots[_hotspot];
            if (hotspot.type == "scene") {
                hotspot.cssClass = "custom-hotspot";
                hotspot.createTooltipFunc = sceneHotspot;
            } else {
                hotspot.cssClass = "custom-tooltip";
                hotspot.createTooltipFunc = infoHotspot;
            }
        }
    }
}

/* DEBUG */
function debugs(viewer) {
    if (!SHOW_MOUSE_COORDS_ON_CLICK && !SHOW_VIEW_COORDS_ON_CLICK) {
        return;
    }
    viewer.on('mousedown', function (event) {
        const viewPitch = viewer.getPitch();
        const viewYaw = viewer.getYaw();
        console.log(`[view  coords] - "pitch": ${viewPitch}, "yaw": ${viewYaw},`);
        if (SHOW_MOUSE_COORDS_ON_CLICK) {
            const viewPitch = viewer.getPitch();
            const viewYaw = viewer.getYaw();
            console.log(`[view  coords] - "pitch": ${viewPitch}, "yaw": ${viewYaw},`);
            const coords = viewer.mouseEventToCoords(event);
            const mousePitch = coords[0];
            const mouseYaw = coords[1];
            console.log(`[mouse coords] - "pitch": ${mousePitch}, "yaw": ${mouseYaw},`);
        }
    });

}


/* INIT */
function init() {
    const jsonFileUrl = getJsonFileUrl();
    const config = loadJsonFromUrl(jsonFileUrl);
    createHotSpots(config);
    const viewer = pannellum.viewer('panorama', config);
    //window.addEventListener('resize', onResize);
    viewer.on('scenechange', () => {
        viewer.setHfov(120);
    });
    viewer.setHfov(100);
    debugs(viewer);
    // wait half second to show the panorama
    setTimeout(() => {
        viewer.setHfov(120);
    }, 50);
}

init();