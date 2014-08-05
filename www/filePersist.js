/*
Library function that abstracts the phonegap/cordova FileApi. 
Allowing calls such as:
    filer = new FilePersist();
    filer.set(object,fileName);
    filer.get(fileName,successCallback(result)); //result being the contents of the fileName file
    
Also supports creation of directories in root and the creation of empty files.
*/

function FilePersist() {
	var fileSystem;
    
	/* Retrieve local fileSystem and store in variable */
    window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){fileSystem = fs;},onError);
	
	/* Error function for the creation of fileSystem object */
	var onError = function(e) {
		console.log(e);
    }
    
    /* create directory function that creates folder in root directory */
    this.createDirectory = function(directoryName,success,error) {
		fileSystem.root.getDirectory(directoryName,{create : true},success,error);
	}
	
	/* create file function that creates folder in root directory */
	this.createFile = function(fileName,success,error) {
		fileSystem.root.getFile(fileName, {create : true},success,error);
	}
	
	/* get function that takes a fileName and returns the contents of the file to the success callback */
	this.get = function(fileName,success,error) {
        
        fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function(fe){
                                fe.file(function(file){
                                        var reader = new FileReader();
                                        
                                        reader.onloadend = function(evt){
											
											try{ var obj = JSON.parse(evt.target.result);}catch(e){}
											
											if(obj==null){ obj=evt.target.result;}
											
											success(obj);
                                        }
                                        
                                        reader.readAsText(file);
                                        
                                        });
                                
                                },error);
        
    }
    
	/* get function that takes an object and a fileName and stores the object in the file */
	this.set = function(obj,fileName,success,error) {
        fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function(fe){
                                fe.createWriter(function(writer){writer.write(JSON.stringify(obj));},error);
                                return true;
                                },error);
    }   
	
	
}
