# Gmail SMTP Setup za KBK Princip Backend

## Prednosti Gmail SMTP
- ✅ **BESPLATNO**: 500 emailova dnevno
- ✅ **Radi sa SVIM email adresama** (nema ograničenja kao trial servisi)
- ✅ **Brza isporuka** (instant)
- ✅ **Pouzdano** (Google infrastruktura)
- ✅ **Nema potrebe za domain verifikacijom**

## Kako podesiti Gmail SMTP

### Korak 1: Omogućite 2-Factor Authentication (2FA)
1. Idite na [Google Account Security](https://myaccount.google.com/security)
2. Kliknite na "2-Step Verification"
3. Pratite uputstva da omogućite 2FA

### Korak 2: Kreirajte App Password
1. Nakon što je 2FA omogućen, idite na [App Passwords](https://myaccount.google.com/apppasswords)
2. Izaberite "Mail" iz dropdown menija
3. Kliknite "Generate"
4. Kopirajte 16-karakterni kod (bez razmaka)
   - Primer: `abcd efgh ijkl mnop` → kopirajte kao `abcdefghijklmnop`

### Korak 3: Podesite Environment Variables na Vercel

1. Idite na Vercel Dashboard
2. Otvorite projekt `kbk-princip-android-backend`
3. Idite na Settings → Environment Variables
4. Dodajte:
   ```
   GMAIL_USER = vaš-gmail@gmail.com
   GMAIL_APP_PASSWORD = 16-karakterni-kod (bez razmaka)
   ```

### Korak 4: Redeploy
1. Idite na Deployments tab
2. Kliknite na "..." pored najnovijeg deploy-a
3. Kliknite "Redeploy"

## Testiranje

Možete testirati slanje emailova preko:
```
POST https://kbk-princip-android-backend.vercel.app/api/test-email
{
  "email": "test@example.com"
}
```

## Limiti
- **Dnevni limit**: 500 emailova
- **Po minuti**: ~20 emailova
- Dovoljno za registraciju i verifikaciju korisnika

## Troubleshooting

### Email se ne šalje
1. Proverite da li je 2FA omogućen na Gmail nalogu
2. Proverite da li je App Password ispravno kopiran (16 karaktera, bez razmaka)
3. Proverite Vercel logs za greške

### "Authentication failed" greška
- App Password nije valjan ili je istekao
- Kreirajte novi App Password

### Emails idu u Spam
- Ovo je retko sa Gmail SMTP
- Korisnici mogu dodati pošiljaoca u kontakte