import React, { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import config from "../Configsettings/appsettings.json";

interface User {
  UserType: string;
  UserName: string;
  UserPassWord: string;
}

interface ResponseModel {
  status: string | number;
  message: string;
}

const createInitialUser = (): User => ({
  UserType: "Admin",
  UserName: "",
  UserPassWord: "",
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(createInitialUser);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!user.UserName.trim() || !user.UserPassWord) {
      setErrorMessage("Enter both your user name and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post<ResponseModel>(
        config.Serviceurl.loginUrl,
        {
          ...user,
          UserName: user.UserName.trim(),
        }
      );

      if (String(response.data.status) === "200") {
        localStorage.setItem("userType", user.UserType);
        localStorage.setItem("userName", user.UserName.trim());
        navigate("/Verify");
      } else {
        setErrorMessage("Invalid User Name or Password");
      }
    } catch {
      setErrorMessage(
        "Unable to connect to the login service. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUser(createInitialUser());
    setErrorMessage("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: "linear-gradient(135deg, #e8f4fb 0%, #f5f8fc 100%)",
      }}
    >
      <Card
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3} sx={{ alignItems: "center" }}>
            <Avatar
              src={require("../images/aarblogo.jpg")}
              alt="Company logo"
              sx={{ width: 64, height: 64, bgcolor: "primary.main" }}
            >
              <LockOutlinedIcon />
            </Avatar>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                color="text.primary"
                sx={{ fontWeight: 700 }}
              >
                User Login
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Sign in to continue to your account
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              autoComplete="off"
              sx={{ width: "100%" }}
            >
              <Stack spacing={2.5}>
                <FormControl fullWidth>
                  <InputLabel id="user-type-label">User Type</InputLabel>
                  <Select
                    labelId="user-type-label"
                    id="drpselect"
                    label="User Type"
                    value={user.UserType}
                    onChange={(event) =>
                      setUser((current) => ({
                        ...current,
                        UserType: event.target.value,
                      }))
                    }
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Staff">Staff</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  id="txtUser"
                  label="User Name"
                  autoComplete="new-password"
                  fullWidth
                  required
                  value={user.UserName}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      UserName: event.target.value,
                    }))
                  }
                />

                <TextField
                  id="txtpass"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  fullWidth
                  required
                  value={user.UserPassWord}
                  onChange={(event) =>
                    setUser((current) => ({
                      ...current,
                      UserPassWord: event.target.value,
                    }))
                  }
                />

                {errorMessage && (
                  <Alert severity="error">{errorMessage}</Alert>
                )}

                <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      py: 1.25,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? "Signing in…" : "OK"}
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={handleReset}
                    sx={{
                      py: 1.25,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;