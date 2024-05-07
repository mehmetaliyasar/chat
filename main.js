const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn")
const deleteButton = document.querySelector("#delete-btn")
const defaultText = document.querySelector(".deafult-text");
//console.log(chatContainer)

let userText = null;




// html elementi oluşturur.
const createElement = (html, className) => {
    // yeni bir div oluşturma
    const chatDiv = document.createElement("div");
    // yeni oluşturduğumuz dive class ekleme
    chatDiv.classList.add("chat", className);
    // oluşturduğumuz divin içerisine dışardan gelen html parametresini gönderme
    chatDiv.innerHTML = html;
    return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/audio/translations";
    const pElement = document.createElement("p");
    const requestData = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant.",
            },
            {
                role: "user",
                content: `${userText}`,
            },
        ],
    };
    // api talebi için özellikleri ve verileri tanımlama
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestData),
    };

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].message.content;
        // console.log(pElement);
    } catch (error) {
        console.log(error);
        //pElement.classList.add("error");
       // pElement.textContent = "OOOpppps";
    }
    // yazım animasyonunu ekrandan kaldırma
    incomingChatDiv.querySelector(".typing-animation").remove();
    // apiden gelen cevabı ekrana aktarma
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatInput.value = " ";
};
// animasyon oluşturma
const showTypingAnimation = () => {
    const html = `
        <div class="chat-content">
            <div class="chat-details">
                <img src="images/chatbot.jpg" alt="">
                <div class="typing-animation">
                    <div class="typing-dot" style="--delay:0.2s"></div>
                    <div class="typing-dot" style="--delay:0.3s"></div>
                    <div class="typing-dot" style="--delay:0.4s"></div>
                </div>
            </div>
        </div>
        `;
    // yazma animasyonu ile gelen bir div oluşturun ve bunu chatContainera ekle
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv)
}
// gönderme butonuna tıklanıldığında çalıştırma
const handleOutGoingChat = () => {
    userText = chatInput.value.trim(); // chatInputun değerini alma ve fazladan boşlukları silme
    if (!userText) return; // chatInputun içi boşsa çalışma
    //console.log(userText)
    const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="images/user.jpg" alt="">
            <p>react nedir</p>
        </div>
    </div>
    `
    // kullanıcının mesajını içeren bir div oluştur ve bunu chatContainer yapısına ekle
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
};

//! Olay izleyicisi
// Enter tuşuna basıldığında istek at
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        handleOutGoingChat();
    };
});
// Göndereme butonuna olay izleyicisi ekleme
sendButton.addEventListener("click", handleOutGoingChat);

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeButton.innerText = document.body.classList.contains("light-mode")
        ? "dark_mode"
        : "light_mode";

    /* if (document.body.classList.contains("light-mode")) {
         themeButton.innerText = "dark_mode";
     } else {
         themeButton.innerText = "light_mode";
     }*/
});

deleteButton.addEventListener("click", () => {
    if (confirm("Tüm sohbetleri silmek istediğinizden emin misiniz?")){
        chatContainer.remove()
    }
});




