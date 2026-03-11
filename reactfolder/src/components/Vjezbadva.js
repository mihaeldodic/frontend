import vjezbadva from "./zadaci/data/vjezbadva.json";

const Vjezbadva = () => {
  console.log(vjezbadva);

  return (
    <div className="container">
      <h1>Vježba dva</h1>

      {vjezbadva.map((item) => (
        <div key={item.id} style={styles.row}>
          <p><strong>User ID:</strong> {item.userId}</p>
          <p><strong>ID:</strong> {item.id}</p>
          <p><strong>Title:</strong> {item.title}</p>
          <p style={{ whiteSpace: "pre-line" }}>
            <strong>Body:</strong><br />
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  row: {
    border: "1px solid #ccc",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
  },
};

export default Vjezbadva;