# My-Car-App
Die App erlaubt die Pflege eines Account-spezifischen Fuhrparks. Erfasst werden können Autos (inkl. Bild), deren gefahrene Strecken, Tankrechnungen, Werkstattrechnungen (incl. Beleg), Versicherungskosten und KFZ-Steuern. Errechnet werden die Kosten pro Kilometer und Fahrzeug (siehe Beschreibung Wertverlust unterhalb). Der Nutzer muss nach eingehender Registrierung eingeloggt sein um die Funktionen der App (vie WebBrowser) nutzen zu können. 

*Berechung Wertverlust allgemein:*
- berücksichtigte Werte:
-- Streckenbuch (erfasste, gefahrene Distanzen)
-- Tankbuch (erfasste Tankrechnungen)
-- Werkstattbuch (erfasste Werkstattrechnungen)
-- Versicherungsbuch (erfasste Versicherungsverträge)
-- Steuerbuch (erfasste KFZ-Steuerabgaben)
-- Fahrzeug Wertverlust nach Fahrzeugalter (Faustformel) und Kilometerstand (Faustformel) >> der höhere Wertverlust beider Werte wird in der Rechung genutzt

*Berechung Wertverlust Fahrzeug:*
- Wertverlust nach Fahrzeugalter
-- Nutzung eines dedizierten Referenzarrays (Bestimmung nach Alter)
-- Wenn das Fahrzeugalter nicht mehr durch die Referenztabelle abgedeckt wäre wird der maximale Wertverlust genutzt
-- Die Differenz aus Fahrzeugalter und Fahrzeugbesitz bestimmt den Wertverfall für den Kaufpreis  
- Wertverlust nach Kilometerstand
-- Nutzung eines dedizierten Referenzarrays (Bestimmung auch hier nach Alter)
-- Wenn das Fahrzeugalter nicht mehr durch die Referenztabelle abgedeckt wäre wird der maximale Wertverlust genutzt
-- Wenn die tatsächlich gefahrenen Strecken die angenommen 15k / Jahr unterschreiten (bzw. überschreiten) wird ein Faktor bestimmt
-- Die Differenz aus Fahrzeugalter und Fahrzeugbesitz bestimmt den Wertverfall für den Kaufpreis (modifiziert durch den Faktor)