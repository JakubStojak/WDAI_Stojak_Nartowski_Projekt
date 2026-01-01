# WDAI_Stojak_Nartowski_Projekt
Projekt na potrzeby przedmiotu Wprowadzenie Do Aplikacji Internetowych, Informatyka AGH. 
Autorzy: Jakub Stojak, Adam Nartowski

# Wymagania i Biblioteki
Projekt jest napisany z użyciem biblioteki React (https://react.dev/). Używa ekstensywnie biblioteki komponentów Material UI (https://mui.com/material-ui/). Do tworzenia bazy danych do backendu zostało użyte sqlite3. Produkty są pobierane ze strony https://dummyjson.com/products.
Wymagania i setup projektu:


#Funkcjonalność 
Strona jest prostym sklepem internetowym. Posiada stronę główną, na której znajduje się m.in. produkt miesiąca, który może ustawiać administrator. 

W sekcji produkty znajduje się lista z filtrowaniem oraz podziałem na kategorie, mamy możliwość dodania produktu w dowolnej ilości do koszyka oraz kliknięcia na szczegóły produktu, w którym pokazant jest opis z dummyjson.com oraz opinie wystawione na stronie. Każdy użytkownik ma możliwość dodania opinii na stronie, jednak tylko jednej na konto. Widoczna jest data opinii oraz ilość gwiazdek.

Strona logowania jest prostym lgoowaniem przez mail i hasło. Istnieje popup pozwalający na przypomnienie hasła po wpisaniu maila, jednak nie jest on funkcjonalny. Jeśli nie posiadamy konta, możemy się zarejestrować, tworzy to nowego użytkownika w backendzie. Logowanie obsługuje JWT razem z refresh token. 

Po zalogowaniu można dodawać produkty do koszyka oraz je usuwać, zmieniać ilość lub wyczyścić koszyk. Jeśli złożymy zamówienie, jest ono zapisywane w bazie danych (tak samo jak opinie). Koszyk przelicza się automatycznie.

W panelu użytkownika mamy możliwość przeglądania swoich zamówień, wystawionych opinii oraz swoich punktów za zamówienia. Istnieje również możliwość ustawienia swojego nicku na jakikolwiek inny (strona wita nas w ten sposób). Dodatkowo, jeśli użytkownik jest administratorem, to w panelu znajduje się możliwość zmiany produktu miesiąca. Tutaj również znajduje się możliwość zmiany motywu na ciemny. 

