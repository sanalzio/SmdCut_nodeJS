/* console.log(process.argv);
const dialog = require('node-file-dialog')
const filedgcfg={type:'open-files'}
dialog(filedgcfg)
.then(dir => console.log(dir))
.catch(err => console.log(err)) */

const {Fore} = require("./colorama");
console.log(Fore.Blue + "Naber?" + Fore.Reset);