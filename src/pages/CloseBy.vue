<template>
  <div class="ui grid">
    <div class="six wide column">
      <form class="ui segment large large form">
        <div v-show="errors" class="ui message red">
          {{ errors }}
        </div>
        <div class="ui segment">
          <div class="field">
            <div
              class="ui right icon input large "
              :class="{ loading: spinner }"
            >
              <input
                v-model="address"
                type="text"
                name=""
                id="autocomplete"
                ref="autocomplete"
                placeholder="Enter your address"
              />
              <i class="circle icon dot link" @click="locatorButtonPressed"></i>
            </div>
          </div>

          <div class="field">
            <div class="two fields">
              <div class="field">
                <select name="" id="" v-model="type">
                  <option value="restaurant">Resturant</option>
                  <option value="club">club</option>
                  <option value="church">church</option>
                  <option value="hospital">Hospital</option>
                </select>
              </div>
              <div class="field">
                <select v-model="radius" name="" id="">
                  <option value="5">5KM</option>
                  <option value="10">10KM</option>
                  <option value="15">15KM</option>
                  <option value="20">20KM</option>
                </select>
              </div>
            </div>
          </div>
          <button
            @click="findCloseBuyButtonPressed"
            type="button"
            class="ui button "
          >
            Go
          </button>
        </div>
      </form>

      <div class="segment ui" style="max-height:300px;overflow:auto">
        <div class="ui divided items">
          <div class="item" :class="{'active':activeIndex===index}" v-for="(place, index) in places" :key="place.id" @click="showInfoWindow(index)" style="padding:10px">
            <div class="content">
              <div class="header " :class="{'turnwhite':activeIndex===index}" >
                {{ place.name }}
              </div>
              <div class="meta " :class="{'turnwhite':activeIndex===index}">{{ place.vicinity }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ten wide column" ref="map"></div>
  </div>
</template>

<script>
import axios from "axios";
import picture from "@/assets/user-shape.png";

export default {
  data() {
    return {
      address: "",
      error: "",
      errors: "",
      spinner: false,
      latitude: "",
      longitude: "",
      type: "",
      radius: "",
      picture,
      apiKey: "AIzaSyBC086AI9HzuotrVMjosi38LnIa8VHn2jQ",
      places: [],
      markers:[],
      activeIndex:-1
    };
  },
  mounted() {
    let autocomplete = new google.maps.places.Autocomplete(
      this.$refs["autocomplete"],
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(this.latitude, this.longitude)
        ),
      }
    );
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      console.log(place);
      this.getUserLocationOnTheMap(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
  },
  methods: {
    locatorButtonPressed() {
      this.spinner = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.getAddressFrom(
              position.coords.latitude,
              position.coords.longitude
            );
            this.getUserLocationOnTheMap(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            console.log(error.message);
            this.errors = error.message;
          }
        );
      } else {
        this.errors = "location access denied";
        console.log("browser does not support ");
      }
    },
    getAddressFrom(lat, long) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBC086AI9HzuotrVMjosi38LnIa8VHn2jQ`
        )
        .then((response) => {
          if (response.data.error_message) {
            console.log(response.data.error_message);
            this.spinner = false;
            this.errors = response.data.error_message;
          } else {
            this.address = response.data.results[0].formatted_address;
            this.spinner = false;
          }
        })
        .catch((error) => {
          console.log(error.message);
          this.errors = error.message;
          this.spinner = false;
        });
    },
    getUserLocationOnTheMap(lat, lng) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        icon: this.picture,
      });
    },
    findCloseBuyButtonPressed() {
      const URL = `https://cors-anywhere-jake.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        this.latitude
      },${this.longitude}&type=${this.type}&radius=${this.radius * 1000}&key=${
        this.apiKey
      }`;

      axios
        .get(URL)
        .then((response) => {
          console.log(response.data.results);
          this.places = response.data.results;
          this.showPlacesOnMap();
          console.log(response);
        })
        .catch((error) => {
          console.log(error.message, "this is an error");
          this.error = error.message;
        });
    },
    showPlacesOnMap() {
      let map = new google.maps.Map(this.$refs["map"], {
        zoom: 15,
        center: new google.maps.LatLng(this.latitude, this.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

      const infoWindow = new google.maps.InfoWindow();
      for (let i = 0; i < this.places.length; i++) {
        const lat = this.places[i].geometry.location.lat;
        const lng = this.places[i].geometry.location.lng;
        const placeId = this.places[i].place_id;

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
        });
        this.markers.push(marker)
        google.maps.event.addListener(marker, "click", () => {
          const URL = `https://cors-anywhere-jake.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?&key=${this.apiKey}&place_id=${placeId}`;

          axios
            .get(URL)
            .then((response) => {
              if (response.data.error_message) {
                this.errors = response.data.error_message;
              } else {
                const place = response.data.result;
                infoWindow.setContent(
                  `<div class=" ui header">${place.name}</div>
                    ${place.formatted_address} <br>
                    ${place.formatted_phone_number} <br>
                    <a href="${place.website}" target="_blank">${place.website}</a>
                  `
                );
                infoWindow.open(map, marker);
              }
            })
            .catch((error) => {
              this.errors = error;
            });
        });
      }
    },
    showInfoWindow(index){
        this.activeIndex =index;
       new google.maps.event.trigger(this.markers[index], 'click')
    }
  },
};

//  google.maps.event.addListener(marker, "click", () =>{
//                 const URL = `https://cors-anywhere-jake.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?&key=${this.apiKey}&place_id=${placeId}`
//                 axios.get(URL).then(response =>{
//                     console.log(response)
//                 })
//                 .catch(error=>{
//                     console.log(error)
//                 })
//                 infoWindow.setContent(`<div class=" ui header">${this.places[i].name}</div>`)
//                 infoWindow.open(map,marker)
//             })
</script>

<style scoped>
.ui.button,
.dot.circle.icon {
  background: #ff5a5f;
  color: white;
}

.pac-icon {
  display: none !important;
}
#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: red;
}
.active{
    background:#ff5a5f!important;
    
}
.turnwhite{
    color:white!important
}
</style>
