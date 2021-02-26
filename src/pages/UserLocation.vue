<template>
  <div>
    <section class="ui two column grid " style="position:relative;z-index:1">
      <div class="column  ">
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
                <i
                  class="circle icon dot link"
                  @click="locatorButtonPressed"
                ></i>
              </div>
            </div>
            <button type="button" class="ui button ">Go</button>
          </div>
        </form>
      </div>
    </section>
    <section id="map"></section>
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
      picture,
      apiKey:'AIzaSyBC086AI9HzuotrVMjosi38LnIa8VHn2jQ'
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
      const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.latitude},${this.longitude}&type=${this.type}&raduis=${this.radius * 1000}&key=${this.apiKey}`;

      axios.get(URL).then(response =>{
        console.log(response)
      }).catch(error =>{
        this.error = error.message
      })
    },
  },
};
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
</style>
