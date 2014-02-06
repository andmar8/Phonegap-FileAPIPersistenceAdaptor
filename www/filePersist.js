/*
 * Scratching out some ideas...
 * 
 * - Is it possible to cache the js file reference and reuse?
 * - Avoiding // comments as they don't like minifiers
 * - Should get/set be separate prototype functions?
 *   - It possibly should, as then you could use a merge in different files to replace get/set with text only in wp8 instead of text/binary in android/ios
 * - For some reason wp8 can load JSON from a string without parsing (IE thing?), android/ios doesn't play nicely in the same vein though :-/
 * - Allow passing in of fail (and success?) callbacks
 * - Handle setting up the fileSystem externally and pass it in?
 * - Double check the create file + write/read in one call, wasn't working last time I tried it
 * 
 * - WARNING: There's a gotcha in WP8, which appears to auto marshall strings to objects, android and ios don't, still investigating
 * - 	Fix.... Parse the json first (android/ios) in a try catch THEN check for null on the result, if null, re assign raw result (wp8),
 * 		if it's still null the data is bad/empty anyway!
 */
var filePersist = {
    /*
     * Reference to the file system
     */
    fileSystem: null,
    
    /*
     * Allow "how" persistent modifer?....
     * 
     * @param boolean persistent
     */
    initialize: function(/*persistent*/){
        /*if(persistent){*/
            window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fs){
                this.fileSystem = fs;
            });
        /*}else{*/
            /*
             * window.requestFileSystem(...)
             */
        /*}*/
    },
    failRead: function(e){
      console.log("Error whilst reading: "+e);
    },
    failWrite: function(e){
      console.log("Error whilst writing: "+e);
    },
    get: function(filePath,fileName/*,objectName ? */){
        this.fileSystem.root.getFile("test.js",/*{create: true, exclusive: true}*/null,function(fileEntry){
            fileEntry.file(this.getObjectInFile,this.failRead);
        },this.failRead);
    },
    getObjectInFile: function(file){
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            var _tmp = evt.target.result; /* scope reduction... maybe unnecessary? */
            var obj = try{JSON.parse(_tmp);}catch(e){} /** android/ios **/
            if(obj==null){obj=_tmp;} /** try again for wp8 **/
            /*console.log(obj);*/
            return obj; /* or callback?... */
        };
        reader.readAsText(file);
    },
    set: function(filePath,fileName,objectToPersist){
        /* create file if it doesn't exist, just in case */
        this.fileSystem.root.getFile("test.js",{create: true, exclusive: true},function(){
            created("test.js");
        },this.failWrite);
        /* write object to file */
        this.fileSystem.root.getFile("test.js",/*{create: true, exclusive: true}*/null,function(fileEntry){
            fileEntry.createWriter(function(writer){
                this.setObjectInFile(writer,objectToPersist);
            },this.failWrite);
        },this.failWrite);
    },
    setObjectInFile: function(writer,objectToPersist){
        var objAsString = JSON.stringify(objectToPersist);
        /*console.log(objAsString);*/
        /*writer.onwriteend = function(evt){console.log("obj written");};*/
        writer.write(objAsString);
    }
};
