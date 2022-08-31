module.exports = () => {
	datapack = getDatapack()
	if(!datapack) return null
	
	mcfunction = []
	json = []
	
	getFiles(datapack, "")
	
	return { mcfunction: mcfunction, json: json, datapack_name: datapack + '_obfs' }
}

const fs = require('fs')

function getFiles(datapack, dir) {
	
	fs.readdirSync(datapack + "/data/" + dir).forEach(file => {
		
		if(file.match(".mcfunction")) {
			let content = fs.readFileSync(datapack + "/data/" + dir + "/" + file, { encoding: 'utf8', flag: 'r' })
			content = content.replace(/\r/g,'')
			
			mcfunction.push({ index: (dir.replace("/",":") + "/" + file).replace("functions/","").replace(".mcfunction",""), content: content })
		}
		
		else if(file.match(".json")) {
			let content = fs.readFileSync(datapack + "/data/" + dir + "/" + file, { encoding: 'utf8', flag: 'r' })
			
			json.push({ index: dir.replace("/",":") + "/" + file, content: content })
		
		}
		
		else if(file.indexOf(".") == -1) getFiles(datapack, dir ? dir + "/" + file : file)
    });
	
}

function getDatapack(folder) {
	var result;
	
	fs.readdirSync("./").forEach(file => {
	 if(file.indexOf(".") > -1) return
	 
	 let attributes = 0
	 fs.readdirSync("./" + file).forEach(a => {
		if(a == 'data') attributes++
		else if(a == 'pack.mcmeta') attributes++
	 })
	 
	 if(attributes == 2 && !file.match("_obfs")) result = file
    });
	
	return result
}