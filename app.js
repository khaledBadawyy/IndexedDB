document.addEventListener("DOMContentLoaded", function () {
  let deferredPrompt;

  function applyStyle() {
    document.body.style.backgroundColor =
      document.body.style.backgroundColor === "lightblue"
        ? "white"
        : "lightblue";
    console.log("تم تغيير لون الخلفية!");
  }

  // Remove the event listener for beforeinstallprompt
  // window.addEventListener("beforeinstallprompt", (event) => {
  //     event.preventDefault();
  //     deferredPrompt = event;
  //     const installButton = document.getElementById("installBtn");
  //     installButton.style.display = "block"; // Show the button
  //     installButton.addEventListener("click", () => {
  //         deferredPrompt.prompt();
  //         deferredPrompt.userChoice.then((choiceResult) => {
  //             if (choiceResult.outcome === "accepted") {
  //                 console.log("تم تثبيت التطبيق");
  //             } else {
  //                 console.log("تم إلغاء التثبيت");
  //             }
  //             deferredPrompt = null; // Reset the deferredPrompt
  //         });
  //     });
  // });
});
