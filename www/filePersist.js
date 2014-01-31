/*
 * Scratching out some ideas...
 * 
 * - Is it possible to cache the js a file reference and reuse?
 * - Avoiding // comments as they don't like minifiers
 * - Should get/set be separate prototype functions?
 * - For some reason wp8 can load JSON from a string without parsing (IE thing?), android/ios doesn't play nicely in the same vein though :-/
 * - Allow passing in of fail (and success?) callbacks
 * - Handle setting up the fileSystem externally and pass it in?
 * - Double check the creation + write to file in one call, wasn't working last time I tried it
 */
var filePersist = {
    get: function(filePath,fileName/*,objectName ? */){
        fileSystem.root.getFile("test.js",/*{create: true, exclusive: true}*/null,function(fileEntry){fileEntry.file(this.getObjectInFile,this.failRead);},this.failRead);
    },
    getObjectInFile: function(){
        
    },
    set: function(filePath,fileName,objectToPersist){
        /* create file if it doesn't exist, just in case */
        fileSystem.root.getFile("test.js",{create: true, exclusive: true},function(){created("test.js");},this.failWrite);
        /* write object to file */
        fileSystem.root.getFile("test.js",/*{create: true, exclusive: true}*/null,function(fileEntry){fileEntry.file(this.getObjectInFile,this.failRead);},this.failRead);
    },
    setObjectInFile: function(){
        
    }
};
