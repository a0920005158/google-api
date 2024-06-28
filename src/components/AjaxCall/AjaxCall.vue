<template>
  <div></div>
</template>

<script>
  import axios from 'axios'
  export default {
    data () {
      return {
        googlePlaceUrl: 'maps/api/place/nearbysearch/json?', // https://maps.googleapis.com/
        googleApiApiKey: 'key= AIzaSyAKQLWY4uD8oZ3j2gYyqT-FnwDLIzpcp4Q&',
        searchType: 'types=tourist_attraction&',
        distance: 'radius=1000&' // 距離1公里
      }
    },
    methods: {
      iPost (url, data, iThen, iCatch) {
        // POST請求
        var now = this.DateFormatSet(new Date())
        console.log(url + ':iPost :' + now)
        axios.post(url, data)
          .then(response => {
            console.log(url + ':then :' + now) // 印出請求成功API名稱與時間
            iThen(response)
          })
          .catch(error => {
            console.log(url + ':catch :' + now) // 印出請求失敗API名稱與時間
            iCatch(error)
          })
      },
      DateFormatSet (date) {
        var yyyy = date.getFullYear()
        var MM =
          date.getMonth() + 1 >= 10
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1)
        var dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var mm =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var ss =
          date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        var today = yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
        return today
      },
      getNearbyAttractions (data, callback) {
        console.log('-----------getNearbyAttractions--------------')
        var latAndLng = 'location=' + data.coords.latitude + ',' + data.coords.longitude // 當前位置經緯度
        var url = '/data/' + this.googlePlaceUrl + this.googleApiApiKey + this.searchType + this.distance + latAndLng
        this.$AJ.iPost(url, '', response => {
          console.log(JSON.parse(response.request.response))
          callback(JSON.parse(response.request.response))
        }, error => {
          callback(0)
        })
      }
    }
  }
</script>

<style>
</style>
