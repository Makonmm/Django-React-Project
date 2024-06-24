import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from "../components/ProductCarousel";
import { fetchProductList } from "../redux/slices/productSlice";
import Paginate from "../components/Paginate";

function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const productList = useSelector((state) => state.product.productList);
  const topRatedProducts = useSelector((state) => state.product.topRatedProducts);

  const { products, loading, error, page, pages } = productList;
  const { pageNumber = 1 } = useParams();
  const { products: topProducts, loading: topLoading, error: topError } = topRatedProducts;

  const keyword = new URLSearchParams(location.search).get('keyword') || '';

  useEffect(() => {
    dispatch(fetchProductList(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <div>
      {!keyword && (
        <>
          <div style={{ fontWeight: "bold", fontSize: "25px", color: "black", fontFamily: "MozAnimationDelay" }}>
            Produtos + avaliados
          </div>
          <ProductCarousel />
        </>
      )}

      <div style={{ fontWeight: "bold", fontSize: "25px", color: "black", fontFamily: "MozAnimationDelay" }}>
        Produtos recentes
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
      <Paginate page={page} pages={pages} keyword={keyword} />
    </div>
  );
}

export default HomeScreen;
