let cmr = {
    init: function(){
        document.getElementById("btnPic").addEventListener("click", cmr.takephoto);
        document.getElementById('btnClear').addEventListener('click', cmr.clearPhoto);
    },

    takephoto: function(){
        let opts = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.BACK,
            targetWidth: 400,
            targetHeight: 800,
            saveToPhotoAlbum: false,
            allowEdit: false
        };

        navigator.camera.getPicture(cmr.onSuccess, cmr.onFail, opts);
    },
    //sucess function
    onSuccess: function(imgURI){
        document.getElementById("msg").textContent = imgURI;
        document.getElementById("photo").src = imgURI;
    },
    //fail function
    onFail: function(msg){
        document.getElementById("msg").textContent = msg;
    },

    clearPhoto: function(){
        document.getElementById('photo').src="../img/back.jpg"; 
        document.getElementById('msg').innerHTML=""; 
    }
};

document.addEventListener('deviceready', cmr.init);
