import * as path from "path";
import * as fs from "fs";

const WIN_PATHS = [
	"C:\\SDL\\SDL2*\\x86_64*\\bin\\SDL2.dll",
	"C:\\SDL2*\\x86_64*\\bin\\SDL2.dll",
	".\\SDL2*\\x86_64*\\bin\\SDL2.dll",
	".\\SDL2.dll"
];

const LINUX_PATHS = [
	""
]

export function getSDL2Lib() {
	let paths: string[];
	if (process.platform === "win32") paths = WIN_PATHS;
	else if (process.platform === "linux") /*paths = LINUX_PATHS;*/ throw "Not fully implemented"
	else throw "The system is not supported now";

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

	throw "Missing dependencies: " +
		process.platform === "win32" ?
		"make sure you have installed SDL2.dll in C:\\SDL\\SDL2*\\x86_64-w64-mingw32\\bin" :
		"make sure to have installed SDL2 library";
}

function containsDir(ls: string[], dirname: string) {
	let rege = new RegExp(dirname.replace("*", ".*"));
	for (let s of ls) {
		if (rege.test(s)) return s;
	}
	return "";
}