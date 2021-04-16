const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://marshall-data-bucket-production.s3.amazonaws.com/csuBakersfieldRetention/c7ad49be69f0493e98d60e5308616847.png";
// Icon created by itim2101 on Flaticon.com
const PERSON_IMG = "https://www.flaticon.com/svg/vstatic/svg/4462/4462643.svg?token=exp=1617668924~hmac=f7744ea041efd8f207c0e208dd263543";
const BOT_NAME = "Virtual Assistant";
const PERSON_NAME = "Me";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  console.log(msgText)
  $.ajax({
    url: '/',
    type: 'post',
    data: {text: msgText},
    success: function(response){
      console.log(response.includes("https"));
      botResponse(response);
    }
  });
  msgerInput.value = "";
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse(msgText) {
//  const r = random(0, BOT_MSGS.length - 1);
  const msg = msgText;
  const delay = msg.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msg);
  }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
