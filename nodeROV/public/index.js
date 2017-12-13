var hasGP = false;
var repGP;


function canGame() {
    return "getGamepads" in navigator;
}

function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    var html = "";
        html += "id: "+gp.id+"<br/>";

    for(var i=0;i<gp.buttons.length;i++) {
        html+= "Button "+(i+1)+": ";
        if(gp.buttons[i].pressed)
          html+= " pressed";

          if(gp.buttons[0].pressed)
          console.log("Button A");
          if(gp.buttons[1].pressed)
          console.log("Button B");
          if(gp.buttons[2].pressed)
          console.log("Button X");
          if(gp.buttons[3].pressed)
          console.log("Button Y");
          if(gp.buttons[4].pressed)
          console.log("Button LB");
          if(gp.buttons[5].pressed)
          console.log("Button RB");
          if(gp.buttons[6].pressed)
          console.log("Button LT");
          if(gp.buttons[7].pressed)
          console.log("Button RT");
          if(gp.buttons[8].pressed)
          console.log("Button back");
          if(gp.buttons[9].pressed)
          console.log("Button start");
          if(gp.buttons[10].pressed)
          console.log("Button lTh");
          if(gp.buttons[11].pressed)
          console.log("Button rTh");
          if(gp.buttons[12].pressed)
          console.log("Button dU");
          if(gp.buttons[13].pressed)
          console.log("Button dD");
          if(gp.buttons[14].pressed)
          console.log("Button dL");
          if(gp.buttons[15].pressed)
          console.log("Button dR");


        html+= "<br/>";
    }

    for(var i=0;i<gp.axes.length; i+=2) {
        html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
        if(gp.axes[i] < 0)
        console.log("Stick L", i+1);
        if(gp.axes[i] > 0.4)
        console.log("Stick  R", i+1);
        if(gp.axes[i+1] < -0.4)
        console.log("Stick U", i+1);
        if(gp.axes[i+1] > 0)
        console.log("Stick  D", i+1);
    }

    $("#gamepadDisplay").html(html);
}

$(document).ready(function() {

    if(canGame()) {

        var prompt = "To begin using your gamepad, connect it and press any button!";
        $("#gamepadPrompt").text(prompt);

        $(window).on("gamepadconnected", function() {
            hasGP = true;
            $("#gamepadPrompt").html("Gamepad connected!");
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad,100);
        });

        $(window).on("gamepaddisconnected", function() {
            console.log("disconnection event");
            $("#gamepadPrompt").text(prompt);
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function() {
            console.log('checkGP');
            if(navigator.getGamepads()[0]) {
                if(!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }

});








// Original Site


function createPhotoCard(photoURL, caption) {

  var photoCardTemplateArgs = {
    photoURL: photoURL,
    caption: caption
  };

  var photoCardHTML = Handlebars.templates.photoCard(photoCardTemplateArgs);

  return photoCardHTML;

}


function getPersonId() {
  var currentURL = window.location.pathname;
  var urlComponents = currentURL.split('/');
  if (urlComponents[0] === "" && urlComponents[1] === "people") {
    return urlComponents[2];
  } else {
    return null;
  }
}


function handleModalAcceptClick() {

  var photoURL = document.getElementById('photo-url-input').value.trim();
  var caption = document.getElementById('photo-caption-input').value.trim();

  if (!photoURL || !caption) {
    alert("You must fill in all of the fields!");
  } else {

    var postRequest = new XMLHttpRequest();
    var postURL = "/people/" + getPersonId() + "/addPhoto";
    postRequest.open('POST', postURL);

    var photoObj = {
      photoURL: photoURL,
      caption: caption
    };
    var requestBody = JSON.stringify(photoObj);
    postRequest.setRequestHeader('Content-Type', 'application/json');

    postRequest.addEventListener('load', function (event) {
      if (event.target.status !== 200) {
        alert("Error storing photo in database:\n\n\n" + event.target.response);
      } else {
        var newPhotoCard = createPhotoCard(photoURL, caption);
        var photoCardContainer = document.querySelector('.photo-card-container');

        photoCardContainer.insertAdjacentHTML('beforeend', newPhotoCard);
      }
    });

    postRequest.send(requestBody);

    hideModal();

  }

}


function showModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}


function clearModalInputs() {

  var modalInputElements = document.querySelectorAll('#add-photo-modal input')
  for (var i = 0; i < modalInputElements.length; i++) {
    modalInputElements[i].value = '';
  }

}


function hideModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');

  clearModalInputs();

}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  var addPhotoButton = document.getElementById('add-photo-button');
  addPhotoButton.addEventListener('click', showModal);

  var modalAcceptButton = document.getElementById('modal-accept');
  modalAcceptButton.addEventListener('click', handleModalAcceptClick);

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
    modalHideButtons[i].addEventListener('click', hideModal);
  }

});
