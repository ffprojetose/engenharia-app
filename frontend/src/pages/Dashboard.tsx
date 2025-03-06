import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, subtitle }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {React.cloneElement(icon as React.ReactElement, { sx: { mr: 1, color: 'primary.main' } })}
      <Typography variant="h6">{title}</Typography>
    </Box>
    <Typography variant="h4">{value}</Typography>
    <Typography color="text.secondary">{subtitle}</Typography>
  </Paper>
);

const Dashboard: React.FC = () => {
  const cards = [
    {
      icon: <PeopleIcon />,
      title: 'Usuários',
      value: 12,
      subtitle: 'Total de usuários ativos',
    },
    {
      icon: <AssignmentIcon />,
      title: 'Projetos',
      value: 8,
      subtitle: 'Projetos em andamento',
    },
    {
      icon: <EventIcon />,
      title: 'Tarefas',
      value: 24,
      subtitle: 'Tarefas pendentes',
    },
    {
      icon: <MoneyIcon />,
      title: 'Financeiro',
      value: 'R$ 45.000',
      subtitle: 'Faturamento mensal',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 