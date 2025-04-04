import { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CircularProgress, 
  Container, 
  Divider, 
  Paper, 
  Snackbar, 
  ToggleButton, 
  ToggleButtonGroup, 
  TextField, 
  Typography,
  Alert 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // Indigo shade
    },
    secondary: {
      main: '#6366f1', // Lighter indigo
    },
    background: {
      default: '#f5f7ff', // Light blueish background
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone 
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToneChange = (event, newTone) => {
    if (newTone !== null) {
      setTone(newTone);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        py: 4, 
        px: { xs: 2, md: 4 } 
      }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" color="primary.dark" gutterBottom>
              Smart Email Assistant
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Generate perfect email replies with the right tone
            </Typography>
          </Box>

          {/* Main Card */}
          <Card sx={{ mb: 4, overflow: 'visible' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Email Input Section */}
              <Box sx={{ p: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Original Email Content
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="Paste the email you want to reply to here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <Divider />

              {/* Tone Selection Section */}
              <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Select Reply Tone
                </Typography>
                <ToggleButtonGroup
                  value={tone}
                  exclusive
                  onChange={handleToneChange}
                  aria-label="email tone"
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    '& .MuiToggleButton-root': {
                      borderRadius: 6,
                      px: 3,
                      py: 1
                    }
                  }}
                >
                  <ToggleButton value="professional" aria-label="professional tone">
                    Professional
                  </ToggleButton>
                  <ToggleButton value="casual" aria-label="casual tone">
                    Casual
                  </ToggleButton>
                  <ToggleButton value="friendly" aria-label="friendly tone">
                    Friendly
                  </ToggleButton>
                  <ToggleButton value="formal" aria-label="formal tone">
                    Formal
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Divider />

              {/* Action Button */}
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!emailContent || loading}
                  sx={{ 
                    minWidth: 200,
                    py: 1.5
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Generating Reply...
                    </>
                  ) : 'Generate Reply'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert severity="error" variant="outlined" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Generated Reply Section */}
          {generatedReply && (
            <Card sx={{ mb: 4 }}>
              <CardHeader 
                title="Generated Reply" 
                titleTypographyProps={{ variant: 'h6' }}
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <Typography variant="body1">{generatedReply}</Typography>
                </Paper>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', bgcolor: 'grey.50' }}>
                <Button
                  variant="outlined"
                  onClick={copyToClipboard}
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
              </Box>
            </Card>
          )}

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Smart Email Assistant
            </Typography>
          </Box>

          {/* Notification */}
          <Snackbar
            open={copied}
            autoHideDuration={2000}
            onClose={() => setCopied(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="success" variant="filled">
              Reply copied to clipboard!
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;