
const videoArea = document.getElementById("videos-container")
const myVideo = document.createElement("video");
myVideo.muted = true;

let myVedioStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVedioStream = stream;
    addVidioStream(myVideo, stream);
  });

const addVidioStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoArea.append(video);
};
