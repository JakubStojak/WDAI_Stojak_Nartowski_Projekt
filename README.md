# WDAI_Stojak_Nartowski_Projekt

Projekt na potrzeby przedmiotu Wprowadzenie Do Aplikacji Internetowych, Informatyka AGH.
Autorzy: Jakub Stojak, Adam Nartowski

---

# Technologie i Biblioteki

**Frontend:**

- **[React](https://react.dev/)** - biblioteka interfejsu.
- **[TypeScript](https://www.typescriptlang.org/)** - statyczne typowanie.
- **[Material UI (MUI)](https://mui.com/)** - biblioteka komponentów.
- **React Router** - obsługa nawigacji (routingu).
- **Axios** - obsługa zapytań HTTP do backendu.

**Backend:**

- **Node.js & Express** - serwer aplikacji.
- **SQLite3** - lekka baza danych plikowa.
- **Sequelize** - ORM do komunikacji z bazą danych.
- **Bezpieczeństwo i Autoryzacja:**
  - **bcrypt** - haszowanie haseł.
  - **JWT (JSON Web Token)** - generowanie tokenów dostępu.
  - **cookie-parser** - obsługa tokenów przesyłanych w ciasteczkach.
  - **CORS** - konfiguracja dostępu dla frontendu.

Produkty pobierane są z zewnętrznego API: [https://dummyjson.com/products](https://dummyjson.com/products).

---

# Setup i Instalacja

Aby uruchomić projekt lokalnie, należy wykonać poniższe kroki.

### 1. Klonowanie i instalacja zależności

Projekt składa się z dwóch części (frontend i backend), które wymagają oddzielnej instalacji.

**Frontend:**
Otwarcie terminala i przejście do folderu aplikacji:

```bash
cd src/my-app
npm install
```

**Backend:**
W nowym terminalu (lub po przejściu do głównego folderu):

```bash
cd server
npm install
```

### 2. Konfiguracja zmiennych środowiskowych (.env)

W katalogu `server` należy stworzyć plik o nazwie `.env` i uzupełnić go według poniższego wzoru:

```text
PORT=3003
JWT_SECRET=twoje_tajne_haslo_jwt
REFRESH_TOKEN_SECRET=twoje_tajne_haslo_refresh
```

### 3. Uruchomienie projektu

Należy uruchomić dwa terminale jednocześnie:

**Terminal 1 (Frontend):**

```bash
cd src/my-app
npm start
```

**Terminal 2 (Backend):**

```bash
cd server
node server.js
```

---

# Funkcjonalność

Strona jest prostym sklepem internetowym. Posiada stronę główną, na której znajduje się m.in. produkt miesiąca, który może ustawiać administrator.

W sekcji produkty znajduje się lista z filtrowaniem oraz podziałem na kategorie, mamy możliwość dodania produktu w dowolnej ilości do koszyka oraz kliknięcia na szczegóły produktu, w którym pokazant jest opis z dummyjson.com oraz opinie wystawione na stronie. Każdy użytkownik ma możliwość dodania opinii na stronie, jednak tylko jednej na konto. Widoczna jest data opinii oraz ilość gwiazdek.

Strona logowania jest prostym lgoowaniem przez mail i hasło. Istnieje popup pozwalający na przypomnienie hasła po wpisaniu maila, jednak nie jest on funkcjonalny. Jeśli nie posiadamy konta, możemy się zarejestrować, tworzy to nowego użytkownika w backendzie. Logowanie obsługuje JWT razem z refresh token.

Po zalogowaniu można dodawać produkty do koszyka oraz je usuwać, zmieniać ilość lub wyczyścić koszyk. Jeśli złożymy zamówienie, jest ono zapisywane w bazie danych (tak samo jak opinie). Koszyk przelicza się automatycznie.

W panelu użytkownika mamy możliwość przeglądania swoich zamówień, wystawionych opinii oraz swoich punktów za zamówienia. Istnieje również możliwość ustawienia swojego nicku na jakikolwiek inny (strona wita nas w ten sposób). Dodatkowo, jeśli użytkownik jest administratorem, to w panelu znajduje się możliwość zmiany produktu miesiąca. Tutaj również znajduje się możliwość zmiany motywu na ciemny.
