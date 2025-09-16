# 🚨 VAŽNO - KAKO SIGURNO RADITI

## TRENUTNO STANJE
✅ **main branch** = PRODUCTION (https://kbk-princip-android-backend.vercel.app)
✅ **development branch** = ZA TESTIRANJE

## KAKO DA RADIŠ BEZ KVARA:

### 1. UVEK PRVO PREBACI NA DEVELOPMENT
```bash
git checkout development
```

### 2. NAPRAVI IZMENE I TESTIRAJ
```bash
# Napravi izmene...
git add .
git commit -m "Opis izmene"
git push origin development
```

### 3. VERCEL AUTOMATSKI PRAVI PREVIEW
Čekaj 1-2 minuta i dobićeš preview URL kao:
- `kbk-princip-android-backend-git-development-vortexrich0n.vercel.app`

### 4. TESTIRAJ NA PREVIEW URL-u
```bash
# Primer testiranja:
curl https://kbk-princip-android-backend-git-development-vortexrich0n.vercel.app/api/login
```

### 5. AKO SVE RADI - MERGUJ U PRODUCTION
```bash
git checkout main
git merge development
git push origin main
```

## ⚠️ NIKAD NE RADI OVO:
❌ `git checkout main` i direktno menjati
❌ `git push origin main` bez testiranja na development
❌ Menjati prisma schema bez migracije

## 📱 ZA ANDROID APP:
Kada tesiraš sa Android app:
1. Promeni BASE_URL u app na preview URL
2. Testiraj sve funkcionalnosti
3. Tek onda vrati na production URL

## 🔧 AKO NEŠTO POKVARIŠ:
```bash
# Vrati se na poslednju radnu verziju
git checkout main
git reset --hard HEAD~1
git push --force origin main
```

## PREVIEW DEPLOYMENTS:
Svaki push na development automatski dobija preview:
- Development: `...-git-development-...vercel.app`
- Feature branches: `...-git-feature-xyz-...vercel.app`

ZAPAMTI: Development za test, Main za production!