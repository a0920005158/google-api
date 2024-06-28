<template>
  <div></div>
</template>

<script>
  export default {
    methods: {
      Rad (d) {
        return d * Math.PI / 180.0// 经纬度转换成三角函数中度分表形式。
      },
      GetDistance (lat1, lng1, lat2, lng2) {
        var radLat1 = this.Rad(lat1)
        var radLat2 = this.Rad(lat2)
        var a = radLat1 - radLat2
        var b = this.Rad(lng1) - this.Rad(lng2)
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
        s = s * 6378.137// EARTH_RADIUS;
        // s = Math.round(s * 10000) / 10000 > 1 ? Math.round(s * 10000) / 10000 + '公里' : Math.round(s * 10000) / 10000 * 1000 + '公尺'// 输出为公里
        // s=s.toFixed(4);
        s = Math.round(s * 10000) / 10000 * 1000 // 输出为公里
        return s
      }
    }
  }
</script>

<style>
</style>
