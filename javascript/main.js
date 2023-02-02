const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const baseUrl = "https://ascii-art.fr/"
const contenuPage = document.querySelector(".content")
const ancienContenu = document.querySelector('.row')
const templatePhoto = ``
const templateWaiting= `<div class="load"></div>`
const templateCreation= `
                         <div class="fadeIn">
                         <span class="createTexttake">création</span>
                         </div>
                        `
const qrCodePlace = document.querySelector(".forQrCode")

const chiffre1 = document.querySelector('#chiffre1')
const chiffre2 = document.querySelector('#chiffre2')
const chiffre3 = document.querySelector('#chiffre3')



let templateFinal = ""
const width = 499;
let height = 0;
let streaming = false;
let video = null;
let canvas = null;
let photo = null;
let startbutton = null;
let randomString=""
let picture = ""
//_____________________________________________

let commencer = document.querySelector('.commencer')
let image = document.querySelector('.photo')
let temoin = ""
/*
addEventListener('keydown', logKey);

function logKey(e) {
    if (e.code === 'Backspace') {
        if(temoin==="capture"){
            location.reload();
        }
    }
    if (e.code === 'Space') {
        if (temoin ==="") {
            image.classList.toggle('faireDisparaitre')
            commencer.textContent="tape sur entrée capturer la photo"
            //video.classList.toggle('faireDisparaitre')
            interval = setInterval(takepicture, 0.01)
            temoin = "video";
        }
        else if (temoin==="video"){
            clearInterval(interval)
            temoin="capture"
            contenuPage.toggleAttribute("faireDisparaitre")
            getEverythingNeeded().then(r =>getQrcode(baseUrl) )
        }
        else if(temoin==="capture"){
            pdfToServeurGet(randomString)
            generatePDF(randomString).then(r => printWindow()).then(location.reload())
        }
    }
}
*/

//-------------------------------------------------



window.addEventListener("load", startup, false);
window.addEventListener('keypress', (event)=>{
    if (event.key == " "){
        photomathon()
        console.log('script à lancé')
    }
})

interval = setInterval(takepicture, 0.01)

// code display screen compte à rebours
async function photomathon(){
    await compteARebours()
    // puis appelle lancement du code dans le setTimeOut Promise
}
function decompte(i){
    setTimeout( function ()
    {
        if(i==1){
            chiffre1.classList.add("displayBlock")
        }
        if(i==2){
            chiffre1.classList.remove("displayBlock")
            chiffre2.classList.add("displayBlock")
        }
        if(i==3){
            chiffre2.classList.remove("displayBlock")
            chiffre3.classList.add("displayBlock")
        }
        if(i==4){
            chiffre3.classList.remove("displayBlock")
            document.body.style.backgroundColor = 'white'
        }
        if(i==5){
            document.body.style.backgroundColor = 'grey'
        }
        console.log(i)
    },900*i)
}
async function compteARebours(){
    for (let i = 1; i <= 5; i++) {
        decompte(i)
    }

    return new Promise(resolve => {
        setTimeout(() => {

            // appelle de la function que l'on veut
            clearInterval(interval) // arrêt du live ascii pour prendre photo


            // script photo
            contenuPage.toggleAttribute("faireDisparaitre")
            getEverythingNeeded().then(r =>getQrcode(baseUrl) )

            //console.log(randomString)
            pdfToServeurGet(randomString)
            generatePDF(randomString).then(r => printWindow()).then(location.reload())
            setTimeout(qrCodePlace.innerHTML = "",7000)


            interval = setInterval(takepicture, 0.01)



        }, 4500);

    });
}


function startup() {
    contenuPage.innerHTML = templatePhoto
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
    video.addEventListener(
        "canplay",
        (ev) => {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute("width", width);
                video.setAttribute("height", height);
                canvas.setAttribute("width", width);
                canvas.setAttribute("height", height);
                streaming = true;
            }
        },
        false
    );

    startbutton.addEventListener(
        "click",
        (ev) => {
            takepicture();
            ev.preventDefault();
        },
        false
    );
    clearphoto();
}

function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    sourceImage = canvas.toDataURL("image/png");
}

