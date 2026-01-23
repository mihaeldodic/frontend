//import korisnici from "./data/korisnici.json";
import {useState} from "react";

const Korisnici = () => {

  const [korisnici, setKorisnici] = useState([]);

fetch('https://jsonplaceholder.typicode.com/users/')
      .then(response => response.json())
      .then(
        (data) => {
          setKorisnici(data);
        }
      )



  return (
    <div className="container">
      <h1>Popis korisnika</h1>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Korisničko ime</th>
            <th>Email</th>
            <th>Grad</th>
            <th>Telefon</th>
            <th>Tvrtka</th>
          </tr>
        </thead>

        <tbody>
          {korisnici.map((korisnik) => (
            <tr key={korisnik.id}>
              <td>{korisnik.id}</td>
              <td>{korisnik.name}</td>
              <td>{korisnik.username}</td>
              <td>{korisnik.email}</td>
              <td>{korisnik.address.city}</td>
              <td>{korisnik.phone}</td>
              <td>{korisnik.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Korisnici;