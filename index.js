config = require("./config.json")
fs = require('fs')

var content = require("./getFiles.js")()

if(!content) return console.log("> No datapack found")

fs.rmSync(content.datapack_name, { recursive: true, force: true })
makePath("",[content.datapack_name, "data", config.main_dir, "functions"])

var length = content.mcfunction.length
var allocation = Math.ceil(length / config.names.split(' ').length)
allocators = {}
for(a of config.names.split(' ')) { allocators[a] = allocation }
console.log(allocators)

//makePath(content.datapack_name + "/data/" + config.main_dir + "/functions/", config.names.split(' '))

var main = content.json.find(x=> x.index == "minecraft:tags/functions/tick.json")

for(let fun of content.mcfunction) {
	let a = getAllocator()
	allocators[a]--;
	
	//console.log(allocators)
	
	fun.new_index = a + ":" + gen()
	for(let nuf of content.mcfunction) {
		if(nuf.content.match(fun.index)) nuf.content = nuf.content.replace(/_wait/g,"").replace(fun.index.replace(/_wait/g,""),fun.new_index)
	}
	if(main.content.match(fun.index)) main.content = main.content.replace(fun.index,fun.new_index)
}

for(let a in allocators) {
	makePath(content.datapack_name + "/data/", [a, "functions"])
}

for(let fun of content.mcfunction) {
	//console.log(fun.index)
	//console.log(fun.new_index)
	fs.writeFileSync(content.datapack_name + "/data/" + fun.new_index.slice(0,fun.new_index.indexOf(':')) + "/functions/" + fun.new_index.slice(fun.new_index.indexOf(':')+1) + '.mcfunction', fun.content)
}

for(let json of content.json) {
	json.index = json.index.replace(':','/')
	let folder = content.datapack_name + "/data/" + json.index.slice(0,json.index.lastIndexOf('/'))
	makePath(content.datapack_name + "/data/", json.index.slice(0,json.index.lastIndexOf('/')).split('/'))
	fs.writeFileSync(content.datapack_name + "/data/" + json.index, json.content)
}

fs.writeFileSync(content.datapack_name + "/pack.mcmeta", config.mcmeta)

console.log("> Done!")


function makePath(a,b) {
	for(c=1; c<=b.length; c++) {
		let path = a+b.slice(0,c).join('/')
		if(!fs.existsSync(path)) fs.mkdirSync(path)
	}
}

function getAllocator() {
	for(a in allocators) if(allocators[a] > 0) return a;
}

function gen() {
    var length = 3,
        charset = "1234567890afox",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}