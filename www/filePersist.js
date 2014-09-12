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
 * Library function that abstracts the phonegap/cordova FileApi.
 *
 * Usage: var filePersist = new FilePersist();
 *
 * Also supports creation of directories in root and the creation of empty files.
 */

function FilePersist(){ /** Construtor **/
    if(!cordova.file){
        cordova.file = {/** Make devices (wp8) not supporting cordova.file.dataDirectory use the root of the file system **/
            applicationDirectory: null,
            applicationStorageDirectory: null,
            cacheDirectory: null,
            dataDirectory: null,
            documentsDirectory: null,
            externalApplicationStorageDirectory: null,
            externalCacheDirectory: null,
            externalDataDirectory: null,
            externalRootDirectory: null,
            sharedDirectory: null,
            syncedDataDirectory: null,
            tempDirectory: null,
        }
    }
};
FilePersist.prototype.options = {
    createIfDoesNotExist: {create: true},
    createExclusivelyIfDoesNotExist: {create: true, exclusive: true}
};
/**
 * Usage: var filePersist = new FilePersist();
 *
 * filePersist.getDir(null,success,error) <- success will have a <DirectoryEntry obj> for the ACTUAL root on the file system (android/ios/wp8)
 * filePersist.getDir(<cordova.file.* obj>,success,error) <- success will have a <DirectoryEntry obj> for specified area in file system  (android/ios)
 * filePersist.getDir(<DirectoryEntry obj>,success,error) <- success will have a <DirectoryEntry obj> for specified area in file system (android/ios/wp8)
 * filePersist.getDir(null,success,error,<"Dir Name">) <- success will have a <DirectoryEntry obj> for directory specific underneath the ACTUAL root on file system (android/ios/wp8)
 * filePersist.getDir(<cordova.file.* obj>,success,error) <- success will have a <DirectoryEntry obj> for directory specific underneath the specified area in file system (android/ios)
 * filePersist.getDir(<DirectoryEntry obj>,success,error) <- success will have a <DirectoryEntry obj> for directory specific underneath the specified area in file system (android/ios/wp8)
 *
 * NOTE: There is no need for a "create or set directory" as using the FilePersist.options you can create the directory as it is accessed
 */
FilePersist.prototype.getDir = function(rootDirectoryEntry,success,error,directoryName,options){
    if(directoryName&&directoryName!=""){
        if(rootDirectoryEntry!=null){
            rootDirectoryEntry.getDirectory(directoryName,options,success,error);
        }else{
            window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fileSystem){
                fileSystem.root.getDirectory(directoryName,options,success,error);
            },error);
        }
    }else{
        if(rootDirectoryEntry!=null){
            /*
             * If we are not trying to retrieve a specified directory under an existing specified rootDirectory then the
             * root directory MUST either be a cordova object OR null (i.e. get the ACTUAL root of the file system)
             */
            window.resolveLocalFileSystemURL(rootDirectoryEntry,success,error);
        }else{
            window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fileSystem){success(fileSystem.root);},error);
        }
    }
};
/*
 *  //Retrieve the object added to the "exampleFile", under the "ExampleDirectory", under the dataDirectory
 *	filePersist.getDir(cordova.file.dataDirectory,function(dataDir){
 *		filePersist.getDir(dataDir,function(exampleDir){
 *			filePersist.getFileContents(exampleDir,"exampleFile",function(obj){
	 			//obj.example === "hello";
 *			},fail,JSONFiles.options.createIfDoesNotExist);
 *		},fail,"ExampleDirectory",JSONFiles.options.createIfDoesNotExist);
 *	},fail);
 *
 */
FilePersist.prototype.getFileContents = function(directoryEntry,fileName,success,error,options){
    directoryEntry.getFile(fileName,(options?options:null),function(fileEntry){
        fileEntry.file(function(file){
            var reader = new FileReader();
            reader.onloadend = function(evt){
                var rawResult = evt.target.result;
                var obj = null;
                try{obj = JSON.parse(rawResult);}catch(e){/* unexpected EOF - blank file*/}
                if(obj==null){obj = rawResult;} /** wp8 work around **/
                if(success){success(obj);}
            };
            reader.readAsText(file);
        },error);
    },error);
};
/*
 * Usage:
 *
 *  //Add a blank file called "exampleFile" to a directory called "ExampleDirectory" (which is created if it doesn't exist) under the dataDirectory
 *	filePersist.getDir(cordova.file.dataDirectory,function(dataDir){
 *		filePersist.getDir(dataDir,function(exampleDir){
 *			filePersist.setFileContents(exampleDir,"exampleFile","",function(){},function(){},JSONFiles.options.createIfDoesNotExist);
 *		},fail,"ExampleDirectory",JSONFiles.options.createIfDoesNotExist);
 *	},fail);
 *
 *  //Add an object to a file called "exampleFile" to a directory called "ExampleDirectory" (which is created if it doesn't exist) under the dataDirectory
 *	filePersist.getDir(cordova.file.dataDirectory,function(dataDir){
 *		filePersist.getDir(dataDir,function(exampleDir){
 *			 var objToSave = {
 *				example: "hello",
 *				something: "bye"
 *			 };
 *			 JSONFiles.setFileContents(exampleDir,"exampleFile",objToSave,function(){},function(){},JSONFiles.options.createIfDoesNotExist);
 *		},fail,"ExampleDirectory",JSONFiles.options.createIfDoesNotExist);
 *	},fail);
 *
 * NOTE: A lot of the time when using this function you are probably more concerned as to if it "errored" than succeeded the error,success params
 * are the reverse order of other functions.
 *
 */
FilePersist.prototype.setFileContents = function(directoryEntry,fileName,objToSave,error,success,options){
    directoryEntry.getFile(fileName,(options?options:null),function(fileEntry){
        fileEntry.createWriter(function(writer){
            writer.onwriteend = function(evt){
                if(success){success();}
            };
            writer.write(JSON.stringify(objToSave));
        },error);
    },error);
};