import { useRef, useState, useCallback, useEffect } from 'react';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

import {
  Rating,
  Button,
  Card,
  Box,
  Typography,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
  Container,
  Divider,
  useTheme
} from '@mui/material';

import { useParams } from 'react-router-dom';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'axios';
import numeral from 'numeral';


import Chart from 'react-apexcharts';

const typographySx = {
  whiteSpace: 'nowrap',
  mb: 2
};

const map = {
  WORK: {
    text: 'OBRA',
    color: 'warning'
  },
  GOOD: {
    text: 'BIEN',
    color: 'info'
  },
  SERVICE: {
    text: 'SERVICIO',
    color: 'primary'
  },
  WORK_CONSULTING: {
    text: 'CONSULTORÍA DE OBRA',
    color: 'yellow'
  }
};

const months =  [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Setiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

const metrics = [
  {
    value: 'ratingAverage',
    text: 'Promedio de calificación'
  }
];

const AFTER_YEARS = 1;

function AudienceOverview() {

  const isMountedRef = useRefMounted();
  const [eProcurement, setEProcurement] = useState(null);
  const [averages, setAverages] = useState([]);
  const { eProcurementId } = useParams();
  const actionRef1 = useRef(null);
  const actionRef2 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [openAudience, setOpenMenuAudience] = useState(false);
  const [periods, setPeriods] = useState([]);
  const [period, setPeriod] = useState(null);
  const [periodValue, setPeriodValue] = useState(null);
  const [metric, setMetric] = useState(metrics[0].text);
  const theme = useTheme();


  const getEProcurement = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/eprocurements/${eProcurementId}?isDetailed=false`);
      if (isMountedRef.current) {
        setEProcurement(response.data);
      }
      setPeriod((response.data.eprocurement.contractEndDate[0] + AFTER_YEARS).toString());
      setPeriodValue(response.data.eprocurement.contractEndDate[0] + AFTER_YEARS);
      setPeriods([
        {
          text: (response.data.eprocurement.contractEndDate[0] + AFTER_YEARS).toString(), 
          value: response.data.eprocurement.contractEndDate[0] + AFTER_YEARS
        }, 
        {
          text: response.data.eprocurement.contractEndDate[0].toString(),
          value: response.data.eprocurement.contractEndDate[0]
        },
        {
          text:response.data.eprocurement.contractStartDate[0].toString(),
          value:response.data.eprocurement.contractStartDate[0],
        }]);
    } catch (err) {
      console.error(err);
    }
  }, [eProcurementId, isMountedRef]);

  const getRatingAverages = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/ratings/averages`,
      {
        params:{
          eProcurementId,
          year:periodValue
        }
      });

      if (isMountedRef.current) {
        setAverages(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [eProcurementId, periodValue, isMountedRef]);

  useEffect(() => {
    getEProcurement();
  }, []);
  
  useEffect(() => {
    getRatingAverages();
  }, [periodValue]);
  
  if (!eProcurement) {
    return null;
  }

  const ChartAudienceOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.colors.primary.main],
    labels: averages.length > 0? averages.map((a) => months[a.month-1]): months,
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      strokeDashArray: 5,
      borderColor: theme.colors.alpha.black[10]
    },
    legend: {
      show: false
    },
    markers: {
      hover: {
        sizeOffset: 2
      },
      shape: 'circle',
      size: 6,
      strokeWidth: 3,
      strokeOpacity: 1,
      strokeColors: [theme.colors.primary.main],
      colors: [theme.colors.alpha.white[100]]
    },
    stroke: {
      curve: 'smooth',
      lineCap: 'butt',
      width: 3
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 1, 
      max: 5, 
      tickAmount: 4, 
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  };

  return (
    <Card>
    <Container maxWidth="lg">
          <Card
            sx={{
              p: 3,
              mb: 3
            }}
          >
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Box >
                  <Typography variant="h4" gutterBottom sx={typographySx}>
                  Entidad contratante: {`${eProcurement.eprocurement.contractingEntityName} - ${eProcurement.eprocurement.contractingEntityRuc}`}
                </Typography>
                <Typography variant="h4" gutterBottom sx={typographySx}>
                  Contratista: {`${eProcurement.eprocurement.contractorName} - ${eProcurement.eprocurement.contractorRuc}`}
                </Typography>
                <Typography variant="h4" gutterBottom sx={typographySx}>
                  Objeto de contratación: {map[eProcurement.eprocurement.procurementObject].text}
                </Typography>
                <Typography variant="h4" gutterBottom sx={typographySx}>
                  Monto:  S/. {numeral(eProcurement.eprocurement.amount).format('0,0')}
                </Typography>
                <Typography variant="h4" gutterBottom sx={typographySx}>
                  Departamento: {eProcurement.eprocurement.department}
                </Typography>
                {eProcurement.eprocurement.province && <Typography variant="h4" gutterBottom sx={typographySx}>
                  Provincia: {eProcurement.eprocurement.province}
                </Typography>}
                {
                  eProcurement.eprocurement.district && 
                  <Typography variant="h4" gutterBottom sx={typographySx}>
                  Distrito: {eProcurement.eprocurement.district}
                </Typography>
                }
 
                <Typography variant="h4" gutterBottom sx={typographySx}>
                  Fecha de inicio del contrato: {eProcurement.eprocurement.contractStartDate[2]}/
                  {eProcurement.eprocurement.contractStartDate[1]}/{eProcurement.eprocurement.contractStartDate[0]}
                </Typography>
                <Typography variant="h4" gutterBottom sx={typographySx}>
                  Fecha fin del contrato:  {eProcurement.eprocurement.contractEndDate[2]}/
                  {eProcurement.eprocurement.contractEndDate[1]}/{eProcurement.eprocurement.contractEndDate[0]}
                </Typography>
                <Typography variant="h3=">
                          Promedio de calificación total actual:
                          {` ${eProcurement.totalRatingAverage.toFixed(2)}`} 
                          <Rating size="medium" readOnly value={1} max={1}/>
                </Typography>
              </Box>
            </Box>
          </Card>
        </Container>
        <CardHeader
        action={
          <>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef1}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {period}
            </Button>
            <Menu
              disableScrollLock
              anchorEl={actionRef1.current}
              onClose={() => setOpenMenuPeriod(false)}
              open={openPeriod}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              {periods.map((_period) => (
                <MenuItem
                  key={_period.value}
                  onClick={() => {
                    setPeriod(_period.text);
                    setPeriodValue(_period.value);
                    setOpenMenuPeriod(false);
                  }}
                >
                  {_period.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        }
        title="Indicadores cuantitativos de la contratación seleccionada"
      />
      <Divider />

      <CardContent>
        <Button
          size="small"
          variant="outlined"
          ref={actionRef2}
          onClick={() => setOpenMenuAudience(true)}
          endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
        >
          {metric}
        </Button>
        <Menu
          disableScrollLock
          anchorEl={actionRef2.current}
          onClose={() => setOpenMenuAudience(false)}
          open={openAudience}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {metrics.map((_audience) => (
            <MenuItem
              key={_audience.value}
              onClick={() => {
                setMetric(_audience.text);
                setOpenMenuAudience(false);
              }}
            >
              {_audience.text}
            </MenuItem>
          ))}
        </Menu>
        <Box mt={2}>
          <Chart
            options={ChartAudienceOptions}
            series={[
              {
                name: 'Promedio calificación',
                data: averages.map(obj=>Number(obj.average.toFixed(2)))
              }
            ]}
            type="line"
            height={230}
          />
        </Box>
      </CardContent>
  
    </Card>
  );
}

export default AudienceOverview;
