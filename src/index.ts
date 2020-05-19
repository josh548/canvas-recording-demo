interface HTMLCanvasElementWithStream extends HTMLCanvasElement {
    captureStream(): MediaStream;
}

function handleDataAvailable(event: BlobEvent): void {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function download(): void {
    const blob: Blob = new Blob(recordedBlobs, { type: "video/webm" });
    const url: string = window.URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "canvas.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

const canvas: HTMLCanvasElementWithStream =
    document.querySelector("canvas") as HTMLCanvasElementWithStream;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

const mediaStream: MediaStream = canvas.captureStream();
const recordedBlobs: Blob[] = [];
const mediaRecorder: MediaRecorder = new MediaRecorder(mediaStream);
mediaRecorder.ondataavailable = handleDataAvailable;

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let framesDrawn: number = 0;
mediaRecorder.start();
function draw(): void {
    context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    context.stroke();
    framesDrawn++;
    if (framesDrawn === 180) {
        mediaRecorder.stop();
        setTimeout(download, 100);
    }
    window.requestAnimationFrame(draw);
}

draw();
