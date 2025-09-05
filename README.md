# Fitness Planner

<p align="center">
<img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="200" alt="Laravel Logo">
<img src="https://reactjs.org/logo-og.png" width="200" alt="React Logo">
</p>

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
git clone <repo-url>
Instaliraj PHP zavisnosti:

bash
Copy code
composer install
Kreiraj .env fajl:

bash
Copy code
cp .env.example .env
Konfiguriši bazu podataka u .env fajlu

Pokreni migracije:

bash
Copy code
php artisan migrate
Pokreni server:

bash
Copy code
php artisan serve
Frontend (React)
Idi u frontend direktorijum:

bash
Copy code
cd frontend/fitnessplaner
Instaliraj npm pakete:

bash
Copy code
npm install
Pokreni razvojni server:

bash
Copy code
npm start
REST API
Aplikacija koristi RESTful API sa sledećim funkcionalnostima:

Autentifikacija

POST /api/register – registracija korisnika

POST /api/login – prijava

POST /api/logout – odjava

Treninzi

GET /api/workouts – svi treninzi trenutnog korisnika

POST /api/workouts – kreiranje treninga

PUT /api/workouts/{id} – izmena treninga

DELETE /api/workouts/{id} – brisanje treninga

POST /api/coach/add-workout – trener dodaje trening za korisnika

Nutricija

GET /api/nutrition-entries – svi unosi hrane

GET /api/nutrition-entries/total-calories – ukupne kalorije

GET /api/nutrition-daily-calories – dnevni unos kalorija za graf

GET /api/nutrition-hydration-summary – pregled unosa za određeni datum

GET /api/nutrition-hydration-summary/pdf – PDF izveštaj

Hidracija

GET /api/hydration-entries – svi unosi vode

GET /api/hydration-entries/total-ml – ukupna količina vode

Trener

GET /api/coach/users – lista korisnika koje trener prati

Struktura projekta
bash
Copy code
fitnessplaner/
├── backend/ (Laravel API)
│   ├── app/
│   ├── routes/api.php
│   ├── database/migrations/
│   └── ...
└── frontend/ (React)
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx
    │   │   ├── DailyCaloriesChart.jsx
    │   │   └── ...
    │   └── App.jsx
    └── package.json
Dodatne napomene
Frontend i backend komuniciraju preko REST API i tokena iz Laravel Sanctum.

Grafički prikazi koriste react-google-charts.

PDF izveštaji se generišu korišćenjem DomPDF.

Trener i korisnik imaju različite role, koje definišu prava pristupa.