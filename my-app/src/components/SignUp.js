import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Link,
  Paper,
  Alert,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "hearing",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    setError("");

    axios
      .post("http://localhost:1515/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      .then((res) => {
        console.log("User registered successfully:", res.data);

        // Show success progress bar
        setSuccess(true);
        setProgress(100);

        // Animate decreasing line
        let value = 100;
        const timer = setInterval(() => {
          value -= 5;
          if (value <= 0) {
            clearInterval(timer);
            setSuccess(false);
            navigate("/login"); // redirect after success
          }
          setProgress(value);
        }, 100);
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        setError("Registration failed. Please try again.");
      });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: "#d0f0d0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "green",
                  },
                }}
              />
              <Typography
                variant="body2"
                color="success.main"
                align="center"
                sx={{ mt: 1 }}
              >
                ✅ Successfully Registered!
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Role</FormLabel>
              <RadioGroup
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="hearing"
                  control={<Radio />}
                  label="Hearing"
                />
                <FormControlLabel
                  value="deaf"
                  control={<Radio />}
                  label="Deaf (ASL)"
                />
                <FormControlLabel
                  value="mute"
                  control={<Radio />}
                  label="Mute (Text Only)"
                />
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
              }
              label="I agree to the Terms and Conditions"
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
            >
              Create Account
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default SignUp;
