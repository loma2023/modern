function FetchData() {
    fetch("/MainDataAndUserData.JSON")
        .then((res) => res.json())
        .then((Data) => { DoThis(Data[0], Data[1]) })
        .catch((err) => { return location.href = "/Error" })
} FetchData()

function DoThis(MainData, Decode) {
    let UserWelcome = document.querySelector(".Congratulations .card-title").innerText.replace("👋♥", " ");
    if (MainData.VoiceMessage === true) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(UserWelcome))
    }
}

fetch("https://api.currencyfreaks.com/v2.0/rates/latest?apikey=f015b9e821c448f08a45124345328dc9")
    .then((req) => req.json())
    .then((Data) => {
        document.querySelector(".PriceOfDollar").innerText = parseFloat(Data.rates["EGP"]).toFixed(2) + "$"
    })

fetch("https://api.openweathermap.org/data/2.5/weather?q=sohag&appid=9563a60cb87e29fe113ec45c797ea52f")
    .then((req) => req.json())
    .then((Data) => {
        let temp = (Data.main.temp - 273.15).toFixed(0)
        let Weather = Data.weather[0].description
        translated(Weather, temp)
    })

function translated(Weather, temp) {
    fetch(`https://api.mymemory.translated.net/get?q=${Weather}&langpair=en-GB|ar-EG`)
        .then((req) => req.json())
        .then((Data) => {
            let translatedText = Data.responseData.translatedText
            document.querySelector(".card-txt").innerText = "حالة الطقس اليوم " + "°" + temp + " - " + translatedText
        })
}
