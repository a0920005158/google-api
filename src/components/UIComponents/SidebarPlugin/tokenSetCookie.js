<script type="text/javascript">
  window.onload = callSetCookie ()
    {
      var urlParam = location.search
      if (urlParam != null && urlParam !== '') {
        var idx = urlParam.indexOf('?token=')
        if (idx === 0) {
          urlParam = urlParam + ''
          this.$PB.log(urlParam)
          this.$PB.log(document.location.pathname)
          if (document.location.pathname.split('/')[1] != 'guest'){
            this.addCookie('token', this.token, 43201)
          }
          this.$options.methods.startset.bind(this)();
          return
        }
      }
    },
 }   
</script>