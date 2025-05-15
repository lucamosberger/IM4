document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profilForm");
  
    if (!form) return;
  
    // Eingabefelder holen
    const vornameInput = document.getElementById("vorname");
    const nachnameInput = document.getElementById("nachname");
    const emailInput = document.getElementById("email");
    const passwortInput = document.getElementById("passwort");
  
    // Bestehende Daten laden (wenn vorhanden)
    vornameInput.value = localStorage.getItem("vorname") || "";
    nachnameInput.value = localStorage.getItem("nachname") || "";
    emailInput.value = localStorage.getItem("email") || "";
    passwortInput.value = localStorage.getItem("passwort") || "";
  
    // Beim Abschicken speichern
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // kein Neuladen der Seite
  
      localStorage.setItem("vorname", vornameInput.value);
      localStorage.setItem("nachname", nachnameInput.value);
      localStorage.setItem("email", emailInput.value);
      localStorage.setItem("passwort", passwortInput.value);
  
      alert("Profil wurde erfolgreich gespeichert!");
    });
  });
  