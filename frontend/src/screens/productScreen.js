import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  createReview,
} from "../redux/slices/productSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../redux/slices/cartSlice";

function ProductScreen({ history }) {
  const { id } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.product.productDetails);
  const { product, loading, error } = productDetails;

  const userLogin = useSelector((state) => state.user);
  const { userDetails } = userLogin;

  const productReviewCreate = useSelector(
    (state) => state.product.createReview
  );
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
    }
    dispatch(fetchProductDetails(id));
  }, [dispatch, id, successProductReview]);

  const addToCartHandler = () => {
    dispatch(addToCart(id, Number(qty)));
    history.push(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!userDetails) {
      history.push("/login");
    } else {
      dispatch(createReview(id, { rating: Number(rating), comment }));
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Voltar
      </Link>

      <Row>
        <Col md={3}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>

        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} avaliações`}
                color={"#f8e825"}
              />
            </ListGroup.Item>

            <ListGroup.Item>Preço: R${product.price}</ListGroup.Item>

            <ListGroup.Item>
              Descrição: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Preço:</Col>
                  <Col>
                    <strong>R${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0
                      ? "Em Estoque"
                      : "Fora de estoque"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Quantidade:</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Adicionar ao Carrinho
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h4>Avaliações</h4>
          {product.reviews.length === 0 && (
            <Message>Sem Avaliações</Message>
          )}
          <ListGroup variant="flush">
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating
                  color={"#f8e825"}
                  value={review.rating}
                />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h4>Escreva uma avaliação</h4>
              {loadingProductReview && <Loader />}
              {successProductReview && (
                <Message variant="success">
                  Avaliação enviada com sucesso
                </Message>
              )}
              {errorProductReview && (
                <Message variant="danger">
                  {errorProductReview}
                </Message>
              )}
              {userDetails ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating">
                    <Form.Label>Avaliação</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) =>
                        setRating(e.target.value)
                      }
                    >
                      <option value="">Selecionar...</option>
                      <option value="1">1 - Ruim</option>
                      <option value="2">2 - Justa</option>
                      <option value="3">3 - Boa</option>
                      <option value="4">4 - Muito Boa</option>
                      <option value="5">5 - Excelente</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment">
                    <Form.Label>Comentários</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      value={comment}
                      onChange={(e) =>
                        setComment(e.target.value)
                      }
                    />
                  </Form.Group>
                  <Button
                    disabled={loadingProductReview}
                    type="submit"
                    variant="primary"
                  >
                    Enviar
                  </Button>
                </Form>
              ) : (
                <Message>
                  Favor{" "}
                  <Link to="/login">entrar</Link> para
                  avaliar o produto
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
