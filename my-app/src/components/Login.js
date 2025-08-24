import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();   // 👈 detect route change
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // ✅ Reset fields whenever you land on "/login"
  useEffect(() => {
    if (location.pathname === "/login") {
      setFormData({ email: "", password: "" });
      setError("");
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:1515/login", {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        console.log(res);

        if (res.data === "Login Successfully") {
          // ✅ call parent login state
          onLogin(formData);

          // ✅ clear input fields before navigating
          setFormData({ email: "", password: "" });
          setError("");

          // ✅ navigate after clearing
          navigate("/home");
        } else {
          setError("Invalid Email or Password");
          // Clear only password
          setFormData((prev) => ({ ...prev, password: '' }));
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong. Please try again.");
        setFormData((prev) => ({ ...prev, password: "" }));
      });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4}}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;
