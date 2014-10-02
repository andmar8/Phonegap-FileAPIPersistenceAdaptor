document.addEventListener('deviceready',function(){
    /* USEFUL STUFF:
     * https://developer.mozilla.org/en-US/docs/Web/API/FileError#Error_codes
     */
    var fail = function(e){console.log("oh dear, something went wrong :(");};
    var filePersist = new FilePersist();
    var myExampleDirName = "exampleDir";
    var myExampleFileName = "exampleFile";
    
    filePersist.getDir(cordova.file.dataDirectory,function(dataDir){
        filePersist.getDir(dataDir,function(myExampleDir){
            var objToSave = {
                "string": "hello",
                "boolean": true,
                "int": 1,
                "array": ["test","test2"]
            };
            var success = function(){
                console.log("Object successfully saved to fileSystem");
                filePersist.getFileContents(myExampleDir,myExampleFileName,function(obj){
                    console.log("What is in "+myExampleDir.nativeURL+myExampleFileName);
                    console.log(obj);
                },fail,filePersist.options.createIfDoesNotExist);
            };
            filePersist.setFileContents(myExampleDir,myExampleFileName,objToSave,fail,success,filePersist.options.createIfDoesNotExist);
        },fail,myExampleDirName,filePersist.options.createIfDoesNotExist);
    },fail);

},false);
