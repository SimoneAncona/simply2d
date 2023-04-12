import * as path from "path";
import * as fs from "fs";
var SDL2_WIN_PATHS = [
    "C:\\SDL\\SDL2*\\x86_64*\\bin\\SDL2.dll",
    "C:\\SDL2*\\x86_64*\\bin\\SDL2.dll",
    ".\\SDL2*\\x86_64*\\bin\\SDL2.dll",
    ".\\SDL2.dll"
];
var SDL2_IMAGE_WIN_PATHS = [
    "C:\\SDL_Image\\SDL2_image*\\x86_64*\\bin\\SDL2_image.dll",
    "C:\\SDL2_image*\\x86_64*\\bin\\SDL2_image.dll",
    ".\\SDL2_Image*\\x86_64*\\bin\\SDL2_image.dll",
    ".\\SDL2_image.dll",
    "C:\\SDL_image\\SDL2_image*\\x86_64*\\bin\\SDL2_image.dll",
];
var SDL2_LINUX_PATHS = [
    ""
];
var SDL2_IMAGE_LINUX_PATHS = [
    ""
];
function getLib(paths) {
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var p = paths_1[_i];
        var splittedPath = p.split(path.sep);
        var currenPath = splittedPath[0] + path.sep;
        for (var i = 1; i < splittedPath.length; i++) {
            var dirn = containsDir(fs.readdirSync(currenPath), splittedPath[i]);
            if (dirn != "") {
                if (i === splittedPath.length - 1)
                    return currenPath + dirn;
                currenPath += dirn + path.sep;
                continue;
            }
            break;
        }
    }
    return "";
}
export function getSDL2Lib() {
    var paths;
    if (process.platform === "win32")
        paths = SDL2_WIN_PATHS;
    else if (process.platform === "linux")
        throw "Not fully implemented for linux";
    else
        throw "The system is not supported now";
    var p = getLib(paths);
    if (p === "")
        throw "Missing dependencies: " + (process.platform === "win32" ?
            "make sure you have installed SDL2.dll in C:\\SDL\\SDL2*\\x86_64-w64-mingw32\\bin" :
            "make sure to have installed SDL2 library");
    return p;
}
export function getSDL2ImageLib() {
    var paths;
    if (process.platform === "win32")
        paths = SDL2_IMAGE_WIN_PATHS;
    else if (process.platform === "linux")
        throw "Not fully implemented for linux";
    else
        throw "The system is not supported now";
    var p = getLib(paths);
    if (p === "")
        throw "Missing dependencies: " + (process.platform === "win32" ?
            "make sure you have installed SDL2_Image.dll in C:\\SDL_Image\\SDL2_image*\\x86_64-w64-mingw32\\bin" :
            "make sure to have installed SDL2_Image library");
    return p;
}
function containsDir(ls, dirname) {
    var rege = new RegExp(dirname.replace("*", ".*"));
    for (var _i = 0, ls_1 = ls; _i < ls_1.length; _i++) {
        var s = ls_1[_i];
        if (rege.test(s))
            return s;
    }
    return "";
}
