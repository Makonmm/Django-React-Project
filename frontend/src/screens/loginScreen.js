
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Importe useNavigate do react-router-dom
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/userSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function LoginScreen() {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate(); // Utilize useNavigate para navegação programática

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const redirect = location.search ? new URLSearchParams(location.search).get("redirect") || "/" : "/";

  const userLogin = useSelector((state) => state.user);
  const { userDetails, loading, error } = userLogin;

  useEffect(() => {
    if (userDetails) {
      navigate(redirect); // Utilize navigate ao invés de history.replace
    }
  }, [navigate, userDetails, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <FormContainer>
      <Typography component="h1" style={{ fontWeight: "bold" }} variant="h5">
        Entrar
      </Typography>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <form className={classes.form} onSubmit={submitHandler}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="filled"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.submit}
        >
          Login
        </Button>
        <Grid container justify="flex-start">
          <Grid item>
            Novo Usuário?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              variant="body2"
            >
              Cadastrar
            </Link>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );
}

export default LoginScreen;
