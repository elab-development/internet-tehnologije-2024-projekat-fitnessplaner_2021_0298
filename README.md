# Fitness Planner

Fitness Planner je web aplikacija za praćenje fizičke aktivnosti, unosa hrane i hidracije. Omogućava korisnicima da kreiraju, pregledaju i ažuriraju svoje treninge, dnevni unos kalorija i količinu unete vode. Takođe, treneri mogu da kreiraju treninge za svoje korisnike i prate njihove aktivnosti.

---

## Tehnologije korišćene

- **Backend:** Laravel 10 (PHP)
- **Frontend:** React.js
- **Baza podataka:** MySQL / MariaDB
- **Autentifikacija:** Laravel Sanctum
- **Vizualizacija podataka:** react-google-charts
- **PDF generisanje:** barryvdh/laravel-dompdf
- **API Requests:** Axios

---

## Funkcionalnosti

### Korisničke
- Registracija i prijava korisnika
- Praćenje unosa hrane i hidracije
- Kreiranje, pregled i izmena treninga
- Pregled dnevnog i mesečnog unosa kalorija
- Grafički prikaz unosa kalorija za tekući mesec (LineChart)
- PDF izveštaj za dnevni unos hrane i hidracije

### Trenerske
- Kreiranje treninga za svoje korisnike
- Pregled treninga korisnika po danima
- Autorizacija i prava pristupa za trenere i korisnike

---

## Instalacija

### Backend (Laravel)

1. Kloniraj repozitorijum:

```bash
git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-fitnessplaner_2021_0298
```

2. Instaliraj PHP zavisnosti:

```bash
composer install
```

3. Kreiraj `.env` fajl:

```bash
cp .env.example .env
```

4. Konfiguriši bazu podataka u `.env` fajlu.

5. Pokreni migracije:

```bash
php artisan migrate
```

6. Pokreni server:

```bash
php artisan serve
```

### Frontend (React)

1. Idi u frontend direktorijum:

```bash
cd frontend/fitnessplaner
```

2. Instaliraj npm pakete:

```bash
npm install
```

3. Pokreni razvojni server:

```bash
npm start
```

---

**Napomene:**

- Frontend i backend komuniciraju preko REST API i tokena iz Laravel Sanctum.  
- Grafički prikazi koriste react-google-charts.  
- PDF izveštaji se generišu korišćenjem DomPDF.  
- Trener i korisnik imaju različite role, koje definišu prava pristupa.