var module = {};
function require(pModule)
{
    console.log("[Require]: " + pModule);
    var parts = pModule.split("/")
    return window[parts[parts.length-1].split(".")[0]];  
};