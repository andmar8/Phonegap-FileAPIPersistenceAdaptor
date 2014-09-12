/*Copyright 2014 Andrew Martin, Gareth Hudson, Newcastle University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

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
