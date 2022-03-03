const video = document.getElementById('video');

function startVideo(){
    navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );

    navigator.getUserMedia(
        {video: {}},
        stream => {
            video.srcObject = stream;
            // video.play();
        },
        err => console.error(err)
    );
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/js/face-api/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/js/face-api/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/js/face-api/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/js/face-api/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/js/face-api/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/js/face-api/models')
])
.then(startVideo);

video.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(video);

    const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {

        document.body.append(canvas);

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString(), lineWidth: 2 })
            drawBox.draw(canvas)
        })
        
        // faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        // faceapi.draw.drawAgeAndGender(canvas, resizedDetections);
    }, 100);
});

function loadLabeledImages() {
    const labels = ['agustin']
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 3; i++) {
          const img = await faceapi.fetchImage(`/storage/people/${label}/${i}.jpg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
        }
  
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
  }