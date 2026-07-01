import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../Context";
import { observer } from "mobx-react";
import Highcharts, { Options } from "highcharts";
import englishString from "./../assets/english.json";
import frenchString from "./../assets/french.json";
import { Input, Select } from "antd";

const { Search } = Input;

const allLanguages = [
   {
      langName: "English",
      lang: englishString,
   },
   {
      langName: "French",
      lang: frenchString,
   },
];

const arrowDown =
   '<svg class="ptarrow" fill="green" viewBox="0 0 1024 1024"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"/>';
const arrowUp =
   '<svg class="ptarrow" fill="red" viewBox="0 0 256 256"><path d="M215.39111,163.06152A8.00015,8.00015,0,0,1,208,168H48a7.99981,7.99981,0,0,1-5.65674-13.65674l80-80a8,8,0,0,1,11.31348,0l80,80A7.99982,7.99982,0,0,1,215.39111,163.06152Z"/></svg>';
const dash =
   '<svg class="ptarrow" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 8a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1z" fill="#2f7ed8"/></svg>';

Highcharts.AST.allowedTags.push("svg");
Highcharts.AST.allowedAttributes.push("viewBox");

export const WeeklyReport = observer(() => {
   const store = useStore();
   let chart: any = useRef(null);
   let chart2: any = useRef(null);
   let chart3: any = useRef(null);
   const [chartTitle, setChartTitle] = useState("Mortality Indicators");
   const [currChartType, setCurrChartType] = useState("column");
   const currDiseases = useRef([]);


   const [activeLanguage, setActiveLanguage] = useState(store.activeLanguage || allLanguages[0]);

   const groupDeathsToOrgUnits = (deaths) => {
      let deathOrgs = {};
      const level = Number(store.getCurrentOrgUnitLevel()) + 1;

     

      deaths.forEach((death) => {
         let orgUnit;
         if (level == 5) orgUnit = death.orgUnit;
         else orgUnit = store.getOrgUnitLevels(death.orgUnit).find((l) => l.level == level)?.id;
         if (!!orgUnit) {
            if (!deathOrgs[orgUnit]) {
               deathOrgs[orgUnit] = [];
            }
            const indi1 = store.allIndis[orgUnit]?.["vyOajQA5xTu"] ?? 0;
            const indi2 = store.allIndis[orgUnit]?.["T8W0wbzErSF"] ?? 0;
            deathOrgs[orgUnit].push({
               ...death,
               indi1,
               indi2,
            });
         }
      });

      console.log("deathOrgs", deathOrgs);

      // return Object.keys(deathOrgs).map((orgUnit) => {
         const currOrgLevel = store.getCurrentOrgUnitLevel();
      const uniqOrgs = Array.from(new Set([
         ...Object.keys(deathOrgs), 
         ...Object.keys(store.allIndis)
      ])).filter((orgUnit) => {
         const oulevel = Math.min(parseInt(store.getOrgUnitLevel(orgUnit), 0));
         return oulevel == currOrgLevel + 1;
      });
      return uniqOrgs.map((orgUnit) => {
         const indi1 = parseInt(store.allIndis[orgUnit]?.["vyOajQA5xTu"] ?? 0);
         const indi2 = parseInt(store.allIndis[orgUnit]?.["T8W0wbzErSF"] ?? 0);
         return {
            name: store.getOrgUnitName(orgUnit),
            orgUnit,
            deaths: deathOrgs[orgUnit] ?? [],
            count: deathOrgs[orgUnit]?.length ?? 0,
            approved: deathOrgs[orgUnit]?.filter((d) => d["twVlVWM3ffz"] != "Not Approved").length ?? 0,
            indi1,
            indi2,
            aggregate: indi1 + indi2,
         };
      });
   };

   const colOptions: any = {
      chart: {
         type: "column",
      },
      title: {
         text: chartTitle,
      },
      xAxis: [
         {
            categories: [],
            crosshair: true,
         } as any,
      ],
      yAxis: {
         min: 0,
         title: {
            text: "Death count",
         },
      },
      series: [
         { name: "Deaths", color: "red" } as any,
         { name: "Approved Deaths", color: "blue" } as any,
         { name: "Aggregate Deaths", color: "green" } as any,
         // { name: "105-MA04c1. Deliveries in unit - Fresh still birth", color: "orange" } as any,
      ],
      tooltip: {
         useHTML: true,
         pointFormatter: function () {
            let point: any = this;
            let arrow = "";

            const disease = currDiseases.current[point.x];

            arrow = disease.count > disease.prev ? arrowUp : disease.count == disease.prev ? dash : arrowDown;

            return `<div class="ptlabel">${point.series?.name}: <b>${point.y}</b>${arrow}</div>`;
         },
      },
      credits: {
         enabled: false,
      },
   };

   let pieOptions = {
      chart: {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false,
         type: "pie",
      } as any,
      title: {
         text: chartTitle,
      },
      tooltip: {
         useHTML: true,
         pointFormatter: function () {
            let point: any = this;
            let arrow = "";

            const disease = currDiseases.current[point.x];
            arrow = disease.count > disease.prev ? arrowUp : disease.count == disease.prev ? dash : arrowDown;
            return `<div class="ptlabel">${point.series.name}: <b>${parseFloat(point.percentage).toFixed(
               1
            )}%</b>${arrow}</div>`;
         },
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
               enabled: true,
               useHTML: true,
               formatter: function () {
                  const pointd: any = this;
                  const point = pointd.point;

                  let arrow = "";

                  const disease = currDiseases.current[point.x];
                  if (!!disease)
                     arrow = disease.count > disease.prev ? arrowUp : disease.count == disease.prev ? dash : arrowDown;

                  return `<div class="ptlabel"><b>${point.name}</b>: ${parseFloat(point.percentage).toFixed(
                     1
                  )}:% ${arrow}</div>`;
               },
            },
         },
      },
      series: [
         {
            name: "Approved Death Records",
            colorByPoint: true,
            data: [{}],
         } as any,        
      ],
      credits: {
         enabled: false,
      },
   };

   const changeChartType = (chartType: string) => {
      let opts = null;
      setCurrChartType(chartType);
      // if (chartType == "pie") {
      //    opts = pieOptions;
      //    const opts2 = {...opts, series: [
      //       {
      //          name: "Aggregate Death Records",
      //          colorByPoint: true,
      //          data: [{}],
      //       } as any,
      //    ]}
      //    // if (!!currDiseases.current)
      //    console.log("pie chart", currDiseases.current)
      //    console.log("all indis org", store.selectedOrgUnit, store.allIndis[store.selectedOrgUnit], store.allIndis)
      //    const indi1 = store.allIndis[store.selectedOrgUnit]?.["vyOajQA5xTu"] ?? 0;
      //    const indi2 = store.allIndis[store.selectedOrgUnit]?.["T8W0wbzErSF"] ?? 0;
      //    const allDeaths = store.allDeaths.length;
      //    const approvedDeaths = store.allDeaths.filter((d) => d["twVlVWM3ffz"] != "Not Approved").length;
      //    const nonApprovedDeaths = allDeaths - approvedDeaths;

      //    const aggregate = parseInt(indi1) + parseInt(indi2);
      //    const nonApprovedAggreagate = aggregate - approvedDeaths;
         

      //    opts.series[0].data = [
      //       {
      //          name: "Approved Deaths",
      //          y: approvedDeaths,
      //       },
      //       {
      //          name: "Non Approved Deaths",
      //          y: nonApprovedDeaths,
      //       },
      //    ];

         
      //    opts2.series[0].data = [
      //       {
      //          name: "Approved Aggregate",
      //          y: approvedDeaths,
      //       },
      //       {
      //          name: "Non Approved Aggregate",
      //          y: nonApprovedAggreagate,
      //       },
      //    ];

      //    if (!!chart2.current && !!opts2) {
      //       chart2.current.destroy();
      //    }
      //    chart2.current = Highcharts.chart("topdiseasesm2", opts2);


      //    if (!!chart3.current && !!opts) {
      //       chart3.current.destroy();
      //    }          
      //    chart3.current = Highcharts.chart("topdiseasesm1", opts);
         
         
      // } else if (chartType == "column") {
      //    // if (!!chart2.current) chart2.current.destroy();
      //    opts = colOptions ?? {};
      //    if (!!currDiseases.current && opts !== undefined) {
      //       opts.xAxis[0].categories = currDiseases.current?.map((d: any) => d?.name);
      //       opts.series[0].data = currDiseases.current?.map((d: any) => {
      //          return {
      //             y: d.count,
      //             color: "red",
      //          };
      //       });
      //       opts.series[1].data = currDiseases.current?.map((d: any) => {
      //          return {
      //             y: d.approved,
      //             color: "blue",
      //          };
      //       });
      //       opts.series[2].data = currDiseases.current?.map((d: any) => {
      //          return {
      //             y: d.indi1 + d.indi2,
      //             color: "green",
      //          };
      //       });
            
      //    }
      //    if (!!chart.current && !!opts) {
      //       chart.current.destroy();
      //    }
      //       console.log("reload chart", opts)
      //       chart.current = Highcharts.chart("topdiseasesm", opts);
         
      // }

      

      
   };

   useEffect(() => {
      console.log("EventList:hook nationalitySelect", store.selectedNationality);

      const setupcharts = async () => {
         let opts = colOptions;    
         chart.current = Highcharts.chart("topdiseasesm", colOptions);
         chart3.current = Highcharts.chart("topdiseasesm1", pieOptions);
         console.log("currChartx", chart.current);

         store.queryTopEvents().then(() => {
            console.log("allDeaths", store.allDeaths);
            if (!!store.allDeaths && !!store.allDeaths.length) {
               let sortedDiseases = [];

               if (
                  (!store.currentOrganisation && !!store.selectedCauseOfDeath && !!store.selectedOrgUnit) ||
                  !!store.selectedLevel
               ) {
                  sortedDiseases = groupDeathsToOrgUnits(store.allDeaths);
               } else if (!store.currentOrganisation && !!store.selectedOrgUnit && !store.selectedCauseOfDeath) {
                  sortedDiseases = []; //groupDiseaseToFilters(store.allDiseases);
               }
               sortedDiseases = groupDeathsToOrgUnits(store.allDeaths);

               console.log("sortedDiseases", sortedDiseases);

               currDiseases.current = sortedDiseases;
               // if (currChartType == "column") {
                  chart.current.xAxis[0].setCategories(sortedDiseases.map((d: any) => d.name)); //setting category
                  
                  chart.current.series[0].setData(
                     sortedDiseases.map((d: any) => {                  
                           return {
                              y: d.count,
                              color: "red",
                           };                  
                     }),
                     true
                  ); //setting data
                  chart.current.series[1].setData(
                     sortedDiseases.map((d: any) => {
                        if (currChartType == "column")
                           return {
                              y: d.approved,
                              color: "blue",
                           };
                        
                     }),
                     true
                  ); //setting data
      
                  chart.current.series[2].setData(
                     sortedDiseases.map((d: any) => {
                        if (currChartType == "column")
                           return {
                              y: d.aggregate,
                              color: "green",
                           };
                        
                     }),
                     true
                  ); //setting data
               // } else if (currChartType == "pie") {

            const indi1 = store.allIndis[store.selectedOrgUnit]?.["vyOajQA5xTu"] ?? 0;
            const indi2 = store.allIndis[store.selectedOrgUnit]?.["T8W0wbzErSF"] ?? 0;
            const allDeaths = store.allDeaths.length;
            const approvedDeaths = store.allDeaths.filter((d) => d["twVlVWM3ffz"] != "Not Approved").length;
            const nonApprovedDeaths = allDeaths - approvedDeaths;

            const aggregate = parseInt(indi1) + parseInt(indi2);
            const nonApprovedAggreagate = Math.min(aggregate - approvedDeaths, 0);
            opts = pieOptions;

            const opts2 = {...opts, series: [
               {
                  name: "Aggregate Death Records",
                  colorByPoint: true,
                  data: [{}],
               } as any,
            ]}
            

            opts.series[0].data = [
               {
                  name: "Approved Deaths",
                  y: approvedDeaths,
               },
               {
                  name: "Non Approved Deaths",
                  y: nonApprovedDeaths,
               },
            ];

            
            opts2.series[0].data = [
               {
                  name: "Approved Aggregate",
                  y: approvedDeaths,
               },
               {
                  name: "Non Approved Aggregate",
                  y: nonApprovedAggreagate,
               },
            ];

            console.log("opts 123", opts, opts2)
            
            chart2.current = Highcharts.chart("topdiseasesm2", opts2);
                  
            chart3.current = Highcharts.chart("topdiseasesm1", opts);

                  // console.log("all indis org", store.selectedOrgUnit, store.allIndis[store.selectedOrgUnit], store.allIndis)
                  // const indi1 = store.allIndis[store.selectedOrgUnit]?.["vyOajQA5xTu"] ?? 0;
                  // const indi2 = store.allIndis[store.selectedOrgUnit]?.["T8W0wbzErSF"] ?? 0;
                  // const allDeaths = indi1 + indi2;
                  // const approvedDeaths = store.allDeaths.filter((d) => d["twVlVWM3ffz"] != "Not Approved").length;
                  // const nonApprovedDeaths = allDeaths - approvedDeaths;
         
                  // chart3.current.series[0].setData([
                  //    {
                  //       name: "Approved Deaths",
                  //       y: approvedDeaths,
                  //    },
                  //    {
                  //       name: "Non Approved Deaths",
                  //       y: nonApprovedDeaths,
                  //    },
                  // ]);
               // }
               
            }
            chart.current.hideLoading();
         });

         store.queryEvents().then(() => {});
      };
      setupcharts();
   }, [
      store?.selectedNationality,
      store?.nationalitySelect,
      store.selectedCauseOfDeath,
      store?.selectedLevel,
      store.selectedOrgUnit,
   ]);

   return (
      <div id="topdiseaseswrapper">
         
         <div
            id="topdiseasesm"
            style={{
               width: "100%",
               height: "400px",
               marginBottom: "20px",
               ...(!currChartType || currChartType == "column" ? {} : { display: "none" }),
            }}
         ></div>
         
         
        
         <div style={{ 
            display: "flex", 
            ...(!currChartType || currChartType == "column" ? { display: "none" } : {} ),
            }}>
         <div
            id="topdiseasesm1"
            style={{
               width: "50%",
               height: "400px",
               marginBottom: "20px",
            }}
         ></div>
         <div
            id="topdiseasesm2"
            style={{
               width: "50%",
               height: "400px",
               marginBottom: "20px",
            }}
         ></div>
         </div>
         

         <div
            className="chartOpts"
            style={{
               left: 0,
               paddingRight: "40px",
            }}
         >
            <div
               style={{
                  marginRight: "auto",
                  paddingLeft: "1rem",
               }}
            ></div>

            <div className="chartPicker">
               <button
                  type="button"
                  className="chart-pick-item"
                  onClick={() => {
                     changeChartType("column");
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                     <g fill="none" fillRule="evenodd">
                        <polygon points="0 0 48 0 48 48 0 48"></polygon>
                        <polygon fill="#147CD7" points="12 12 18 12 18 36 12 36"></polygon>
                        <polygon fill="#147CD7" points="22 22 28 22 28 36 22 36"></polygon>
                        <polygon fill="#147CD7" points="32 7 38 7 38 36 32 36"></polygon>
                        <polygon fill="#4A5768" points="6 6 8 6 8 42 6 42"></polygon>
                        <polygon fill="#4A5768" points="6 40 42 40 42 42 6 42"></polygon>
                     </g>
                  </svg>
               </button>
               <button
                  type="button"
                  className="chart-pick-item"
                  onClick={() => {
                     changeChartType("pie");
                  }}
               >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,48,48">
                     <g fill="none" fillRule="evenodd" transform="rotate(90 24 24)">
                        <polygon points="0 0 48 0 48 48 0 48"></polygon>
                        <circle cx="24" cy="24" r="16" stroke="#4A5768" strokeWidth="2"></circle>
                        <path
                           fill="#FFC324"
                           d="M11,24 C11,31.1797017 16.8202983,37 24,37 C31.1797017,37 37,31.1797017 37,24 C37,16.8202983 31.1797017,11 24,11 L24,24 L11,24 Z"
                           transform="rotate(165 24 24)"
                        ></path>
                        <path
                           fill="#147CD7"
                           d="M11,24 C11,31.1797017 16.8202983,37 24,37 C31.1797017,37 37,31.1797017 37,24 C37,16.8202983 31.1797017,11 24,11 L24,24 L11,24 Z"
                           transform="rotate(-15 24 24)"
                        ></path>
                     </g>
                  </svg>
               </button>
            </div>

            {/*
					<div className="chart-date-range">
          			</div>
					*/}
         </div>
      </div>
   );
});
