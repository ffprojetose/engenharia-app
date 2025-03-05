import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const Tarefas: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestão de Tarefas
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          Funcionalidade em desenvolvimento...
        </Typography>
      </Paper>
    </Box>
  );
}; 