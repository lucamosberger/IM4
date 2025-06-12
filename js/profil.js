// document.addEventListener("DOMContentLoaded", async () => {
//     const data = await fetchProfileData();

//     console.log("Profilseite geladen");
//     const form = document.getElementById("profilForm");
//     const anredeInput = document.getElementById("anrede");
//     const vornameInput = document.getElementById("vorname");
//     const nachnameInput = document.getElementById("nachname");
//     const emailInput = document.getElementById("e-mail");
//     const passwortInput = document.getElementById("password");

//     console.log("Profil-Daten:", data);
//     vornameInput.value = data.user.firstname || "";
//     nachnameInput.value = data.user.lastname || "";
//     emailInput.value = data.user.email || "";
//     anredeInput.value = data.user.anrede || "";


//     // ✅ Speichern
//     form.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const daten = {
//             anrede: anredeInput.value,
//             vorname: vornameInput.value,
//             nachname: nachnameInput.value,
//             email: emailInput.value,
//             passwort: passwortInput.value
//         };

//         fetch("api/profile/updateProfile.php", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(daten)
//         })
//             .then(response => response.json())
//             .then(result => {
//                 if (result.status === "success") {
//                     alert("Profil gespeichert!");
//                 } else {
//                     alert("Fehler beim Speichern!");
//                 }
//             });
//     });
// });

// async function fetchProfileData() {
//     try {
//         const response = await fetch("/api/profile/readProfile.php", {
//             method: "GET",
//             credentials: "include"
//         });
//         if (!response.ok) {
//             throw new Error("Netzwerkantwort war nicht ok");
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Fehler beim Abrufen der Profil-Daten:", error);
//     }
// }
