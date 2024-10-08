import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { Alert, Button, Container } from "react-bootstrap";
import { Card, Form } from "react-bootstrap";

let BASE_URL = "http://localhost:5000/player/";

const Player = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [sport, setSport] = useState(null);
  const [error, setError] = useState([]);
  const [isPending, setIsPending] = useState(true);

  const onChange = (event) => {
    setSport(event.target.value);
  };

  const getPlayer = async () => {
    const res = await fetch(`${BASE_URL}${id}`);
    if (!res.ok) {
      setError("Error fetching player");
    } else {
      const data = await res.json();
      setPlayer(data);
      setSport(data.sport);
    }
    setIsPending(false);
  };

  const handleDelete = async () => {
    const response = await fetch(`${BASE_URL}${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      let errArray = data.detail.map((el) => {
        return `${el.loc[1]} -${el.msg}`;
      });
      setError(errArray);
    } else {
      setError([]);
      navigate("/player");
    }
  };

  const updateSport = async () => {
    console.log("What", `${BASE_URL}${id}`);
    const response = await fetch(`${BASE_URL}${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sport }),
    });

    const data = await response.json();
    if (!response.ok) {
      let errArray = data.detail.map((el) => {
        return `${el.loc[1]} -${el.msg}`;
      });
      setError(errArray);
    } else {
      setError([]);
      getPlayer();
    }
  };

  useEffect(() => {
    getPlayer(id);
  }, [id]);

  return (
    <Container>
    <Layout>
      {isPending && (
        <div className="bg-red-500 w-full text-white h-10 text-lg">
          <Loading></Loading>
        </div>
      )}

      {error && (
        <div>
          {error &&
            error.map((el, index) => (
              <Alert key="danger" variant="danger">
                {index} - {el}
              </Alert>
            ))}
        </div>
      )}

      {player && (
        <div>
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src="https://via.placeholder.com/960x550.png?text=IMAGINE+A+CAR!"
            />
            <Card.Body>
              <Card.Title>
                {player.brand} {player.make}
              </Card.Title>
              <Card.Text>
                <div>Sport: <span>{player.sport}</span></div>
                <div>Year: {player.year}</div>
                <div>Km: {player.km}</div>
                <div>
                  <Form>
                    <Form.Group className="mb-3" controlId="formSport">
                      <Form.Label>Sport</Form.Label>
                      <Form.Control type="number" placeholder="Enter sport" onChange={onChange}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={updateSport}>Edit Sport</Button>
                    <Button variant="danger" type="submit" onClick={handleDelete}>Delete Player</Button>
                  </Form>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
    </Layout>
    </Container>
  );
};

export default Player;
