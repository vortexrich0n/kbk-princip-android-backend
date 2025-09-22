export default function TermsOfService() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KBK Princip - Uslovi Korišćenja</title>
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
        p, li {
            margin-bottom: 10px;
            color: #555;
        }
        ul {
            margin-left: 30px;
            margin-bottom: 15px;
        }
        .contact-box {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Uslovi Korišćenja</h1>
        <p class="date"><strong>Datum poslednje izmene:</strong> Januar 2025</p>

        <h2>1. Prihvatanje Uslova</h2>
        <p>Korišćenjem KBK Princip mobilne aplikacije, prihvatate ove Uslove korišćenja.</p>

        <h2>14. Kontakt</h2>
        <div class="contact-box">
            <p>Za sva pitanja u vezi sa Uslovima korišćenja, kontaktirajte nas:</p>
            <strong>Developer:</strong> Borivoj Brankov<br>
            <strong>Email:</strong> bbrankov997@gmail.com<br>
            <strong>Aplikacija:</strong> KBK Princip<br>
        </div>
    </div>
</body>
</html>
    ` }} />
  );
}