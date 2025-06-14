document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchProfileData();

    console.log("Profilseite geladen");
    const form = document.getElementById("profilForm");
    const user_nameInput = document.getElementById("user_name");
    const anredeInput = document.getElementById("anrede");
    const vornameInput = document.getElementById("vorname");
    const nachnameInput = document.getElementById("nachname");
    const emailInput = document.getElementById("e-mail");
    const passwortInput = document.getElementById("password");

    console.log("Profil-Daten:", data);
    vornameInput.value = data.user.firstname || "";
    nachnameInput.value = data.user.lastname || "";
    emailInput.value = data.user.email || "";
    anredeInput.value = data.user.anrede || "";
    user_nameInput.value = data.user.user_name || "";


    form.addEventListener("submit", (e) => {
    e.preventDefault();

    const daten = {
        user_name: user_nameInput.value,
        anrede: anredeInput.value,
        vorname: vornameInput.value,
        nachname: nachnameInput.value,
        email: emailInput.value,
        passwort: passwortInput.value
    };

    fetch("api/profile/updateProfile.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(daten)
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {
                // ✅ Weiterleitung zur Startseite
                window.location.href = "start.php";
            } else {
                alert("Fehler beim Speichern!");
            }
        })
        .catch(error => {
            console.error("Fehler beim Senden:", error);
            alert("Ein Fehler ist aufgetreten.");
        });
});
});

async function fetchProfileData() {
    try {
        const response = await fetch("/api/profile/readProfile.php", {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Netzwerkantwort war nicht ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Profil-Daten:", error);
    }
}


