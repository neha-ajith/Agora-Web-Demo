
let handleFail = function(err){
    console.log("Error : ", err);
};


let remoteContainer = document.getElementById("remote-container");

var channelName = localStorage.getItem("channelname");

document.getElementById('disconnect_call').onclick = () =>  {
    disconnectCall();
}

function disconnectCall(){
    client.leave();
    if (client.leave) {
        window.location.href = '../index.html'
    }
}

var isMuted = false;
document.getElementById('mute_mic').onclick = () =>  {
    toggleMic();
}

function toggleMic() {
    if (isMuted) {
        isMuted = false;
        globalstream.enableAudio();
    } else {
        isMuted = true;
        globalstream.muteAudio();
    }
}

var isCameraOn = true;
document.getElementById('disable_camera').onclick = () =>  {
    toggleCamera();
}

function toggleCamera() {
    if (isCameraOn) {
        isCameraOn = false;
        globalstream.muteVideo();
    } else {
        isCameraOn = true;
        globalstream.enableVideo();
    }
}


function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById('remote-container');
    remDiv.parentNode.removeChild(remDiv);
    console.log("Remote stream removed ");
}

let client = AgoraRTC.createClient({
    mode : 'live',
    codec : "h264"
});

var stream = AgoraRTC.createStream({
  streamID: 0,
  audio:true,
  video:true,
  screen:false
});

client.init("dc96e5c14025414ea38980c9b1b1fbe4", function(){
    console.log("Initialized successfully!");
});


client.join(null, 'test', null, function(uid){

    let localstream = AgoraRTC.createStream({
        streamID : uid,
        audio : false,
        video : true,
        screen : false
    });

    globalstream = localstream;

    localstream.init(function(){
        localstream.play('me');
        client.publish(localstream, handleFail);

        client.on('stream-added', (evt)=>{
            client.subscribe(evt.stream,handleFail);
        });

        client.on('stream-subscribed', (evt)=>{
            let stream = evt.stream;
            stream.play('remote-container');
        });
        client.on('stream-removed', removeVideoStream);
    },handleFail);

},handleFail);