"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Chart } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";

import { Incident, TimeLineChartProps } from "@/shared/interface";
import { FOOTBALL_END_MATCH_STATUS, INCIDENT_TYPE } from "@/shared/common";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  annotationPlugin
);

const TimeLineChart: React.FC<TimeLineChartProps> = React.memo(
  ({ labels = [], data = [], breakTime = "" }) => {
    const chartRef = useRef<ChartJS>();
    const fullTime = useMemo(
      () =>
        labels.reduce((max: number, num: number) => (num > max ? num : max), 0),
      [labels]
    );

    const createLineAnnotation = () => {
      const lastData = data[data.length - 1];
      return {
        type: "line",
        borderColor: "#48FF5A",
        borderWidth: 2,
        yMin: -140,
        yMax: 140,
        xMin: lastData.x,
        xMax: lastData.x,
      };
    };

    const createAnnotations = () => {
      const annotationList = {} as any;
      data.map((item, index) => {
        item?.incidents?.map((incidentItem, incidentIndex) => {
          annotationList[`annotation_${index}_${incidentIndex}`] = {
            type: "line",
            borderColor: "#272A31",
            borderWidth: 1,
            borderDash: [4, 4],
            yMin: incidentItem.isHome ? 0 : -140,
            yMax: incidentItem.isHome ? 140 : 0,
            xMin: incidentItem.time,
            xMax: incidentItem.time,
            label: {
              display: true,
              content: () => {
                const image = new Image(15, 15);

                if (incidentItem.incidentType !== "") {
                  image.src = `images/${incidentItem.incidentType}${
                    incidentItem.incidentClass
                      ? `-${incidentItem.incidentClass}`
                      : ""
                  }.svg`;
                }

                return image;
              },
              padding: 0,
              backgroundColor: "transparent",
              position: incidentItem.isHome ? "end" : "start",
            },
          };
        });
      });

      if (
        !FOOTBALL_END_MATCH_STATUS.includes(breakTime) &&
        breakTime !== "HT"
      ) {
        annotationList["lineAnnotation"] = createLineAnnotation();
      }

      return annotationList;
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 1000,
      },
      layout: {
        padding: {
          top: 10,
          right: 7,
        },
      },
      plugins: {
        annotation: {
          annotations: createAnnotations(),
        },
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,

          external: function (context: any) {
            let tooltipEl = document.getElementById("chartjs-tooltip");

            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.innerHTML =
                '<div class="chart-tooltip-container"></div>';
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = "0";
              return;
            }

            tooltipEl.classList.remove("above", "below", "no-transform");
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add("no-transform");
            }

            if (tooltipModel.body) {
              let innerHtml = "";

              if (context.tooltip.dataPoints[0].raw.incidents.length > 0) {
                innerHtml += '<div class="chart-tooltip-content">';
                context.tooltip.dataPoints[0].raw.incidents.forEach(function (
                  item: Incident
                ) {
                  if (item.incidentType !== INCIDENT_TYPE.CORNER) {
                    const content = renderIncidentTooltip(item);
                    innerHtml += `<div class="chart-tooltip-item">${content}</div>`;
                  }
                });
                innerHtml += "</div>";
              }
              let divRoot = tooltipEl.querySelector("div");
              if (divRoot) {
                divRoot.innerHTML = innerHtml;
              }
            }

            const position = context.chart.canvas.getBoundingClientRect();

            tooltipEl.style.opacity = "1";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX + "px";
            tooltipEl.style.top =
              position.top + window.pageYOffset + tooltipModel.caretY + "px";
            tooltipEl.style.padding =
              tooltipModel.padding + "px " + tooltipModel.padding + "px";
            tooltipEl.style.pointerEvents = "none";
          },
        },
      },
      scales: {
        xAxisLine: {
          type: "linear" as const,
          ticks: {
            stepSize: 15,
            includeBounds: false,
            callback: function (value: any) {
              return value === 45
                ? "HT"
                : value === 0 || value > 90
                ? ""
                : `${value}'`;
            },
          },
          border: {
            display: false,
          },
          grid: {
            color: "#091557",
            lineWidth: function (context: any) {
              return context?.tick?.value > 90 ? 0 : 2;
            },
          },
          min: 0,
          max: fullTime > 90 ? fullTime : 90,
        },
        yAxisLine: {
          type: "linear" as const,
          offset: true,
          ticks: {
            display: false,
            beginAtZero: true,
          },
          border: {
            display: false,
          },
          grid: {
            color: function (context: any) {
              return context.tick.value === 0 ? "#272A31" : "";
            },
            lineWidth: function (context: any) {
              return context.tick.value === 0 ? 1 : 0;
            },
          },
          min: -140,
          max: 140,
        },
      },
    };

    const plugins = [
      {
        id: "lineChartRender",
        afterDatasetsDraw: (chart: any) => {
          const { ctx } = chart;
          let yAxis = chart.scales["yAxisLine"];
          let yPos = yAxis.getPixelForValue(0);
          ctx.save();
          let gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, "#2187E5");
          gradient.addColorStop(yPos / chart.height, "#2187E5");
          gradient.addColorStop(yPos / chart.height, "#F6B500");
          gradient.addColorStop(1, "#F6B500");
          chart.data.datasets[0].borderColor = gradient;
          chart.data.datasets[0].pointBackgroundColor = gradient;
          ctx.restore();
        },
      },
    ];

    const getChartData = () => {
      return {
        labels,
        datasets: [
          {
            xAxisID: "xAxisLine",
            yAxisID: "yAxisLine",
            data,
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
            hoverRadius: 6,
            hitRadius: 20,
            pointBorderColor: "#fff",
          },
        ],
      };
    };

    const renderIncidentTooltip = (incident: Incident) => {
      const time = `<span class="time">${incident?.time}'</span>`;
      const playerName = (name?: string) =>
        name && `<span class="player-name">${name}'</span>`;
      switch (incident.incidentType) {
        case INCIDENT_TYPE.GOAL:
          return `<div class="chart-inner">
                    <span class="title">GOAL</span>
                    ${playerName(incident?.player?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.CARD:
          return `<div class="chart-inner">
                    <span class="title">${incident.incidentClass} CARD</span>
                    ${playerName(incident?.player?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.SUBSTITUTION:
          return `<div class="chart-inner">
                    <span class="title">SUBSTITUTION</span>
                    ${playerName(incident?.playerIn?.name)}
                    ${playerName(incident?.playerOut?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.VAR_DECISION:
          return `<div class="chart-inner">
                    <span class="title">VAR DECISION</span>
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.INJURY_TIME:
          return `<div class="chart-inner">
                    <span class="title">INJURY</span>
                    ${playerName(incident?.playerIn?.name)}
                    ${playerName(incident?.playerOut?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.INGAMEPENALTY:
          return `<div class="chart-inner">
                    <span class="title">PENALTY</span>
                    ${playerName(incident?.player?.name)}
                  </div>
                  ${time}`;
        default:
          break;
      }
    };

    useEffect(() => {
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.update();
        }
      }, 100);
    }, []);

    return (
      <Chart
        ref={chartRef}
        type="line"
        data={getChartData()}
        options={options}
        plugins={plugins}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.labels === nextProps.labels && prevProps.data === nextProps.data
    );
  }
);

TimeLineChart.displayName = "TimeLineChart";

export default TimeLineChart;
