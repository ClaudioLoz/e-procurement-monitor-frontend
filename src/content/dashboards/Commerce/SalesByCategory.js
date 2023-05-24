import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  useTheme,
} from '@mui/material';
import Chart from 'react-apexcharts';


function SalesByCategory() {
  const theme = useTheme();

  const sales = {
    datasets: [
      {
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main,

        ]
      }
    ],
    labels: ["1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"]
  };

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%'
        }
      }
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${val}%`;
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: sales.labels,
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = [15, 45, 25, 10, 5];

  return (
    <Card>
      <CardHeader title="Resultados totales hasta el momento" />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid
            md={6}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Chart
              height={228}
              options={chartOptions}
              series={chartSeries}
              type="donut"
            />
          </Grid>
          
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SalesByCategory;
