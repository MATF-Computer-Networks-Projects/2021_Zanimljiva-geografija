# 2021_Zanimljiva-geografija

# Opis teme
Implementacija popularne multiplayer igrice Zanimljiva geografija, gde igrači, za zadato slovo, treba da ispišu naziv države, grada, reke i planine na to slovo. Projekat takođe sadrži i čet sistem, kao i mogućnost kreiranja nove igre, pridruživanje postojećim igrama kao i pravljenje privatne igre, gde samo sa šifrom sobe mogu drugi korisnici da uđu. Takođe postoji sistem za autentifikaciju korisnika.

## Pravila igre
Igra sadrži četiri igrača i tri runde, i nakon što se započne runda, igrači imaju zadatak da ispišu nazive države, grada, reke i planine na zadato slovo. Nakon prvog potvrđivanja odgovora od strane nekog igrača, ostalima preostaje još 60 sekundi da unesu svoje odgovore, i nakon isteka 60 sekundi prelazi se u novu rundu. Igrači skupljaju poene na sledeći način : ukoliko igrač ima jedinstveni unos za zadati atribut (i naravno ukoliko je unos validan), dobija maksimalnih 15 poena za zadati atribut, a ukoliko ima bar dva igrača koja imaju isti unos za određeni atribut (i ako je unos validan) dobijaju po 10 poena za taj atribut, i 0 poena igrači dobijaju za zadati atribut ako nemaju unos ili ako nije validan. Pobednik je onaj koji nakon tri runde skupi najviše poena.


## Programski jezici i tehnologije

Projekat je rađen u programskom jeziku JavaScript, korišćenjem Node.js radnog okvira za razvoj serverskog dela aplikacije, za bazu podataka je korišćen MongoDB ,dok se za korišćenje WebSocket-a koristila biblioteka socket.io. Takođe su korišćene biblioteke express, mongoose. 

## Pokretanje programa

Da biste pokrenuli program, neophodno je instalirati Node.js preko linka https://nodejs.org/en/download/. Zatim, potrebno je preko terminala klonirati projekat preko git clone url_projekta (potrebno je da bude instaliran git na računaru). Nakon pozicioniranja u direktorijum projekta, potrebno je pokrenuti npm start, i onda se aplikacija pokrece na localhost serveru na 3000 portu, tacnije na adresi localhost:3000/login.

 

