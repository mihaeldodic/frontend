
import tecaj from "./data/tecaj.json";

const Tecaj = () => {
  return (
    <div className="container">
      <h1>Tečajna lista</h1>

      <table className="table mt-3 mb-5">
        <thead>
          <tr>
            <th>Država</th>
            <th>Valuta</th>
            <th>Kupovni tečaj</th>
            <th>Prodajni tečaj</th>
            <th>Srednji tečaj</th>
            <th>Datum primjene</th>
          </tr>
        </thead>
        <tbody>
          {tecaj.map((tecaj) => (
            <tr>
              <td>{tecaj.drzava}</td>
              <td>{tecaj.valuta}</td>
              <td>{tecaj.kupovni_tecaj}</td>
              <td>{tecaj.prodajni_tecaj}</td>
              <td>{tecaj.srednji_tecaj}</td>
              <td>{tecaj.datum_primjene}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tecaj;