import { useEffect, useState } from 'react';
import { getServerHealth, getServerStatus } from '../../services/api.services'; 
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Box,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Memory as MemoryIcon,
  DeviceHub as DeviceHubIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

const ServerHealthStatus = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [selfStatus, setSelfStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [healthResponse, selfResponse] = await Promise.all([getServerHealth(), getServerStatus()]);
        setHealthStatus(healthResponse);
        setSelfStatus(selfResponse);
      } catch (err) {
        setError('Failed to fetch server status.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;
  if (error) return <Alert severity="error" sx={{ marginTop: '20px' }}>{error}</Alert>;
  if (!healthStatus || !selfStatus) return null;

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', paddingBottom: '40px' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>
        Server Health Status
      </Typography>
      <Grid container spacing={4}>

        {/* Application Information */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3, background: theme.palette.grey[100] }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.info.main }}>
                <MemoryIcon sx={{ mr: 1 }} /> Application Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Environment:</Typography>
                  <Typography variant="body2">{healthStatus.data.application.environment}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Uptime:</Typography>
                  <Typography variant="body2">{healthStatus.data.application.uptime}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Memory Usage:</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Heap Total:</Typography>
                        <Typography variant="body2">{healthStatus.data.application.memoryUsage.heapTotal}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Heap Used:</Typography>
                        <Typography variant="body2">{healthStatus.data.application.memoryUsage.heapUsed}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3, background: theme.palette.grey[100] }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.warning.main }}>
                <DeviceHubIcon sx={{ mr: 1 }} /> System Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Memory:</Typography>
                  <Typography variant="body2">{healthStatus.data.system.totalMemory}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Free Memory:</Typography>
                  <Typography variant="body2">{healthStatus.data.system.freeMemory}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>CPU Usage:</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Stack spacing={1}>
                      {healthStatus.data.system.cpuUsage.map((usage, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>CPU Core {index + 1}:</Typography>
                          <Typography variant="body2">{usage}%</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Request Information */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3, background: theme.palette.grey[100] }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                <LanguageIcon sx={{ mr: 1 }} /> Request Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>IP:</Typography>
                  <Typography variant="body2">{selfStatus.request.ip}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Method:</Typography>
                  <Typography variant="body2">{selfStatus.request.method}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>URL:</Typography>
                  <Typography variant="body2">{selfStatus.request.url}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: '16px', boxShadow: 3, background: theme.palette.grey[100] }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.primary.main }}>
                <InfoIcon sx={{ mr: 1 }} /> Additional Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Timestamp:</Typography>
                  <Typography variant="body2">{new Date(healthStatus.data.timestamp).toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Message:</Typography>
                  <Typography variant="body2">{selfStatus.message}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServerHealthStatus;
