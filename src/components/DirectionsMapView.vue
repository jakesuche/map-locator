<template>
  <section class="map" ref="map"></section>
</template>

<script>
import { EventBus } from "@/EventBus";
export default {
  mounted() {
    const directionsService = new google.maps.DirectionsService();
    const directionRendere = new google.maps.DirectionsRenderer();
    // new google.maps.Map(this.$refs["map"], {
    //   center: new google.maps.LatLng(45.4215296, -75.6971931),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP,
    // });
    // EventBus.$on('route-data',data=>{
    //     directionsService.route({
    //         origin:data.origin.address,
    //         destination:data.destination.address,
    //         travelMode:'DRIVING'

    //         },
    //         (response,status)=>{
    //             if(status==="OK"){
    //                 directionRendere.setDirections(response)
    //                 directionRendere.setMap(map)
    //             }
    //         }
    //         )
    // })

    EventBus.$on("routes-data", (data) => {
      const map = new google.maps.Map(this.$refs["map"], {
        center: new google.maps.LatLng(45.4215296, -75.6971931),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      data.forEach(({ origin, destination, distance, duration, color }) => {
        directionsService.route(
          {
            origin: origin.address,
            destination: destination.address,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              const directionRendere = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions:{
                    strokeColor:color,
                    strokeWeight:8
                }
              });

              this.createInfoWindowWith(origin, "marker alternate", map,color);
              this.createInfoWindowWith(destination, "flag checkered", map,color);

              //  const originLabel =new google.maps.InfoWindow({
              //      content:`<i class="marker alternate icon"></i> ${origin.address}`,
              //      position: new google.maps.LatLng(origin.lat,origin.lng)
              //  });
              //  originLabel.open(map, null)
              //  const destinationLabel =new google.maps.InfoWindow({
              //      content:`<i class="marker alternate icon"></i> ${destination.address}`,
              //      position: new google.maps.LatLng(destination.lat,destination.lng)
              //  });

              // destinationLabel.open(map,null)
              const overViewPath = response.routes[0].overview_path;
              const middleIndex = parseInt(overViewPath.length / 2);
              const middleLoc = overViewPath[middleIndex];

              const distanceDurationLabel = new google.maps.InfoWindow({
                content: `<i class="icon car"></i>${distance.text} - ${duration.text}`,
                position: new google.maps.LatLng(
                  middleLoc.lat(),
                  middleLoc.lng()
                ),
              });
              distanceDurationLabel.open(map, null);
              directionRendere.setDirections(response);
              directionRendere.setMap(map);
                console.log(origin.lat,origin.lng,'polylin')

                //draws a line from the origin to the startingpoint
              new google.maps.Polyline({
                path: [
                  {
                    lat: origin.lat,
                    lng: origin.lng,
                  },
                  {
                    lat:overViewPath[1].lat(),lng:overViewPath[1].lng()
                  }
                ],
                strokeColor:'#000000',
                strokeOpacity:1,
                strokeWeight:8,
                map:map
              });
               new google.maps.Polyline({
                path: [
                  {
                    lat: destination.lat,
                    lng: destination.lng,
                  },
                  {
                    lat:overViewPath[overViewPath.length-1].lat(),lng:overViewPath[overViewPath.length-1].lng()
                  }
                ],
                strokeColor:'#000000',
                strokeOpacity:1,
                strokeWeight:8,
                map:map
              });

              

              
            }


          }
        );
      });
    });
  },
  methods: {
    createInfoWindowWith(location, icon, map, color) {
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="background:${color};"><i class="${icon} icon"></i> ${location.address}</div>`,
        position: new google.maps.LatLng(location.lat, location.lng),
      });
      infoWindow.open(map, null);
    },
  },
 
};
</script>

<style scoped>
.map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: red;
}
</style>
