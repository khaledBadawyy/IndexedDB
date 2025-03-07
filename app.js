function applyStyle() {
  document.body.style.backgroundColor =
    document.body.style.backgroundColor === "lightblue" ? "white" : "lightblue";
  console.log("تم تغيير لون الخلفية!");
}

console.log("تم تحميل وتشغيل app.js من IndexedDB!");

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    
    const installButton = document.createElement("button");
    installButton.textContent = "تثبيت التطبيق";
    installButton.style.position = "fixed";
    installButton.style.bottom = "20px";
    installButton.style.right = "20px";
    installButton.style.padding = "10px";
    installButton.style.background = "blue";
    installButton.style.color = "white";
    installButton.style.border = "none";
    installButton.style.borderRadius = "5px";
    installButton.style.cursor = "pointer";

    document.body.appendChild(installButton);

    installButton.addEventListener("click", () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("تم تثبيت التطبيق بنجاح");
            }
            installButton.remove();
        });
    });
});


let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  const installButton = document.getElementById("installPWA");
  installButton.style.display = "block";

  installButton.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the PWA install");
      } else {
        console.log("User dismissed the PWA install");
      }
      deferredPrompt = null;
    });
  });
});
