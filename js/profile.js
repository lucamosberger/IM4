// /**
//  * Profilverwaltung JavaScript
//  * 
//  * Dieses Skript verwaltet die Benutzerprofile mit CRUD-Operationen (Create, Read, Update, Delete).
//  * Es ermöglicht das Anzeigen, Erstellen, Aktualisieren und Löschen von Benutzerinformationen.
//  * 
//  * Ablauf:
//  * 1. Authentifizierungsprüfung: Ist der Benutzer eingeloggt?
//  * 2. Laden der Profildaten: Existiert bereits ein Profil?
//  * 3. Event-Handler für CRUD-Operationen einrichten
//  */

// // _______________________________________________________________
// // Authentifizierungsprüfung - Stellt sicher, dass der Benutzer eingeloggt ist
// // _______________________________________________________________

// /**
//  * Prüft, ob der Benutzer authentifiziert ist
//  * 
//  * @returns {Object|boolean} Benutzerdaten bei erfolgreicher Authentifizierung, sonst false
//  */
// async function checkAuth() {
//   try {
//     // API-Anfrage mit Credentials senden (überträgt Cookies zur Authentifizierung)
//     const response = await fetch("/api/protected.php", {
//       credentials: "include",
//     });

//     // Wenn nicht authentifiziert (401), zur Login-Seite weiterleiten
//     if (response.status === 401) {
//       window.location.href = "/login.html";
//       return false;
//     }

//     // Erfolgreiche Authentifizierung: Benutzerdaten zurückgeben
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     // Bei Fehlern in der API-Anfrage: Fehler loggen und zur Login-Seite weiterleiten
//     console.error("Auth check failed:", error);
//     window.location.href = "/login.html";
//     return false;
//   }
// }

// /**
//  * Selbstausführende asynchrone Funktion (IIFE)
//  * Führt den Code nur aus, wenn die Authentifizierung erfolgreich war
//  */
// (async function() {
//   // Authentifizierung prüfen und abbrechen, wenn nicht erfolgreich
//   const authResult = await checkAuth();
//   if (!authResult) return; // Code-Ausführung stoppen, wenn nicht authentifiziert

//   // _______________________________________________________________
//   // Laden der Profildaten aus der API - READ Operation
//   // _______________________________________________________________

//   /**
//    * Lädt Benutzerprofildaten von der API
//    * 
//    * @returns {Object} API-Antwort mit Benutzerdaten oder Fehlerinformationen
//    */
//   async function loadData() {
//       const url = '/api/profile/readProfile.php'; // Endpoint für das Lesen von Profildaten
//       try {
//           // Fetch-API zum Laden der Daten verwenden
//           const response = await fetch(url);
          
//           // HTTP-Fehler abfangen (nicht 200-299)
//           if (!response.ok) {
//               return { error: `HTTP error! status: ${response.status}` };
//           }
          
//           // Erfolgreiche Antwort als JSON zurückgeben
//           return await response.json();
//       } catch (error) {
//           // Netzwerk- oder JSON-Parsing-Fehler abfangen
//           console.error(error);
//           return { error: 'Failed to fetch data' };
//       }
//   }

//   // Daten laden und Fehlerbehandlung
//   let data;
//   try {
//       data = await loadData();
//       console.log(data); // Daten zur Überprüfung in der Konsole ausgeben
//   } catch (e) {
//       // Unerwartete Fehler beim Laden abfangen
//       console.error("Error loading data:", e);
//       data = { error: e.message };
//   }

//   // DOM-Elemente für die Datenanzeige auswählen
//   const domfirstName = document.querySelector('#firstName');
//   const domlastName = document.querySelector('#lastName');
//   const inputBirthYear = document.querySelector('#inputBirthday');

//   /**
//    * Daten im Benutzerinterface anzeigen
//    * - Prüfen, ob gültige Benutzerdaten vorhanden sind
//    * - Anzeigen der Daten oder einer Nachricht, wenn keine Daten vorhanden sind
//    */
//   if (data && !data.error && data.user && data.user.firstname) {
//       // Wenn Benutzerdaten existieren: Daten in den DOM einfügen
//       domfirstName.innerHTML = data.user.firstname;
//       domlastName.innerHTML = data.user.lastname;
//       inputBirthYear.value = data.user.geburtsjahr || '';
//   } else {
//       // Wenn keine Benutzerdaten vorhanden: Standardnachricht anzeigen
//       domfirstName.innerHTML = "No user information";
//       domlastName.innerHTML = "No user information";
//       inputBirthYear.value = "";
//   }

//   // _______________________________________________________________
//   // Vorname und Nachname zur Datenbank hinzufügen - CREATE Operation
//   // _______________________________________________________________

//   // DOM-Elemente für die Eingabefelder und den Speichern-Button auswählen
//   const inputFirstName = document.querySelector('#inputFirstName');
//   const inputLastName = document.querySelector('#inputLastName');
//   const saveButton = document.querySelector('#btnSaveAdditionalInfo');

