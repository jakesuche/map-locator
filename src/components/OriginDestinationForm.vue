<template>
  <section class="origin-destination-form">
      <div class="ui form">
          <div v-show="error" class="ui message red small">
              {{error}}
          </div>
          <div class="two fields">
             <div class="field">
                <div class="ui left icon input">
                  <i class="marker alternate icon"></i>
                  <input type="text" name="" placeholder="Origin" id="" ref="origin">
              </div>
             </div>
             <div class="field">
                <div class="ui left icon input">
                    <i class="flag checkered icon">
                        
                    </i>
                    <input type="text" name="" placeholder="Destination" id="" ref="destination">
                </div>
             </div>
             <button class="ui button small green  " :class="{'loading':spinner}" @click="calculateButtonPressed"> calculate</button>
          </div>
      </div>
  </section>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase'
export default {
    data(){
        return {
            apiKey:'AIzaSyBC086AI9HzuotrVMjosi38LnIa8VHn2jQ',
            route:{
                origin:{
                    address:'',
                    lat:0,
                    lng:0
                },
                destination:{
                     address:'',
                    lat:0,
                    lng:0
                },
                distance:{},
                duration:{},
                color:''
            },
            error:null,
            spinner:false,
            latitude:'',
            longitude:''
        }
    },
    mounted(){

        this.locatorButtonPressed()
        for(let ref in this.$refs){
            console.log(this.$refs[ref])
            const autocomplete = new google.maps.places.Autocomplete(
                this.$refs[ref],
                 {
                bounds:new google.maps.LatLngBounds(
                    new google.maps.LatLng(this.latitude, this.longitude)
                )
                }
            );
            
            autocomplete.addListener("place_changed",()=>{
           
            const place = autocomplete.getPlace()
            this.route[ref].address = `${place.name}, ${place.vicinity}`;
            this.route[ref].lat = place.geometry.location.lat()
             this.route[ref].lng = place.geometry.location.lng()
        });

        }
        // const originAutocomplete = new google.maps.places.Autocomplete(
        //     this.$refs['origin'],
        //     {
        //         bounds:new google.maps.LatLngBounds(
        //             new google.maps.LatLng(45.4215296, -75.6971931)
        //         )
        //     }
        // );
        // originAutocomplete.addListener("place_changed",()=>{
        //     originAutocomplete.getPlace()
        // });

        // const destinationAutocomplete =new google.maps.places.Autocomplete(
        //     this.$refs['destination'],
        //     {
        //          bounds:new google.maps.LatLngBounds(
        //             new google.maps.LatLng(45.4215296, -75.6971931)
        //         )
        //     }
        // )
        // destinationAutocomplete.addListener("place_changed",()=>{
        //     destinationAutocomplete.getPlace()
        // })
    },
    methods:{
        calculateButtonPressed(){
            this.spinner = true
            const URL = `https://cors-anywhere-jake.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.route.origin.lat},${this.route.origin.lng}&destinations=${this.route.destination.lat},${this.route.destination.lng}&key=${this.apiKey}`

            axios.get(URL)
            .then(response =>{
                this.spinner = false
                if(response.data.error_message){
                    this.error= response.data.error_meesage
                }else{
                    const elements =response.data.rows[0].elements;
                    if(elements[0].status ==="ZERO_RESULTS"){
                        this.error ="No Results found or seems likyarne you submitted zero data"
                    }else{
                        console.log(elements[0].distance);
                        console.log(elements[0].duration);
                        this.route.distance = elements[0].distance;
                        this.route.duration = elements[0].duration;
                        this.route.color =this.getRandomColor()

                        this.saveRoute()


                       
                    }
                    console.log(response)
                }
            })
            .catch(err=>{
                this.spinner = false
                this.error=err.message
            })
        },
        saveRoute(){
            const db = firebase.firestore()
            db.collection("routes")
            .doc()
            .set(this.route)
            
        },
    locatorButtonPressed() {
    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
           
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
     getRandomColor(){
      let characters = "0123456789ABCDEF"
      let color ="#"
      for(let i = 0;i<6; i++){
          color += characters[Math.floor(Math.random() * 16)]
      }
      return color;
  }
    }

}
</script>

<style scoped>
    .origin-destination-form{
        position:relative;
        z-index: 1;
        max-width: 610px;
        margin:10px;
        
    }
</style>