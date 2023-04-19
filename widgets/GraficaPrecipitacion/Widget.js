///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare', 'jimu/BaseWidget'],
  function(declare, BaseWidget) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-widgetPrecipitacion',

      peticion: function(){
        if (this.status === 200) {
          
          const respuesta = JSON.parse(this.response);
          console.log(respuesta);
      
          fetch(`${respuesta.datos}`)
            .then((response) => response.json())
            .then((data) => {

              datos=data[0]
              console.log(datos);
              let prediccion = datos.prediccion.dia;
              
              let valoresX = [];
              let valoresY = [];
            
              prediccion.forEach((dia) => {
                let fecha = dia.fecha.substr(8, 2);
                let mes = dia.fecha.substr(5, 2);
                dia.precipitacion.forEach((hora) => {
                  valoresX.push(`${hora.periodo}h ${fecha}/${mes}`);
                  valoresY.push(parseFloat(hora.value));
                });
              });

              precipitacionGraph = new Chart(graficoPrecipitacion, {
                type: "line",
                data: {
                  labels: valoresX,
                  datasets: [
                    {
                      label: "Precipitación",
                      data: valoresY,
                      borderWidth: 1,
                      borderColor: '#036bfc',
                      backgroundColor: '#036bfc'
                    },
                  ],
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                },
              });
            });
        }
      },

      


      startup: function() {
        API_URL = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/47139/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbHZhcm8uZ3Ryei5jbGltZW50QGdtYWlsLmNvbSIsImp0aSI6IjUwYWU4ZmMzLTU1OTMtNDRmZS04NjBiLTdjODVkNGQ3OWUyNyIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNjc1MDI0ODA5LCJ1c2VySWQiOiI1MGFlOGZjMy01NTkzLTQ0ZmUtODYwYi03Yzg1ZDRkNzllMjciLCJyb2xlIjoiIn0.LhYIJW4xC4Gbe7EeHErRMh9VmNsVCuMazaHFCBsnUQU";
        canvasDiv = document.getElementById('grafico')
        xhr = new XMLHttpRequest()

        xhr.addEventListener("load", this.peticion);
        xhr.open("GET", API_URL);
        xhr.send();
  
      },


    });
  });