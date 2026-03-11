import Korisnik from "./data/korisnik.json";

// Funkcija za prikaz korisnika
const Profil = () => {
    // //Ovo je JSON format, tekstualni oblik, string
    // const KorisnikJSON = '{ "ime" : "Mihael", "prezime" : "Dodic", "godine" : 25, "vozacka" : true, "vjestine" : [ "HTML", "CSS", "JavaScript", "React" ], "adresa" : { "ulica" : "Zagrebacka 12", "grad" : "Zagreb", "pbroj" : 10000 } }' ; 
    // //Pomoću JSON.parse() pretvaramo JSON string u Javascript objekt
    // const KorisnikObjekt = JSON.parse(KorisnikJSON);

    
    // const Korisnik = {
    //     //Javascript objekt se sastoji od "key" : "value" parova
    //     "ime" : "Mihael", //string
    //     "prezime" : "Dodic", //string
    //     "godine" : 25, //number
    //     "vozacka" : true, //boolean
    //     "vjestine" : [   //array / niz
    //         "HTML", 
    //         "CSS", 
    //         "JavaScript", 
    //         "React" 
    //     ],
    //     "adresa" : {  //objekt
    //         "ulica" : "Zagrebacka 12",
    //         "grad" : "Zagreb",
    //         "pbroj" : 10000
    //     }

    // };

    console.log(Korisnik);


    // Ova komponenta vraća informacije o koriskinku
    return (
        <div className="container">
            <h1>Profil korisnika</h1>
            <p>Ime: {Korisnik.ime}</p>
            <p>Prezime: {Korisnik.prezime}</p>
            <p>Godine: {Korisnik.godine}</p>

            <div>
                Vještine:
                <ul>
                    
                    {
                    // Map koristimo za prolazak kroz niz (i za ispisivanje vrijednosti, u ovom slučaju)
                    Korisnik.vjestine.map(
                        (vjestina, index) => (
                            <li>{index+1}. {vjestina}</li>
                        )
                    )
                }
                    
                </ul>
            </div>

            <p>Vozacka: {Korisnik.vozacka}</p>
            <p>Ulica: {Korisnik.adresa.ulica}</p>
            <p>Grad: {Korisnik.adresa.grad}</p>
            <p>Postanski broj: {Korisnik.adresa.pbroj}</p>

        </div>
    )

};

export default Profil; 