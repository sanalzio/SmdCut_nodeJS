let Reset = "\x1b[0m", Bright = "\x1b[1m", Dim = "\x1b[2m", Underscore = "\x1b[4m", Blink = "\x1b[5m", Reverse = "\x1b[7m", Hidden = "\x1b[8m", Black = "\x1b[30m", Red = "\x1b[31m", Green = "\x1b[32m", Yellow = "\x1b[33m", Blue = "\x1b[34m", Magenta = "\x1b[35m", Cyan = "\x1b[36m", White = "\x1b[37m", Gray = "\x1b[90m", BrightYellow = "\x1b[93m", BrightBlue = "\x1b[94m", BrightMagenta = "\x1b[95m", BgBlack = "\x1b[40m", BgRed = "\x1b[41m", BgGreen = "\x1b[42m", BgYellow = "\x1b[43m", BgBlue = "\x1b[44m", BgMagenta = "\x1b[45m", BgCyan = "\x1b[46m", BgWhite = "\x1b[47m", BgGray = "\x1b[100m";
const argv = process.argv;
const prompt = require("prompt-sync")();
const fs = require('fs');
const path = require('path');
/* const dialog = require('node-file-dialog')
const filedgcfg={type:'open-files'} */
process.stdout.write(String.fromCharCode(27) + "]0;" + "Smdcut for goldsrc" + String.fromCharCode(7));

let files = [];

console.log(Yellow + "\n\n                                 SmdCut" + Reset);
console.log("    Utility for cuting .SMD files to bypass GoldSrc engine's limits.\n");

if (argv.length<3) {
    /* let filenames;
    dialog(filedgcfg)
        .then(dir => {filenames = dir;})
        .catch(err => {console.log(err);process.exit(1);})
    for (let fi = 0; fi < filenames.length; fi++) {
        const file = filenames[fi];
        files.push(file);
    } */
    console.log(Green+"    Usage"+Reset+": smdcut.exe <file1> <file2> <file3> ...");
    console.log("    Or you can simply drag and drop the files you want to cut into "+Green+"smdcut.exe"+Reset+".\n\n");
    prompt(Magenta + "Press ENTER to exit." + Reset);
    exit(1);
} else if (argv[1].toLowerCase()=="help" || argv[1]=="?") {
    console.log(Green+"    Usage"+Reset+": smdcut.exe <file1> <file2> <file3> ...");
    console.log("    Or you can simply drag and drop the files you want to cut into "+Green+"smdcut.exe"+Reset+".\n\n");
    exit(0);
} else {
    for (let fi = 0; fi < argv.slice(2).length; fi++) {
        const file = argv.slice(2)[fi];
        files.push(file);
    }
}

console.log(Yellow + "INFO" + Reset + ": GoldSrc supports a maximum of 4080 triangles!\n");
var max_triangles = prompt("How many triangles should a file have at most? (3000 recommending)  "+ Green);
if (max_triangles=="") {max_triangles = 3000}
else {max_triangles = Number(max_triangles);}
console.log(Reset)

function cut(filename, total, thiss) {
    let ismesh=false;
    let refcon = fs.readFileSync(filename,{ encoding: 'utf8', flag: 'r' }).split("\n");
    let pref = [];
    let suffix = "end\n";

    for (let li = 0; li < refcon.length; li++) {
        const l = refcon[li];
        if(l.includes("triangles")){
            ismesh=true;
            pref = refcon.slice(0, li).concat(["triangles\n"]);
            refcon = refcon.slice(li+1);
            refcon.pop();
            break;
        }
    }

    let num_triangles = Math.floor(refcon.length / 4)

    if (!ismesh){
        console.log('"'+Red+path.basename(filename)+Reset+`" is not a reference file. (${thiss.toString()}/${total.toString()})`);
        return;
    }
    else if (num_triangles<=max_triangles) {
        console.log(`"`+BrightMagenta+path.basename(filename)+Yellow+`": cuting not needed, mesh fits into limit.${Reset} (${thiss.toString()}/${total.toString()})`);
        return;
    }
    else {console.log(`Cuting "`+BrightBlue+path.basename(filename)+Reset+`"...`)};

    let num_files = Math.floor((num_triangles + max_triangles - 1) / max_triangles)

    let i = 0;
    while (i < num_files) {
        console.log(
            'Writing "' +
            path.basename(filename).replace(".SMD", "").replace(".smd", "") + "_P" + (i + 1) + ".smd" +
            '"'
        );
        let start = i * max_triangles * 4;
        let end = Math.min(start + (max_triangles * 4), refcon.length);
        fs.writeFileSync(filename.replace(".SMD", "").replace(".smd", "") + "_P" + (i + 1) + ".smd", pref.concat(refcon.slice(start, end), [suffix]).join('\n'));
        i += 1;
    }
    console.log(`\x1b[32m"${path.basename(filename)}" successfully cut, ${num_files} files created.  (${thiss}/${total})\x1b[0m`);
    console.log(`\x1b[33mINFO\x1b[0m: You can copy these lines and paste to .qc file content.`);
    i = 0;
    while (i < num_files) {
        console.log(
            '$body "studio" "' +
            path.basename(filename).replace(".SMD", "").replace(".smd", "") + "_P" + (i + 1) +
            '"'
        );
        i += 1;
    }
    console.log("\n");
}

for (let fi = 0; fi < files.length; fi++) {
    const file = files[fi];
    cut(file, files.length, fi+1);
}

prompt(Magenta + "Press ENTER to exit." + Reset);
process.exit(0);