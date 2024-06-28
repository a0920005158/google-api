<template>
  <div id="map"></div>
</template>

<script>
  import store from "@/store/index";
  import globalDataX from '@/store/globalDataX.vue'
  import { log } from 'util';
  var API;
  export default {
    store,
    extends: globalDataX,
    data () {
      return {
        routerParams: '',
        pyrmont: '',
        service: null,
        map: null,
        markers: [{
          position: {
            lat: 24.0906165,
            lng: 120.6947551
          },
          infoText: '<strong>Marker 1</strong>'
        }],
      }
    },
    created: function () {
      API = this;
    },
    methods: {
      getGeolocation (params) {
        console.log('~~~~~~~getGeolocation')
        if (API.$NowRouter.indexOf('/travel-cost-count') > -1 && API.$NowRouter.indexOf('/reg-acc') > -1) {
          API.$PostValue({ paramName: '$loading', data: false })
          return
        }
        navigator.geolocation.getAccurateCurrentPosition(API.onSuccess, API.onError, API.onProgress, { desiredAccuracy: 20, maxWait: 15000 })
        API.routerParams = params;
      },
      DetailsCallback (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log('sss')
          console.log(place)
          API.$PushValue({ paramName: '$Details', data: { id: API.routerParams, place: place } });
          API.$PushValue({ paramName: '$PhotosUrl', data: { id: API.routerParams, url: place.photos[0].getUrl({ maxWidth: document.body.clientWidth, maxHeight: document.body.clientHeight * 0.2 }) } })
          // createMarker(place);
        }
      },
      Search (data) {
        console.log(data)
        var request = {
          query: data,
          fields: ['name', 'geometry', 'user_ratings_total', 'formatted_address', 'rating', 'place_id', 'icon', 'photos'],
        };

        API.service.findPlaceFromQuery(request, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results)
            var newResults = [];
            results.forEach(el => {
              var el2 = el
              console.log(el)
              console.log(Object.keys(el))
              if (Object.keys(el).indexOf('photos') > -1) {
                el2['imgNew'] = el.photos[0].getUrl({ 'maxWidth': 400, 'maxHeight': 400 })
              } else {
                el2['imgNew'] = ''
              }
              console.log('~~~~~~~~~~~~$SearchResult~~~~~~~~~~~~~~')
              console.log(el2)
              newResults.push(el2)
            });
            API.$PostValue({ paramName: '$SearchResult', data: newResults })
          }
        });
      },
      onSuccess (data) {
        console.log(data)
        if (data == undefined) {
          API.$PostValue({ paramName: '$RouterPush', data: '/nearby-attractions' });
          return
        }
        console.log('API.$NowRouter')
        console.log(API.$NowRouter)
        if (API.$DIS.GetDistance(API.$locationLat, API.$locationLng, data.coords.latitude, data.coords.longitude) < 1000) {
          if (API.$NowRouter.indexOf('/nearby-attraction-details/') > -1) {
            console.log('BBBB')
            API.getPlaceDetails(API.routerParams)
          }
          API.$PostValue({ paramName: '$locationLat', data: data.coords.latitude })
          API.$PostValue({ paramName: '$locationLng', data: data.coords.longitude })
          API.$PostValue({ paramName: '$showLoad', data: false });
          API.$PostValue({ paramName: '$showLoad2', data: false });
          return
        } else {
          API.$PostValue({ paramName: '$locationLat', data: data.coords.latitude })
          API.$PostValue({ paramName: '$locationLng', data: data.coords.longitude })
          // if(API.$NearbyAttractionsList.length!=0&&API.$locationLng)
          API.pyrmont = new google.maps.LatLng(data.coords.latitude, data.coords.longitude)
          API.map = new google.maps.Map(document.getElementById('map'), {
            center: API.pyrmont,
            zoom: 15
          });

          var request = {
            location: API.pyrmont,
            radius: '5000',
            type: ['tourist_attraction']
          };
          console.log('AAAAA')
          API.service = new google.maps.places.PlacesService(map);
          if (API.$NowRouter.indexOf('/nearby-attractions') > -1) {
            console.log('A')
            API.service.nearbySearch(request, API.getNearbyAttractionsCallback);
          } else if (API.$NowRouter.indexOf('/nearby-attraction-details/') > -1) {
            console.log('B')
            API.getPlaceDetails(API.routerParams)
            if (API.$NearbyAttractionsList.length == 0)
              API.service.nearbySearch(request, API.getNearbyAttractionsCallback);
          } else {
            console.log('C')
            API.$PostValue({ paramName: '$loading', data: false })
          }
          //   API.$AJ.getNearbyAttractions(data, API.getNearbyAttractionsCallback)
          console.log(API.$NowRouter)
          API.markers = [{ position: { lat: data.coords.latitude, lng: data.coords.longitude } }]
        }
      },
      getPlaceDetails (routerParams) {
        API.routerParams = routerParams;
        if (API.$Details.map(x => x.id).indexOf(routerParams) > -1 && API.$PhotosUrl.map(x => x.id).indexOf(routerParams) > -1) {
          console.log('跳過仔入')
          return
        }

        var request2 = {
          placeId: routerParams,
          fields: ['name', 'rating', 'formatted_phone_number', 'geometry', 'reviews', 'photos', 'formatted_address']
        };
        console.log('xxxxxxx')
        console.log(routerParams)
        API.service.getDetails(request2, API.DetailsCallback);
      },
      onError (data) {
        console.log('~~~~~~~~~~Error~~~~~~~')
        console.log(data)
        alert('無法取得目前位置，請檢查是否有開啟定位')
        API.pyrmont = new google.maps.LatLng(24.0906165, 120.6947551)
        var request = {
          location: API.pyrmont,
          radius: '5000',
          type: ['tourist_attraction']
        };
        API.$PostValue({ paramName: '$loading', data: false })
        if (API.$NowRouter.indexOf('/nearby-attractions') > -1) {
          console.log('A')
          API.service.nearbySearch(request, API.getNearbyAttractionsCallback);
        }
      },
      onProgress (data) {
        console.log(data)
      },
      getNearbyAttractionsCallback (results, status) {
        API.$PostValue({ paramName: '$showLoad', data: false });
        API.$PostValue({ paramName: '$showLoad2', data: false });
        console.log('status=====')
        console.log(status)
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(results)
          var newResults = [];
          results.forEach(el => {
            var el2 = el
            if (Object.keys(el).indexOf('photos') > -1) {
              el2['imgNew'] = el.photos[0].getUrl({ 'maxWidth': 400, 'maxHeight': 400 })
            } else {
              el2['imgNew'] = ''
            }
            console.log('~~~~~~~~~~~~NewgetNearbyAttractionsCallback~~~~~~~~~~~~~~')
            console.log(el2)
            newResults.push(el2)
          });
          API.$PostValue({ paramName: '$NearbyAttractionsList', data: newResults })
          API.$PostValue({ paramName: '$loading', data: false })
        }
      },
    }
  }
</script>

<style>
</style>