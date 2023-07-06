function sceneHotspot(hotSpotDiv, args) { infoHotspot(hotSpotDiv, args); }

function infoHotspot(hotSpotDiv, args) {
    const img = document.createElement('img');
    img.src = getImage(args.text, 'info');
    img.style.width = "100%";
    img.style.height = "100%";
    //sixe of 200px
    img.style.width = "200px";
    hotSpotDiv.appendChild(img);
    _hotspot_pos_fix(hotSpotDiv);
}

function _hotspot_pos_fix(hotSpotDiv) {
    hotSpotDiv.style.top = "-5.5vh";
}
