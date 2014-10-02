document.addEventListener('deviceready',function(){
    
    var fail = function(e){console.log("oh dear, something went wrong :(");};
    var filePersist = new FilePersist();
    filePersist.getDir(cordova.file.dataDirectory,function(dataDir){
        /* USEFUL STUFF:
         * https://developer.mozilla.org/en-US/docs/Web/API/FileError#Error_codes
         */

        filePersist.getDir(dataDir,function(myExampleDir){
            filePersist.getFileContents(myExampleDir,"exampleFile",function(obj){
                console.log("What is in "+myExampleDir.nativeURL+"exampleFile?");
                console.log(obj);
            },fail,filePersist.options.createIfDoesNotExist);
        },fail,"exampleDir",filePersist.options.createIfDoesNotExist);
    },fail);
    
},false);