function takepicture() {
    const context = canvas.getContext("2d");
    if (!width && !height) {
        clearphoto();
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    let data = canvas.toDataURL("image/png");

    let canvas1 = document.querySelector('#canvas1')
    const ctx = canvas1.getContext('2d');
    const image1 = new Image();
    image1.src=data
    //console.log(image1.src) // ################## Lien de la base64
    class Cell {
        constructor(x, y, symbol) {
            this.x = x;
            this.y = y;
            this.symbol = symbol;
        }
        draw(ctx){
            ctx.fillStyle = 'black';
            ctx.fillText(this.symbol, this.x, this.y)
        }
    }

    class AscciEffect {
        #imageCellArray = [];
        #pixels = [];
        #ctx;
        #width;
        #height;
        constructor(ctx, width, height) {
            this.#ctx = ctx;
            this.#width = width;
            this.#height = height;
            this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
            this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
            //console.log(this.#pixels.data) // ################## Grille
        }
        #convertToSymbol(g) {
            if (g > 250) return '@';
            else if (g > 240) return '*';
            else if (g > 220) return '+';
            else if (g > 200) return '#';
            else if (g > 180) return '&';
            else if (g > 160) return '%';
            else if (g > 140) return '_';
            else if (g > 120) return ':';
            else if (g > 100) return '$';
            else if (g > 80) return '/';
            else if (g > 60) return '-';
            else if (g > 40) return 'X';
            else if (g > 20) return 'W';
            else return '';
        }
        #scanImage(cellSize){
            this.#imageCellArray = [];
            for (let y = 0; y < this.#pixels.height; y +=
                cellSize){
                for (let x = 0; x < this.#pixels.width; x += cellSize) {
                    const posX = x * 4;
                    const posY = y * 4;
                    const pos = (posY * this.#pixels.width) + posX;

                    if (this.#pixels.data[pos + 3] >128 ){
                        const red = this.#pixels.data[pos];
                        const green = this.#pixels.data[pos + 1];
                        const blue = this.#pixels.data[pos + 2];
                        const total = red + green + blue;
                        const averageColorValue = total/3;
                        const color = "rgb(" + red + ","+ green + "," + blue + ")";
                        const symbol = this.#convertToSymbol(averageColorValue);
                        if (total > 200) {this.#imageCellArray.push(new Cell(x, y, symbol, color));}
                    }
                }
            }
        }
        #drawAscii(){
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            for (let i = 0; i < this.#imageCellArray.length; i++) {
                this.#imageCellArray[i].draw(this.#ctx);
            }
        }
        draw(cellSize){
            this.#scanImage(cellSize);
            this.#drawAscii();
        }
    }

    let effect; // ################## objet = tableau => tableau = coordonnées, symbol

    image1.onload = function initialize(){
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        effect = new AscciEffect(ctx, image1.width, image1.height);
        effect.draw(6);
        // valeur de la resolution
        // (4 ou 5 pour fond noir et caractère blanc
        // (5 ou 6 pour fond blanc et caractère noir)
    }
}

function generateString(length) {
    let newRandomString = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        newRandomString += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    randomString = newRandomString
}

function DownloadCanvasAsImage(randomString){
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', randomString+'.png');
    let canvas = document.getElementById('canvas1');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href',url);
    downloadLink.click();

    picture= downloadLink

}

function getQrcode(baseUrl){
    let qrcode = new QRCode(document.querySelector('.forQrCode'), {
        text: `${baseUrl}${randomString}`,
        width: 60,
        height: 60,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H,
        classList: "qrCode"
    });
}


async function getEverythingNeeded(){
    generateString(10)
    DownloadCanvasAsImage(randomString)
}

async function createTemplate() {
    ancienContenu.toggleAttribute("faireDisparaitre")
    let template=`<div class="container row">
        <div class="mainDiv">
        <div class="forpic">
             <img id="pic" src="../img/${randomString}.png" alt="picture">
        </div>
            <div class="forQrCode">
            </div>
        </div>
    </div>`
    contenuPage.innerHTML= template

    getQrcode(baseUrl, randomString)

    templateFinal = template
}

function printWindow(){
    window.print()
}

/*
function print() {
    const backgroundImg = document.querySelector(".row")

    backgroundImg.classList+="AllWhite"
    printContents = templateFinal
    originalContents = document.body.innerHTML;

    document.body.appendChild(printContents);
    window.print();
    document.body.innerHTML = originalContents;
}
*/

async function generatePDF(fileName){

    let opt = {
        destination: "../pdf/",
        filename:     fileName +".pdf",
        image:        { type: 'png' },
        html2canvas:  { scale: 1},
        jsPDF:        { unit: 'cm', format: 'a6', orientation: 'portrait'}
    };

    const conteneur = document.querySelector(".row")

    html2pdf().from(conteneur).set(opt).save()
}


async function pdfToServeurGet(randomString){

    //console.log(randomString)
    let url = `${baseUrl}${randomString}`

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    await fetch(url, requestOptions)
        .then(response=>response.json())
        .then(result=>{
            console.log(result)
        })
        .catch(error => {
            console.error(error);
        });
}





