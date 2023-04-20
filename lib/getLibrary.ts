import * as path from "path";
import * as fs from "fs";

const SDL2_WIN_PATHS = [
	"C:\\SDL\\SDL2*\\x86_64*\\bin\\SDL2.dll",
	"C:\\SDL2*\\x86_64*\\bin\\SDL2.dll",
	".\\SDL2*\\x86_64*\\bin\\SDL2.dll",
	".\\SDL2.dll"
];

const SDL2_IMAGE_WIN_PATHS = [
	"C:\\SDL_Image\\SDL2_image*\\x86_64*\\bin\\SDL2_image.dll",
	"C:\\SDL2_image*\\x86_64*\\bin\\SDL2_image.dll",
	".\\SDL2_Image*\\x86_64*\\bin\\SDL2_image.dll",
	".\\SDL2_image.dll",
	"C:\\SDL_image\\SDL2_image*\\x86_64*\\bin\\SDL2_image.dll",
]

const SDL2_LINUX_PATHS = [
	""
]

const SDL2_IMAGE_LINUX_PATHS = [
	""
]

function getLib(paths: string[]) {
	for (let p of paths) {
		let splittedPath = p.split(path.sep);
		let currenPath = splittedPath[0] + path.sep
		for (let i = 1; i < splittedPath.length; i++) {
			let dirn = containsDir(fs.readdirSync(currenPath), splittedPath[i])
			if (dirn != "") {
				if (i === splittedPath.length - 1) return currenPath + dirn;
				currenPath += dirn + path.sep;
				continue;
			}
			break;
		}
	}

	return "";

}

export function getSDL2Lib() {
	let paths: string[];
	if (process.platform === "win32") paths = SDL2_WIN_PATHS;
	else if (process.platform === "linux") /*paths = SDL2_LINUX_PATHS;*/ throw "Not fully implemented for linux"
	else throw "The system is not supported now";

	let p = getLib(paths);
	if (p === "") throw "Missing dependencies: " + (
		process.platform === "win32" ?
		"make sure you have installed SDL2.dll in C:\\SDL\\SDL2*\\x86_64-w64-mingw32\\bin" :
		"make sure to have installed SDL2 library");
	return p;
}

export function getSDL2ImageLib() {
	let paths: string[];
	if (process.platform === "win32") paths = SDL2_IMAGE_WIN_PATHS;
	else if (process.platform === "linux") /*paths = SDL2_IMAGE_LINUX_PATHS;*/ throw "Not fully implemented for linux"
	else throw "The system is not supported now";

	let p = getLib(paths);
	if (p === "") throw "Missing dependencies: " + (
		process.platform === "win32" ?
		"make sure you have installed SDL2_Image.dll in C:\\SDL_Image\\SDL2_image*\\x86_64-w64-mingw32\\bin" :
		"make sure to have installed SDL2_Image library");
	return p;
}

function containsDir(ls: string[], dirname: string) {
	let rege = new RegExp(dirname.replace("*", ".*"));
	for (let s of ls) {
		if (rege.test(s)) return s;
	}
	return "";
}