//   /**
//    * Event-Listener für den Speichern-Button
//    * Speichert die eingegebenen Vor- und Nachnamen in der Datenbank
//    */
//   saveButton.addEventListener('click', async () => {
//       // Benutzereingaben auslesen
//       let firstName = inputFirstName.value;
//       let lastName = inputLastName.value;
      
//       // API-Endpoint für das Erstellen von Profildaten
//       const url = '/api/profile/createProfile.php';
      
//       // Daten-Objekt für die API-Anfrage erstellen
//       const data = {
//           firstname: firstName,
//           lastname: lastName
//       };
      
//       // Daten zur API senden und Ergebnis abwarten
//       const dataAdded = await addData(url, data);
//       console.log(dataAdded);
      
//       // Wenn erfolgreich gespeichert: Seite neu laden, um aktualisierte Daten anzuzeigen
//       if (dataAdded && !dataAdded.error) {
//           window.location.reload();
//       }
//   });

//   /**
//    * Sendet Daten per POST-Anfrage an die API
//    * 
//    * @param {string} url - API-Endpoint
//    * @param {Object} data - Zu sendende Daten
//    * @returns {Object} API-Antwort oder Fehlerinformationen
//    */
//   async function addData(url, data) {
//       try {
//           // POST-Anfrage mit JSON-Daten senden
//           const response = await fetch(url, {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json'
//               },
//               body: JSON.stringify(data)
//           });
//           return await response.json();
//       } catch (error) {
//           // Fehler abfangen und strukturierte Fehlermeldung zurückgeben
//           console.error(error);
//           return { error: 'Failed to add data' };
//       }
//   }

//   // _______________________________________________________________
//   // Geburtsjahr aktualisieren - UPDATE Operation
//   // _______________________________________________________________

//   // Button zum Speichern des Geburtsjahrs auswählen
//   const saveBirthYearButton = document.querySelector('#btnUpdateBirthday');

//   /**
//    * Event-Listener für den Button zum Aktualisieren des Geburtsjahrs
//    * Sendet das aktualisierte Geburtsjahr an die API
//    */
//   saveBirthYearButton.addEventListener('click', async () => {
//       // Eingabewert auslesen
//       const birthYearInput = inputBirthYear.value;
      
//       // API-Endpoint für das Aktualisieren von Profildaten
//       const url = '/api/profile/updateProfile.php';
      
//       // Daten-Objekt für die API-Anfrage erstellen
//       const data = {
//           birthyear: birthYearInput
//       };
      
//       // Daten zur API senden und Ergebnis abwarten
//       const dataUpdated = await updateData(url, data);
//       console.log(dataUpdated);
      
//       // Wenn erfolgreich aktualisiert: Seite neu laden, um aktualisierte Daten anzuzeigen
//       if (dataUpdated && !dataUpdated.error) {
//           window.location.reload();
//       }
//   });

//   /**
//    * Sendet Daten per PUT-Anfrage an die API
//    * 
//    * @param {string} url - API-Endpoint
//    * @param {Object} data - Zu aktualisierende Daten
//    * @returns {Object} API-Antwort oder Fehlerinformationen
//    */
//   async function updateData(url, data) {
//       try {
//           // PUT-Anfrage mit JSON-Daten senden
//           const response = await fetch(url, {
//               method: 'PUT',
//               headers: {
//                   'Content-Type': 'application/json'
//               },
//               body: JSON.stringify(data)
//           });
//           return await response.json();
//       } catch (error) {
//           // Fehler abfangen und strukturierte Fehlermeldung zurückgeben
//           console.error(error);
//           return { error: 'Failed to update data' };
//       }
//   }

//   // _______________________________________________________________
//   // Kontoinformationen löschen - DELETE Operation
//   // _______________________________________________________________

//   // Button zum Löschen der Kontoinformationen auswählen
//   const deleteInformationButton = document.querySelector('#btnDeleteInformation');

//   /**
//    * Event-Listener für den Löschen-Button
//    * Sendet Löschungsanfrage an die API
//    */
//   deleteInformationButton.addEventListener('click', async () => {
//       // API-Endpoint für das Löschen von Profildaten
//       const url = '/api/profile/deleteProfile.php';
      
//       // Löschanfrage senden und Ergebnis abwarten
//       const dataDeleted = await deleteData(url);
//       console.log(dataDeleted);
      
//       // Wenn erfolgreich gelöscht: Seite neu laden, um aktualisierte Ansicht anzuzeigen
//       if (dataDeleted && !dataDeleted.error) {
//           window.location.reload();
//       }
//   });

//   /**
//    * Sendet DELETE-Anfrage an die API
//    * 
//    * @param {string} url - API-Endpoint
//    * @returns {Object} API-Antwort oder Fehlerinformationen
//    */
//   async function deleteData(url) {
//       try {
//           // DELETE-Anfrage senden
//           const response = await fetch(url, {
//               method: 'DELETE',
//               headers: {
//                   'Content-Type': 'application/json'
//               }
//           });
//           return await response.json();
//       } catch (error) {
//           // Fehler abfangen und strukturierte Fehlermeldung zurückgeben
//           console.error(error);
//           return { error: 'Failed to delete data' };
//       }
//   };
// })();