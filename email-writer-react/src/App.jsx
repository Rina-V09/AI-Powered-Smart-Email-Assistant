import { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  CircularProgress, 
  Typography, 
  Paper 
} from '@mui/material';
import axios from 'axios';

function App() {
  // --- State Variables ---
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false); // Track copy status

  // --- API Request Handler ---
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8081/api/email/generate', {
        emailContent,
        tone
      });
      
      // Handle the response
      setGeneratedReply(typeof response.data === 'string' ? response.data : response.data.content);
      
    } catch (error) {
      console.error(error);
      setError('Failed to generate reply. Please check if your backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setIsCopied(true);
    
    // Reset the button text after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // --- UI Render ---
  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4 
      }}
    >
      <Container maxWidth="md">
        
        {/* Header */}
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 'bold', 
            color: 'white', 
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Email Reply Generator
        </Typography>

        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)', 
          }}
        >
          <Box component="form" noValidate autoComplete="off">
            
            <TextField 
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              placeholder="Paste the email you received here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3, backgroundColor: 'white' }} 
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="tone-label">Tone (Optional)</InputLabel>
              <Select
                labelId="tone-label"
                label="Tone (Optional)"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                sx={{ backgroundColor: 'white' }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              sx={{ 
                py: 1.5, 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', 
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                color: 'white'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Generated Reply Section */}
        {generatedReply && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Generated Reply:
            </Typography>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.95)', 
                borderLeft: '6px solid #764ba2' 
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                {generatedReply}
              </Typography>
              
              <Button 
                  variant="outlined" 
                  onClick={handleCopy}
                  color={isCopied ? "success" : "secondary"}
              >
                  {isCopied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </Paper>
          </Box>
        )}

      </Container>
    </Box>
  );
}

export default App;

//npm run dev
