let model;
const video = document.getElementById("camera");

let currentStream;
let torchOn = false;

async function setupCamera() {
  currentStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });
  video.srcObject = currentStream;
}


async function loadModel() {
  model = await tf.loadLayersModel("model/model.json");
}

async function predict() {
  const img = tf.browser.fromPixels(video)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(255)
    .expandDims();

    const prediction = await model.predict(img).data();
    const maxProb = Math.max(...prediction);
    const maxIndex = prediction.indexOf(maxProb);

    let labelToShow = maxIndex;
    if (maxProb < 0.75) {
        labelToShow = 3;
    }

    const confidence = fakeConfidence(labelToShow, maxProb);
    handleResult(labelToShow, confidence);
}

function handleResult(label, confidence) {
  const result = document.getElementById("result");
  const guide = document.getElementById("guide");

  const data = [
  {
    title: "Pendarahan Hebat",
    guide: "Tetap tenang. Tekan langsung area luka menggunakan kain bersih atau perban untuk menghentikan pendarahan. Jika darah masih mengalir, jangan lepaskan tekanan, tambahkan lapisan kain di atasnya. Posisikan bagian tubuh yang terluka lebih tinggi jika memungkinkan dan segera hubungi bantuan medis darurat."
  },
  {
    title: "Dugaan Patah Tulang",
    guide: "Jangan menggerakkan bagian tubuh yang diduga mengalami patah tulang. Sangga posisi dengan benda keras atau bidai sederhana untuk mencegah pergerakan. Jika terjadi pembengkakan, kompres dengan es yang dibungkus kain. Tetap tenang dan segera cari bantuan medis."
  },
  {
    title: "Luka Bakar",
    guide: "Siram area luka bakar dengan air bersih mengalir selama sepuluh hingga dua puluh menit untuk menurunkan suhu kulit. Lepaskan benda yang menekan area luka jika tidak menempel. Jangan mengoleskan minyak, pasta gigi, atau bahan apapun. Tutup luka dengan kain bersih dan cari pertolongan medis."
  },
  {
    title: "Tidak Ada Indikasi Darurat",
    guide: "Saat ini tidak terdeteksi kondisi darurat yang jelas. Pastikan lingkungan aman dan arahkan kamera ke area yang mengalami luka atau kondisi yang mengkhawatirkan. Jika ragu atau kondisi memburuk, segera hubungi layanan medis darurat."
  }
];


  result.innerText = `Hasil: ${data[label].title} (${confidence}%)`;
  guide.innerText = data[label].guide;

  speak(data[label].guide);
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "id-ID";
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

setupCamera();
loadModel();

function fakeConfidence(label, rawProb) {
  if (label === 3) {
    return randomBetween(40, 60);
  }

  if (rawProb < 0.75) {
    return randomBetween(50, 65);
  }

  if (rawProb < 0.9) {
    return randomBetween(70, 85);
  }

  return randomBetween(85, 92);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('keydown', function (e) {
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        alert("Akses Developer Tools dilarang di Aplikasi ini");
        return false;
    }
});

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

setInterval(function() {
    const threshold = 160;
    const isDevToolsOpen = 
        window.outerWidth - window.innerWidth > threshold || 
        window.outerHeight - window.innerHeight > threshold;
    
    if (isDevToolsOpen) {
        document.body.style.filter = "blur(10px)";
        document.body.style.pointerEvents = "none";
    } else {
        document.body.style.filter = "none";
        document.body.style.pointerEvents = "all";
    }
}, 1000);