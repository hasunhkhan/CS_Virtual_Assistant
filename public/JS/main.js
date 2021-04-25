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
const PERSON_IMG = "images/profile.png";
const BOT_NAME = "Virtual Assistant";
const PERSON_NAME = "Me";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  console.log(msgText)
  $.ajax({
    url: '/home',
    type: 'post',
    data: {text: msgText},
    success: function(response){
      console.log(response.includes("https"));
      var urlHtml;
      var url = false;
      if(response.includes("https")){
        var urlHtml = regexUrl(response);
        var url = true;
      }
      console.log(urlHtml);
      botResponse(response, urlHtml, url);
    }
  });
  msgerInput.value = "";
});

function appendMessage(name, img, side, text, urlHtml, url) {
  //   Simple solution for small apps
  var msgHTML;
  console.log(urlHtml);
  if(url){
    msgHTML = `
     <div class="msg ${side}-msg">
       <div class="msg-img" style="background-image: url(${img})"></div>

       <div class="msg-bubble">
         <div class="msg-info">
           <div class="msg-info-name">${name}</div>
           <div class="msg-info-time">${formatDate(new Date())}</div>
         </div>

         <div class="msg-text">`+urlHtml+`</div>
       </div>
     </div>
   `;
  }
  else{
   msgHTML = `
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
  }
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse(msgText, urlHtml, url) {
//  const r = random(0, BOT_MSGS.length - 1);
  const msg = msgText;
  const delay = msg.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msg, urlHtml, url);
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

function regexUrl(text){
  var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '\ "target=\"_blank\" >' + url + '</a>';
    });
}

/*$(function() {
	'use strict';

  $('.form-control').on('input', function() {
	  var $field = $(this).closest('.form-group');
	  if (this.value) {
      console.log(this.value);
	    $field.addClass('field--not-empty');
	  } else {
	    $field.removeClass('field--not-empty');
	  }
	});

});*/
