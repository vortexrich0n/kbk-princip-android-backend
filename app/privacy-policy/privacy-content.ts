export const privacyPolicyHTML = `<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KBK Princip - Politika Privatnosti</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #DC2626;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 3px solid #DC2626;
        }
        h2 {
            color: #1a1a1a;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 4px solid #DC2626;
        }
        h3 {
            color: #444;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        p, li {
            margin-bottom: 10px;
            color: #555;
        }
        ul {
            margin-left: 30px;
            margin-bottom: 15px;
        }
        strong {
            color: #333;
        }
        .metadata {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .contact-box {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .important {
            background: #d1ecf1;
            border-left: 4px solid #0c5460;
            padding: 15px;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .container { padding: 20px; }
            h1 { font-size: 24px; }
            h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Politika Privatnosti</h1>
        <h2>KBK Princip Aplikacija</h2>

        <div class="metadata">
            <strong>Datum poslednje izmene:</strong> 22. septembar 2025<br>
            <strong>Verzija:</strong> 1.0
        </div>

        <h2>1. Uvod</h2>
        <p>Dobrodošli u KBK Princip aplikaciju ("Aplikacija"). Poštujemo vašu privatnost i posvećeni smo zaštiti vaših ličnih podataka. Ova Politika privatnosti objašnjava kako prikupljamo, koristimo, čuvamo i štitimo vaše informacije kada koristite našu aplikaciju za upravljanje članstvom u teretani/klubu.</p>

        <h2>2. Vlasnik podataka i kontakt</h2>
        <div class="contact-box">
            <strong>Developer:</strong> Borivoj Brankov<br>
            <strong>Email:</strong> bbrankov997@gmail.com
        </div>

        <h2>3. Podaci koje prikupljamo</h2>

        <h3>3.1 Podaci koje direktno pružate:</h3>
        <ul>
            <li><strong>Email adresa</strong> - za kreiranje naloga i autentifikaciju</li>
            <li><strong>Ime i prezime</strong> - za personalizaciju naloga</li>
            <li><strong>Lozinka</strong> - čuva se šifrovano pomoću bcrypt algoritma</li>
        </ul>

        <h3>3.2 Podaci koje automatski prikupljamo:</h3>
        <ul>
            <li><strong>Evidencija dolazaka</strong> - datum i vreme kada ste skenirali QR kod</li>
            <li><strong>IP adresa</strong> - za bezbednost i prevenciju zloupotrebe</li>
            <li><strong>Tip uređaja i OS verzija</strong> - za tehničku podršku</li>
            <li><strong>Crash logs</strong> - anonimni podaci o padovima aplikacije</li>
        </ul>

        <h3>3.3 Dozvole koje zahtevamo:</h3>
        <ul>
            <li><strong>Kamera</strong> - isključivo za skeniranje QR koda pri evidentiranju dolaska</li>
            <li><strong>Internet</strong> - za komunikaciju sa serverom</li>
            <li><strong>Mrežni status</strong> - za proveru konekcije</li>
        </ul>

        <h2>4. Kako koristimo vaše podatke</h2>
        <p>Vaše podatke koristimo isključivo za:</p>
        <ul>
            <li>Kreiranje i upravljanje vašim nalogom</li>
            <li>Verifikaciju članarine i evidentiranje dolazaka</li>
            <li>Slanje emaila za verifikaciju i reset lozinke</li>
            <li>Poboljšanje funkcionalnosti aplikacije</li>
            <li>Komunikaciju o vašem članstvu</li>
            <li>Prevenciju zloupotrebe i održavanje bezbednosti</li>
        </ul>

        <h2>5. Pravna osnova za obradu</h2>
        <p>Obrađujemo vaše podatke na osnovu:</p>
        <ul>
            <li><strong>Ugovora</strong> - za pružanje usluga članstva</li>
            <li><strong>Legitimnog interesa</strong> - za bezbednost i poboljšanje usluga</li>
            <li><strong>Zakonskih obaveza</strong> - kada je to zahtevano zakonom</li>
        </ul>

        <h2>6. Čuvanje i bezbednost podataka</h2>

        <h3>6.1 Bezbednosne mere:</h3>
        <ul>
            <li>Svi podaci se prenose preko HTTPS konekcije</li>
            <li>Lozinke se čuvaju pomoću bcrypt hash algoritma</li>
            <li>Tokeni za autentifikaciju koriste JWT sa ograničenim rokom važenja</li>
            <li>Lokalni podaci se čuvaju u EncryptedSharedPreferences</li>
            <li>Redovne bezbednosne provere i ažuriranja</li>
        </ul>

        <h3>6.2 Lokacija podataka:</h3>
        <ul>
            <li><strong>Server:</strong> Vercel (EU region)</li>
            <li><strong>Baza podataka:</strong> Neon PostgreSQL (EU region)</li>
            <li><strong>Analitika:</strong> Firebase (Google Cloud, EU)</li>
        </ul>

        <h2>7. Zadržavanje podataka</h2>
        <ul>
            <li><strong>Aktivni nalozi:</strong> Čuvamo dok imate aktivno članstvo</li>
            <li><strong>Neaktivni nalozi:</strong> Brišemo nakon 2 godine neaktivnosti</li>
            <li><strong>Evidencija dolazaka:</strong> Čuva se 1 godinu</li>
            <li><strong>Crash logs:</strong> 90 dana</li>
        </ul>

        <h2>8. Deljenje podataka sa trećim licima</h2>
        <div class="important">
            <strong>Ne prodajemo niti delimo vaše lične podatke</strong> sa trećim licima, osim:
            <ul>
                <li>Kada je to zahtevano zakonom</li>
                <li>Sa našim tehničkim provajderima (Vercel, Neon) koji su obavezani ugovorima o poverljivosti</li>
                <li>Firebase/Google za crash reporting (anonimizirani podaci)</li>
            </ul>
        </div>

        <h2>9. Vaša prava</h2>
        <p>Imate pravo da:</p>
        <ul>
            <li><strong>Pristupite</strong> svojim podacima</li>
            <li><strong>Ispravite</strong> netačne podatke</li>
            <li><strong>Obrišete</strong> svoj nalog</li>
            <li><strong>Ograničite</strong> obradu podataka</li>
            <li><strong>Prenesete</strong> podatke drugom servisu</li>
            <li><strong>Prigovorite</strong> na obradu podataka</li>
        </ul>
        <p>Za ostvarivanje ovih prava, kontaktirajte nas na: <strong>bbrankov997@gmail.com</strong></p>

        <h2>10. Podatci o maloletnicima</h2>
        <p>Aplikacija nije namenjena osobama mlađim od 16 godina. Ne prikupljamo svesno podatke od maloletnika bez roditeljske saglasnosti.</p>

        <h2>11. Kamera i QR skeniranje</h2>
        <div class="important">
            <p>Kamera se koristi <strong>isključivo</strong> za:</p>
            <ul>
                <li>Skeniranje QR koda za evidentiranje dolaska</li>
                <li>Ne pristupamo vašoj galeriji fotografija</li>
                <li>Ne snimamo niti čuvamo fotografije ili video zapise</li>
                <li>Kamera se aktivira samo kada eksplicitno otvorite skener</li>
            </ul>
        </div>

        <h2>12. Kolačići i praćenje</h2>
        <p>Aplikacija <strong>ne koristi</strong> kolačiće niti alate za praćenje u marketinške svrhe. Koristimo samo:</p>
        <ul>
            <li>Session tokene za autentifikaciju</li>
            <li>Firebase Analytics za osnovnu statistiku korišćenja (anonimizirano)</li>
        </ul>

        <h2>13. Promene politike privatnosti</h2>
        <p>Zadržavamo pravo izmene ove politike. O značajnim promenama ćete biti obavešteni putem:</p>
        <ul>
            <li>Notifikacije u aplikaciji</li>
            <li>Email obaveštenja</li>
            <li>Obaveštenja na sajtu</li>
        </ul>

        <h2>14. Kontakt</h2>
        <div class="contact-box">
            <p>Za sva pitanja u vezi sa privatnošću, kontaktirajte nas:</p>
            <strong>Developer:</strong> Borivoj Brankov<br>
            <strong>Email:</strong> bbrankov997@gmail.com
        </div>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #888;">
            <em>Korišćenjem KBK Princip aplikacije, saglasni ste sa ovom Politikom privatnosti.</em>
        </p>
    </div>
</body>
</html>`;