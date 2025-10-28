import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WaveformChart = ({ 
  waveformData, 
  title = "Signal Waveform", 
  height = 300,
  showPoints = false,
  colors = ['#3B82F6'],
  yAxisLabel = "Amplitude (V)",
  xAxisLabel = "Time"
}) => {
  if (!waveformData || waveformData.length === 0) {
    return (
      <div className="waveform-container" style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <p className="text-gray-500">No waveform data available</p>
      </div>
    );
  }

  // Handle different data formats
  const datasets = [];
  
  if (Array.isArray(waveformData) && waveformData.length > 0) {
    if (typeof waveformData[0] === 'object' && waveformData[0].signal) {
      // Multiple waveforms with signal and timeAxis
      waveformData.forEach((data, index) => {
        const labels = data.timeAxis || Array.from({ length: data.signal.length }, (_, i) => i);
        datasets.push({
          label: data.encoding || `Signal ${index + 1}`,
          data: data.signal.map((value, i) => ({ x: labels[i] || i, y: value })),
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '20',
          borderWidth: 2,
          pointRadius: showPoints ? 2 : 0,
          pointHoverRadius: 4,
          tension: 0,
          stepped: true, // For digital signals
        });
      });
    } else if (typeof waveformData[0] === 'number') {
      // Single waveform as array of numbers
      datasets.push({
        label: title,
        data: waveformData.map((value, i) => ({ x: i, y: value })),
        borderColor: colors[0],
        backgroundColor: colors[0] + '20',
        borderWidth: 2,
        pointRadius: showPoints ? 2 : 0,
        pointHoverRadius: 4,
        tension: 0,
        stepped: true,
      });
    }
  } else if (typeof waveformData === 'object' && waveformData.signal) {
    // Single waveform with signal and timeAxis
    const labels = waveformData.timeAxis || Array.from({ length: waveformData.signal.length }, (_, i) => i);
    datasets.push({
      label: waveformData.encoding || title,
      data: waveformData.signal.map((value, i) => ({ x: labels[i] || i, y: value })),
      borderColor: colors[0],
      backgroundColor: colors[0] + '20',
      borderWidth: 2,
      pointRadius: showPoints ? 2 : 0,
      pointHoverRadius: 4,
      tension: 0,
      stepped: true,
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(3)}V at t=${context.parsed.x.toFixed(3)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: xAxisLabel,
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: yAxisLabel,
        },
        grid: {
          color: '#f3f4f6',
        },
        suggestedMin: -1.5,
        suggestedMax: 1.5,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0, // Disable bezier curves for digital signals
      },
    },
  };

  const data = {
    datasets,
  };

  return (
    <div className="waveform-container" style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default WaveformChart;