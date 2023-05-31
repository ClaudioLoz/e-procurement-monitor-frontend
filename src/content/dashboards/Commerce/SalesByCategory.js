
import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  useTheme,
    Box,
    Typography,
    styled

} from '@mui/material';
import axios from 'axios';
import Chart from 'react-apexcharts';
import useRefMounted from 'src/hooks/useRefMounted';


const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

function SalesByCategory({justifications, eProcurementId}) {
  const theme = useTheme();
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const isMountedRef = useRefMounted();


  const getRatingDistribution = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/ratings/distribution`,{
        params:{
          eProcurementId,
        }
      });
      console.log(response.data)
      if (isMountedRef.current) {
        setRatingDistribution(response.data.map( r => parseFloat(r.percentage.toFixed(2))));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getRatingDistribution();
  }, [getRatingDistribution, justifications]);

  const sales = {
    datasets: [
      {
        backgroundColor: [
          theme.palette.primary.main,
          "gray",
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
      "gray",
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${val.toFixed(2)}%`;
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

  return (
    <Card>
      <CardHeader title="Distribución de totales hasta el momento (quedan 27 días para calificar)" />
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
              series={ratingDistribution}
              type="donut"
            />
          </Grid>
          <Grid md={6} item display="flex" alignItems="center">
            <Box>
              {sales.labels.map((label, i) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{
                    py: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    mr: 2
                  }}
                >
                  <DotLegend
                    style={{
                      background: `${sales.datasets[0].backgroundColor[i]}`
                    }}
                  />
                  <span
                    style={{
                      paddingRight: 10,
                      color: `${sales.datasets[0].backgroundColor[i]}`
                    }}
                  >
                    {`${ratingDistribution[i]}%`}
                  </span>
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SalesByCategory;
