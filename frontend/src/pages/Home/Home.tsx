import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';

export const Home: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Sistema de Engenharia
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Projetos Recentes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nenhum projeto encontrado.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atividades Pendentes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nenhuma atividade pendente.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Estatísticas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Total de Projetos</Typography>
                <Typography variant="h4">0</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Em Andamento</Typography>
                <Typography variant="h4">0</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle1">Concluídos</Typography>
                <Typography variant="h4">0</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 