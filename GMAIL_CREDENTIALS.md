# Gmail SMTP Kredencijali za Vercel

## Kopirajte ove environment variables na Vercel:

1. Idite na: https://vercel.com/vortexrich0ns-projects/kbk-princip-android-backend/settings/environment-variables

2. Dodajte sledeće variable:

```
GMAIL_USER = zgffitudok@gmail.com
GMAIL_APP_PASSWORD = qafqgahcklnafkeu
```

⚠️ **VAŽNO**: App password kopirajte BEZ RAZMAKA!
- Originalni format: `qafq gahc klna fkeu`
- Pravilno: `qafqgahcklnafkeu`

3. Kliknite "Save" za svaku variablu

4. Idite na Deployments tab i kliknite "Redeploy" na najnoviji deployment

## Testiranje

Nakon redeploy-a, testirajte sa:
```bash
curl -X POST https://kbk-princip-android-backend.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "zgffitudok@gmail.com"}'
```

Email bi trebalo da stigne za nekoliko sekundi.

## Gmail nalog informacije
- Email: zgffitudok@gmail.com
- Password: JackAndJones123!!
- App Password: qafqgahcklnafkeu (bez razmaka)